// app/api/pengunjung/reviews/route.ts
// API untuk ulasan wisatawan

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - ambil semua ulasan user + visited places
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

    // Tempat yang pernah dikunjungi (belum diulas + sudah diulas)
    const visited = await prisma.visitedPlace.findMany({
      where: { userId },
      include: {
        destination: {
          include: { categories: { include: { category: true } } },
        },
      },
      orderBy: { visitedAt: "desc" },
    });

    // Ulasan yang sudah ditulis
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        destination: {
          include: { categories: { include: { category: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        visitedPlaces: visited,
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data ulasan" },
      { status: 500 }
    );
  }
}

// POST - buat ulasan baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, destinationId, rating, comment, photoUrl, videoUrl } = body;

    if (!userId || !destinationId || !rating) {
      return NextResponse.json(
        { success: false, error: "userId, destinationId, dan rating diperlukan" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.upsert({
      where: { userId_destinationId: { userId, destinationId } },
      update: { rating, comment, photoUrl, videoUrl, updatedAt: new Date() },
      create: { userId, destinationId, rating, comment, photoUrl, videoUrl },
      include: {
        user: { select: { id: true, name: true, photo: true } },
        destination: { select: { id: true, name: true, imageUrl: true, address: true } },
      },
    });

    // Mark as visited
    await prisma.visitedPlace.upsert({
      where: { userId_destinationId: { userId, destinationId } },
      update: { checkedIn: true },
      create: { userId, destinationId, checkedIn: true },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}

// POST check-in via geofencing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, destinationId } = body;

    if (!userId || !destinationId) {
      return NextResponse.json(
        { success: false, error: "userId dan destinationId diperlukan" },
        { status: 400 }
      );
    }

    await prisma.visitedPlace.upsert({
      where: { userId_destinationId: { userId, destinationId } },
      update: { checkedIn: true, visitedAt: new Date() },
      create: { userId, destinationId, checkedIn: true },
    });

    // Increment visit count
    await prisma.destination.update({
      where: { id: destinationId },
      data: { visitCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: "Check-in berhasil!" });
  } catch (error) {
    console.error("Error checking in:", error);
    return NextResponse.json(
      { success: false, error: "Gagal check-in" },
      { status: 500 }
    );
  }
}
