import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

function cleanKeyword(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; keywordId: string }> }
) {
  try {
    const { id, keywordId } = await params;

    const categoryId = Number(id);
    const parsedKeywordId = Number(keywordId);
    const body = await req.json();
    const keyword = cleanKeyword(body.keyword);

    if (Number.isNaN(categoryId) || Number.isNaN(parsedKeywordId)) {
      return NextResponse.json(
        { message: "ID kategori atau keyword tidak valid" },
        { status: 400 }
      );
    }

    if (!keyword) {
      return NextResponse.json(
        { message: "Keyword wajib diisi" },
        { status: 400 }
      );
    }

    const existingKeyword = await prisma.categoryKeyword.findFirst({
      where: {
        id: parsedKeywordId,
        categoryId,
      },
    });

    if (!existingKeyword) {
      return NextResponse.json(
        { message: "Keyword tidak ditemukan pada kategori ini" },
        { status: 404 }
      );
    }

    const updatedKeyword = await prisma.categoryKeyword.update({
      where: { id: parsedKeywordId },
      data: { keyword },
    });

    return NextResponse.json(updatedKeyword);
  } catch (error) {
    console.error("PUT CATEGORY KEYWORD ERROR:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Keyword sudah ada pada kategori ini" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal mengubah keyword" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; keywordId: string }> }
) {
  try {
    const { id, keywordId } = await params;

    const categoryId = Number(id);
    const parsedKeywordId = Number(keywordId);

    if (Number.isNaN(categoryId) || Number.isNaN(parsedKeywordId)) {
      return NextResponse.json(
        { message: "ID kategori atau keyword tidak valid" },
        { status: 400 }
      );
    }

    const keywordCount = await prisma.categoryKeyword.count({
      where: { categoryId },
    });

    if (keywordCount <= 10) {
      return NextResponse.json(
        {
          message:
            "Keyword tidak dapat dihapus karena setiap kategori minimal memiliki 10 keyword.",
        },
        { status: 400 }
      );
    }

    await prisma.categoryKeyword.delete({
      where: {
        id: parsedKeywordId,
        categoryId,
      },
    });

    return NextResponse.json({
      message: "Keyword berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE CATEGORY KEYWORD ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus keyword" },
      { status: 500 }
    );
  }
}