// ============================================================
// lib/data-destinasi.ts
//
// SAAT INI : data dummy (hardcoded)
// NANTI    : ganti fungsi getDestinasiById() dengan query Prisma
//            contohnya ada di komentar bawah
// ============================================================

export interface JamBuka {
  hari: string;
  buka: string;
  tutup: string;
  highlight?: boolean; // true = teks oranye (weekend)
}

export interface InfoTiket {
  label: string;
  harga: string;
}

export interface Destinasi {
  id: string;
  nama: string;
  slug: string;
  kategori: string;          // "Budaya" | "Alam" | "Kuliner" | "Fashion" | "Hotel"
  kategoriSlug: string;
  subJudul: string;          // "Wisata Budaya & Sejarah"
  deskripsiKategori: string; // teks di bawah subjudul
  badge: string;             // "Destinasi Terpopuler"
  rating: number;
  jumlahUlasan: number;
  lokasi: string;
  alamatLengkap: string;
  hargaMulai: string;
  kontak: string;
  website?: string;
  gambarHero: string;
  gambarPeta?: string;
  tentang: string;
  statusBuka: boolean;
  cuacaSuhu: string;
  cuacaKondisi: string;
  cuacaUpdate: string;
  ringkasanAI: string;
  tagSentimen: string[];
  infoTiket: InfoTiket[];
  jamBuka: JamBuka[];
  waktuTerbaik: string;
  lat: number;
  lng: number;
}

