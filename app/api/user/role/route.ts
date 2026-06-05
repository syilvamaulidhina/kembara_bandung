import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { userId, role } = body;

		const allowedRoles = ["WISATAWAN", "PENGELOLA"];

		if (!userId || !role) {
			return NextResponse.json(
				{ message: "User ID dan role wajib diisi" },
				{ status: 400 }
			);
		}

		if (!allowedRoles.includes(role)) {
			return NextResponse.json(
				{ message: "Role tidak valid" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.update({
			where: { id: Number(userId) },
			data: {
				role,
				verificationStatus:
					role === "PENGELOLA" ? "PENDING" : null,
				verificationDocument: null,
				rejectionReason: null,
			},
		});

		const response = NextResponse.json({
			message: "Role berhasil diupdate",
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