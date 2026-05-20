import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        keywords: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET ADMIN CATEGORIES ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();

    const keywords: string[] = Array.isArray(body.keywords)
    ? body.keywords
        .map((keyword: unknown) => String(keyword).trim().toLowerCase())
        .filter((keyword: string) => keyword.length > 0)
    : [];

    const uniqueKeywords: string[] = Array.from(new Set(keywords));

    if (!name) {
      return NextResponse.json(
        { message: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    if (uniqueKeywords.length < 10) {
      return NextResponse.json(
        { message: "Minimal 10 keyword wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        keywords: {
          create: uniqueKeywords.map((keyword) => ({
            keyword,
          })),
        },
      },
      include: {
        keywords: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST ADMIN CATEGORY ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan kategori" },
      { status: 500 }
    );
  }
}