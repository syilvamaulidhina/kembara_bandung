import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const keywords = await prisma.categoryKeyword.findMany({
      where: {
        categoryId: Number(id),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error("GET CATEGORY KEYWORDS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil keyword kategori" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const keyword = String(body.keyword || "").trim().toLowerCase();

    if (!keyword) {
      return NextResponse.json(
        { message: "Keyword wajib diisi" },
        { status: 400 }
      );
    }

    const newKeyword = await prisma.categoryKeyword.create({
      data: {
        keyword,
        categoryId: Number(id),
      },
    });

    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error) {
    console.error("POST CATEGORY KEYWORD ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan keyword" },
      { status: 500 }
    );
  }
}