import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const destinationId = Number(id);

    if (Number.isNaN(destinationId)) {
      return NextResponse.json(
        { message: "ID wisata tidak valid." },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.findFirst({
      where: {
        id: destinationId,
        isDeleted: false,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { message: "Wisata tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error("GET DESTINATION DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail wisata." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const destinationId = Number(id);

    if (Number.isNaN(destinationId)) {
      return NextResponse.json(
        { message: "ID wisata tidak valid." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map((categoryId: unknown) => Number(categoryId))
      : [];

    if (!body.name || !body.description || !body.address) {
      return NextResponse.json(
        { message: "Nama, deskripsi, dan alamat wajib diisi." },
        { status: 400 }
      );
    }

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { message: "Pilih minimal satu kategori wisata." },
        { status: 400 }
      );
    }

    if (!body.latitude || !body.longitude) {
      return NextResponse.json(
        { message: "Latitude dan longitude wajib diisi." },
        { status: 400 }
      );
    }

    await prisma.destinationCategory.deleteMany({
      where: {
        destinationId,
      },
    });

    const updatedDestination = await prisma.destination.update({
      where: {
        id: destinationId,
      },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        contact: body.contact || null,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        imageUrl: body.imageUrl || null,

        // setelah pengelola edit, masuk review lagi
        status: "pending",

        categories: {
          create: categoryIds.map((categoryId: number) => ({
            categoryId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error("UPDATE DESTINATION ERROR:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui wisata." },
      { status: 500 }
    );
  }
}