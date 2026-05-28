// prisma/seed.ts
// Data dummy untuk development. Hapus/ganti dengan data asli dari pengelola.
// Jalankan dengan: npx prisma db seed
import "dotenv/config";

import { PrismaClient, DestinationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── CATEGORIES ──────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Alam" }, update: {}, create: { name: "Alam" } }),
    prisma.category.upsert({ where: { name: "Budaya" }, update: {}, create: { name: "Budaya" } }),
    prisma.category.upsert({ where: { name: "Kuliner" }, update: {}, create: { name: "Kuliner" } }),
    prisma.category.upsert({ where: { name: "Fashion" }, update: {}, create: { name: "Fashion" } }),
    prisma.category.upsert({ where: { name: "Hotel" }, update: {}, create: { name: "Hotel" } }),
  ]);

  const [alam, budaya, kuliner, fashion, hotel] = categories;
  console.log("✅ Categories created");

  // ── DESTINATIONS (DATA DUMMY – GANTI DENGAN DATA ASLI DARI PENGELOLA) ──
  // TODO: Data ini akan otomatis tergantikan ketika pengelola memasukkan data via modul mereka.
  // Tabel yang digunakan: Destination + DestinationCategory
  const destinationsData = [
    // ALAM
    {
      name: "Kawah Putih",
      description: "Danau kawah vulkanik berwarna putih kehijauan yang menakjubkan di ketinggian 2.430 mdpl. Menjadi salah satu ikon wisata alam Bandung Selatan.",
      address: "Ciwidey, Kab. Bandung",
      contact: "+62 22 5921387",
      latitude: -7.1665,
      longitude: 107.4021,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kawah_Putih.jpg/1280px-Kawah_Putih.jpg",
      openTime: "07:00",
      closeTime: "17:00",
      ticketPrice: 25000,
      maxPrice: 25000,
      visitCount: 1520,
      status: DestinationStatus.aktif,
      categoryId: alam.id,
    },
    {
      name: "Tangkuban Perahu",
      description: "Gunung berapi aktif berbentuk perahu terbalik dengan kawah-kawah yang masih aktif mengeluarkan uap belerang.",
      address: "Lembang, Kab. Bandung Barat",
      contact: "+62 22 2787000",
      latitude: -6.7598,
      longitude: 107.6098,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tangkuban_Parahu.jpg/1280px-Tangkuban_Parahu.jpg",
      openTime: "07:00",
      closeTime: "17:00",
      ticketPrice: 30000,
      maxPrice: 30000,
      visitCount: 1890,
      status: DestinationStatus.aktif,
      categoryId: alam.id,
    },
    {
      name: "Orchid Forest Cikole",
      description: "Kawasan ekowisata anggrek terbesar di Indonesia di tengah hutan pinus Lembang. Tersedia Wood Bridge yang ikonik.",
      address: "Cikole, Lembang, Kab. Bandung Barat",
      contact: "+62 812-3456-7890",
      latitude: -6.7891,
      longitude: 107.6234,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c5/54/8e/orchid-forest-cikole.jpg?w=1200&h=-1&s=1",
      openTime: "09:00",
      closeTime: "18:00",
      ticketPrice: 40000,
      maxPrice: 40000,
      visitCount: 1340,
      status: DestinationStatus.aktif,
      categoryId: alam.id,
    },
    {
      name: "Situ Patenggang",
      description: "Danau alami di tengah perkebunan teh Ciwidey. Tersedia perahu untuk mengelilingi danau dan Pulau Asmara.",
      address: "Ciwidey, Kab. Bandung",
      contact: "+62 22 5921388",
      latitude: -7.1895,
      longitude: 107.4234,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Situ_Patenggang.jpg",
      openTime: "07:00",
      closeTime: "17:00",
      ticketPrice: 15000,
      maxPrice: 50000,
      visitCount: 980,
      status: DestinationStatus.aktif,
      categoryId: alam.id,
    },
    {
      name: "Kebun Teh Sukawana",
      description: "Hamparan kebun teh hijau yang indah dengan pemandangan pegunungan dan udara segar khas dataran tinggi Bandung.",
      address: "Sukawana, Kab. Bandung Barat",
      contact: null,
      latitude: -6.8123,
      longitude: 107.5678,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/32/a1/8e/kebun-teh.jpg?w=1200",
      openTime: "06:00",
      closeTime: "17:00",
      ticketPrice: 10000,
      maxPrice: 10000,
      visitCount: 756,
      status: DestinationStatus.aktif,
      categoryId: alam.id,
    },
    // BUDAYA
    {
      name: "Gedung Sate",
      description: "Ikon Kota Bandung, gedung bersejarah bergaya neo-klasik yang menjadi kantor Gubernur Jawa Barat. Tersedia museum di dalamnya.",
      address: "Jl. Diponegoro No.22, Kota Bandung",
      contact: "+62 22 4230963",
      latitude: -6.9025,
      longitude: 107.6189,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Gedung_Sate.jpg/1280px-Gedung_Sate.jpg",
      openTime: "09:00",
      closeTime: "16:00",
      ticketPrice: 5000,
      maxPrice: 5000,
      visitCount: 2100,
      status: DestinationStatus.aktif,
      categoryId: budaya.id,
    },
    {
      name: "Museum KAA",
      description: "Gedung tempat berlangsungnya Konferensi Asia-Afrika 1955 yang bersejarah. Menyimpan koleksi sejarah diplomasi Indonesia.",
      address: "Jl. Asia Afrika No.65, Kota Bandung",
      contact: "+62 22 4234596",
      latitude: -6.9215,
      longitude: 107.6072,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Gedung_Merdeka_Bandung.jpg",
      openTime: "08:00",
      closeTime: "16:00",
      ticketPrice: 0,
      maxPrice: 0,
      visitCount: 1230,
      status: DestinationStatus.aktif,
      categoryId: budaya.id,
    },
    {
      name: "Saung Angklung Udjo",
      description: "Pusat kebudayaan dan pertunjukan seni angklung tradisional Sunda. Wisatawan dapat belajar memainkan angklung langsung.",
      address: "Jl. Padasuka No.118, Kota Bandung",
      contact: "+62 22 7271714",
      latitude: -6.8987,
      longitude: 107.6601,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/4e/74/8e/saung-angklung-udjo.jpg?w=1200",
      openTime: "08:30",
      closeTime: "22:00",
      ticketPrice: 60000,
      maxPrice: 100000,
      visitCount: 1567,
      status: DestinationStatus.aktif,
      categoryId: budaya.id,
    },
    {
      name: "Jalan Braga",
      description: "Kawasan heritage bersejarah dengan bangunan kolonial Belanda abad ke-19. Menjadi pusat seni, galeri, dan café di Bandung.",
      address: "Jl. Braga, Kota Bandung",
      contact: null,
      latitude: -6.9188,
      longitude: 107.6098,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Braga_Street_Bandung.jpg",
      openTime: "00:00",
      closeTime: "23:59",
      ticketPrice: 0,
      maxPrice: 0,
      visitCount: 1890,
      status: DestinationStatus.aktif,
      categoryId: budaya.id,
    },
    // KULINER
    {
      name: "Sate Kardjan",
      description: "Sate ayam dan kambing legendaris Bandung sejak 1925. Bumbu kacang khas dengan aroma bakaran yang menggugah selera.",
      address: "Jl. Otto Iskandar Dinata, Kota Bandung",
      contact: "+62 22 4235678",
      latitude: -6.9198,
      longitude: 107.6134,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d6/70/8e/sate-kardjan.jpg?w=1200",
      openTime: "10:00",
      closeTime: "21:00",
      ticketPrice: 30000,
      maxPrice: 100000,
      visitCount: 1456,
      status: DestinationStatus.aktif,
      categoryId: kuliner.id,
    },
    {
      name: "Batagor Kingsley",
      description: "Batagor (bakso tahu goreng) legendaris khas Bandung yang sudah ada sejak puluhan tahun. Wajib coba saat di Bandung!",
      address: "Jl. Sumur Bandung, Kota Bandung",
      contact: "+62 22 4201234",
      latitude: -6.9145,
      longitude: 107.6045,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/4b/92/8e/batagor.jpg?w=1200",
      openTime: "08:00",
      closeTime: "17:00",
      ticketPrice: 15000,
      maxPrice: 50000,
      visitCount: 1123,
      status: DestinationStatus.aktif,
      categoryId: kuliner.id,
    },
    {
      name: "Warung Nasi Ampera",
      description: "Restoran masakan Sunda otentik dengan pilihan lauk pauk lengkap. Nasi liwet dan lalapan segar menjadi andalan.",
      address: "Jl. Riau No.34, Kota Bandung",
      contact: "+62 22 7234567",
      latitude: -6.9089,
      longitude: 107.6234,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/7e/54/8e/warung-ampera.jpg?w=1200",
      openTime: "07:00",
      closeTime: "22:00",
      ticketPrice: 20000,
      maxPrice: 80000,
      visitCount: 987,
      status: DestinationStatus.aktif,
      categoryId: kuliner.id,
    },
    // FASHION
    {
      name: "Paris Van Java Mall",
      description: "Pusat perbelanjaan semi-outdoor bergaya arsitektur Eropa. Tersedia berbagai brand lokal dan internasional serta kuliner.",
      address: "Jl. Sukajadi No.137, Kota Bandung",
      contact: "+62 22 2001234",
      latitude: -6.8889,
      longitude: 107.5978,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/7a/54/8e/paris-van-java.jpg?w=1200",
      openTime: "10:00",
      closeTime: "22:00",
      ticketPrice: 0,
      maxPrice: 0,
      visitCount: 2345,
      status: DestinationStatus.aktif,
      categoryId: fashion.id,
    },
    {
      name: "Cihampelas Walk (Ciwalk)",
      description: "Pusat factory outlet dan fashion Bandung yang ikonik. Tempat berburu pakaian berkualitas dengan harga terjangkau.",
      address: "Jl. Cihampelas No.160, Kota Bandung",
      contact: "+62 22 2061234",
      latitude: -6.8934,
      longitude: 107.6012,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/3a/54/8e/cihampelas.jpg?w=1200",
      openTime: "10:00",
      closeTime: "22:00",
      ticketPrice: 0,
      maxPrice: 0,
      visitCount: 1789,
      status: DestinationStatus.aktif,
      categoryId: fashion.id,
    },
    {
      name: "Pasar Baru Trade Center",
      description: "Pusat grosir dan eceran tekstil terbesar di Bandung. Tersedia ribuan pilihan kain, pakaian, dan aksesori fashion.",
      address: "Jl. Otto Iskandar Dinata, Kota Bandung",
      contact: "+62 22 4234567",
      latitude: -6.9212,
      longitude: 107.6087,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/56/54/8e/pasar-baru.jpg?w=1200",
      openTime: "09:00",
      closeTime: "21:00",
      ticketPrice: 0,
      maxPrice: 0,
      visitCount: 1234,
      status: DestinationStatus.aktif,
      categoryId: fashion.id,
    },
    // HOTEL
    {
      name: "The Trans Luxury Hotel",
      description: "Hotel bintang 5 mewah di Bandung dengan fasilitas kolam renang infinity, spa, dan view kota yang spektakuler.",
      address: "Jl. Gatot Subroto No.289, Kota Bandung",
      contact: "+62 22 8700000",
      latitude: -6.9156,
      longitude: 107.6312,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/54/8e/trans-luxury.jpg?w=1200",
      openTime: "00:00",
      closeTime: "23:59",
      ticketPrice: 1500000,
      maxPrice: 5000000,
      visitCount: 890,
      status: DestinationStatus.aktif,
      categoryId: hotel.id,
    },
    {
      name: "Padma Hotel Bandung",
      description: "Resort hotel di lereng bukit Dago dengan pemandangan lembah hijau yang memukau. Cocok untuk bulan madu dan keluarga.",
      address: "Jl. Ranca Bentang No.56, Kota Bandung",
      contact: "+62 22 2012800",
      latitude: -6.8756,
      longitude: 107.6145,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/c2/54/8e/padma-hotel.jpg?w=1200",
      openTime: "00:00",
      closeTime: "23:59",
      ticketPrice: 800000,
      maxPrice: 3000000,
      visitCount: 1045,
      status: DestinationStatus.aktif,
      categoryId: hotel.id,
    },
    {
      name: "Grand Hyatt Bandung",
      description: "Hotel bintang 5 di jantung kota Bandung dengan konektivitas langsung ke Bandung Indah Plaza. Fasilitas bisnis dan leisure lengkap.",
      address: "Jl. Asia Afrika No.8, Kota Bandung",
      contact: "+62 22 4718234",
      latitude: -6.9223,
      longitude: 107.6056,
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/d8/54/8e/grand-hyatt.jpg?w=1200",
      openTime: "00:00",
      closeTime: "23:59",
      ticketPrice: 1200000,
      maxPrice: 4000000,
      visitCount: 923,
      status: DestinationStatus.aktif,
      categoryId: hotel.id,
    },
  ];

  // Insert destinations
  for (const data of destinationsData) {
    const { categoryId, ...destData } = data;
    const destination = await prisma.destination.upsert({
      where: { id: destinationsData.indexOf(data) + 1 },
      update: {},
      create: destData,
    });
    // Link ke kategori
    await prisma.destinationCategory.upsert({
      where: {
        destinationId_categoryId: {
          destinationId: destination.id,
          categoryId,
        },
      },
      update: {},
      create: {
        destinationId: destination.id,
        categoryId,
      },
    });
  }
  console.log("✅ Destinations created (dummy data)");

  // ── DUMMY USER untuk testing ──────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "wisatawan@test.com" },
    update: {},
    create: {
      name: "Wisatawan Test",
      email: "wisatawan@test.com",
      password: hashedPassword,
      role: "WISATAWAN",
      domisili: "Bandung",
    },
  });
  console.log("✅ Test user created (email: wisatawan@test.com / password: password123)");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
