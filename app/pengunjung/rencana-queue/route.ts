// app/api/pengunjung/rencana-queue/route.ts
// SIMPLIFIED: Antrean rencana = semua SavedDestination user
// Tidak perlu tabel ItineraryQueue terpisah

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId diperlukan" }, { status: 400 });
    }

    const saved = await prisma.savedDestination.findMany({
      where: { userId },
      include: {
        destination: {
          include: { categories: { include: { category: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = saved
      .filter((s) => !s.destination.isDeleted && s.destination.status === "aktif")
      .map((s) => ({
        queueId: s.id,
        id: s.destination.id,
        name: s.destination.name,
        address: s.destination.address,
        imageUrl: s.destination.imageUrl,
        latitude: s.destination.latitude,
        longitude: s.destination.longitude,
        ticketPrice: s.destination.ticketPrice,
        openTime: s.destination.openTime,
        closeTime: s.destination.closeTime,
        categories: s.destination.categories,
        distance:
          lat && lng
            ? calculateDistance(lat, lng, s.destination.latitude, s.destination.longitude)
            : undefined,
      }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET rencana-queue error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST & DELETE tidak dipakai tapi tetap ada agar tidak 404
export async function POST() { return NextResponse.json({ success: true }); }
export async function DELETE() { return NextResponse.json({ success: true }); }
