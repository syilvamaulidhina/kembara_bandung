import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
	params: Promise<{
		id: string;
	}>;
};

function getUserFromCookie(req: NextRequest) {
	const userCookie = req.cookies.get("user");

	if (!userCookie) return null;

	try {
		return JSON.parse(userCookie.value);
	} catch {
		return null;
	}
}

function validatePengelola(req: NextRequest) {
	const user = getUserFromCookie(req);

	if (!user) {
		return {
			error: NextResponse.json(
				{ message: "User belum login." },
				{ status: 401 }
			),
			user: null,
		};
	}

	if (user.role !== "PENGELOLA") {
		return {
			error: NextResponse.json(
				{ message: "Akses ditolak." },
				{ status: 403 }
			),
			user: null,
		};
	}

	return {
		error: null,
		user,
	};
}

export async function GET(req: NextRequest, { params }: Params) {
	try {
		const auth = validatePengelola(req);

		if (auth.error) return auth.error;

		const { id } = await params;
		const destinationId = Number(id);

		if (Number.isNaN(destinationId)) {
			return NextResponse.json(
				{ message: "ID wisata tidak valid." },
				{ status: 400 }
			);
		}

		const destination = await prisma.destination.findFirst({
			where: {
				id: destinationId,
				ownerId: Number(auth.user.id),
				isDeleted: false,
			},
			include: {
				categories: {
					include: {
						category: true,
					},
				},
				aiAnalyses: {
					orderBy: {
						createdAt: "desc",
					},
					take: 1,
				},
			},
		});

		if (!destination) {
			return NextResponse.json(
				{ message: "Wisata tidak ditemukan." },
				{ status: 404 }
			);
		}

		const latestAnalysis = destination.aiAnalyses[0] || null;

		return NextResponse.json({
			...destination,
			latestAnalysis: latestAnalysis
				? {
						score: latestAnalysis.score,
						status: latestAnalysis.status,
						message: latestAnalysis.message,
						...(latestAnalysis.rawResult as object),
				  }
				: null,
		});
	} catch (error) {
		console.error("GET DESTINATION DETAIL ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal mengambil detail wisata." },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest, { params }: Params) {
	try {
		const auth = validatePengelola(req);

		if (auth.error) return auth.error;

		const { id } = await params;
		const destinationId = Number(id);

		if (Number.isNaN(destinationId)) {
			return NextResponse.json(
				{ message: "ID wisata tidak valid." },
				{ status: 400 }
			);
		}

		const existingDestination = await prisma.destination.findFirst({
			where: {
				id: destinationId,
				ownerId: Number(auth.user.id),
				isDeleted: false,
			},
		});

		if (!existingDestination) {
			return NextResponse.json(
				{ message: "Wisata tidak ditemukan." },
				{ status: 404 }
			);
		}

		const body = await req.json();
		const analysisResult = body.analysisResult;

		// const submittedCoveragePolygon = body.coveragePolygon ?? null;

		// const currentProposedPolygon =
		// 	existingDestination.coveragePolygonChanged
		// 		? existingDestination.pendingCoveragePolygon
		// 		: existingDestination.coveragePolygon;

		// const coveragePolygonChanged =
		// 	JSON.stringify(submittedCoveragePolygon) !==
		// 	JSON.stringify(currentProposedPolygon);

		const submittedCoveragePolygon = body.coveragePolygon ?? null;

		const categoryIds = Array.isArray(body.categoryIds)
			? body.categoryIds.map((categoryId: unknown) => Number(categoryId))
			: [];

		if (!body.name || !body.description || !body.address) {
			return NextResponse.json(
				{ message: "Nama, deskripsi, dan alamat wajib diisi." },
				{ status: 400 }
			);
		}

		if (categoryIds.length === 0) {
			return NextResponse.json(
				{ message: "Pilih minimal satu kategori wisata." },
				{ status: 400 }
			);
		}

		if (!body.latitude || !body.longitude) {
			return NextResponse.json(
				{ message: "Latitude dan longitude wajib diisi." },
				{ status: 400 }
			);
		}

		await prisma.destinationCategory.deleteMany({
			where: {
				destinationId,
			},
		});

		const updateData: Prisma.DestinationUpdateInput = {
			name: body.name,
			description: body.description,
			address: body.address,

			addressStreet: body.addressStreet || null,
			addressVillage: body.addressVillage || null,
			addressDistrict: body.addressDistrict || null,
			addressCity: body.addressCity || null,
			addressProvince: body.addressProvince || null,

			contact: body.contact || null,
			latitude: Number(body.latitude),
			longitude: Number(body.longitude),
			imageUrl: body.imageUrl || null,

			openTime: body.openTime || null,
			closeTime: body.closeTime || null,

			ticketPrice: body.isFree
				? 0
				: body.ticketPrice === "" ||
					body.ticketPrice === null ||
					body.ticketPrice === undefined
					? null
					: Number(body.ticketPrice),

			maxPrice: body.isFree
				? 0
				: body.maxPrice === "" ||
					body.maxPrice === null ||
					body.maxPrice === undefined
					? null
					: Number(body.maxPrice),

			website: body.website || null,

			status: "pending",
			adminFeedback: null,

			categories: {
				create: categoryIds.map((categoryId: number) => ({
					categoryId,
				})),
			},
		};

		if (submittedCoveragePolygon) {
		const isDifferentFromCurrentPending =
			JSON.stringify(submittedCoveragePolygon) !==
			JSON.stringify(existingDestination.pendingCoveragePolygon);

		if (
			!existingDestination.coveragePolygonChanged ||
			isDifferentFromCurrentPending
		) {
			updateData.pendingCoveragePolygon = submittedCoveragePolygon;
			updateData.coveragePolygonChanged = true;
		}
		} else if (existingDestination.coveragePolygonChanged) {
		// Pengelola menghapus/membatalkan polygon usulan.
		// Polygon approved tetap tidak berubah.
		updateData.pendingCoveragePolygon = Prisma.DbNull;
		updateData.coveragePolygonChanged = false;
		}

		const updatedDestination = await prisma.destination.update({
			where: {
				id: destinationId,
			},
			data: updateData,
			include: {
				categories: {
					include: {
						category: true,
					},
				},
			},
		});

		if (analysisResult) {
			await prisma.aiAnalysis.create({
				data: {
					destinationId,
					score: Number(analysisResult.score),
					status: analysisResult.status,
					message: analysisResult.message,
					rawResult: analysisResult,
				},
			});
		}

		return NextResponse.json(updatedDestination);
	} catch (error) {
		console.error("UPDATE DESTINATION ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal memperbarui wisata." },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
	try {
		const auth = validatePengelola(req);

		if (auth.error) return auth.error;

		const { id } = await params;
		const destinationId = Number(id);

		if (Number.isNaN(destinationId)) {
			return NextResponse.json(
				{ message: "ID wisata tidak valid." },
				{ status: 400 }
			);
		}

		const destination = await prisma.destination.findFirst({
			where: {
				id: destinationId,
				ownerId: Number(auth.user.id),
				isDeleted: false,
			},
		});

		if (!destination) {
			return NextResponse.json(
				{ message: "Wisata tidak ditemukan." },
				{ status: 404 }
			);
		}

		await prisma.destination.update({
			where: {
				id: destinationId,
			},
			data: {
				isDeleted: true,
				deletedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: "Wisata berhasil dihapus.",
		});
	} catch (error) {
		console.error("DELETE DESTINATION ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal menghapus wisata." },
			{ status: 500 }
		);
	}
}