import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);
    const body = await req.json();
    const name = cleanText(body.name);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID kategori tidak valid" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { message: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
      include: {
        keywords: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("PUT ADMIN CATEGORY ERROR:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal mengubah kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID kategori tidak valid" },
        { status: 400 }
      );
    }

    const usedByDestination = await prisma.destinationCategory.count({
      where: { categoryId },
    });

    if (usedByDestination > 0) {
      return NextResponse.json(
        {
          message:
            "Kategori tidak dapat dihapus karena sudah digunakan oleh destinasi.",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE ADMIN CATEGORY ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}