// app/api/pengunjung/itinerary/route.ts
// API untuk membuat, mengambil, dan mengelola rencana perjalanan

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  optimizeRoute,
  calculateTotalDistance,
  calculateDistance,
} from "@/lib/utils";

// GET - ambil itinerary aktif user (atau buat baru jika belum ada)
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

    // Ambil itinerary terbaru user
    const itinerary = await prisma.itinerary.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            destination: {
              include: {
                categories: { include: { category: true } },
                reviews: { select: { rating: true } },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!itinerary) {
      return NextResponse.json({ success: true, data: null });
    }

    const enriched = {
      ...itinerary,
      items: itinerary.items.map((item) => {
        const ratings = item.destination.reviews.map((r) => r.rating);
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null;
        return {
          ...item,
          destination: {
            ...item.destination,
            reviews: undefined,
            averageRating,
            reviewCount: ratings.length,
          },
        };
      }),
    };

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil itinerary" },
      { status: 500 }
    );
  }
}

// POST - buat itinerary baru / update dengan destinasi yang dipilih
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      destinationIds,
      startLat,
      startLng,
      useAI = false,
      title = "Rencana Perjalananku",
    } = body;

    if (!userId || !destinationIds?.length) {
      return NextResponse.json(
        { success: false, error: "userId dan destinationIds diperlukan" },
        { status: 400 }
      );
    }

    // Ambil data destinasi
    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds }, status: "aktif" },
    });

    // Tentukan urutan
    let orderedDestinations: Array<{
      id: number;
      visitTime: string;
      distanceFromPrev: number;
    }>;

    if (useAI && startLat && startLng) {
      // AI optimization: Nearest Neighbor Algorithm
      orderedDestinations = optimizeRoute(startLat, startLng, destinations);
    } else {
      // Manual order: ikuti urutan yang dikirim
      orderedDestinations = destinationIds.map((id: number, idx: number) => {
        const dest = destinations.find((d) => d.id === id);
        return {
          id,
          visitTime: `${String(8 + idx * 2).padStart(2, "0")}:00`,
          distanceFromPrev: 0,
        };
      });
    }

    // Hitung total jarak dan estimasi waktu
    const orderedDests = orderedDestinations
      .map((o) => destinations.find((d) => d.id === o.id)!)
      .filter(Boolean);

    const totalDistance = startLat && startLng
      ? calculateTotalDistance(startLat, startLng, orderedDests)
      : 0;

    const estimatedTime = orderedDests.length * 90 + Math.round((totalDistance / 40) * 60);

    // Hitung estimasi biaya (sum tiket)
    const estimatedCost = orderedDests.reduce(
      (sum, d) => sum + (d.ticketPrice || 0),
      0
    );

    // Hapus itinerary lama user (simpan 1 itinerary aktif saja)
    await prisma.itinerary.deleteMany({ where: { userId } });

    // Buat itinerary baru
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title,
        totalDistance,
        estimatedTime,
        estimatedCost,
        isAiGenerated: useAI,
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

// PATCH - update urutan item dalam itinerary
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itineraryId, items } = body;
    // items: Array<{ id: number, order: number }>

    if (!itineraryId || !items) {
      return NextResponse.json(
        { success: false, error: "itineraryId dan items diperlukan" },
        { status: 400 }
      );
    }

    // Update order setiap item
    await Promise.all(
      items.map((item: { id: number; order: number }) =>
        prisma.itineraryItem.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    // Recalculate total distance
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      include: {
        items: {
          include: { destination: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (itinerary?.items.length) {
      const dests = itinerary.items.map((i) => i.destination);
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          updatedAt: new Date(),
          estimatedCost: dests.reduce((s, d) => s + (d.ticketPrice || 0), 0),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui itinerary" },
      { status: 500 }
    );
  }
}

// DELETE - hapus item dari itinerary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = parseInt(searchParams.get("itemId") || "0");

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "itemId diperlukan" },
        { status: 400 }
      );
    }

    await prisma.itineraryItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting itinerary item:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus item itinerary" },
      { status: 500 }
    );
  }
}
