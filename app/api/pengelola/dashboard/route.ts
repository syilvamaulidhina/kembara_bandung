import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getUserFromCookie(req: NextRequest) {
	const userCookie = req.cookies.get("user");

	if (!userCookie) {
		return null;
	}

	try {
		return JSON.parse(userCookie.value);
	} catch {
		return null;
	}
}

export async function GET(req: NextRequest) {
	try {
		const user = getUserFromCookie(req);

		if (!user) {
			return NextResponse.json(
				{ message: "User belum login." },
				{ status: 401 }
			);
		}

		if (user.role !== "PENGELOLA") {
			return NextResponse.json(
				{ message: "Akses ditolak." },
				{ status: 403 }
			);
		}

		const ownerFilter = {
			ownerId: Number(user.id),
			isDeleted: false,
		};

		const totalDestinations = await prisma.destination.count({
			where: ownerFilter,
		});

		const activeDestinations = await prisma.destination.count({
			where: {
				...ownerFilter,
				status: "aktif",
			},
		});

		const pendingDestinations = await prisma.destination.count({
			where: {
				...ownerFilter,
				status: "pending",
			},
		});

		const revisionDestinations = await prisma.destination.count({
			where: {
				...ownerFilter,
				status: "butuh_perbaikan",
			},
		});

		const recentDestinations = await prisma.destination.findMany({
			where: ownerFilter,
			orderBy: {
				createdAt: "desc",
			},
			take: 5,
			select: {
				id: true,
				name: true,
				status: true,
				imageUrl: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			totalDestinations,
			activeDestinations,
			pendingDestinations,
			revisionDestinations,
			recentDestinations,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Gagal mengambil data dashboard." },
			{ status: 500 }
		);
	}
}