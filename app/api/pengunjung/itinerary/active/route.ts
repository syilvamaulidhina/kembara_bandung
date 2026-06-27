// app/api/pengunjung/itinerary/active/route.ts
// BARU: ambil itinerary dengan status "aktif" milik user (maksimal 1, sesuai
// aturan hanya 1 perjalanan aktif sekaligus). Dipakai untuk section
// "Perjalanan Aktif" di bagian atas halaman /pengunjung/rencana.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId diperlukan" },
        { status: 400 }
      );
    }

    const active = await prisma.itinerary.findFirst({
      where: { userId, status: "aktif" },
      include: {
        items: {
          include: { destination: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!active) {
      return NextResponse.json({ success: true, data: null });
    }

    const visitedCount = active.items.filter((i) => i.visited).length;
    const nextItem = active.items.find((i) => !i.visited);

    return NextResponse.json({
      success: true,
      data: {
        ...active,
        visitedCount,
        totalItems: active.items.length,
        nextDestination: nextItem?.destination ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching active itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil perjalanan aktif" },
      { status: 500 }
    );
  }
}
