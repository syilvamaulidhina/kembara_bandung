// app/api/pengunjung/categories/route.ts
// Fetch semua kategori dari DB (dibuat admin)
// UPDATE: support langsung ke destinasi

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: { destinations: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/pengunjung/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil kategori" },
      { status: 500 }
    );
  }
}