// ── DATA DUMMY ────────────────────────────────────────────────────────────────
// Ganti array ini dengan query Prisma saat database pengelola sudah siap
const DUMMY_DESTINASI: Destinasi[] = [
  {
    id: "1",
    nama: "Orchid Forest Cikole",
    slug: "orchid-forest-cikole",
    kategori: "Alam",
    kategoriSlug: "alam",
    subJudul: "Wisata Alam & Edukasi",
    deskripsiKategori:
      "Jelajahi keindahan alam hutan pinus dengan koleksi anggrek terbesar di Indonesia.",
    badge: "Destinasi Terpopuler",
    rating: 4.8,
    jumlahUlasan: 12403,
    lokasi: "Lembang, Bandung Barat",
    alamatLengkap:
      "Genting, Cikole, Lembang, Kabupaten Bandung Barat, Jawa Barat 40391",
    hargaMulai: "Mulai Rp 40.000",
    kontak: "+62 812-3456-7890",
    website: "https://orchidforestcikole.com",
    gambarHero:
      "https://images.unsplash.com/photo-1610552050890-fe99536c2615?w=1400&h=716&fit=crop",
    tentang:
      "Orchid Forest Cikole merupakan kawasan ekowisata anggrek terbesar di Indonesia yang terletak di tengah hutan pinus yang asri. Dengan koleksi lebih dari 157 jenis anggrek dari seluruh dunia, tempat ini menawarkan perpaduan sempurna antara keindahan alam dan fasilitas modern seperti Wood Bridge (jembatan gantung) yang ikonik, area camping, dan cafe bernuansa hutan.",
    statusBuka: true,
    cuacaSuhu: "18°C",
    cuacaKondisi: "Berawan",
    cuacaUpdate: "Update 2m lalu",
    ringkasanAI:
      '"Mayoritas pengunjung sangat terkesan dengan suasana sejuk dan instalasi lampu malam (Wood Bridge). Area ini sangat ramah keluarga, namun disarankan datang lebih awal untuk menghindari keramaian di akhir pekan. Beberapa ulasan menyebutkan akses jalan yang menantang namun terbayar oleh pemandangan hutan pinus."',
    tagSentimen: ["#Fotogenik", "#UdaraSegar", "#WoodBridge"],
    infoTiket: [
      { label: "Wisatawan Domestik",      harga: "Rp 40.000" },
      { label: "Wisatawan Mancanegara",   harga: "Rp 100.000" },
      { label: "Lembang Card",            harga: "Rp 10.000" },
    ],
    jamBuka: [
      { hari: "Senin - Jumat",  buka: "09:00", tutup: "18:00" },
      { hari: "Sabtu - Minggu", buka: "08:00", tutup: "19:00", highlight: true },
    ],
    waktuTerbaik: "16:00 WIB",
    lat: -6.817,
    lng: 107.607,
  },
  {
    id: "2",
    nama: "Kawah Putih Ciwidey",
    slug: "kawah-putih-ciwidey",
    kategori: "Alam",
    kategoriSlug: "alam",
    subJudul: "Wisata Alam & Geologi",
    deskripsiKategori:
      "Danau kawah vulkanik berwarna putih kehijauan yang menakjubkan di ketinggian 2.194 mdpl.",
    badge: "Destinasi Populer",
    rating: 4.8,
    jumlahUlasan: 9870,
    lokasi: "Ciwidey, Bandung Selatan",
    alamatLengkap: "Jl. Raya Ciwidey, Bandung Selatan, Jawa Barat",
    hargaMulai: "Mulai Rp 25.000",
    kontak: "+62 22-5921032",
    gambarHero:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1400&h=716&fit=crop",
    tentang:
      "Kawah Putih adalah danau kawah vulkanik yang terletak di Gunung Patuha. Warna air danau berubah-ubah antara putih, hijau, dan biru tergantung kandungan belerang dan suhu udara.",
    statusBuka: true,
    cuacaSuhu: "16°C",
    cuacaKondisi: "Berkabut",
    cuacaUpdate: "Update 5m lalu",
    ringkasanAI:
      '"Pengunjung terpesona dengan warna air kawah yang unik dan suasana berkabut yang mistis. Cocok untuk fotografi dan menikmati alam. Disarankan datang pagi hari sebelum kabut tebal."',
    tagSentimen: ["#Fotogenik", "#MisteriusABIS", "#KabrutAlami"],
    infoTiket: [
      { label: "Wisatawan Domestik",    harga: "Rp 25.000" },
      { label: "Wisatawan Mancanegara", harga: "Rp 75.000" },
    ],
    jamBuka: [
      { hari: "Senin - Jumat",  buka: "07:00", tutup: "17:00" },
      { hari: "Sabtu - Minggu", buka: "07:00", tutup: "17:30", highlight: true },
    ],
    waktuTerbaik: "08:00 WIB",
    lat: -7.166,
    lng: 107.401,
  },
  {
    id: "3",
    nama: "Gedung Sate",
    slug: "gedung-sate",
    kategori: "Budaya",
    kategoriSlug: "budaya",
    subJudul: "Wisata Budaya & Sejarah",
    deskripsiKategori:
      "Jelajahi warisan arsitektur kolonial, museum seni, dan situs bersejarah yang membentuk identitas kota Bandung.",
    badge: "Ikon Kota",
    rating: 4.7,
    jumlahUlasan: 8521,
    lokasi: "Pusat Kota Bandung",
    alamatLengkap: "Jl. Diponegoro No.22, Citarum, Bandung, Jawa Barat 40115",
    hargaMulai: "Mulai Rp 15.000",
    kontak: "+62 22-4233348",
    gambarHero:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1400&h=716&fit=crop",
    tentang:
      "Gedung Sate adalah kantor Gubernur Jawa Barat yang terkenal dengan ornamen tusuk sate pada menara utamanya. Dibangun tahun 1920, gedung ini merupakan salah satu ikon arsitektur kolonial Belanda di Bandung.",
    statusBuka: true,
    cuacaSuhu: "24°C",
    cuacaKondisi: "Cerah",
    cuacaUpdate: "Update 3m lalu",
    ringkasanAI:
      '"Gedung Sate menjadi destinasi wajib di Bandung. Arsitektur kolonial yang megah dan taman yang rapi menjadi daya tarik utama. Museum di dalamnya memberikan informasi sejarah yang menarik."',
    tagSentimen: ["#ArsitekturKolonial", "#Bersejarah", "#IkonBandung"],
    infoTiket: [
      { label: "Tiket Masuk Museum", harga: "Rp 15.000" },
      { label: "Tur Berpemandu",     harga: "Rp 50.000" },
    ],
    jamBuka: [
      { hari: "Selasa - Jumat", buka: "09:00", tutup: "16:00" },
      { hari: "Sabtu - Minggu", buka: "09:00", tutup: "15:00", highlight: true },
    ],
    waktuTerbaik: "10:00 WIB",
    lat: -6.902,
    lng: 107.618,
  },
];

