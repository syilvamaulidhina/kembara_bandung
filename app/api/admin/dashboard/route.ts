import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalWisata = await prisma.destination.count({
      where: { isDeleted: false, status: "aktif" },
    });

    const totalPengguna = await prisma.user.count({
      where: { role: "WISATAWAN" },
    });

    const totalKategori = await prisma.category.count();

    const categories = await prisma.category.findMany({
      include: {
        destinations: true,
      },
    });

    const totalSemuaDestinasi = categories.reduce(
      (acc, cat) => acc + cat.destinations.length,
      0
    );

    const colors = ["#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#3B82F6", "#EC4899"];
    const kategoriData = categories.map((cat, i) => ({
      name: cat.name,
      value:
        totalSemuaDestinasi > 0
          ? Math.round((cat.destinations.length / totalSemuaDestinasi) * 100)
          : 0,
      color: colors[i % colors.length],
    }));

    const now = new Date();
    const bulanList = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      bulanList.push({
        bulan: d.toLocaleString("id-ID", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        },
      },
      select: { createdAt: true },
    });

    const kunjunganData = bulanList.map((b) => ({
      bulan: b.bulan,
      kunjungan: reviews.filter(
        (r: { createdAt: Date }) =>
          r.createdAt.getFullYear() === b.year &&
          r.createdAt.getMonth() === b.month
      ).length,
    }));

    return NextResponse.json({
      totalWisata,
      totalPengguna,
      totalKategori,
      kategoriData,
      kunjunganData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        totalWisata: 0,
        totalPengguna: 0,
        totalKategori: 0,
        kategoriData: [],
        kunjunganData: [],
      },
      { status: 500 }
    );
  }
}