// app/api/pengunjung/itinerary/[id]/start/route.ts
// BARU: dipanggil saat user menekan "Mulai Navigasi" di halaman detail itinerary.
//
// Sesuai requirement: itinerary bisa dibuat jauh-jauh hari, jadi saat mulai
// navigasi sistem cek lokasi GPS terbaru. Kalau user pilih "pakai lokasi
// sekarang", urutan destinasi di-reoptimize permanen (overwrite order &
// totalDistance/estimatedTime di DB) TANPA menambah/menghapus destinasi.
// Juga menandai sebagai "Perjalanan Aktif" — hanya 1 itinerary boleh aktif
// per user, jadi itinerary aktif lain (jika ada) otomatis di-set balik ke draft.
//
// Body: { useCurrentLocation: boolean, currentLat?, currentLng? }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { optimizeRoute, calculateTotalDistance } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itineraryId = parseInt(id);

// export async function POST(
//  request: NextRequest,
  // { params }: { params: { id: string } }
// ) {
  // try {
  //   const itineraryId = parseInt(params.id);
   const body = await request.json();
    const { useCurrentLocation, currentLat, currentLng } = body as {
      useCurrentLocation: boolean;
      currentLat?: number;
      currentLng?: number;
    };

    if (!itineraryId) {
      return NextResponse.json(
        { success: false, error: "id itinerary tidak valid" },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      include: { items: { include: { destination: true }, orderBy: { order: "asc" } } },
    });

    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: "Itinerary tidak ditemukan" },
        { status: 404 }
      );
    }

    // Re-optimize urutan destinasi (TANPA menambah/menghapus) pakai lokasi baru
    if (useCurrentLocation && currentLat && currentLng && itinerary.items.length > 0) {
      const destinations = itinerary.items.map((i) => i.destination);
      const optimized = optimizeRoute(currentLat, currentLng, destinations);

      // Update order tiap item sesuai hasil optimasi baru (2 tahap hindari unique conflict)
      for (const o of optimized) {
        const item = itinerary.items.find((i) => i.destinationId === o.id);
        if (item) {
          await prisma.itineraryItem.update({
            where: { id: item.id },
            data: { order: -(optimized.indexOf(o) + 1) },
          });
        }
      }
      for (let idx = 0; idx < optimized.length; idx++) {
        const o = optimized[idx];
        const item = itinerary.items.find((i) => i.destinationId === o.id);
        if (item) {
          await prisma.itineraryItem.update({
            where: { id: item.id },
            data: { order: idx + 1, visitTime: o.visitTime },
          });
        }
      }

      const orderedDests = optimized
        .map((o) => destinations.find((d) => d.id === o.id)!)
        .filter(Boolean);
      const totalDistance = calculateTotalDistance(currentLat, currentLng, orderedDests);
      const estimatedTime =
        orderedDests.length * 90 + Math.round((totalDistance / 40) * 60);

      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          totalDistance,
          estimatedTime,
          startLat: currentLat,
          startLng: currentLng,
          startLabel: "Lokasi GPS terbaru",
          startType: "gps",
        },
      });
    }

    // Pastikan hanya 1 itinerary aktif per user — set yang lain (selain ini) jadi draft
    await prisma.itinerary.updateMany({
      where: { userId: itinerary.userId, status: "aktif", id: { not: itineraryId } },
      data: { status: "draft" },
    });

    // Set itinerary ini jadi aktif
    const updated = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: { status: "aktif", startedAt: itinerary.startedAt ?? new Date() },
      include: {
        items: {
          include: { destination: { include: { categories: { include: { category: true } } } } },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error starting navigation:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memulai navigasi" },
      { status: 500 }
    );
  }
}
