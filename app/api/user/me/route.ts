import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const userCookie = req.cookies.get("user");

		if (!userCookie) {
			return NextResponse.json(
				{ message: "User tidak ditemukan" },
				{ status: 401 }
			);
		}

		const { id } = JSON.parse(userCookie.value);

		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				verificationStatus: true,
				verificationDocument: true,
				rejectionReason: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "User tidak ditemukan" },
				{ status: 404 }
			);
		}

		const response = NextResponse.json({
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
			{ message: "Terjadi kesalahan" },
			{ status: 500 }
		);
	}
}