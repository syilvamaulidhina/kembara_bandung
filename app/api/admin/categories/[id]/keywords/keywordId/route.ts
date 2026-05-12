import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ keywordId: string }> }
) {
  const { keywordId } = await params;

  await prisma.categoryKeyword.delete({
    where: {
      id: Number(keywordId),
    },
  });

  return NextResponse.json({ message: "Keyword berhasil dihapus" });
}