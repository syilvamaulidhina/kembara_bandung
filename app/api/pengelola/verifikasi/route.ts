import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(buffer: Buffer, fileName: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // otomatis deteksi: PDF, JPG, PNG, dll
        folder: "kembara/verifikasi-pengelola",
        public_id: fileName,
      },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function PATCH(req: NextRequest) {
	try {
		const formData = await req.formData();

		const userId = formData.get("userId");
		const file = formData.get("file") as File | null;

		if (!userId || !file) {
			return NextResponse.json(
				{ message: "User ID dan file wajib diisi" },
				{ status: 400 }
			);
		}

		const allowedTypes = [
			"application/pdf",
			"image/jpeg",
			"image/jpg",
			"image/png",
		];

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ message: "Format file harus PDF, JPG, atau PNG" },
				{ status: 400 }
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileExt = file.name.split(".").pop();
		const fileName = `verifikasi-${userId}-${Date.now()}.${fileExt}`;

		const result = await uploadBuffer(buffer, fileName);
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
			message: "Dokumen verifikasi berhasil diupload",
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
			}
		);

		return response;
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Terjadi kesalahan saat upload dokumen" },
			{ status: 500 }
		);
	}
}