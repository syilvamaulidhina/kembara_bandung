import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const totalDestinations = await prisma.destination.count({
			where: { isDeleted: false },
		});

		const activeDestinations = await prisma.destination.count({
			where: {
				isDeleted: false,
				status: "aktif",
			},
		});

		const pendingDestinations = await prisma.destination.count({
			where: {
				isDeleted: false,
				status: "pending",
			},
		});

		const revisionDestinations = await prisma.destination.count({
			where: {
				isDeleted: false,
				status: "butuh_perbaikan",
			},
		});

		const recentDestinations = await prisma.destination.findMany({
			where: { isDeleted: false },
			orderBy: { createdAt: "desc" },
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