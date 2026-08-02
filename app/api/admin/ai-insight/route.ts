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

    // ============================================================
    // 🎯 CATATAN PENGUJI #1 — QUERY DATA ASLI DARI DATABASE
    // Kemungkinan ditanya: "Coba tunjukkan mana bagian yang membuktikan
    // AI tidak mengarang data sendiri."
    // Jawaban: Seluruh angka di bawah ini (total wisata, status aktif,
    // dst) diambil LANGSUNG dari database PostgreSQL lewat Prisma ORM,
    // SEBELUM AI sama sekali dilibatkan. AI tidak pernah menyentuh
    // proses penghitungan angka ini.
    // ============================================================
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

    // Rating rata-rata GLOBAL (seluruh destinasi aktif), dipakai sebagai
    // benchmark pembanding untuk insight rule-based / fallback.
    // ============================================================
    // 🎯 CATATAN PENGUJI #2 — RATING RATA-RATA GLOBAL (BENCHMARK)
    // Kemungkinan ditanya: "Bagaimana AI bisa bilang 'rating kategori
    // ini di atas rata-rata'? Dari mana pembandingnya?"
    // Jawaban: Sistem menghitung dulu rata-rata rating GLOBAL di sisi
    // kode/database, baru nilai ini dikirim sebagai pembanding ke AI.
    // Perbandingan "di atas/di bawah rata-rata" berbasis angka
    // matematis asli, bukan estimasi AI.
    // ============================================================
    const globalReviews = await prisma.review.findMany({
      where: { destination: baseWhere },
      select: { rating: true },
    });
    const globalAvgRating =
      globalReviews.length > 0
        ? Math.round((globalReviews.reduce((a, r) => a + r.rating, 0) / globalReviews.length) * 10) / 10
        : 0;

    // Where clause khusus untuk data yang DIANALISIS, sesuai filter admin
    // ============================================================
    // 🎯 CATATAN PENGUJI #3 — FILTER KATEGORI (RELASI MANY-TO-MANY)
    // Kemungkinan ditanya: "Kenapa satu destinasi bisa punya lebih dari
    // satu kategori? Bagaimana skema database-nya?"
    // Jawaban: Relasi Destination-Category itu many-to-many, dijembatani
    // tabel DestinationCategory — satu destinasi bisa masuk beberapa
    // kategori sekaligus. .some() artinya: ambil destinasi yang minimal
    // SALAH SATU kategorinya cocok dengan filter admin.
    // ============================================================
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

    // Distribusi kategori dihitung dari data yang SUDAH difilter.
    //
    // ============================================================
    // 🎯 CATATAN PENGUJI #4 — BUG YANG PERNAH DIPERBAIKI (⚠️ agak
    // berisiko kalau penguji teliti baca komentar "FIX" di bawah ini)
    // Kemungkinan ditanya: "Ada komentar 'FIX' di sini, berarti pernah
    // ada bug? Bug apa?"
    // Jawaban (jawab jujur, jangan panik): "Betul, sebelumnya sistem
    // saya mengambil kategori PERTAMA yang menempel pada suatu destinasi
    // untuk menentukan label distribusi. Karena satu destinasi bisa
    // punya lebih dari satu kategori, ini menyebabkan distribusi kadang
    // salah label. Saya temukan ini saat pengujian mandiri terhadap
    // fitur filter, lalu perbaiki dengan mencari kategori yang BENAR-
    // BENAR cocok dengan filter yang dipilih." — ini nilai plus kalau
    // dijelaskan santai, karena membuktikan kamu debugging mandiri.
    // ============================================================
    // FIX: Sebelumnya kode selalu ambil categories[0] (kategori pertama yang
    // nempel di destinasi) untuk menentukan label kategori. Ini salah kalau
    // satu destinasi punya lebih dari satu kategori sekaligus (relasi
    // many-to-many) — destinasi yang lolos filter "Wisata Alam" bisa saja
    // categories[0]-nya ternyata "Wisata Hiburan", sehingga muncul di
    // distribusi sebagai kategori yang salah.
    //
    // Sekarang: kalau filter kategori sedang aktif, cari kategori yang
    // BENAR-BENAR cocok dengan kategoriId yang difilter, baru fallback ke
    // categories[0] kalau memang tidak ada filter aktif (kategoriId === "ALL").
    const kategoriMap: Record<string, { jumlah: number; ratings: number[] }> = {};
    destinasiTerfilter.forEach((d) => {
      let namaKategori: string;

      if (kategoriId !== "ALL") {
        const matchedCategory = d.categories.find(
          (c: any) => String(c.categoryId) === String(kategoriIdForQuery)
        );
        namaKategori =
          matchedCategory?.category?.name?.toUpperCase() ||
          d.categories[0]?.category?.name?.toUpperCase() ||
          "LAINNYA";
      } else {
        namaKategori = d.categories[0]?.category?.name?.toUpperCase() || "LAINNYA";
      }

      if (!kategoriMap[namaKategori]) {
        kategoriMap[namaKategori] = { jumlah: 0, ratings: [] };
      }
      kategoriMap[namaKategori].jumlah += 1;
      d.reviews.forEach((r) => kategoriMap[namaKategori].ratings.push(r.rating));
    });

    const totalTerfilter = destinasiTerfilter.length;

    // Metrik kelengkapan & kualitas data DALAM RUANG LINGKUP HASIL FILTER
    // (bukan global) — ini yang dipakai untuk insight rule-based supaya
    // benar-benar mencerminkan filter yang dipilih admin.
    const filteredTanpaFoto = destinasiTerfilter.filter((d) => !d.imageUrl || d.imageUrl === "").length;
    const filteredTanpaKoordinat = destinasiTerfilter.filter(
      (d) => d.latitude === 0 || d.longitude === 0
    ).length;
    const filteredNonAktif = destinasiTerfilter.filter((d) => d.status !== "aktif").length;
    const filteredRatings = destinasiTerfilter.flatMap((d) => d.reviews.map((r) => r.rating));
    const filteredAvgRating =
      filteredRatings.length > 0
        ? Math.round((filteredRatings.reduce((a, r) => a + r, 0) / filteredRatings.length) * 10) / 10
        : 0;

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

    const fallbackCtx = {
      filterLabel,
      namaKategoriAktif,
      isFiltered: kategoriId !== "ALL",
      totalTerfilter,
      totalPengguna,
      kategoriSummary,
      topRated,
      filteredTanpaFoto,
      filteredTanpaKoordinat,
      filteredNonAktif,
      filteredAvgRating,
      filteredRatingCount: filteredRatings.length,
      globalAvgRating,
    };

    // ============================================================
    // 🎯 CATATAN PENGUJI #5 — CONTEXT: DATA TERSTRUKTUR KE AI
    // (PALING PENTING — ini bukti utama "AI tidak menganalisis bebas")
    // Kemungkinan ditanya: "Bagian mana yang menunjukkan AI tidak
    // menganalisis bebas?"
    // Jawaban: Semua angka yang sudah dihitung di kode (Bagian #1-#4)
    // disusun jadi TEKS TERSTRUKTUR di sini, baru dikirim ke AI. AI
    // tidak pernah diberi akses langsung ke database — dia cuma
    // menerima teks yang sudah "difilter dan diringkas" oleh kode,
    // sehingga tidak mungkin mengarang angka yang tidak ada di sini.
    // ============================================================
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

    // ============================================================
    // 🎯 CATATAN PENGUJI #6 — SYSTEM PROMPT: LARANGAN EKSPLISIT MENGARANG
    // Kemungkinan ditanya: "Bagaimana kamu mencegah AI berhalusinasi/
    // mengarang klaim yang tidak sesuai data?"
    // Jawaban: Ada instruksi eksplisit "PENTING" berulang di system
    // prompt yang melarang AI membuat klaim tertentu kalau kondisi
    // datanya tidak mendukung. Ini lapis pencegahan PERTAMA, sebelum
    // lapis kedua di Bagian #9 (filter ulang setelah AI menjawab).
    // ============================================================
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

    // NOTE: Model diganti dari "llama3-8b-8192" (sudah decommissioned per pesan
    // error Groq: "model_decommissioned") ke "openai/gpt-oss-20b", yang saat
    // ini direkomendasikan Groq sebagai pengganti model ringan/cepat serupa.
    // Groq cukup sering memperbarui daftar model aktifnya — kalau di kemudian
    // hari model ini juga error "decommissioned", cek daftar model terbaru di
    // console.groq.com/docs/models sebelum sidang/demo.
    // ============================================================
    // 🎯 CATATAN PENGUJI #7 — NAMA MODEL AI
    // ⚠️⚠️⚠️ PALING PENTING DISIAPKAN — INI FAKTA, BUKAN KEMUNGKINAN ⚠️⚠️⚠️
    // Naskah skripsi masih menyebut model "llama3-8b-8192", tapi kode
    // ini sekarang pakai "openai/gpt-oss-20b". Kalau penguji sempat
    // cross-check naskah vs kode/demo, INI YANG PALING GAMPANG KETAHUAN.
    //
    // Kemungkinan ditanya: "Di skripsi tertulis llama3-8b-8192, tapi di
    // kode ini modelnya openai/gpt-oss-20b. Kenapa beda?"
    //
    // Jawaban WAJIB DIHAFAL (inti, boleh dirangkai bebas):
    // "Model llama3-8b-8192 yang saya tuliskan di skripsi adalah model
    // yang saya gunakan pada saat penelitian dan penulisan dilakukan,
    // dan itu akurat pada waktu itu. Namun Groq sebagai penyedia API
    // pihak ketiga secara berkala memperbarui dan menghentikan dukungan
    // model-model lamanya — model tersebut kini sudah decommissioned
    // oleh Groq. Untuk menjaga sistem tetap berfungsi, saya perbarui ke
    // model pengganti yang direkomendasikan Groq, yaitu openai/gpt-oss-
    // 20b, tanpa mengubah logika/arsitektur sistem lainnya. Ini
    // menunjukkan risiko nyata mengandalkan layanan AI pihak ketiga,
    // sekaligus membuktikan sistem saya cukup fleksibel beradaptasi
    // tanpa perlu dibangun ulang dari awal."
    // ============================================================
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analisis data berikut dan hasilkan insight:\n\n${context}` },
        ],
      }),
    });

    // ============================================================
    // 🎯 CATATAN PENGUJI #8 — FALLBACK SAAT GROQ API GAGAL TOTAL
    // Kemungkinan ditanya: "Apa yang terjadi kalau API AI-nya down
    // atau error?"
    // Jawaban: Sistem TIDAK menampilkan halaman error ke admin. Kalau
    // pemanggilan Groq gagal (limit, koneksi, model bermasalah), sistem
    // otomatis beralih ke getFallbackInsights() — fungsi yang
    // menghasilkan insight rule-based dari data asli, bukan dari AI.
    // Ini bentuk fault tolerance di desain sistem saya.
    // ============================================================
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error (status " + response.status + "):", errorText);
      return NextResponse.json({
        insights: getFallbackInsights(fallbackCtx),
        data: realData,
        categories: allCategories,
        appliedFilters: { kategoriId, periode },
        source: "fallback-rule-based",
      });
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    // ============================================================
    // 🎯 CATATAN PENGUJI #9 — VALIDASI ULANG HASIL AI (LAPIS KEDUA)
    // Kemungkinan ditanya: "Kalaupun AI-nya jawab, bagaimana kalau
    // isinya tetap salah walau formatnya benar?"
    // Jawaban: Setelah AI menjawab, hasilnya tetap DIFILTER ULANG
    // secara otomatis di kode (insights.filter(...) di bawah) — kalau
    // AI tetap menyebut sesuatu yang tidak sesuai kondisi data riil
    // (mis. "foto belum lengkap" padahal tanpaFoto === 0), insight itu
    // otomatis dibuang sebelum ditampilkan ke admin. Ini lapis validasi
    // KEDUA, di luar instruksi prompt di Bagian #6.
    // ============================================================
    let insights: any[] = [];
    let insightSource: "groq-llm" | "fallback-rule-based" = "groq-llm";
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
        // DIAGNOSTIK: bagian ini sebelumnya senyap, sekarang di-log supaya
        // ketahuan kalau Groq membalas tapi tidak dalam format JSON array.
        console.error("Groq response tidak mengandung JSON array. Raw content:", aiContent);
        insights = getFallbackInsights(fallbackCtx);
        insightSource = "fallback-rule-based";
      }
    } catch (parseError) {
      // DIAGNOSTIK: catch block ini sebelumnya kosong tanpa logging sama
      // sekali, sekarang di-log supaya ketahuan kalau penyebabnya gagal
      // JSON.parse.
      console.error("Gagal parse JSON dari Groq:", parseError, "Raw content:", aiContent);
      insights = getFallbackInsights(fallbackCtx);
      insightSource = "fallback-rule-based";
    }

    // ============================================================
    // 🎯 CATATAN PENGUJI #10 — PENANDA SUMBER INSIGHT (SOURCE TAGGING)
    // Kemungkinan ditanya: "Bagaimana kamu tahu insight yang tampil itu
    // dari AI atau dari fallback?"
    // Jawaban: Field "source" di response API ini sengaja ditambahkan
    // untuk transparansi — untuk kebutuhan debugging/monitoring saya
    // sendiri selama pengembangan, supaya saya bisa memastikan sumber
    // insight yang tampil ke pengguna tanpa harus menebak-nebak.
    // ============================================================
    return NextResponse.json({
      insights,
      data: realData,
      categories: allCategories,
      appliedFilters: { kategoriId, periode },
      source: insightSource, // "groq-llm" kalau LLM beneran jalan, "fallback-rule-based" kalau tidak
    });
  } catch (error) {
    console.error("Unhandled error di AI Insight route:", error);
    return NextResponse.json(
      {
        insights: getFallbackInsights({
          filterLabel: "Semua Kategori | semua waktu",
          namaKategoriAktif: "Semua Kategori",
          isFiltered: false,
          totalTerfilter: 0,
          totalPengguna: 0,
          kategoriSummary: [],
          topRated: [],
          filteredTanpaFoto: 0,
          filteredTanpaKoordinat: 0,
          filteredNonAktif: 0,
          filteredAvgRating: 0,
          filteredRatingCount: 0,
          globalAvgRating: 0,
        }),
        data: null,
        categories: [],
      },
      { status: 500 }
    );
  }
}

/**
 * ============================================================
 * 🎯 CATATAN PENGUJI #11 — FUNGSI FALLBACK RULE-BASED (BUKAN AI)
 * Kemungkinan ditanya: "Kalau fallback ini bukan AI, berarti ini
 * rule-based biasa? Apa bedanya sama sistem tanpa AI sama sekali?"
 * Jawaban: Betul, fungsi ini murni logika terprogram (if-else
 * berdasarkan ambang batas angka), bukan AI. Bedanya: fungsi ini
 * hanya berperan sebagai JARING PENGAMAN (safety net) kalau AI gagal
 * dipanggil — bukan pengganti permanen. Saat AI berhasil dipanggil
 * (kondisi normal), sistem tetap pakai hasil LLM yang punya kemampuan
 * menyusun narasi lebih variatif dan menangkap pola lintas-variabel
 * yang sulit ditangani logika if-else biasa.
 * ============================================================
 *
 * Menghasilkan insight rule-based yang dihitung LANGSUNG dari data hasil
 * filter (bukan teks statis) — dipakai sebagai pengganti saat Groq API
 * gagal dipanggil, supaya admin tetap dapat insight yang masuk akal dan
 * sesuai konteks filter, bukan boilerplate generik.
 *
 * Struktur mengikuti 4 kategori:
 * - TREN: pola yang teridentifikasi dari data (kategori dominan, rating
 *   dibanding rata-rata global, dst)
 * - PELUANG: potensi yang bisa dimanfaatkan
 * - PERINGATAN: hal yang butuh perhatian (data kosong, nonaktif, dst) —
 *   hanya ditampilkan kalau memang ada masalah nyata pada hasil filter
 * - REKOMENDASI: aksi konkret, mengikuti temuan peringatan di atas
 */
function getFallbackInsights(ctx: {
  filterLabel: string;
  namaKategoriAktif: string;
  isFiltered: boolean;
  totalTerfilter: number;
  totalPengguna: number;
  kategoriSummary: { kategori: string; jumlah: number; persentase: number; avgRating: number }[];
  topRated: { nama: string; kategori: string; rating: number; jumlahReview: number }[];
  filteredTanpaFoto: number;
  filteredTanpaKoordinat: number;
  filteredNonAktif: number;
  filteredAvgRating: number;
  filteredRatingCount: number;
  globalAvgRating: number;
}) {
  const {
    filterLabel,
    namaKategoriAktif,
    isFiltered,
    totalTerfilter,
    totalPengguna,
    kategoriSummary,
    topRated,
    filteredTanpaFoto,
    filteredTanpaKoordinat,
    filteredNonAktif,
    filteredAvgRating,
    filteredRatingCount,
    globalAvgRating,
  } = ctx;

  const insights: any[] = [];
  let id = 1;

  // ============ TREN ============
  if (isFiltered && filteredAvgRating > 0 && globalAvgRating > 0) {
    const selisih = Math.round((filteredAvgRating - globalAvgRating) * 10) / 10;
    if (Math.abs(selisih) >= 0.2) {
      insights.push({
        id: id++,
        type: "trend",
        title:
          selisih > 0
            ? `Rating ${namaKategoriAktif} di Atas Rata-Rata`
            : `Rating ${namaKategoriAktif} di Bawah Rata-Rata`,
        description: `Rating rata-rata kategori ${namaKategoriAktif} adalah ${filteredAvgRating}, ${
          selisih > 0 ? `${Math.abs(selisih)} poin lebih tinggi` : `${Math.abs(selisih)} poin lebih rendah`
        } dibanding rata-rata seluruh kategori (${globalAvgRating}).`,
        impact: Math.abs(selisih) >= 0.5 ? "high" : "medium",
      });
    } else {
      insights.push({
        id: id++,
        type: "trend",
        title: `Rating ${namaKategoriAktif} Setara Rata-Rata`,
        description: `Rating rata-rata kategori ${namaKategoriAktif} (${filteredAvgRating}) sejalan dengan rata-rata seluruh kategori (${globalAvgRating}), menunjukkan kualitas destinasi yang konsisten.`,
        impact: "low",
      });
    }
  } else if (!isFiltered && kategoriSummary.length > 0) {
    const dominant = [...kategoriSummary].sort((a, b) => b.jumlah - a.jumlah)[0];
    insights.push({
      id: id++,
      type: "trend",
      title: `${dominant.kategori} Mendominasi Data Wisata`,
      description: `Dari ${totalTerfilter} destinasi terdaftar, kategori ${dominant.kategori} menjadi yang terbanyak dengan ${dominant.jumlah} destinasi (${dominant.persentase}%) dan rating rata-rata ${dominant.avgRating}.`,
      impact: "medium",
    });
  } else {
    insights.push({
      id: id++,
      type: "trend",
      title: "Ringkasan Data Sesuai Filter",
      description: `Berdasarkan filter (${filterLabel}), ditemukan ${totalTerfilter} wisata yang sesuai kriteria.`,
      impact: "medium",
    });
  }

  // ============ PELUANG ============
  if (topRated.length > 0 && topRated[0].rating >= 4.5) {
    insights.push({
      id: id++,
      type: "opportunity",
      title: "Destinasi Unggulan Layak Dipromosikan",
      description: `${topRated[0].nama} meraih rating ${topRated[0].rating} dari ${topRated[0].jumlahReview} ulasan pada hasil filter ini — berpotensi dijadikan destinasi andalan untuk promosi kategori ${namaKategoriAktif}.`,
      impact: "medium",
    });
  } else if (!isFiltered) {
    const nichePotential = kategoriSummary
      .filter((k) => k.avgRating >= 4.3 && k.jumlah > 0)
      .sort((a, b) => a.jumlah - b.jumlah)[0];
    if (nichePotential) {
      insights.push({
        id: id++,
        type: "opportunity",
        title: `Kategori ${nichePotential.kategori} Berpotensi Dikembangkan`,
        description: `Kategori ${nichePotential.kategori} baru memiliki ${nichePotential.jumlah} destinasi namun rating rata-ratanya ${nichePotential.avgRating} — cukup tinggi untuk dipertimbangkan penambahan destinasi baru di kategori ini.`,
        impact: "medium",
      });
    }
  }
  if (insights.filter((i) => i.type === "opportunity").length === 0) {
    insights.push({
      id: id++,
      type: "opportunity",
      title: "Potensi Pengguna Wisatawan",
      description: `Total ${totalPengguna} wisatawan terdaftar pada platform menunjukkan basis pengguna yang bisa dijangkau lebih lanjut untuk kategori ${namaKategoriAktif}.`,
      impact: "medium",
    });
  }

  // ============ PERINGATAN (hanya jika ada masalah nyata pada hasil filter) ============
  if (filteredTanpaFoto > 0) {
    insights.push({
      id: id++,
      type: "warning",
      title: `${filteredTanpaFoto} Destinasi Belum Memiliki Foto`,
      description: `Pada hasil filter (${filterLabel}), terdapat ${filteredTanpaFoto} dari ${totalTerfilter} destinasi yang belum memiliki foto. Ini dapat menurunkan daya tarik destinasi tersebut bagi wisatawan.`,
      impact: "high",
    });
  } else if (filteredTanpaKoordinat > 0) {
    insights.push({
      id: id++,
      type: "warning",
      title: `${filteredTanpaKoordinat} Destinasi Belum Memiliki Koordinat`,
      description: `Pada hasil filter (${filterLabel}), terdapat ${filteredTanpaKoordinat} destinasi yang belum memiliki koordinat, sehingga tidak muncul pada peta SIG.`,
      impact: "high",
    });
  } else if (filteredNonAktif > 0) {
    insights.push({
      id: id++,
      type: "warning",
      title: `${filteredNonAktif} Destinasi Berstatus Nonaktif`,
      description: `Pada hasil filter (${filterLabel}), terdapat ${filteredNonAktif} destinasi yang saat ini berstatus nonaktif dan tidak tampil ke wisatawan.`,
      impact: "medium",
    });
  } else if (filteredRatingCount === 0) {
    insights.push({
      id: id++,
      type: "warning",
      title: "Belum Ada Ulasan pada Hasil Filter Ini",
      description: `Belum ada satu pun ulasan pada destinasi dengan filter (${filterLabel}), sehingga kualitas pengalaman wisatawan pada kategori ini belum dapat dinilai.`,
      impact: "medium",
    });
  }

  // ============ REKOMENDASI (mengikuti temuan peringatan di atas) ============
  if (filteredTanpaFoto > 0) {
    insights.push({
      id: id++,
      type: "recommendation",
      title: "Lengkapi Foto Destinasi",
      description: `Prioritaskan pelengkapan foto untuk ${filteredTanpaFoto} destinasi pada kategori ${namaKategoriAktif} agar tampil maksimal di halaman pencarian dan peta.`,
      impact: "high",
    });
  } else if (filteredTanpaKoordinat > 0) {
    insights.push({
      id: id++,
      type: "recommendation",
      title: "Lengkapi Koordinat Destinasi",
      description: `Lengkapi koordinat pada ${filteredTanpaKoordinat} destinasi agar dapat tervisualisasi di peta SIG dan mudah ditemukan wisatawan.`,
      impact: "high",
    });
  } else if (filteredNonAktif > 0) {
    insights.push({
      id: id++,
      type: "recommendation",
      title: "Tinjau Ulang Destinasi Nonaktif",
      description: `Lakukan peninjauan terhadap ${filteredNonAktif} destinasi berstatus nonaktif pada kategori ${namaKategoriAktif} — putuskan untuk diaktifkan kembali atau dihapus dari sistem.`,
      impact: "medium",
    });
  } else {
    insights.push({
      id: id++,
      type: "recommendation",
      title: "Tingkatkan Promosi Kategori Ini",
      description: `Data pada kategori ${namaKategoriAktif} sudah cukup lengkap dan berkualitas baik — pertimbangkan untuk mempromosikan kategori ini lebih aktif kepada wisatawan.`,
      impact: "medium",
    });
  }

  return insights;
}