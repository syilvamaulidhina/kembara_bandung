// app/api/pengunjung/saved/route.ts
// API untuk menyimpan / menghapus / mengambil destinasi tersimpan

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

// GET - ambil semua destinasi tersimpan user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId diperlukan" },
        { status: 400 }
      );
    }

    const saved = await prisma.savedDestination.findMany({
      where: { userId: parseInt(userId) },
      include: {
        destination: {
          include: {
            categories: { include: { category: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = saved
      .filter((s) => !s.destination.isDeleted && s.destination.status === "aktif")
      .map((s) => {
        const ratings = s.destination.reviews.map((r) => r.rating);
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null;
        const distance =
          lat && lng
            ? calculateDistance(lat, lng, s.destination.latitude, s.destination.longitude)
            : undefined;
        return {
          savedId: s.id,
          savedAt: s.createdAt,
          ...s.destination,
          reviews: undefined,
          averageRating,
          reviewCount: ratings.length,
          distance,
          isSaved: true,
        };
      });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching saved destinations:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil destinasi tersimpan" },
      { status: 500 }
    );
  }
}

// POST - simpan destinasi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, destinationId } = body;

    if (!userId || !destinationId) {
      return NextResponse.json(
        { success: false, error: "userId dan destinationId diperlukan" },
        { status: 400 }
      );
    }

    const saved = await prisma.savedDestination.upsert({
      where: {
        userId_destinationId: { userId, destinationId },
      },
      update: {},
      create: { userId, destinationId },
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error saving destination:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan destinasi" },
      { status: 500 }
    );
  }
}

// DELETE - hapus destinasi tersimpan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0");
    const destinationId = parseInt(searchParams.get("destinationId") || "0");

    if (!userId || !destinationId) {
      return NextResponse.json(
        { success: false, error: "userId dan destinationId diperlukan" },
        { status: 400 }
      );
    }

    await prisma.savedDestination.deleteMany({
      where: { userId, destinationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing saved destination:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus destinasi tersimpan" },
      { status: 500 }
    );
  }
}
