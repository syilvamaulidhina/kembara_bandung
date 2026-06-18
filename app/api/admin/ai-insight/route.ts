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
        OR: [
          { latitude: { equals: 0 } },
          { longitude: { equals: 0 } },
        ],
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

    // Ambil semua destinasi beserta kategori dan review
    const semuaDestinasi = await prisma.destination.findMany({
      where: { isDeleted: false },
      include: {
        categories: {
          include: { category: true },
        },
        reviews: true,
      },
    });

    // Hitung distribusi kategori dari destinasi (1 destinasi = 1 kategori)
    const kategoriMap: Record<string, { jumlah: number; ratings: number[] }> = {};

    semuaDestinasi.forEach((d) => {
      const namaKategori = d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA";
      if (!kategoriMap[namaKategori]) {
        kategoriMap[namaKategori] = { jumlah: 0, ratings: [] };
      }
      kategoriMap[namaKategori].jumlah += 1;
      d.reviews.forEach((r) => {
        kategoriMap[namaKategori].ratings.push(r.rating);
      });
    });

    const kategoriSummary = Object.entries(kategoriMap).map(([kategori, val]) => {
      const persentase = totalWisata > 0 ? Math.round((val.jumlah / totalWisata) * 100) : 0;
      const avgRating =
        val.ratings.length > 0
          ? Math.round((val.ratings.reduce((a, b) => a + b, 0) / val.ratings.length) * 10) / 10
          : 0;
      return { kategori, jumlah: val.jumlah, persentase, avgRating };
    });

    // Top 3 wisata rating tertinggi — hanya yang sudah punya review
    const topRated = semuaDestinasi
      .filter((d) => d.status === "aktif" && d.reviews.length > 0)
      .map((d) => {
        const ratings = d.reviews.map((r) => r.rating);
        const avgRating =
          Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
        return {
          nama: d.name,
          kategori: d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA",
          rating: avgRating,
          lokasi: d.address,
          jumlahReview: ratings.length,
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
${topRated.length > 0
  ? topRated.map((w, i) => `${i + 1}. ${w.nama} - ${w.kategori} - Rating: ${w.rating} (${w.jumlahReview} review)`).join("\n")
  : "Belum ada wisata dengan review"}`;

    const systemPrompt = `Kamu adalah AI Analyst untuk platform wisata Kembara Bandung.
Analisis data dashboard dan hasilkan 6-8 insight yang actionable untuk admin.

PENTING: Jangan buat insight tentang "wisata tanpa foto" jika jumlah wisata tanpa foto adalah 0.
PENTING: Jangan buat insight tentang "wisata tanpa koordinat" jika jumlah wisata tanpa koordinat adalah 0.
PENTING: Jangan buat insight tentang "top wisata" atau "rating tertinggi" jika belum ada wisata dengan review.
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
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analisis data berikut dan hasilkan insight:\n\n${context}` },
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

    let insights: any[] = [];
    try {
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);

        // Filter insight yang tidak relevan berdasarkan data nyata
        insights = insights.filter((insight: any) => {
          const title = insight.title?.toLowerCase() || "";
          const desc = insight.description?.toLowerCase() || "";
          if ((title.includes("foto") || desc.includes("foto")) && tanpaFoto === 0) return false;
          if ((title.includes("koordinat") || desc.includes("koordinat")) && tanpaKoordinat === 0) return false;
          if ((title.includes("rating") || title.includes("top")) && topRated.length === 0) return false;
          return true;
        });
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
  const insights: any[] = [
    {
      id: 1,
      type: "trend",
      title: "Wisata Aktif Mendominasi",
      description: `Dari ${data?.totalWisata ?? 0} wisata terdaftar, ${data?.wisataAktif ?? 0} wisata berstatus aktif. Ini menunjukkan pengelolaan data wisata yang baik.`,
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