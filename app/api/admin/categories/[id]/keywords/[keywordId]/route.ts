import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; keywordId: string }> }
) {
  try {
    const { keywordId } = await params;

    await prisma.categoryKeyword.delete({
      where: {
        id: Number(keywordId),
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