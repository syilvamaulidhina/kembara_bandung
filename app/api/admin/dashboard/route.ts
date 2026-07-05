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

    // Daftar 12 bulan terakhir untuk opsi dropdown
    const availableMonths: { value: string; label: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
      availableMonths.push({ value, label });
    }

    // Breakdown per minggu (selalu 4 batang) untuk bulan yang dipilih
    const [yearStr, monthStr] = monthParam.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1; // JS month index 0-based

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    // Statistik kunjungan diambil dari VisitedPlace
    // Setiap record = 1 kunjungan unik (1 user hanya bisa punya 1 record per destinasi)
    // sehingga tidak ada duplikasi kunjungan dari user yang sama ke destinasi yang sama
    const visits = await prisma.visitedPlace.findMany({
      where: { visitedAt: { gte: startOfMonth, lt: endOfMonth } },
      select: { visitedAt: true },
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Bagi rata jadi 4 minggu (minggu ke-4 menampung sisa hari kalau bulan 29-31 hari)
    const weekSize = Math.ceil(daysInMonth / 4);
    const weekBuckets = [1, 2, 3, 4].map((w) => {
      const start = (w - 1) * weekSize + 1;
      const end = w === 4 ? daysInMonth : Math.min(w * weekSize, daysInMonth);
      return { week: w, start, end, count: 0 };
    });

    visits.forEach((v: { visitedAt: Date }) => {
      const day = v.visitedAt.getDate();
      const bucket = weekBuckets.find((b) => day >= b.start && day <= b.end);
      if (bucket) bucket.count++;
    });

    const kunjunganData = weekBuckets.map((b) => ({
      bulan: `Minggu ${b.week}`,
      kunjungan: b.count,
    }));

    return NextResponse.json({
      totalWisata,
      totalPengguna,
      totalKategori,
      kategoriData,
      kunjunganData,
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
        availableMonths: [],
      },
      { status: 500 }
    );
  }
}