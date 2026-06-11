import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action !== "generate_insights") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const totalWisata = await prisma.destination.count({
      where: { isDeleted: false },
    });

    const wisataAktif = await prisma.destination.count({
      where: { isDeleted: false, status: "aktif" },
    });

    const wisataNonAktif = await prisma.destination.count({
      where: { isDeleted: false, status: { not: "aktif" } },
    });

    const tanpaKoordinat = await prisma.destination.count({
      where: {
        isDeleted: false,
        OR: [{ latitude: 0 }, { longitude: 0 }],
      },
    });

    const tanpaFoto = await prisma.destination.count({
      where: {
        isDeleted: false,
        OR: [{ imageUrl: null }, { imageUrl: "" }],
      },
    });

    const totalPengguna = await prisma.user.count({
      where: { role: "WISATAWAN" },
    });

    const categories = await prisma.category.findMany({
      include: {
        destinations: {
          include: {
            destination: {
              include: { reviews: true },
            },
          },
        },
      },
    });

    const kategoriSummary = categories.map((cat) => {
      const jumlah = cat.destinations.length;
      const persentase = totalWisata > 0 ? Math.round((jumlah / totalWisata) * 100) : 0;
      const allRatings = cat.destinations.flatMap((d) =>
        d.destination.reviews.map((r) => r.rating)
      );
      const avgRating =
        allRatings.length > 0
          ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
          : 0;
      return {
        kategori: cat.name.toUpperCase(),
        jumlah,
        persentase,
        avgRating,
      };
    });

    const topRatedRaw = await prisma.destination.findMany({
      where: { isDeleted: false, status: "aktif" },
      include: {
        reviews: true,
        categories: {
          include: { category: true },
        },
      },
      take: 20,
    });

    const topRated = topRatedRaw
      .map((d) => {
        const ratings = d.reviews.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
            : 0;
        return {
          nama: d.name,
          kategori: d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA",
          rating: avgRating,
          lokasi: d.address,
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const realData = {
      totalWisata,
      totalPengguna,
      wisataAktif,
      wisataNonAktif,
      tanpaKoordinat,
      tanpaFoto,
      kategoriSummary,
      topRated,
    };

    const context = `Data Real Kembara Bandung:

STATISTIK UTAMA:
- Total Wisata Terdaftar: ${totalWisata}
- Wisata Aktif: ${wisataAktif}
- Wisata Tidak Aktif: ${wisataNonAktif}
- Total Pengguna Wisatawan: ${totalPengguna}
- Wisata Tanpa Koordinat: ${tanpaKoordinat}
- Wisata Tanpa Foto: ${tanpaFoto}

DISTRIBUSI KATEGORI:
${kategoriSummary.map((k) => `- ${k.kategori}: ${k.jumlah} wisata (${k.persentase}%), avg rating: ${k.avgRating}`).join("\n")}

TOP 3 WISATA RATING TERTINGGI:
${topRated.map((w, i) => `${i + 1}. ${w.nama} - ${w.kategori} - Rating: ${w.rating}`).join("\n")}`;

    const systemPrompt = `Kamu adalah AI Analyst untuk platform wisata Kembara Bandung.
Analisis data dashboard dan hasilkan 6-8 insight yang actionable untuk admin.

Kategori insight yang tersedia:
- opportunity: Peluang yang bisa dimanfaatkan
- warning: Peringatan atau area yang perlu perhatian
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
Gunakan data spesifik dari context, bahasa Indonesia profesional, minimal 1 insight per kategori.
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
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Analisis data berikut dan hasilkan insight:\n\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json({ insights: getFallbackInsights(realData), data: realData });
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    let insights = [];
    try {
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = getFallbackInsights(realData);
      }
    } catch {
      insights = getFallbackInsights(realData);
    }

    return NextResponse.json({ insights, data: realData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { insights: getFallbackInsights(null), data: null },
      { status: 500 }
    );
  }
}

function getFallbackInsights(data: any) {
  return [
    {
      id: 1,
      type: "trend",
      title: "Wisata Aktif Mendominasi",
      description: `Dari ${data?.totalWisata ?? 0} wisata terdaftar, ${data?.wisataAktif ?? 0} wisata berstatus aktif. Ini menunjukkan pengelolaan data wisata yang baik.`,
      impact: "medium",
    },
    {
      id: 2,
      type: "warning",
      title: "Wisata Belum Memiliki Foto",
      description: `Terdapat ${data?.tanpaFoto ?? 0} wisata yang belum memiliki foto. Foto sangat penting untuk menarik minat wisatawan.`,
      impact: "high",
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
      title: "Lengkapi Data Wisata",
      description: "Pastikan semua wisata memiliki foto dan koordinat yang lengkap untuk meningkatkan pengalaman pengguna.",
      impact: "high",
    },
  ];
}