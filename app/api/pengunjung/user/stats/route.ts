// app/api/pengunjung/user/stats/route.ts
// Endpoint: GET /api/pengunjung/user/stats?userId=xxx
// UPDATE: support halaman profil

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "0");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId wajib diisi" },
        { status: 400 }
      );
    }

    const [savedCount, reviewCount, itineraryCount] = await Promise.all([
      prisma.savedDestination.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.itinerary.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { savedCount, reviewCount, itineraryCount },
    });
  } catch (error) {
    console.error("GET /api/pengunjung/user/stats error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