// ── FUNGSI GET DATA ───────────────────────────────────────────────────────────

/**
 * Ambil destinasi berdasarkan ID.
 *
 * SEKARANG  : pakai data dummy di atas
 * NANTI     : uncomment kode Prisma di bawah dan hapus baris dummy
 */
export async function getDestinasiById(id: string): Promise<Destinasi | null> {
  // ── DUMMY (aktif sekarang) ─────────────────────────────────────────
  const found = DUMMY_DESTINASI.find((d) => d.id === id);
  return found ?? null;

  // ── PRISMA (aktifkan saat database sudah siap) ─────────────────────
  // import { prisma } from "@/lib/prisma";
  //
  // const raw = await prisma.destinasi.findUnique({
  //   where: { id: Number(id) },
  //   include: {
  //     kategori: true,
  //     infoTiket: true,
  //     jamBuka: true,
  //     tagSentimen: true,
  //   },
  // });
  // if (!raw) return null;
  //
  // return {
  //   id:              String(raw.id),
  //   nama:            raw.nama,
  //   slug:            raw.slug,
  //   kategori:        raw.kategori.nama,
  //   kategoriSlug:    raw.kategori.slug,
  //   subJudul:        raw.kategori.subJudul,
  //   deskripsiKategori: raw.kategori.deskripsi,
  //   badge:           raw.badge ?? "Destinasi Populer",
  //   rating:          raw.rating,
  //   jumlahUlasan:    raw.jumlahUlasan,
  //   lokasi:          raw.lokasi,
  //   alamatLengkap:   raw.alamatLengkap,
  //   hargaMulai:      `Mulai Rp ${raw.hargaMin.toLocaleString("id-ID")}`,
  //   kontak:          raw.kontak ?? "",
  //   website:         raw.website ?? undefined,
  //   gambarHero:      raw.gambarHero,
  //   tentang:         raw.tentang,
  //   statusBuka:      raw.statusBuka,
  //   cuacaSuhu:       raw.cuacaSuhu ?? "–",
  //   cuacaKondisi:    raw.cuacaKondisi ?? "–",
  //   cuacaUpdate:     raw.cuacaUpdate ?? "",
  //   ringkasanAI:     raw.ringkasanAI ?? "",
  //   tagSentimen:     raw.tagSentimen.map((t) => t.label),
  //   infoTiket:       raw.infoTiket.map((t) => ({ label: t.label, harga: t.harga })),
  //   jamBuka:         raw.jamBuka.map((j) => ({ hari: j.hari, buka: j.buka, tutup: j.tutup, highlight: j.highlight })),
  //   waktuTerbaik:    raw.waktuTerbaik ?? "",
  //   lat:             raw.lat,
  //   lng:             raw.lng,
  // };
}

/**
 * Ambil semua destinasi (untuk halaman kategori / listing).
 * Pola sama: dummy sekarang, Prisma nanti.
 */
export async function getAllDestinasi(): Promise<Destinasi[]> {
  return DUMMY_DESTINASI;

  // PRISMA:
  // return prisma.destinasi.findMany({ include: { kategori: true } });
}

export { DUMMY_DESTINASI };
