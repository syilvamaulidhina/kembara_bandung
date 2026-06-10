// app/api/uploads/route.ts
// Upload foto & video ke /public/uploads (server lokal)

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image"; // "image" | "video"

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Ukuran file maksimal 50MB. File kamu: ${(file.size / 1024 / 1024).toFixed(1)}MB` },
        { status: 400 }
      );
    }

    const allowedMimes = type === "video" ? ALLOWED_TYPES.video : ALLOWED_TYPES.image;
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Format tidak didukung. Gunakan: ${allowedMimes.join(", ")}` },
        { status: 400 }
      );
    }

    // Buat folder uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate nama file unik
    const ext = file.name.split(".").pop()?.toLowerCase() || (type === "video" ? "mp4" : "jpg");
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${type}_${timestamp}_${random}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Tulis file ke disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupload file" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
