// app/api/uploads/route.ts
// Upload foto & video ke Cloudinary (bukan lagi disk lokal — disk lokal di Vercel bersifat sementara)

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

function uploadBuffer(
  buffer: Buffer,
  resourceType: "image" | "video"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "kembara" },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, type === "video" ? "video" : "image");

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      fileName: result.public_id,
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