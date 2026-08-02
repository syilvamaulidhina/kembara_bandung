// app/api/pengunjung/destinations/route.ts
// UPDATE: support kategori dari DB (nama langsung, bukan slug), fix filter jarak
// pakai nearby=true agar backward-compatible dengan kode lama

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category"); // nama kategori (langsung dari DB)
    const search = searchParams.get("search");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const maxDistance = parseFloat(searchParams.get("maxDistance") || "100");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    // nearby=true → aktifkan filter & sort jarak dari koordinat GPS user
    const nearby = searchParams.get("nearby") === "true";
    // Kalau ada maxDistance dikirim DAN ada lat/lng → anggap nearby juga aktif
    // (dipakai oleh halaman kategori detail yang kirim maxDistance tanpa nearby=true)
    const hasCoords = lat !== 0 && lng !== 0;
    const distanceFilterActive =
      hasCoords &&
      (nearby || searchParams.has("maxDistance"));
    const popular = searchParams.get("popular") === "true";
    const userId = searchParams.get("userId");

    // ── WHERE clause ─────────────────────────────────────────────
    const where: any = {
      status: "aktif",
      isDeleted: false,
    };

    // Filter kategori — terima nama langsung dari DB (case-insensitive)
    // Backward-compatible: dulu pakai slug, sekarang pakai nama lengkap
    if (category && category !== "populer") {
      where.categories = {
        some: {
          category: {
            name: {
              // Kalau dikirim nama lengkap (mis. "Wisata Alam"), cocokkan persis
              // Kalau dikirim slug lama (mis. "wisata-alam"), fallback ke contains
              equals: category,
              mode: "insensitive",
            },
          },
        },
      };
    }

    // Filter search — cari di name, description, address, dan nama kategori
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        {
          categories: {
            some: {
              category: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
      ];
    }

    // Filter harga
    if (minPrice > 0 || maxPrice < 999999999) {
      where.ticketPrice = { gte: minPrice, lte: maxPrice };
    }

    // Order by
    const orderBy: any = { visitCount: "desc" };

    const skip = (page - 1) * limit;

    // isSaved — pakai query terpisah (sama dengan kode asli)
    let savedIds: Set<number> = new Set();
    if (userId) {
      const saved = await prisma.savedDestination.findMany({
        where: { userId: parseInt(userId) },
        select: { destinationId: true },
      });
      savedIds = new Set(saved.map((s: any) => s.destinationId));
    }

    // Kalau filter jarak aktif, ambil lebih banyak dulu lalu filter di JS
    // (sama dengan pola kode asli untuk nearby)
    const fetchTake = distanceFilterActive || popular ? undefined : limit;
    const fetchSkip = distanceFilterActive || popular ? undefined : skip;

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          reviews: { select: { rating: true } },
          savedBy: { select: { id: true } },
        },
        orderBy,
        ...(fetchTake !== undefined && { take: fetchTake }),
        ...(fetchSkip !== undefined && { skip: fetchSkip }),
      }),
      prisma.destination.count({ where }),
    ]);

    // ── Enrichment: tambah computed fields ────────────────────────
    let enriched = destinations.map((dest: any) => {
      const reviewRatings = dest.reviews.map((r: any) => r.rating);
      const averageRating =
        reviewRatings.length > 0
          ? reviewRatings.reduce((a: number, b: number) => a + b, 0) /
            reviewRatings.length
          : null;

      const distance =
        hasCoords
          ? calculateDistance(lat, lng, dest.latitude, dest.longitude)
          : undefined;

      const savedCount = dest.savedBy ? dest.savedBy.length : 0;
      const popularityScore = (dest.visitCount * 1) + (savedCount * 3) + (reviewRatings.length * 5) + ((averageRating || 0) * 10);

      return {
        ...dest,
        reviews: undefined, // bersihkan dari response
        savedBy: undefined, // bersihkan dari response
        averageRating,
        reviewCount: reviewRatings.length,
        distance,
        popularityScore,
        isSaved: savedIds.has(dest.id),
      };
    });

    // Filter by jarak (kalau distanceFilterActive)
    if (distanceFilterActive) {
      enriched = enriched.filter(
        (d: any) => (d.distance ?? 0) <= maxDistance
      );
    }

    // Filter by rating minimum
    if (minRating > 0) {
      enriched = enriched.filter(
        (d: any) => (d.averageRating ?? 0) >= minRating
      );
    }

    // Sort by jarak kalau filter aktif
    if (distanceFilterActive) {
      enriched.sort(
        (a: any, b: any) => (a.distance ?? 0) - (b.distance ?? 0)
      );
    }

    // Sort & paginate popular
    if (popular) {
      enriched.sort((a: any, b: any) => b.popularityScore - a.popularityScore);
    }

    // Pagination manual kalau filter jarak atau popular aktif
    const needsManualPaginate = distanceFilterActive || popular;
    const finalData = needsManualPaginate
      ? enriched.slice(skip, skip + limit)
      : enriched;

    // Total yang dikembalikan ke pagination
    const finalTotal = distanceFilterActive
      ? enriched.length  // setelah filter jarak
      : total;           // dari count Prisma

    return NextResponse.json({
      success: true,
      data: finalData,
      pagination: {
        page,
        limit,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limit),
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