// app/api/pengunjung/destinations/route.ts
// API untuk mengambil daftar destinasi wisata
// Data bersumber dari pengelola (tabel Destination + DestinationCategory + Category)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category"); // slug kategori
    const search = searchParams.get("search");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const maxDistance = parseFloat(searchParams.get("maxDistance") || "100");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const nearby = searchParams.get("nearby") === "true";
    const popular = searchParams.get("popular") === "true";
    const userId = searchParams.get("userId");

    // Build query
    const where: any = {
      status: "aktif",
      isDeleted: false,
    };

    // Filter by category (case-insensitive match)
    if (category && category !== "populer") {
      where.categories = {
        some: {
          category: {
            name: {
              equals: category.charAt(0).toUpperCase() + category.slice(1),
              mode: "insensitive",
            },
          },
        },
      };
    }

    // Filter by search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by price
    if (minPrice > 0 || maxPrice < 999999999) {
      where.ticketPrice = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    // Order by
    let orderBy: any = { visitCount: "desc" };
    if (nearby && lat && lng) {
      orderBy = { visitCount: "desc" }; // sort by distance done in code
    }

    const skip = (page - 1) * limit;

    // Get saved destinations for user
    let savedIds: Set<number> = new Set();
    if (userId) {
      const saved = await prisma.savedDestination.findMany({
        where: { userId: parseInt(userId) },
        select: { destinationId: true },
      });
      savedIds = new Set(saved.map((s) => s.destinationId));
    }

    // Get reviews aggregate
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        include: {
          categories: {
            include: { category: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy,
        skip: popular ? 0 : skip,
        take: popular ? 100 : limit,
      }),
      prisma.destination.count({ where }),
    ]);

    // Add computed fields
    let enriched = destinations.map((dest) => {
      const reviewRatings = dest.reviews.map((r) => r.rating);
      const averageRating =
        reviewRatings.length > 0
          ? reviewRatings.reduce((a, b) => a + b, 0) / reviewRatings.length
          : null;

      const distance =
        lat && lng
          ? calculateDistance(lat, lng, dest.latitude, dest.longitude)
          : undefined;

      return {
        ...dest,
        reviews: undefined,
        averageRating,
        reviewCount: reviewRatings.length,
        distance,
        isSaved: savedIds.has(dest.id),
      };
    });

    // Filter by distance if nearby
    if (nearby && lat && lng) {
      enriched = enriched.filter((d) => (d.distance || 0) <= maxDistance);
    }

    // Filter by rating
    if (minRating > 0) {
      enriched = enriched.filter((d) => (d.averageRating || 0) >= minRating);
    }

    // Sort by distance if nearby
    if (nearby && lat && lng) {
      enriched.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Sort by visitCount if popular
    if (popular) {
      enriched.sort((a, b) => b.visitCount - a.visitCount);
      enriched = enriched.slice(skip, skip + limit);
    }

    return NextResponse.json({
      success: true,
      data: enriched,
      pagination: {
        page,
        limit,
        total: nearby ? enriched.length : total,
        totalPages: Math.ceil((nearby ? enriched.length : total) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data destinasi" },
      { status: 500 }
    );
  }
}
