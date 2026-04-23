import { NextRequest, NextResponse } from "next/server";

// Data dummy untuk dashboard (nanti bisa diganti dengan fetch dari database)
const dashboardData = {
  visitData: [
    { bulan: "Jan", kunjungan: 3000 },
    { bulan: "Feb", kunjungan: 4000 },
    { bulan: "Mar", kunjungan: 5200 },
    { bulan: "Apr", kunjungan: 2400 },
    { bulan: "Mei", kunjungan: 3600 },
    { bulan: "Jun", kunjungan: 4100 },
  ],
  kategoriData: [
    { name: "Wisata Alam", value: 40 },
    { name: "Wisata Kuliner", value: 20 },
    { name: "Wisata Edukasi", value: 20 },
    { name: "Wisata Hiburan", value: 20 },
  ],
  topWisata: [
    { nama: "Kawah Putih", pengunjung: "3.000" },
    { nama: "Farm House Lembang", pengunjung: "2.000" },
    { nama: "Orchid Forest", pengunjung: "1.500" },
  ],
  stats: [
    { label: "Wisata Terdaftar", value: "9,812" },
    { label: "Total Kategori Wisata", value: "12" },
    { label: "Pengguna", value: "5,760" },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action !== "generate_insights") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Siapkan context data untuk AI
    const totalKunjungan = dashboardData.visitData.reduce((acc, d) => acc + d.kunjungan, 0);
    const avgKunjungan = Math.round(totalKunjungan / dashboardData.visitData.length);
    const maxMonth = dashboardData.visitData.reduce((prev, current) =>
      current.kunjungan > prev.kunjungan ? current : prev
    );
    const minMonth = dashboardData.visitData.reduce((prev, current) =>
      current.kunjungan < prev.kunjungan ? current : prev
    );
    const dominantCategory = dashboardData.kategoriData.reduce((prev, current) =>
      current.value > prev.value ? current : prev
    );

    const context = `
Data Dashboard Kembara Bandung (per April 2026):

STATISTIK UTAMA:
- Total Wisata Terdaftar: ${dashboardData.stats[0].value}
- Total Kategori: ${dashboardData.stats[1].value}
- Total Pengguna: ${dashboardData.stats[2].value}

DATA KUNJUNGAN (6 bulan):
- Januari: 3,000 kunjungan
- Februari: 4,000 kunjungan
- Maret: 5,200 kunjungan (tertinggi)
- April: 2,400 kunjungan (terendah)
- Mei: 3,600 kunjungan
- Juni: 4,100 kunjungan
- Total: ${totalKunjungan.toLocaleString("id-ID")} kunjungan
- Rata-rata per bulan: ${avgKunjungan.toLocaleString("id-ID")} kunjungan

KATEGORI WISATA:
- Wisata Alam: ${dominantCategory.value}% (dominan)
- Wisata Kuliner: 20%
- Wisata Edukasi: 20%
- Wisata Hiburan: 20%

TOP WISATA:
1. ${dashboardData.topWisata[0].nama} - ${dashboardData.topWisata[0].pengunjung} pengunjung/hari
2. ${dashboardData.topWisata[1].nama} - ${dashboardData.topWisata[1].pengunjung} pengunjung/hari
3. ${dashboardData.topWisata[2].nama} - ${dashboardData.topWisata[2].pengunjung} pengunjung/hari
`;

    const systemPrompt = `Kamu adalah AI Analyst untuk platform wisata Kembara Bandung.
Tugas kamu adalah menganalisis data dashboard dan menghasilkan 6-8 insight yang actionable untuk admin.

Kategori insight:
- "opportunity": Peluang yang bisa dimanfaatkan
- "warning": Peringatan atau area yang perlu perhatian
- "trend": Pola atau tren yang teridentifikasi
- "recommendation": Rekomendasi aksi konkret

Format respons HARUS JSON array seperti ini:
[
  {
    "id": 1,
    "type": "trend",
    "title": "Judul insight yang menarik",
    "description": "Penjelasan insight dalam 2-3 kalimat dengan data pendukung",
    "impact": "high" | "medium" | "low"
  }
]

Pastikan:
- Minimal 1 insight per kategori
- Gunakan data spesifik dari context
- Bahasa Indonesia yang profesional
- Insight harus actionable dan relevan untuk pengembangan wisata Bandung`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Analisis data berikut dan hasilkan insight:\n\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    // Parse JSON dari response
    let insights = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback insights jika parsing gagal
      insights = [
        {
          id: 1,
          type: "trend",
          title: "Kunjungan Tertinggi di Bulan Maret",
          description: `Bulan Maret mencatat kunjungan tertinggi dengan ${maxMonth.kunjungan.toLocaleString("id-ID")} pengunjung. Pertimbangkan untuk meningkatkan promosi di bulan-bulan lainnya.`,
          impact: "medium",
        },
        {
          id: 2,
          type: "warning",
          title: "Penurunan Signifikan di Bulan April",
          description: `Terjadi penurunan drastis dari Maret (${maxMonth.kunjungan.toLocaleString("id-ID")}) ke April (${minMonth.kunjungan.toLocaleString("id-ID")}). Perlu investigasi penyebab penurunan ini.`,
          impact: "high",
        },
        {
          id: 3,
          type: "opportunity",
          title: "Wisata Alam Menjadi Kategori Dominan",
          description: `Wisata Alam mendominasi dengan ${dominantCategory.value}% dari total kategori. Ini menunjukkan potensi besar untuk mengembangkan lebih banyak destinasi wisata alam.`,
          impact: "high",
        },
        {
          id: 4,
          type: "recommendation",
          title: "Diversifikasi Kategori Wisata",
          description: "Kategori Kuliner, Edukasi, dan Hiburan masing-masing hanya 20%. Pertimbangkan program khusus untuk mengembangkan ketiga kategori ini agar lebih seimbang.",
          impact: "medium",
        },
        {
          id: 5,
          type: "trend",
          title: "Recovery Pasca Penurunan April",
          description: "Setelah penurunan di April, kunjungan menunjukkan tren recovery di Mei dan Juni. Momentum ini bisa dimanfaatkan untuk kampanye promosi.",
          impact: "medium",
        },
        {
          id: 6,
          type: "recommendation",
          title: "Optimasi Wisata Top Performer",
          description: `${dashboardData.topWisata[0].nama} sebagai wisata terpopuler bisa dijadikan flagship untuk package tour atau kampanye promosi utama.`,
          impact: "low",
        },
      ];
    }

    return NextResponse.json({
      insights,
      data: dashboardData,
    });
  } catch (error) {
    console.error(error);

    // Fallback insights jika API gagal
    const fallbackInsights = [
      {
        id: 1,
        type: "trend",
        title: "Kunjungan Tertinggi di Bulan Maret",
        description: "Bulan Maret mencatat kunjungan tertinggi dengan 5.200 pengunjung. Pertimbangkan untuk meningkatkan promosi di bulan-bulan lainnya.",
        impact: "medium" as const,
      },
      {
        id: 2,
        type: "warning",
        title: "Penurunan Signifikan di Bulan April",
        description: "Terjadi penurunan drastis dari Maret (5.200) ke April (2.400). Perlu investigasi penyebab penurunan ini.",
        impact: "high" as const,
      },
      {
        id: 3,
        type: "opportunity",
        title: "Wisata Alam Menjadi Kategori Dominan",
        description: "Wisata Alam mendominasi dengan 40% dari total kategori. Ini menunjukkan potensi besar untuk mengembangkan lebih banyak destinasi wisata alam.",
        impact: "high" as const,
      },
      {
        id: 4,
        type: "recommendation",
        title: "Diversifikasi Kategori Wisata",
        description: "Kategori Kuliner, Edukasi, dan Hiburan masing-masing hanya 20%. Pertimbangkan program khusus untuk mengembangkan ketiga kategori ini.",
        impact: "medium" as const,
      },
      {
        id: 5,
        type: "trend",
        title: "Recovery Pasca Penurunan April",
        description: "Setelah penurunan di April, kunjungan menunjukkan tren recovery di Mei dan Juni. Momentum ini bisa dimanfaatkan untuk kampanye promosi.",
        impact: "medium" as const,
      },
      {
        id: 6,
        type: "recommendation",
        title: "Optimasi Wisata Top Performer",
        description: "Kawah Putih sebagai wisata terpopuler bisa dijadikan flagship untuk package tour atau kampanye promosi utama.",
        impact: "low" as const,
      },
    ];

    return NextResponse.json({
      insights: fallbackInsights,
      data: dashboardData,
    });
  }
}
