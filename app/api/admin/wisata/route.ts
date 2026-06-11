import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isDeleted: false, status: "aktif" },
      include: {
        categories: { include: { category: true } },
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const wisata = destinations.map((d) => ({
      id: d.id,
      nama: d.name,
      kategori: d.categories[0]?.category?.name || "Lainnya",
      lokasi: d.address,
      status: "Aktif",
    }));

    return NextResponse.json({ wisata });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, nama, lokasi, status } = await req.json();
    await prisma.destination.update({
      where: { id },
      data: {
        name: nama,
        address: lokasi,
        status: status === "Aktif" ? "aktif" : "pending",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.destination.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal hapus" }, { status: 500 });
  }
}