// app/api/pengunjung/itinerary/[id]/items/route.ts
// BARU: kelola item di dalam 1 itinerary spesifik
//
// POST   -> tambah 1/banyak destinasi ke itinerary ini (lanjut urutan terakhir)
// PATCH  -> toggle "visited" untuk 1 item (dipakai navigasi: klik "Sudah Sampai")
// DELETE -> hapus 1 item dari itinerary (?itemId=)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/// POST - body: { destinationIds: number[] }
// Menambahkan ke urutan paling akhir itinerary, visitTime default 2 jam
// setelah destinasi sebelumnya (sederhana, user bisa drag-reorder nanti)
//
// UPDATE:
// - Support Next.js 15 (params menggunakan Promise)
// - Validasi itinerary sebelum menambahkan item

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itineraryId = parseInt(id);

    const body = await request.json();
    const { destinationIds } = body as { destinationIds: number[] };

    // Validasi input
    if (!itineraryId || !destinationIds?.length) {
      return NextResponse.json(
        {
          success: false,
          error: "itineraryId dan destinationIds diperlukan",
        },
        {
          status: 400,
        }
      );
    }

    // Validasi itinerary
    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: itineraryId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        {
          success: false,
          error: "Itinerary tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // Ambil item yang sudah ada
    const existingItems = await prisma.itineraryItem.findMany({
      where: {
        itineraryId,
      },
      select: {
        destinationId: true,
        order: true,
      },
      orderBy: {
        order: "desc",
      },
    });

    type ExistingItem = {
      destinationId: number;
      order: number;
    };

    const existingTyped = existingItems as ExistingItem[];

    // Skip destinasi yang sudah ada di itinerary ini
    const existingDestIds = new Set(
      existingTyped.map((i: ExistingItem) => i.destinationId)
    );

    const newIds = destinationIds.filter(
      (id) => !existingDestIds.has(id)
    );

    if (newIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Semua destinasi sudah ada di itinerary ini",
        added: 0,
      });
    }

    // Hitung urutan terakhir
    let lastOrder = existingTyped[0]?.order || 0;

    await prisma.itineraryItem.createMany({
      data: newIds.map((destinationId, idx) => {
        lastOrder += 1;

        const visitTime = `${String(
          8 + (existingTyped.length + idx) * 2 >= 24
            ? 22
            : 8 + (existingTyped.length + idx) * 2
        ).padStart(2, "0")}:00`;

        return {
          itineraryId,
          destinationId,
          order: lastOrder,
          visitTime,
        };
      }),
    });

    // Recalculate estimasi biaya
    const refreshed = await prisma.itinerary.findUnique({
      where: {
        id: itineraryId,
      },
      include: {
        items: {
          include: {
            destination: true,
          },
        },
      },
    });

    if (refreshed) {
      await prisma.itinerary.update({
        where: {
          id: itineraryId,
        },
        data: {
          updatedAt: new Date(),
          estimatedCost: refreshed.items.reduce(
            (s, i) => s + (i.destination.ticketPrice || 0),
            0
          ),
        },
      });
    }

    return NextResponse.json({
      success: true,
      added: newIds.length,
    });
  } catch (error) {
    console.error("Error adding items to itinerary:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menambah destinasi ke itinerary",
      },
      {
        status: 500,
      }
    );
  }
}
// PATCH - body: { itemId, visited }
// Toggle status "sudah dikunjungi" untuk 1 item dalam itinerary ini.
// Ini progress checkpoint LOKAL ke itinerary (bukan VisitedPlace global).
//
// UPDATE:
// - Support Next.js 15 (params menggunakan Promise)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itineraryId = parseInt(id);

    const body = await request.json();
    const { itemId, visited } = body as {
      itemId: number;
      visited: boolean;
    };

    if (!itineraryId) {
      return NextResponse.json(
        {
          success: false,
          error: "itineraryId tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "itemId diperlukan",
        },
        {
          status: 400,
        }
      );
    }

    // Pastikan itinerary ada
    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: itineraryId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        {
          success: false,
          error: "Itinerary tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // Update status item
    const item = await prisma.itineraryItem.update({
      where: {
        id: itemId,
      },
      data: {
        visited,
        visitedAt: visited ? new Date() : null,
      },
      include: {
        destination: true,
      },
    });

    // Cek apakah semua destinasi sudah dikunjungi
    const allItems = await prisma.itineraryItem.findMany({
      where: {
        itineraryId,
      },
    });

    const allVisited =
      allItems.length > 0 &&
      allItems.every((i) => i.visited);

    if (allVisited) {
      await prisma.itinerary.update({
        where: {
          id: itineraryId,
        },
        data: {
          status: "selesai",
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: item,
      itineraryCompleted: allVisited,
    });
  } catch (error) {
    console.error("Error toggling visited:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal memperbarui status kunjungan",
      },
      {
        status: 500,
      }
    );
  }
}
// DELETE - hapus 1 item dari itinerary (?itemId=)
//
// UPDATE:
// - Support Next.js 15 (params menggunakan Promise)
// - Setelah item dihapus, urutan (order) dirapikan kembali
// - Estimasi biaya diperbarui otomatis

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itineraryId = parseInt(id);

    const { searchParams } = new URL(request.url);
    const itemId = parseInt(searchParams.get("itemId") || "0");

    if (!itineraryId) {
      return NextResponse.json(
        {
          success: false,
          error: "itineraryId tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "itemId diperlukan",
        },
        {
          status: 400,
        }
      );
    }

    // Pastikan itinerary ada
    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: itineraryId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        {
          success: false,
          error: "Itinerary tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // Hapus item
    await prisma.itineraryItem.delete({
      where: {
        id: itemId,
      },
    });

    // Ambil item tersisa
    const items = await prisma.itineraryItem.findMany({
      where: {
        itineraryId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        destination: true,
      },
    });

    // Rapikan order menjadi 1,2,3,...
    for (let i = 0; i < items.length; i++) {
      if (items[i].order !== i + 1) {
        await prisma.itineraryItem.update({
          where: {
            id: items[i].id,
          },
          data: {
            order: i + 1,
          },
        });
      }
    }

    // Hitung ulang estimasi biaya
    await prisma.itinerary.update({
      where: {
        id: itineraryId,
      },
      data: {
        updatedAt: new Date(),
        estimatedCost: items.reduce(
          (total, item) => total + (item.destination.ticketPrice || 0),
          0
        ),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting itinerary item:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghapus item itinerary",
      },
      {
        status: 500,
      }
    );
  }
}