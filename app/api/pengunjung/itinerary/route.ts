// app/api/pengunjung/itinerary/route.ts
// GANTI TOTAL: dulu 1 user = 1 itinerary (selalu deleteMany lalu create baru).
// Sekarang user bisa punya banyak itinerary, masing-masing punya title,
// tripDate, dan status (draft/aktif/selesai).
//
// GET  -> daftar SEMUA itinerary milik user (untuk halaman /pengunjung/rencana)
// POST -> buat itinerary BARU (kosong / manual / AI), TIDAK menghapus yang lama

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  optimizeRoute,
  calculateTotalDistance,
} from "@/lib/utils";

// GET - daftar semua itinerary user, urut: aktif dulu, lalu draft, lalu selesai (terbaru dulu)
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

    const itineraries = await prisma.itinerary.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            destination: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                latitude: true,
                longitude: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    // Urutkan: aktif > draft > selesai, lalu by updatedAt desc di tiap grup
    const statusWeight: Record<string, number> = { aktif: 0, draft: 1, selesai: 2 };
    const sorted = [...itineraries].sort(
      (a, b) => statusWeight[a.status] - statusWeight[b.status]
    );

    const enriched = sorted.map((it) => ({
      ...it,
      visitedCount: it.items.filter((i) => i.visited).length,
      totalItems: it.items.length,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar itinerary" },
      { status: 500 }
    );
  }
}

// POST - buat itinerary baru
// Body untuk MANUAL (kosong): { userId, title, tripDate, useAI: false }
// Body untuk AI: { userId, title, tripDate, useAI: true, destinationIds,
//                  startLat, startLng, startLabel, startType }
// destinationIds boleh kosong untuk mode manual (itinerary dibuat tanpa item,
// destinasi ditambahkan belakangan dari halaman detail itinerary)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title = "Rencana Perjalananku",
      tripDate,
      useAI = false,
      destinationIds = [],
      startLat,
      startLng,
      startLabel,
      startType,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId diperlukan" },
        { status: 400 }
      );
    }

    // Mode manual tanpa destinasi -> buat itinerary kosong langsung
    if (!destinationIds?.length) {
      const itinerary = await prisma.itinerary.create({
        data: {
          userId,
          title,
          tripDate: tripDate ? new Date(tripDate) : null,
          isAiGenerated: false,
          startLat: startLat ?? null,
          startLng: startLng ?? null,
          startLabel: startLabel ?? null,
          startType: startType ?? null,
        },
        include: {
          items: {
            include: {
              destination: {
                include: { categories: { include: { category: true } } },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });
      return NextResponse.json({ success: true, data: itinerary });
    }

    // Ada destinationIds -> hitung urutan (AI atau manual sesuai urutan dikirim)
    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds }, status: "aktif" },
    });

    let orderedDestinations: Array<{
      id: number;
      visitTime: string;
      distanceFromPrev: number;
    }>;

    if (useAI && startLat && startLng) {
      orderedDestinations = optimizeRoute(startLat, startLng, destinations);
    } else {
      orderedDestinations = destinationIds.map((id: number, idx: number) => {
        return {
          id,
          visitTime: `${String(8 + idx * 2).padStart(2, "0")}:00`,
          distanceFromPrev: 0,
        };
      });
    }

    const orderedDests = orderedDestinations
      .map((o) => destinations.find((d) => d.id === o.id)!)
      .filter(Boolean);

    const totalDistance =
      startLat && startLng
        ? calculateTotalDistance(startLat, startLng, orderedDests)
        : 0;

    const estimatedTime =
      orderedDests.length * 90 + Math.round((totalDistance / 40) * 60);

    const estimatedCost = orderedDests.reduce(
      (sum, d) => sum + (d.ticketPrice || 0),
      0
    );

    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title,
        tripDate: tripDate ? new Date(tripDate) : null,
        totalDistance,
        estimatedTime,
        estimatedCost,
        isAiGenerated: useAI,
        startLat: startLat ?? null,
        startLng: startLng ?? null,
        startLabel: startLabel ?? null,
        startType: startType ?? null,
        items: {
          create: orderedDestinations.map((o, idx) => ({
            destinationId: o.id,
            order: idx + 1,
            visitTime: o.visitTime,
          })),
        },
      },
      include: {
        items: {
          include: {
            destination: {
              include: { categories: { include: { category: true } } },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: itinerary });
  } catch (error) {
    console.error("Error creating itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat itinerary" },
      { status: 500 }
    );
  }
}
