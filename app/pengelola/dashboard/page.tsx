"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	Activity,
	ArrowUpRight,
	Bookmark,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	Clock3,
	Eye,
	Lightbulb,
	MapPinned,
	MessageSquareText,
	Route,
	Sparkles,
	Star,
	TriangleAlert,
	UsersRound,
} from "lucide-react";

import RecentDestinations from "@/components/dashboard/recent-destinations";
import StatCard from "@/components/dashboard/stat-card";

type Destination = {
	id: number;
	name: string;
	status: string;
	createdAt: string;
	imageUrl?: string | null;
};

type TopDestination = {
	id: number;
	name: string;
	status: string;
	imageUrl?: string | null;
	views: number;
	saved: number;
	visited: number;
	reviews: number;
	itineraries: number;
	averageRating: number;
};

type RecentReview = {
	id: number;
	rating: number;
	comment?: string | null;
	createdAt: string;
	user: { name: string; photo?: string | null };
	destination: { id: number; name: string };
};

type DashboardData = {
	summary: {
		totalDestinations: number;
		activeDestinations: number;
		pendingDestinations: number;
		revisionDestinations: number;
		totalEvents: number;
		activeEvents: number;
		pendingEvents: number;
	};
	engagement: {
		totalViews: number;
		totalSaved: number;
		totalVisited: number;
		totalReviews: number;
		averageRating: number;
		totalItineraryEntries: number;
	};
	recentDestinations: Destination[];
	topDestinations: TopDestination[];
	recentReviews: RecentReview[];
};

type DashboardRecommendation = {
	health: { score: number; label: string; description: string };
	summary: string;
	priority: string;
	recommendations: { title: string; description: string }[];
};

const EMPTY_DASHBOARD: DashboardData = {
	summary: {
		totalDestinations: 0,
		activeDestinations: 0,
		pendingDestinations: 0,
		revisionDestinations: 0,
		totalEvents: 0,
		activeEvents: 0,
		pendingEvents: 0,
	},
	engagement: {
		totalViews: 0,
		totalSaved: 0,
		totalVisited: 0,
		totalReviews: 0,
		averageRating: 0,
		totalItineraryEntries: 0,
	},
	recentDestinations: [],
	topDestinations: [],
	recentReviews: [],
};

async function parseJsonResponse(res: Response) {
	const text = await res.text();

	if (!res.ok) {
		throw new Error(text || "Permintaan gagal.");
	}

	try {
		return JSON.parse(text);
	} catch {
		throw new Error("API mengembalikan respons yang tidak valid.");
	}
}

function formatCompact(value: number) {
	const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

	return new Intl.NumberFormat("id-ID", {
		notation: safeValue >= 1000 ? "compact" : "standard",
		maximumFractionDigits: 1,
	}).format(safeValue);
}

function formatDate(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) return "-";

	return parsedDate.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function normalizeDashboardData(value: Partial<DashboardData> | null | undefined): DashboardData {
	return {
		summary: {
			...EMPTY_DASHBOARD.summary,
			...(value?.summary ?? {}),
		},
		engagement: {
			...EMPTY_DASHBOARD.engagement,
			...(value?.engagement ?? {}),
		},
		recentDestinations: Array.isArray(value?.recentDestinations)
			? value.recentDestinations
			: [],
		topDestinations: Array.isArray(value?.topDestinations)
			? value.topDestinations
			: [],
		recentReviews: Array.isArray(value?.recentReviews)
			? value.recentReviews
			: [],
	};
}

