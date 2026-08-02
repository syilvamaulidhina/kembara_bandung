// app/api/pengunjung/destinations/[id]/route.ts
// API untuk mengambil detail satu destinasi wisata

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const userIdParam = searchParams.get("userId");
    const userId = userIdParam && userIdParam !== "undefined" && userIdParam !== "null" ? parseInt(userIdParam) : null;

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.findFirst({
      where: { id, status: "aktif", isDeleted: false },
      include: {
        categories: { include: { category: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, photo: true } },
            likes: userId ? {
              where: { userId },
              select: { id: true }
            } : undefined,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        events: {
          where: { status: "aktif", isDeleted: false },
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Destinasi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Increment visit count
    await prisma.destination.update({
      where: { id },
      data: { visitCount: { increment: 1 } },
    });

    // Compute averageRating
    const ratings = destination.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    // Check if saved by user
    let isSaved = false;
    if (userId) {
      const saved = await prisma.savedDestination.findUnique({
        where: {
          userId_destinationId: {
            userId,
            destinationId: id,
          },
        },
      });
      isSaved = !!saved;
    }

    const distance =
      lat && lng
        ? calculateDistance(lat, lng, destination.latitude, destination.longitude)
        : undefined;

    const formattedReviews = destination.reviews.map((r: any) => {
      const isLiked = r.likes ? r.likes.length > 0 : false;
      const { likes, ...rest } = r;
      return { ...rest, isLiked };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...destination,
        reviews: formattedReviews,
        averageRating,
        reviewCount: ratings.length,
        distance,
        isSaved,
      },
    });
  } catch (error) {
    console.error("Error fetching destination detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail destinasi" },
      { status: 500 }
    );
  }
}
