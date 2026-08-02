import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
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

		const destinations = await prisma.destination.findMany({
			where: {
				ownerId: Number(user.id),
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
			orderBy: {
				createdAt: "desc",
			},
		});

		const formattedDestinations = destinations.map((destination) => {
			const latestAnalysis = destination.aiAnalyses[0] || null;

			return {
				...destination,
				latestAnalysis: latestAnalysis
					? {
							score: latestAnalysis.score,
							status: latestAnalysis.status,
							message: latestAnalysis.message,
							...(latestAnalysis.rawResult as object),
						}
					: null,
			};
		});

		return NextResponse.json(formattedDestinations);
	} catch (error) {
		console.error("GET DESTINATIONS ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal mengambil data destinasi" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
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

		if (user.verificationStatus !== "APPROVED") {
			return NextResponse.json(
				{ message: "Akun pengelola belum diverifikasi." },
				{ status: 403 }
			);
		}

		const body = await req.json();
		const analysisResult = body.analysisResult;

		const categoryIds = Array.isArray(body.categoryIds)
			? body.categoryIds.map((id: unknown) => Number(id))
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

		if (!body.isFree) {
			if (body.ticketPrice === "" || body.ticketPrice === undefined) {
				return NextResponse.json(
					{ message: "Harga tiket mulai wajib diisi." },
					{ status: 400 }
				);
			}

			if (body.maxPrice === "" || body.maxPrice === undefined) {
				return NextResponse.json(
					{ message: "Harga tiket maksimal wajib diisi." },
					{ status: 400 }
				);
			}

			if (Number(body.ticketPrice) < 0 || Number(body.maxPrice) < 0) {
				return NextResponse.json(
					{ message: "Harga tiket tidak boleh negatif." },
					{ status: 400 }
				);
			}

			if (Number(body.maxPrice) < Number(body.ticketPrice)) {
				return NextResponse.json(
					{ message: "Harga maksimal tidak boleh lebih kecil dari harga mulai." },
					{ status: 400 }
				);
			}
		}

		if (!body.openTime || !body.closeTime) {
			return NextResponse.json(
				{ message: "Jam buka dan jam tutup wajib diisi." },
				{ status: 400 }
			);
		}

		const coveragePolygon = body.coveragePolygon ?? null;

		if (coveragePolygon !== null) {
			if (
				coveragePolygon.type !== "Polygon" ||
				!Array.isArray(coveragePolygon.coordinates) ||
				!Array.isArray(coveragePolygon.coordinates[0])
			) {
				return NextResponse.json(
				{ message: "Format cakupan wilayah tidak valid." },
				{ status: 400 }
				);
			}

			const ring = coveragePolygon.coordinates[0];

			if (ring.length < 4) {
				return NextResponse.json(
				{ message: "Cakupan wilayah minimal harus memiliki 3 titik." },
				{ status: 400 }
				);
			}

			if (ring.length > 31) {
				return NextResponse.json(
				{ message: "Cakupan wilayah maksimal terdiri dari 30 titik." },
				{ status: 400 }
				);
			}

			const coordinatesValid = ring.every(
				(point: unknown) =>
				Array.isArray(point) &&
				point.length === 2 &&
				typeof point[0] === "number" &&
				typeof point[1] === "number" &&
				Number.isFinite(point[0]) &&
				Number.isFinite(point[1])
			);

			if (!coordinatesValid) {
				return NextResponse.json(
				{ message: "Koordinat cakupan wilayah tidak valid." },
				{ status: 400 }
				);
			}

			const firstPoint = ring[0];
			const lastPoint = ring[ring.length - 1];

			const isClosed =
				firstPoint[0] === lastPoint[0] &&
				firstPoint[1] === lastPoint[1];

			if (!isClosed) {
				return NextResponse.json(
				{ message: "Polygon cakupan wilayah harus tertutup." },
				{ status: 400 }
				);
			}
		}

		const destination = await prisma.destination.create({
			data: {
				owner: {
					connect: {
					id: Number(user.id),
					},
				},

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

				coveragePolygon: Prisma.DbNull,
				pendingCoveragePolygon:
					coveragePolygon !== null ? coveragePolygon : Prisma.DbNull,
				coveragePolygonChanged: coveragePolygon !== null,
				
				imageUrl: body.imageUrl || null,

				openTime: body.openTime || null,
				closeTime: body.closeTime || null,
				ticketPrice: body.isFree ? 0 : Number(body.ticketPrice),
				maxPrice: body.isFree ? 0 : Number(body.maxPrice),
				website: body.website || null,

				status: "pending",

				categories: {
					create: categoryIds.map((id: number) => ({
					categoryId: id,
					})),
				},
				},
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
					destinationId: destination.id,
					score: Number(analysisResult.score),
					status: analysisResult.status,
					message: analysisResult.message,
					rawResult: analysisResult,
				},
			});
		}

		return NextResponse.json(destination);
	} catch (error) {
		console.error("CREATE DESTINATION ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal menambahkan destinasi wisata." },
			{ status: 500 }
		);
	}
}