import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(
  buffer: Buffer,
  publicId: string,
  extension: string,
  isPdf: boolean
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: isPdf ? "raw" : "image",
        folder: "kembara/verifikasi-pengelola",
        public_id: isPdf ? `${publicId}.${extension}` : publicId,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) {
          reject(error ?? new Error("Upload gagal"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId");
    const file = formData.get("file");

    if (!userId || !(file instanceof File)) {
      return NextResponse.json(
        { message: "User ID dan file wajib diisi" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Format file harus PDF, JPG, JPEG, atau PNG" },
        { status: 400 }
      );
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 5 MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      (file.type === "application/pdf" ? "pdf" : "jpg");

    const isPdf =
      file.type === "application/pdf" || extension === "pdf";

    const publicId = `verifikasi-${userId}-${Date.now()}`;

    const result = await uploadBuffer(
      buffer,
      publicId,
      extension,
      isPdf
    );

    const documentUrl = result.secure_url;

    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        verificationDocument: documentUrl,
        verificationStatus: "PENDING",
        rejectionReason: null,
      },
    });

    const response = NextResponse.json({
      message: "Dokumen verifikasi berhasil diunggah",
      user,
    });

    response.cookies.set(
      "user",
      JSON.stringify({
        id: user.id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }
    );

    return response;
  } catch (error) {
    console.error("Upload dokumen verifikasi gagal:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat upload dokumen" },
      { status: 500 }
    );
  }
}