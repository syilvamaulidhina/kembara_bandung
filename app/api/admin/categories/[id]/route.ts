import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
      include: {
        keywords: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("PUT ADMIN CATEGORY ERROR:", error);

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

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
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