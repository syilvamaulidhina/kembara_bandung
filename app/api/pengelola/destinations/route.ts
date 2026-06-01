import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const destinations = await prisma.destination.findMany({
			where: {
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

export async function POST(req: Request) {
	try {
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

		const destination = await prisma.destination.create({
			data: {
        name: body.name,
        description: body.description,
        address: body.address,
        contact: body.contact || null,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
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