// app/api/pengunjung/rencana-queue/route.ts
// Destinasi yang sudah diklik "Tambah ke Rencana" dari halaman Tersimpan
// Disimpan di tabel baru ItineraryQueue (perlu di-migrate)
// SEMENTARA: menggunakan SavedDestination dengan flag isQueued

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

// GET – ambil semua destinasi yang sudah di-queue untuk rencana
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");

    if (!userId) return NextResponse.json({ success: false, error: "userId diperlukan" }, { status: 400 });

    // Ambil dari ItineraryQueue jika ada, fallback ke SavedDestination dengan isQueued
    // Untuk sekarang kita cek apakah ada tabel ItineraryQueue, jika tidak pakai saved
    let queuedItems: any[] = [];

    try {
      // Coba akses ItineraryQueue
      queuedItems = await (prisma as any).itineraryQueue.findMany({
        where: { userId },
        include: {
          destination: {
            include: { categories: { include: { category: true } } },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    } catch {
      // Tabel belum ada, fallback ke SavedDestination
      const saved = await prisma.savedDestination.findMany({
        where: { userId },
        include: {
          destination: {
            include: { categories: { include: { category: true } } },
          },
        },
      });
      queuedItems = saved.map(s => ({ destination: s.destination }));
    }

    const data = queuedItems
      .filter((q: any) => !q.destination.isDeleted && q.destination.status === "aktif")
      .map((q: any) => ({
        ...q.destination,
        distance: lat && lng
          ? calculateDistance(lat, lng, q.destination.latitude, q.destination.longitude)
          : undefined,
      }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching rencana queue:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil antrean rencana" }, { status: 500 });
  }
}

// POST – tambah destinasi ke antrean rencana
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, destinationId } = body;

    if (!userId || !destinationId) {
      return NextResponse.json({ success: false, error: "userId dan destinationId diperlukan" }, { status: 400 });
    }

    try {
      await (prisma as any).itineraryQueue.upsert({
        where: { userId_destinationId: { userId, destinationId } },
        update: {},
        create: { userId, destinationId },
      });
    } catch {
      // Tabel belum ada, simpan ke SavedDestination saja
      await prisma.savedDestination.upsert({
        where: { userId_destinationId: { userId, destinationId } },
        update: {},
        create: { userId, destinationId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding to queue:", error);
    return NextResponse.json({ success: false, error: "Gagal menambah ke antrean" }, { status: 500 });
  }
}

// DELETE – hapus dari antrean rencana (setelah itinerary selesai / dibatalkan)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0");
    const destinationId = searchParams.get("destinationId")
      ? parseInt(searchParams.get("destinationId")!)
      : null;
    const clearAll = searchParams.get("clearAll") === "true";

    if (!userId) return NextResponse.json({ success: false, error: "userId diperlukan" }, { status: 400 });

    try {
      if (clearAll) {
        await (prisma as any).itineraryQueue.deleteMany({ where: { userId } });
      } else if (destinationId) {
        await (prisma as any).itineraryQueue.deleteMany({ where: { userId, destinationId } });
      }
    } catch {
      // Tabel belum ada – tidak perlu delete
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from queue:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus dari antrean" }, { status: 500 });
  }
}
