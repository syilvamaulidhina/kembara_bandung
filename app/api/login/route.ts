import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email dan password wajib diisi" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Email tidak ditemukan" },
				{ status: 404 }
			);
		}

		const isMatch = await bcryptjs.compare(password, user.password);

		if (!isMatch) {
			return NextResponse.json(
				{ message: "Password salah" },
				{ status: 401 }
			);
		}

		let role = user.role;

		if (email === "admin@kembara.com") {
			role = "ADMIN";
		}

		const response = NextResponse.json({
			message: "Login berhasil",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role,
				verificationStatus: user.verificationStatus,
				verificationDocument: user.verificationDocument,
				rejectionReason: user.rejectionReason,
			},
		});

		response.cookies.set(
			"user",
			JSON.stringify({
				id: user.id,
				role,
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
			{ message: "Terjadi kesalahan" },
			{ status: 500 }
		);
	}
}