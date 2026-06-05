import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

		const uploadDir = path.join(
			process.cwd(),
			"public",
			"uploads",
			"verifikasi-pengelola"
		);

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const fileExt = file.name.split(".").pop();
		const fileName = `verifikasi-${userId}-${Date.now()}.${fileExt}`;
		const filePath = path.join(uploadDir, fileName);

		fs.writeFileSync(filePath, buffer);

		const documentUrl = `/uploads/verifikasi-pengelola/${fileName}`;

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