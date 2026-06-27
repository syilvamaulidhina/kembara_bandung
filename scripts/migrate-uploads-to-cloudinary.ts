// scripts/migrate-uploads-to-cloudinary.ts
// Script sekali-jalan: upload semua file di public/uploads ke Cloudinary,
// lalu update path-nya di database (Destination.imageUrl, User.photo,
// User.verificationDocument, Review.photoUrl, Review.videoUrl).

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    console.log("Folder public/uploads tidak ditemukan. Tidak ada yang perlu dimigrasikan.");
    return;
  }

  const files = fs.readdirSync(uploadDir).filter((f) => {
    const stat = fs.statSync(path.join(uploadDir, f));
    return stat.isFile();
  });

  console.log(`Ditemukan ${files.length} file di public/uploads. Mulai upload ke Cloudinary...\n`);

  // Map: path lama (/uploads/namafile.jpg) -> URL baru dari Cloudinary
  const urlMap: Record<string, string> = {};

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const oldUrl = `/uploads/${file}`;
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "kembara",
        resource_type: "auto",
      });
      urlMap[oldUrl] = result.secure_url;
      console.log(`✓ ${file} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`✗ Gagal upload ${file}:`, err);
    }
  }

  console.log(`\nUpload selesai. ${Object.keys(urlMap).length}/${files.length} berhasil.`);
  console.log("\nMulai update database...\n");

  // 1. Update Destination.imageUrl
  const destinations = await prisma.destination.findMany({
    where: { imageUrl: { startsWith: "/uploads/" } },
  });
  for (const dest of destinations) {
    if (dest.imageUrl && urlMap[dest.imageUrl]) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: { imageUrl: urlMap[dest.imageUrl] },
      });
      console.log(`Destination #${dest.id} (${dest.name}) diupdate`);
    }
  }

  // 2. Update User.photo
  const usersWithPhoto = await prisma.user.findMany({
    where: { photo: { startsWith: "/uploads/" } },
  });
  for (const u of usersWithPhoto) {
    if (u.photo && urlMap[u.photo]) {
      await prisma.user.update({
        where: { id: u.id },
        data: { photo: urlMap[u.photo] },
      });
      console.log(`User #${u.id} (${u.name}) - foto profil diupdate`);
    }
  }

  // 3. Update User.verificationDocument
  const usersWithDoc = await prisma.user.findMany({
    where: { verificationDocument: { startsWith: "/uploads/" } },
  });
  for (const u of usersWithDoc) {
    if (u.verificationDocument && urlMap[u.verificationDocument]) {
      await prisma.user.update({
        where: { id: u.id },
        data: { verificationDocument: urlMap[u.verificationDocument] },
      });
      console.log(`User #${u.id} (${u.name}) - dokumen verifikasi diupdate`);
    }
  }

  // 4. Update Review.photoUrl & Review.videoUrl
  const reviews = await prisma.review.findMany({
    where: {
      OR: [
        { photoUrl: { startsWith: "/uploads/" } },
        { videoUrl: { startsWith: "/uploads/" } },
      ],
    },
  });
  for (const r of reviews) {
    const data: { photoUrl?: string; videoUrl?: string } = {};
    if (r.photoUrl && urlMap[r.photoUrl]) data.photoUrl = urlMap[r.photoUrl];
    if (r.videoUrl && urlMap[r.videoUrl]) data.videoUrl = urlMap[r.videoUrl];
    if (Object.keys(data).length > 0) {
      await prisma.review.update({ where: { id: r.id }, data });
      console.log(`Review #${r.id} diupdate`);
    }
  }

  console.log("\nSelesai! Semua file sudah dipindah ke Cloudinary dan database sudah diupdate.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Migrasi gagal:", e);
  process.exit(1);
});