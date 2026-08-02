import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();

    const monthParam =
      searchParams.get("month") ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const totalWisata = await prisma.destination.count({
      where: { isDeleted: false, status: "aktif" },
    });

    const totalPengguna = await prisma.user.count({
      where: { role: "WISATAWAN" },
    });

    const totalKategori = await prisma.category.count();

    const categories = await prisma.category.findMany({
      include: { destinations: true },
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

    const availableMonths: { value: string; label: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
      availableMonths.push({ value, label });
    }

    const [yearStr, monthStr] = monthParam.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    // Ambil visited place beserta kategori destinasinya
    const visits = await prisma.visitedPlace.findMany({
      where: { visitedAt: { gte: startOfMonth, lt: endOfMonth } },
      select: {
        visitedAt: true,
        destination: {
          select: {
            categories: {
              select: { category: { select: { name: true } } },
              take: 1,
            },
          },
        },
      },
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekSize = Math.ceil(daysInMonth / 4);

    // Buat struktur data: weekBuckets[weekIndex][kategoriName] = count
    const weekLabels = ["M1", "M2", "M3", "M4"];
    const kategoriNames = categories.map((c) => c.name);

    // Init semua minggu dengan 0 per kategori
    const weekBuckets: Record<string, Record<string, number>> = {};
    weekLabels.forEach((label) => {
      weekBuckets[label] = {};
      kategoriNames.forEach((k) => {
        weekBuckets[label][k] = 0;
      });
      weekBuckets[label]["Lainnya"] = 0;
    });

    visits.forEach((v) => {
      const day = v.visitedAt.getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / weekSize), 3);
      const weekLabel = weekLabels[weekIndex];
      const kategori = v.destination.categories[0]?.category?.name || "Lainnya";
      if (weekBuckets[weekLabel][kategori] !== undefined) {
        weekBuckets[weekLabel][kategori]++;
      } else {
        weekBuckets[weekLabel]["Lainnya"]++;
      }
    });

    // Format untuk stacked bar chart
    const kunjunganData = weekLabels.map((label) => ({
      bulan: label,
      ...weekBuckets[label],
    }));

    return NextResponse.json({
      totalWisata,
      totalPengguna,
      totalKategori,
      kategoriData,
      kunjunganData,
      kategoriNames,
      availableMonths,
      selectedMonth: monthParam,
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
        kategoriNames: [],
        availableMonths: [],
      },
      { status: 500 }
    );
  }
}