// prisma/seed.ts - FIXED: upsert by name bukan by id
// npx prisma db seed

import "dotenv/config";
import { PrismaClient, DestinationStatus } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL belum ada di .env");
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // CATEGORIES
  const categoryNames = ["Wisata Alam","Wisata Budaya","Wisata Kuliner","Wisata Edukasi","Wisata Hiburan","Wisata Belanja","Wisata Religi"];
  const categoryMap: Record<string, number> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
    categoryMap[name] = cat.id;
  }
  console.log("Categories done:", Object.keys(categoryMap));

  // DESTINATIONS - upsert by name (aman dijalankan berulang)
  const destinations = [
    { name: "Kawah Putih", description: "Danau kawah vulkanik berwarna putih kehijauan di ketinggian 2.430 mdpl.", address: "Ciwidey, Kab. Bandung", contact: "+62 22 5921387", latitude: -7.1665, longitude: 107.4021, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kawah_Putih.jpg/1280px-Kawah_Putih.jpg", openTime: "07:00", closeTime: "17:00", ticketPrice: 25000, maxPrice: 25000, visitCount: 1520, status: DestinationStatus.aktif, category: "Wisata Alam" },
    { name: "Tangkuban Perahu", description: "Gunung berapi aktif berbentuk perahu terbalik dengan kawah yang masih aktif.", address: "Lembang, Kab. Bandung Barat", contact: "+62 22 2787000", latitude: -6.7598, longitude: 107.6098, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tangkuban_Parahu.jpg/1280px-Tangkuban_Parahu.jpg", openTime: "07:00", closeTime: "17:00", ticketPrice: 30000, maxPrice: 30000, visitCount: 1890, status: DestinationStatus.aktif, category: "Wisata Alam" },
    { name: "Orchid Forest Cikole", description: "Kawasan ekowisata anggrek di tengah hutan pinus Lembang. Wood Bridge ikonik.", address: "Cikole, Lembang, Kab. Bandung Barat", contact: "+62 812-3456-7890", latitude: -6.7891, longitude: 107.6234, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c5/54/8e/orchid-forest-cikole.jpg?w=1200&h=-1&s=1", openTime: "09:00", closeTime: "18:00", ticketPrice: 40000, maxPrice: 40000, visitCount: 1340, status: DestinationStatus.aktif, category: "Wisata Alam" },
    { name: "Situ Patenggang", description: "Danau alami di perkebunan teh Ciwidey. Tersedia perahu dan Pulau Asmara.", address: "Ciwidey, Kab. Bandung", contact: "+62 22 5921388", latitude: -7.1895, longitude: 107.4234, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Situ_Patenggang.jpg", openTime: "07:00", closeTime: "17:00", ticketPrice: 15000, maxPrice: 50000, visitCount: 980, status: DestinationStatus.aktif, category: "Wisata Alam" },
    { name: "Kebun Teh Sukawana", description: "Hamparan kebun teh hijau dengan pemandangan pegunungan dan udara segar.", address: "Sukawana, Kab. Bandung Barat", contact: null, latitude: -6.8123, longitude: 107.5678, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/32/a1/8e/kebun-teh.jpg?w=1200", openTime: "06:00", closeTime: "17:00", ticketPrice: 10000, maxPrice: 10000, visitCount: 756, status: DestinationStatus.aktif, category: "Wisata Alam" },
    { name: "Gedung Sate", description: "Ikon Kota Bandung, gedung bersejarah bergaya neo-klasik, kantor Gubernur Jawa Barat.", address: "Jl. Diponegoro No.22, Kota Bandung", contact: "+62 22 4230963", latitude: -6.9025, longitude: 107.6189, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Gedung_Sate.jpg/1280px-Gedung_Sate.jpg", openTime: "09:00", closeTime: "16:00", ticketPrice: 5000, maxPrice: 5000, visitCount: 2100, status: DestinationStatus.aktif, category: "Wisata Budaya" },
    { name: "Museum KAA", description: "Gedung bersejarah Konferensi Asia-Afrika 1955. Koleksi sejarah diplomasi Indonesia.", address: "Jl. Asia Afrika No.65, Kota Bandung", contact: "+62 22 4234596", latitude: -6.9215, longitude: 107.6072, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Gedung_Merdeka_Bandung.jpg", openTime: "08:00", closeTime: "16:00", ticketPrice: 0, maxPrice: 0, visitCount: 1230, status: DestinationStatus.aktif, category: "Wisata Budaya" },
    { name: "Saung Angklung Udjo", description: "Pusat seni angklung tradisional Sunda. Bisa belajar bermain angklung.", address: "Jl. Padasuka No.118, Kota Bandung", contact: "+62 22 7271714", latitude: -6.8987, longitude: 107.6601, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/4e/74/8e/saung-angklung-udjo.jpg?w=1200", openTime: "08:30", closeTime: "22:00", ticketPrice: 60000, maxPrice: 100000, visitCount: 1567, status: DestinationStatus.aktif, category: "Wisata Budaya" },
    { name: "Jalan Braga", description: "Kawasan heritage kolonial Belanda abad ke-19. Pusat seni, galeri, dan cafe.", address: "Jl. Braga, Kota Bandung", contact: null, latitude: -6.9188, longitude: 107.6098, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Braga_Street_Bandung.jpg", openTime: "00:00", closeTime: "23:59", ticketPrice: 0, maxPrice: 0, visitCount: 1890, status: DestinationStatus.aktif, category: "Wisata Budaya" },
    { name: "Sate Kardjan", description: "Sate legendaris Bandung sejak 1925. Bumbu kacang khas dengan aroma bakaran.", address: "Jl. Otto Iskandar Dinata, Kota Bandung", contact: "+62 22 4235678", latitude: -6.9198, longitude: 107.6134, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d6/70/8e/sate-kardjan.jpg?w=1200", openTime: "10:00", closeTime: "21:00", ticketPrice: 30000, maxPrice: 100000, visitCount: 1456, status: DestinationStatus.aktif, category: "Wisata Kuliner" },
    { name: "Batagor Kingsley", description: "Batagor legendaris khas Bandung, wajib coba saat berkunjung.", address: "Jl. Sumur Bandung, Kota Bandung", contact: "+62 22 4201234", latitude: -6.9145, longitude: 107.6045, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/4b/92/8e/batagor.jpg?w=1200", openTime: "08:00", closeTime: "17:00", ticketPrice: 15000, maxPrice: 50000, visitCount: 1123, status: DestinationStatus.aktif, category: "Wisata Kuliner" },
    { name: "Warung Nasi Ampera", description: "Restoran masakan Sunda otentik, nasi liwet dan lalapan segar.", address: "Jl. Riau No.34, Kota Bandung", contact: "+62 22 7234567", latitude: -6.9089, longitude: 107.6234, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/7e/54/8e/warung-ampera.jpg?w=1200", openTime: "07:00", closeTime: "22:00", ticketPrice: 20000, maxPrice: 80000, visitCount: 987, status: DestinationStatus.aktif, category: "Wisata Kuliner" },
    { name: "Paris Van Java Mall", description: "Pusat perbelanjaan semi-outdoor bergaya Eropa, brand lokal dan internasional.", address: "Jl. Sukajadi No.137, Kota Bandung", contact: "+62 22 2001234", latitude: -6.8889, longitude: 107.5978, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/7a/54/8e/paris-van-java.jpg?w=1200", openTime: "10:00", closeTime: "22:00", ticketPrice: 0, maxPrice: 0, visitCount: 2345, status: DestinationStatus.aktif, category: "Wisata Belanja" },
    { name: "Cihampelas Walk (Ciwalk)", description: "Pusat factory outlet dan fashion Bandung yang ikonik.", address: "Jl. Cihampelas No.160, Kota Bandung", contact: "+62 22 2061234", latitude: -6.8934, longitude: 107.6012, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/3a/54/8e/cihampelas.jpg?w=1200", openTime: "10:00", closeTime: "22:00", ticketPrice: 0, maxPrice: 0, visitCount: 1789, status: DestinationStatus.aktif, category: "Wisata Belanja" },
    { name: "Pasar Baru Trade Center", description: "Pusat grosir tekstil terbesar di Bandung.", address: "Jl. Otto Iskandar Dinata, Kota Bandung", contact: "+62 22 4234567", latitude: -6.9212, longitude: 107.6087, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/56/54/8e/pasar-baru.jpg?w=1200", openTime: "09:00", closeTime: "21:00", ticketPrice: 0, maxPrice: 0, visitCount: 1234, status: DestinationStatus.aktif, category: "Wisata Belanja" },
    { name: "Trans Studio Bandung", description: "Taman bermain indoor terbesar di Asia Tenggara dengan berbagai wahana seru.", address: "Jl. Gatot Subroto No.289, Kota Bandung", contact: "+62 22 8700000", latitude: -6.9156, longitude: 107.6312, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/54/8e/trans-luxury.jpg?w=1200", openTime: "10:00", closeTime: "20:00", ticketPrice: 250000, maxPrice: 350000, visitCount: 1890, status: DestinationStatus.aktif, category: "Wisata Hiburan" },
    { name: "Dusun Bambu", description: "Kawasan wisata alam dengan suasana pedesaan, kuliner, glamping dan aktivitas keluarga.", address: "Jl. Kolonel Masturi No.325, Lembang, Kab. Bandung Barat", contact: "+62 22 2786189", latitude: -6.8209, longitude: 107.5602, imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/c2/54/8e/padma-hotel.jpg?w=1200", openTime: "08:00", closeTime: "18:00", ticketPrice: 25000, maxPrice: 50000, visitCount: 1340, status: DestinationStatus.aktif, category: "Wisata Hiburan" },
    { name: "Museum Geologi Bandung", description: "Museum geologi terlengkap di Indonesia, koleksi fosil dan mineral.", address: "Jl. Diponegoro No.57, Kota Bandung", contact: "+62 22 7212011", latitude: -6.9018, longitude: 107.6194, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Gedung_Merdeka_Bandung.jpg", openTime: "09:00", closeTime: "15:30", ticketPrice: 2000, maxPrice: 3000, visitCount: 890, status: DestinationStatus.aktif, category: "Wisata Edukasi" },
    { name: "Observatorium Bosscha", description: "Observatorium astronomi tertua dan terbesar di Indonesia.", address: "Lembang, Kab. Bandung Barat", contact: "+62 22 2786001", latitude: -6.8254, longitude: 107.6147, imageUrl: "https://images.unsplash.com/photo-1532094349884-543559097c1a?w=800", openTime: "09:00", closeTime: "15:00", ticketPrice: 15000, maxPrice: 15000, visitCount: 654, status: DestinationStatus.aktif, category: "Wisata Edukasi" },
    { name: "Masjid Raya Bandung", description: "Masjid bersejarah di pusat Kota Bandung dengan arsitektur megah dan menara kembar.", address: "Jl. Dalem Kaum No.14, Kota Bandung", contact: "+62 22 4201234", latitude: -6.9218, longitude: 107.6063, imageUrl: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800", openTime: "04:00", closeTime: "22:00", ticketPrice: 0, maxPrice: 0, visitCount: 2100, status: DestinationStatus.aktif, category: "Wisata Religi" },
    { name: "Vihara Dharma Ramsi", description: "Vihara tertua di Bandung dengan arsitektur Tionghoa yang khas.", address: "Jl. Kelenteng No.5, Kota Bandung", contact: null, latitude: -6.9205, longitude: 107.6098, imageUrl: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800", openTime: "06:00", closeTime: "18:00", ticketPrice: 0, maxPrice: 0, visitCount: 543, status: DestinationStatus.aktif, category: "Wisata Religi" },
  ];

  for (const data of destinations) {
    const { category, ...destFields } = data;
    const categoryId = categoryMap[category];
    // Workaround: Prisma v7 + adapter-pg has a bug with findFirst.
    // Use findMany + take 1 instead.
    const existingList = await prisma.destination.findMany({ where: { name: destFields.name }, take: 1 });
    const existing = existingList[0] ?? null;
    let dest;
    if (existing) {
      dest = await prisma.destination.update({
        where: { id: existing.id },
        data: { openTime: destFields.openTime, closeTime: destFields.closeTime, ticketPrice: destFields.ticketPrice, maxPrice: destFields.maxPrice, imageUrl: destFields.imageUrl, status: destFields.status },
      });
      console.log("Updated:", dest.name);
    } else {
      dest = await prisma.destination.create({ data: destFields });
      console.log("Created:", dest.name);
    }
    if (categoryId) {
      await prisma.destinationCategory.upsert({
        where: { destinationId_categoryId: { destinationId: dest.id, categoryId } },
        update: {},
        create: { destinationId: dest.id, categoryId },
      });
    }
  }
  console.log("Destinations done!");

  // TEST USER
  const hashed = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "wisatawan@test.com" },
    update: {},
    create: { name: "Wisatawan Test", email: "wisatawan@test.com", password: hashed, role: "WISATAWAN", domisili: "Bandung" },
  });
  console.log("Test user: wisatawan@test.com / password123");
  console.log("Seeding complete!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
