// app/api/pengunjung/itinerary/[id]/route.ts
// BARU: detail satu itinerary spesifik (sebelumnya tidak ada, karena dulu
// cuma ada 1 itinerary per user jadi tidak perlu route by id)
//
// GET    -> detail 1 itinerary + semua item & destinasinya
// PATCH  -> update reorder item, atau update info itinerary (title/tripDate)
// DELETE -> hapus itinerary ini (sesuai permintaan: bisa hapus dari halaman Rencana)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itineraryId = parseInt(id);

    if (isNaN(itineraryId)) {
      return NextResponse.json(
        { success: false, error: "id itinerary tidak valid" },
        { status: 400 }
      );
    }
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
    // const itineraryId = parseInt(params.id);

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
  //  try {
//     const itineraryId = parseInt(params.id);
    if (!itineraryId) {
      return NextResponse.json(
        { success: false, error: "id itinerary tidak valid" },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
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
    });

    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: "Itinerary tidak ditemukan" },
        { status: 404 }
      );
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
    console.error("Error fetching itinerary detail:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail itinerary" },
      { status: 500 }
    );
  }
}

// PATCH - dua kegunaan:
// 1. Reorder items: body { items: [{ id, order }] }
// 2. Update info: body { title?, tripDate? }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const itineraryId = parseInt(id);

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
  try {
    // const itineraryId = parseInt(params.id);
    const body = await request.json();
    const { items, title, tripDate } = body;

    if (!itineraryId) {
      return NextResponse.json(
        { success: false, error: "id itinerary tidak valid" },
        { status: 400 }
      );
    }

    // Reorder items (pola sama seperti sebelumnya: dua tahap hindari unique constraint conflict)
    if (items?.length) {
      const typedItems = items as { id: number; order: number }[];

      for (const item of typedItems) {
        await prisma.itineraryItem.update({
          where: { id: item.id },
          data: { order: -item.order },
        });
      }
      for (const item of typedItems) {
        await prisma.itineraryItem.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }

      const refreshed = await prisma.itinerary.findUnique({
        where: { id: itineraryId },
        include: {
          items: { include: { destination: true }, orderBy: { order: "asc" } },
        },
      });

      if (refreshed?.items.length) {
        await prisma.itinerary.update({
          where: { id: itineraryId },
          data: {
            updatedAt: new Date(),
            estimatedCost: refreshed.items.reduce(
              (s, i) => s + (i.destination.ticketPrice || 0),
              0
            ),
          },
        });
      }
    }

    // Update info dasar
    if (title !== undefined || tripDate !== undefined) {
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          ...(title !== undefined && { title }),
          ...(tripDate !== undefined && {
            tripDate: tripDate ? new Date(tripDate) : null,
          }),
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

// DELETE - hapus itinerary beserta semua itemnya (cascade dari schema)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const itineraryId = parseInt(id);

// export async function DELETE(
  // request: NextRequest,
  // { params }: { params: { id: string } }
// ) {
  try {
    // const itineraryId = parseInt(params.id);
    if (!itineraryId) {
      return NextResponse.json(
        { success: false, error: "id itinerary tidak valid" },
        { status: 400 }
      );
    }

    await prisma.itinerary.delete({ where: { id: itineraryId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus itinerary" },
      { status: 500 }
    );
  }
}
