import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getUserFromCookie(req: NextRequest) {
	const userCookie = req.cookies.get("user");
	if (!userCookie) return null;

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
			return NextResponse.json({ message: "User belum login." }, { status: 401 });
		}

		if (user.role !== "PENGELOLA") {
			return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
		}

		const ownerId = Number(user.id);
		if (!Number.isInteger(ownerId)) {
			return NextResponse.json({ message: "Identitas pengguna tidak valid." }, { status: 400 });
		}

		const ownerFilter = { ownerId, isDeleted: false };
		const destinationRelationFilter = { destination: ownerFilter };
		const now = new Date();

		const [
			totalDestinations,
			activeDestinations,
			pendingDestinations,
			revisionDestinations,
			recentDestinations,
			totalEvents,
			activeEvents,
			pendingEvents,
			totalViews,
			totalSaved,
			totalVisited,
			totalItineraryEntries,
			reviewAggregate,
			recentReviews,
			destinationsForPerformance,
		] = await Promise.all([
			prisma.destination.count({ where: ownerFilter }),
			prisma.destination.count({ where: { ...ownerFilter, status: "aktif" } }),
			prisma.destination.count({ where: { ...ownerFilter, status: "pending" } }),
			prisma.destination.count({ where: { ...ownerFilter, status: "butuh_perbaikan" } }),
			prisma.destination.findMany({
				where: ownerFilter,
				orderBy: { createdAt: "desc" },
				take: 5,
				select: { id: true, name: true, status: true, imageUrl: true, createdAt: true },
			}),
			prisma.event.count({ where: { ownerId, isDeleted: false } }),
			prisma.event.count({
				where: {
					ownerId,
					isDeleted: false,
					status: "aktif",
					endDate: { gte: now },
				},
			}),
			prisma.event.count({ where: { ownerId, isDeleted: false, status: "pending" } }),
			prisma.destinationView.count({ where: destinationRelationFilter }),
			prisma.savedDestination.count({ where: destinationRelationFilter }),
			prisma.visitedPlace.count({ where: destinationRelationFilter }),
			prisma.itineraryItem.count({ where: destinationRelationFilter }),
			prisma.review.aggregate({
				where: destinationRelationFilter,
				_count: { _all: true },
				_avg: { rating: true },
			}),
			prisma.review.findMany({
				where: destinationRelationFilter,
				orderBy: { createdAt: "desc" },
				take: 4,
				select: {
					id: true,
					rating: true,
					comment: true,
					createdAt: true,
					user: { select: { name: true, photo: true } },
					destination: { select: { id: true, name: true } },
				},
			}),
			prisma.destination.findMany({
				where: ownerFilter,
				select: {
					id: true,
					name: true,
					imageUrl: true,
					status: true,
					_count: {
						select: {
							views: true,
							savedBy: true,
							visitedBy: true,
							reviews: true,
							itineraryItems: true,
						},
					},
					reviews: { select: { rating: true } },
				},
			}),
		]);

		const topDestinations = destinationsForPerformance
			.map((destination: (typeof destinationsForPerformance)[number]) => {
				const averageRating = destination.reviews.length
					? destination.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
					  destination.reviews.length
					: 0;

				return {
					id: destination.id,
					name: destination.name,
					imageUrl: destination.imageUrl,
					status: destination.status,
					views: destination._count.views,
					saved: destination._count.savedBy,
					visited: destination._count.visitedBy,
					reviews: destination._count.reviews,
					itineraries: destination._count.itineraryItems,
					averageRating: Number(averageRating.toFixed(1)),
				};
			})
			.sort((a: { views: number; saved: number; reviews: number }, b: { views: number; saved: number; reviews: number }) => b.views - a.views || b.saved - a.saved || b.reviews - a.reviews)
			.slice(0, 5);

		return NextResponse.json({
			summary: {
				totalDestinations,
				activeDestinations,
				pendingDestinations,
				revisionDestinations,
				totalEvents,
				activeEvents,
				pendingEvents,
			},
			engagement: {
				totalViews,
				totalSaved,
				totalVisited,
				totalReviews: reviewAggregate._count._all,
				averageRating: Number((reviewAggregate._avg.rating ?? 0).toFixed(1)),
				totalItineraryEntries,
			},
			recentDestinations,
			topDestinations,
			recentReviews,
		});
	} catch (error) {
		console.error("Dashboard API error:", error);
		return NextResponse.json({ message: "Gagal mengambil data dashboard." }, { status: 500 });
	}
}
