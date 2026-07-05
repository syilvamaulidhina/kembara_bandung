import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Periode = "all" | "7d" | "30d" | "90d" | "365d";

const PERIODE_DAYS: Record<Exclude<Periode, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

function getDateFrom(periode: Periode): Date | null {
  if (periode === "all") return null;
  const d = new Date();
  d.setDate(d.getDate() - PERIODE_DAYS[periode]);
  return d;
}

function periodeLabel(periode: Periode) {
  switch (periode) {
    case "7d": return "7 hari terakhir";
    case "30d": return "30 hari terakhir";
    case "90d": return "3 bulan terakhir";
    case "365d": return "1 tahun terakhir";
    default: return "semua waktu";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, filters } = body;

    if (action !== "generate_insights") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const kategoriId: string = filters?.kategoriId || "ALL";
    const periode: Periode = filters?.periode || "all";
    const dateFrom = getDateFrom(periode);

    // Daftar kategori selalu diambil tanpa filter, untuk mengisi dropdown
    const allCategoriesRaw = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    // Samakan id ke string agar konsisten dengan value dari <select> di frontend,
    // apapun tipe id aslinya di Prisma (Int atau String).
    const allCategories = allCategoriesRaw.map((c) => ({ id: String(c.id), name: c.name }));

    // Untuk query Prisma, kembalikan ke tipe asli sesuai skema (number jika id Int).
    const kategoriIdForQuery: any =
      kategoriId !== "ALL" && !Number.isNaN(Number(kategoriId)) ? Number(kategoriId) : kategoriId;

    // Where clause dasar (tanpa filter kategori/waktu) untuk statistik global
    const baseWhere = { isDeleted: false };

    const totalWisata = await prisma.destination.count({ where: baseWhere });
    const wisataAktif = await prisma.destination.count({
      where: { ...baseWhere, status: "aktif" },
    });
    const wisataNonAktif = await prisma.destination.count({
      where: { ...baseWhere, status: { not: "aktif" } },
    });
    const tanpaKoordinat = await prisma.destination.count({
      where: {
        ...baseWhere,
        OR: [{ latitude: { equals: 0 } }, { longitude: { equals: 0 } }],
      },
    });
    const tanpaFoto = await prisma.destination.count({
      where: { ...baseWhere, OR: [{ imageUrl: null }, { imageUrl: "" }] },
    });
    const totalPengguna = await prisma.user.count({ where: { role: "WISATAWAN" } });

    // Where clause khusus untuk data yang DIANALISIS, sesuai filter admin
    const filteredWhere: any = { isDeleted: false };
    if (kategoriId !== "ALL") {
      filteredWhere.categories = { some: { categoryId: kategoriIdForQuery } };
    }
    if (dateFrom) {
      filteredWhere.createdAt = { gte: dateFrom };
    }

    const destinasiTerfilter = await prisma.destination.findMany({
      where: filteredWhere,
      include: {
        categories: { include: { category: true } },
        reviews: true,
      },
    });

    // Distribusi kategori dihitung dari data yang SUDAH difilter
    const kategoriMap: Record<string, { jumlah: number; ratings: number[] }> = {};
    destinasiTerfilter.forEach((d) => {
      const namaKategori = d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA";
      if (!kategoriMap[namaKategori]) {
        kategoriMap[namaKategori] = { jumlah: 0, ratings: [] };
      }
      kategoriMap[namaKategori].jumlah += 1;
      d.reviews.forEach((r) => kategoriMap[namaKategori].ratings.push(r.rating));
    });

    const totalTerfilter = destinasiTerfilter.length;


    const kategoriSummary = Object.entries(kategoriMap).map(([kategori, val]) => {
      const persentase = totalTerfilter > 0 ? Math.round((val.jumlah / totalTerfilter) * 100) : 0;
      const avgRating =
        val.ratings.length > 0
          ? Math.round((val.ratings.reduce((a, b) => a + b, 0) / val.ratings.length) * 10) / 10
          : 0;
      return { kategori, jumlah: val.jumlah, persentase, avgRating };
    });

    // Top wisata rating tertinggi, mengikuti filter kategori & periode
    const topRated = destinasiTerfilter
      .filter((d) => d.status === "aktif" && d.reviews.length > 0)
      .map((d) => {
        const ratings = d.reviews.map((r) => r.rating);
        const avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
        return {
          nama: d.name,
          kategori: d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA",
          rating: avgRating,
          lokasi: d.address,
          jumlahReview: ratings.length,
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const realData = {
      totalWisata,
      totalPengguna,
      wisataAktif,
      wisataNonAktif,
      tanpaKoordinat,
      tanpaFoto,
      totalTerfilter,
      kategoriSummary,
      topRated,
    };

    const namaKategoriAktif =
      kategoriId === "ALL"
        ? "Semua Kategori"
        : allCategories.find((c) => c.id === String(kategoriId))?.name || "Kategori tertentu";

    const filterLabel = `Kategori: ${namaKategoriAktif} | Periode: ${periodeLabel(periode)}`;

    if (totalTerfilter === 0) {
      return NextResponse.json({
        insights: [
          {
            id: 1,
            type: "warning",
            title: "Tidak Ada Data Sesuai Filter",
            description: `Tidak ditemukan data wisata untuk filter "${filterLabel}". Coba ubah kategori atau perluas rentang waktu.`,
            impact: "medium",
          },
        ],
        data: realData,
        categories: allCategories,
        appliedFilters: { kategoriId, periode },
      });
    }

    const context = `Data Kembara Bandung (FILTER AKTIF: ${filterLabel}):

STATISTIK GLOBAL (seluruh sistem, tidak terpengaruh filter):
- Total Wisata Terdaftar: ${totalWisata}
- Wisata Aktif: ${wisataAktif}
- Wisata Tidak Aktif: ${wisataNonAktif}
- Total Pengguna Wisatawan: ${totalPengguna}
- Wisata Tanpa Koordinat: ${tanpaKoordinat}
- Wisata Tanpa Foto: ${tanpaFoto}

DATA HASIL FILTER (${filterLabel}):
- Jumlah wisata sesuai filter: ${totalTerfilter}

DISTRIBUSI KATEGORI (dalam hasil filter):
${kategoriSummary.map((k) => `- ${k.kategori}: ${k.jumlah} wisata (${k.persentase}%), avg rating: ${k.avgRating}`).join("\n")}

TOP WISATA RATING TERTINGGI (dalam hasil filter):
${topRated.length > 0
  ? topRated.map((w, i) => `${i + 1}. ${w.nama} - ${w.kategori} - Rating: ${w.rating} (${w.jumlahReview} review)`).join("\n")
  : "Belum ada wisata dengan review pada hasil filter ini"}`;

    const systemPrompt = `Kamu adalah AI Analyst untuk platform wisata Kembara Bandung.
Admin sedang menganalisis data dengan FILTER AKTIF: ${filterLabel}.
Fokuskan seluruh insight HANYA pada data hasil filter tersebut, bukan data global, kecuali diminta membandingkan.
Hasilkan 4-6 insight yang actionable untuk admin, relevan dengan konteks filter yang dipilih.

PENTING: Jangan buat insight tentang "wisata tanpa foto" jika jumlah wisata tanpa foto adalah 0.
PENTING: Jangan buat insight tentang "wisata tanpa koordinat" jika jumlah wisata tanpa koordinat adalah 0.
PENTING: Jangan buat insight tentang "top wisata" atau "rating tertinggi" jika belum ada wisata dengan review pada hasil filter.
Hanya buat insight yang relevan dan akurat berdasarkan data yang diberikan.

Kategori insight yang tersedia:
- opportunity: Peluang yang bisa dimanfaatkan
- warning: Peringatan atau area yang perlu perhatian (hanya jika ada masalah nyata)
- trend: Pola atau tren yang teridentifikasi
- recommendation: Rekomendasi aksi konkret

Format respons HARUS berupa JSON array seperti contoh berikut, tanpa teks lain:
[
  {
    "id": 1,
    "type": "trend",
    "title": "Judul insight",
    "description": "Penjelasan 2-3 kalimat dengan data spesifik",
    "impact": "medium"
  }
]

Nilai impact hanya boleh salah satu dari: high, medium, low.
Nilai type hanya boleh salah satu dari: opportunity, warning, trend, recommendation.
Gunakan data spesifik dari context, bahasa Indonesia profesional.
PENTING: Respons hanya JSON array saja, tidak ada penjelasan atau teks lain.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analisis data berikut dan hasilkan insight:\n\n${context}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json({
        insights: getFallbackInsights(realData, filterLabel),
        data: realData,
        categories: allCategories,
        appliedFilters: { kategoriId, periode },
      });
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    let insights: any[] = [];
    try {
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);

        insights = insights.filter((insight: any) => {
          const title = insight.title?.toLowerCase() || "";
          const desc = insight.description?.toLowerCase() || "";
          if ((title.includes("foto") || desc.includes("foto")) && tanpaFoto === 0) return false;
          if ((title.includes("koordinat") || desc.includes("koordinat")) && tanpaKoordinat === 0) return false;
          if ((title.includes("rating") || title.includes("top")) && topRated.length === 0) return false;
          return true;
        });
      } else {
        insights = getFallbackInsights(realData, filterLabel);
      }
    } catch {
      insights = getFallbackInsights(realData, filterLabel);
    }

    return NextResponse.json({
      insights,
      data: realData,
      categories: allCategories,
      appliedFilters: { kategoriId, periode },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { insights: getFallbackInsights(null, "Semua Kategori | semua waktu"), data: null, categories: [] },
      { status: 500 }
    );
  }
}

function getFallbackInsights(data: any, filterLabel: string) {
  const insights: any[] = [
    {
      id: 1,
      type: "trend",
      title: "Ringkasan Data Sesuai Filter",
      description: `Berdasarkan filter (${filterLabel}), ditemukan ${data?.totalTerfilter ?? 0} wisata yang sesuai kriteria.`,
      impact: "medium",
    },
    {
      id: 3,
      type: "opportunity",
      title: "Potensi Pengguna Wisatawan",
      description: `Total ${data?.totalPengguna ?? 0} wisatawan terdaftar menunjukkan basis pengguna yang terus berkembang.`,
      impact: "medium",
    },
    {
      id: 4,
      type: "recommendation",
      title: "Tingkatkan Kualitas Data Wisata",
      description: "Pastikan semua wisata memiliki deskripsi lengkap dan koordinat yang akurat untuk meningkatkan pengalaman pengguna.",
      impact: "high",
    },
  ];

  if ((data?.tanpaFoto ?? 0) > 0) {
    insights.splice(1, 0, {
      id: 2,
      type: "warning",
      title: "Wisata Belum Memiliki Foto",
      description: `Terdapat ${data?.tanpaFoto} wisata yang belum memiliki foto. Foto sangat penting untuk menarik minat wisatawan.`,
      impact: "high",
    });
  }

  if ((data?.tanpaKoordinat ?? 0) > 0) {
    insights.push({
      id: 5,
      type: "warning",
      title: "Wisata Belum Memiliki Koordinat",
      description: `Terdapat ${data?.tanpaKoordinat} wisata yang belum memiliki koordinat. Wisata ini tidak akan muncul di peta SIG.`,
      impact: "high",
    });
  }

  return insights;
}