export default function DashboardPage() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [recommendation, setRecommendation] =
		useState<DashboardRecommendation | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadDashboard() {
			try {
				const [dashboardResult, recommendationResult] =
					await Promise.allSettled([
						fetch("/api/pengelola/dashboard").then(parseJsonResponse),
						fetch("/api/pengelola/dashboard/recommendation").then(
							parseJsonResponse
						),
					]);

				if (dashboardResult.status === "fulfilled") {
					setData(normalizeDashboardData(dashboardResult.value));
				}

				if (recommendationResult.status === "fulfilled") {
					const rawRecommendation =
						recommendationResult.value?.recommendation;

					if (rawRecommendation) {
						setRecommendation({
							...rawRecommendation,
							health: {
								score: Number(
									rawRecommendation?.health?.score ?? 0
								),
								label:
									rawRecommendation?.health?.label ??
									"Belum tersedia",
								description:
									rawRecommendation?.health?.description ??
									"",
							},
							priority: rawRecommendation?.priority ?? "",
							recommendations: Array.isArray(
								rawRecommendation?.recommendations
							)
								? rawRecommendation.recommendations
								: [],
						});
					}
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}

		loadDashboard();
	}, []);

	const safeData = data ?? EMPTY_DASHBOARD;
	const { summary, engagement } = safeData;

	const healthScore = Math.min(
		100,
		Math.max(0, Number(recommendation?.health?.score ?? 0))
	);

	const attentionTotal =
		Number(summary.pendingDestinations ?? 0) +
		Number(summary.revisionDestinations ?? 0) +
		Number(summary.pendingEvents ?? 0);

	const activeRate = useMemo(() => {
		if (!summary.totalDestinations) return 0;

		return Math.round(
			(summary.activeDestinations / summary.totalDestinations) * 100
		);
	}, [summary.activeDestinations, summary.totalDestinations]);

	const recommendationItems = Array.isArray(recommendation?.recommendations)
		? recommendation.recommendations.slice(0, 3)
		: [];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F5F7FB] p-4 md:p-6">
				<div className="mx-auto max-w-[1600px] animate-pulse space-y-4">
					<div className="h-36 rounded-3xl bg-white" />
					<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="h-28 rounded-2xl bg-white"
							/>
						))}
					</div>
					<div className="h-96 rounded-3xl bg-white" />
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-[#F5F7FB] p-6">
				<div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
					Gagal memuat dashboard.
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F5F7FB] px-4 py-5 md:px-6 md:py-7">
			<div className="mx-auto max-w-[1600px] space-y-5">
				<section className="relative overflow-hidden rounded-[28px] bg-[#285260] px-5 py-6 text-white shadow-sm md:px-8 md:py-7">
					<div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#F29B4B]/20 blur-3xl" />
					<div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

					<div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F7B978]">
								Dashboard Pengelola
							</p>
							<h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
								Ringkasan pengelolaan wisata
							</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
								Pantau kualitas data, respons wisatawan, performa
								destinasi, dan aktivitas event dalam satu halaman.
							</p>

							<div className="mt-4 flex flex-wrap gap-2">
								<div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10">
									{activeRate}% destinasi aktif
								</div>
								<div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10">
									{attentionTotal} item perlu perhatian
								</div>
							</div>
						</div>

						<div className="flex flex-wrap gap-2.5">
							<Link
								href="/pengelola/destinasi/tambah"
								className="inline-flex items-center gap-2 rounded-xl bg-[#F29B4B] px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:opacity-95"
							>
								+ Tambah Wisata
								<ArrowUpRight className="h-4 w-4" />
							</Link>
							<Link
								href="/pengelola/event/tambah"
								className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/15"
							>
								+ Tambah Event
							</Link>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
					<StatCard
						title="Total Wisata"
						value={summary.totalDestinations}
						description={`${summary.activeDestinations} aktif`}
						variant="default"
						icon={MapPinned}
					/>
					<StatCard
						title="Menunggu Review"
						value={summary.pendingDestinations}
						description="Pengajuan destinasi"
						variant="pending"
						icon={Clock3}
					/>
					<StatCard
						title="Butuh Perbaikan"
						value={summary.revisionDestinations}
						description="Perlu ditindaklanjuti"
						variant="revision"
						icon={TriangleAlert}
					/>
					<StatCard
						title="Event Aktif"
						value={summary.activeEvents}
						description={`${summary.totalEvents} total event`}
						variant="active"
						icon={CalendarDays}
					/>
				</section>

				<section className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
					<div className="mb-4 flex items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-extrabold text-[#1F2937]">
								Engagement Wisatawan
							</h2>
							<p className="mt-1 text-sm text-gray-500">
								Akumulasi interaksi pada seluruh destinasi milikmu.
							</p>
						</div>
						<div className="hidden items-center gap-2 rounded-full bg-[#F5F7FB] px-3 py-1.5 text-xs font-semibold text-gray-500 md:flex">
							<Activity className="h-4 w-4 text-[#F29B4B]" />
							Data keseluruhan
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
						{[
							{
								label: "Tayangan",
								value: engagement.totalViews,
								icon: Eye,
							},
							{
								label: "Disimpan",
								value: engagement.totalSaved,
								icon: Bookmark,
							},
							{
								label: "Dikunjungi",
								value: engagement.totalVisited,
								icon: UsersRound,
							},
							{
								label: "Ulasan",
								value: engagement.totalReviews,
								icon: MessageSquareText,
							},
							{
								label: "Rating",
								value: engagement.averageRating,
								icon: Star,
								suffix: engagement.totalReviews ? "/5" : "",
							},
							{
								label: "Itinerary",
								value: engagement.totalItineraryEntries,
								icon: Route,
							},
						].map((item) => {
							const Icon = item.icon;

							return (
								<div
									key={item.label}
									className="rounded-2xl border border-transparent bg-[#F7F9FC] p-3.5 transition hover:border-[#285260]/10 hover:bg-white hover:shadow-sm"
								>
									<div className="flex items-center gap-2 text-gray-500">
										<Icon className="h-4 w-4" />
										<span className="text-xs font-semibold">
											{item.label}
										</span>
									</div>
									<p className="mt-2 text-2xl font-extrabold text-[#285260]">
										{formatCompact(Number(item.value ?? 0))}
										{item.suffix && (
											<span className="ml-1 text-xs font-semibold text-gray-400">
												{item.suffix}
											</span>
										)}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{attentionTotal > 0 && (
					<section className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 md:flex-row md:items-center md:px-5">
						<div className="flex items-start gap-3">
							<div className="rounded-xl bg-amber-100 p-2">
								<TriangleAlert className="h-5 w-5 shrink-0 text-amber-700" />
							</div>
							<div>
								<p className="text-sm font-bold text-amber-900">
									{attentionTotal} item membutuhkan perhatian
								</p>
								<p className="mt-0.5 text-xs leading-5 text-amber-700">
									{summary.revisionDestinations} perlu perbaikan,{" "}
									{summary.pendingDestinations} destinasi dan{" "}
									{summary.pendingEvents} event menunggu review.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							{summary.revisionDestinations > 0 && (
								<Link
									href="/pengelola/destinasi"
									className="inline-flex items-center gap-1 rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-bold text-white"
								>
									Tindak lanjuti
									<ChevronRight className="h-4 w-4" />
								</Link>
							)}
							<Link
								href="/pengelola/destinasi"
								className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-800 ring-1 ring-amber-300"
							>
								Lihat semua
								<ChevronRight className="h-4 w-4" />
							</Link>
						</div>
					</section>
				)}

				<section className="grid gap-5 xl:grid-cols-12">
					<div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm md:p-5 xl:col-span-7">
						<div className="flex items-center justify-between gap-4">
							<div>
								<h2 className="text-lg font-extrabold text-[#1F2937]">
									Performa Destinasi
								</h2>
								<p className="mt-1 text-sm text-gray-500">
									Diurutkan berdasarkan jumlah tayangan.
								</p>
							</div>
							<Activity className="h-5 w-5 text-[#F29B4B]" />
						</div>

						<div className="mt-4 overflow-x-auto">
							<table className="w-full min-w-[650px] text-left">
								<thead>
									<tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
										<th className="pb-3">Destinasi</th>
										<th className="pb-3 text-center">Rating</th>
										<th className="pb-3 text-center">Ulasan</th>
										<th className="pb-3 text-center">Disimpan</th>
										<th className="pb-3 text-right">Tayangan</th>
									</tr>
								</thead>
								<tbody>
									{safeData.topDestinations.length ? (
										safeData.topDestinations.map((destination) => (
											<tr
												key={destination.id}
												className="border-b border-gray-50 transition last:border-0 hover:bg-[#F8FAFC]"
											>
												<td className="py-3">
													<Link
														href={`/pengelola/destinasi/${destination.id}`}
														className="flex items-center gap-3"
													>
														<img
															src={
																destination.imageUrl ||
																"/images/placeholder.png"
															}
															alt={destination.name}
															className="h-10 w-12 rounded-xl object-cover"
														/>
														<span className="max-w-[260px] truncate text-sm font-bold text-gray-800">
															{destination.name}
														</span>
													</Link>
												</td>
												<td className="py-3 text-center text-sm font-semibold text-gray-700">
													{destination.reviews
														? Number(
																destination.averageRating ?? 0
															).toFixed(1)
														: "-"}
												</td>
												<td className="py-3 text-center text-sm text-gray-600">
													{destination.reviews ?? 0}
												</td>
												<td className="py-3 text-center text-sm text-gray-600">
													{destination.saved ?? 0}
												</td>
												<td className="py-3 text-right text-sm font-bold text-[#285260]">
													{formatCompact(
														Number(destination.views ?? 0)
													)}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan={5}
												className="py-12 text-center text-sm text-gray-400"
											>
												Belum ada data performa.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-[28px] bg-[#285260] p-5 text-white shadow-sm md:p-6 xl:col-span-5">
						<div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#F29B4B]/20 blur-3xl" />

						<div className="relative">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F7B978]">
										Asisten Pengelolaan
									</p>
									<h2 className="mt-2 text-xl font-extrabold">
										Kesehatan Data
									</h2>
								</div>
								<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-extrabold ring-1 ring-white/10">
									{healthScore || "-"}
								</div>
							</div>

							<div className="mt-4 flex items-center justify-between text-xs">
								<span className="font-semibold text-white/70">
									{recommendation?.health?.label ||
										"Belum tersedia"}
								</span>
								<span className="font-bold text-[#F7B978]">
									{healthScore}/100
								</span>
							</div>

							<div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
								<div
									className="h-full rounded-full bg-[#F29B4B] transition-all"
									style={{ width: `${healthScore}%` }}
								/>
							</div>

							<p className="mt-4 text-sm leading-6 text-white/75">
								{recommendation?.summary ||
									"Rekomendasi sistem belum tersedia."}
							</p>

							{recommendation?.priority && (
								<div className="mt-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
									<div className="flex items-center gap-2">
										<Sparkles className="h-4 w-4 text-[#F7B978]" />
										<p className="text-xs font-bold text-[#F7B978]">
											Prioritas utama
										</p>
									</div>
									<p className="mt-2 text-sm leading-5 text-white/85">
										{recommendation.priority}
									</p>
								</div>
							)}

							{recommendationItems.length > 0 && (
								<div className="mt-4 space-y-2">
									{recommendationItems.map((item, index) => (
										<div
											key={`${item.title}-${index}`}
											className="flex gap-3 rounded-2xl bg-white/[0.07] p-3"
										>
											<div className="mt-0.5">
												<CheckCircle2 className="h-4 w-4 text-[#F7B978]" />
											</div>
											<div>
												<p className="text-xs font-bold text-white">
													{item.title}
												</p>
												<p className="mt-1 text-xs leading-5 text-white/65">
													{item.description}
												</p>
											</div>
										</div>
									))}
								</div>
							)}

							<div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#1F4652] px-3.5 py-3 text-xs text-white/70">
								<Lightbulb className="h-4 w-4 shrink-0 text-[#F7B978]" />
								Insight diperbarui berdasarkan kondisi data terbaru.
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-5 xl:grid-cols-2">
					<RecentDestinations
						destinations={safeData.recentDestinations}
					/>

					<div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm md:p-5">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-lg font-extrabold text-[#1F2937]">
									Ulasan Terbaru
								</h2>
								<p className="mt-1 text-sm text-gray-500">
									Masukan terkini dari wisatawan.
								</p>
							</div>
							<MessageSquareText className="h-5 w-5 text-[#F29B4B]" />
						</div>

						<div className="mt-4 space-y-3">
							{safeData.recentReviews.length ? (
								safeData.recentReviews.map((review) => (
									<div
										key={review.id}
										className="rounded-2xl bg-[#F7F9FC] p-3.5 transition hover:bg-[#F2F5F9]"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="truncate text-sm font-bold text-gray-800">
													{review.destination.name}
												</p>
												<p className="mt-0.5 text-xs text-gray-500">
													{review.user.name} ·{" "}
													{formatDate(review.createdAt)}
												</p>
											</div>
											<div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
												<Star className="h-3.5 w-3.5 fill-current" />
												{review.rating}
											</div>
										</div>
										<p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-600">
											{review.comment ||
												"Wisatawan memberikan rating tanpa komentar."}
										</p>
									</div>
								))
							) : (
								<div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
									Belum ada ulasan.
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}