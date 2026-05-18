"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DestinationListMap from "@/components/destination-list-map";

type CategoryAnalysis = {
	categoryId: number;
	categoryName: string;
	isSelected: boolean;
	matchedKeywords: string[];
	matchCount: number;
};

type Destination = {
	id: number;
	name: string;
	description: string;
	address: string;
	contact: string | null;
	latitude: number;
	longitude: number;
	imageUrl: string | null;
	status: string;
	adminFeedback?: string | null;
	createdAt?: string;

	categories: {
		category: {
			id: number;
			name: string;
		};
	}[];

	latestAnalysis?: {
		score: number;
		status: string;
		strongestCategory: CategoryAnalysis;
		selectedCategories: CategoryAnalysis[];
	} | null;
};

export default function DetailDestinasiPage() {
	const router = useRouter();
	const params = useParams();

	const destinationId = params.id as string;

	const [destination, setDestination] =
		useState<Destination | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchDestination() {
			try {
				const res = await fetch(
					`/api/pengelola/destinations/${destinationId}`
				);

				if (!res.ok) {
					throw new Error("Gagal mengambil detail wisata.");
				}

				const data = await res.json();
				setDestination(data);
			} catch (error) {
				console.error(error);
				alert("Gagal mengambil detail wisata.");
			} finally {
				setLoading(false);
			}
		}

		if (destinationId) {
			fetchDestination();
		}
	}, [destinationId]);

	if (loading) {
		return (
			<main className="min-h-screen bg-[#F5F7FB] px-10 py-8">
				<div className="rounded-[28px] bg-white p-8 text-gray-500">
					Loading detail wisata...
				</div>
			</main>
		);
	}

	if (!destination) {
		return (
			<main className="min-h-screen bg-[#F5F7FB] px-10 py-8">
				<div className="rounded-[28px] bg-white p-8 text-red-500">
					Data wisata tidak ditemukan.
				</div>
			</main>
		);
	}

	const analysis = destination.latestAnalysis;

	const isNeedRevision = destination.status
		.toLowerCase()
		.includes("perbaikan");

	const isPending = destination.status
		.toLowerCase()
		.includes("pending");

	return (
		<>
			<header className="border-b border-gray-200 bg-white">
				<div className="w-full px-10 py-8">
					<button
						type="button"
						onClick={() => router.push("/pengelola/destinasi")}
						className="mb-4 text-sm font-semibold text-[#285260] hover:underline"
					>
						← Kembali ke Kelola Wisata
					</button>

					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<h1 className="text-4xl font-extrabold text-[#285260]">
								{destination.name}
							</h1>

							<div className="mt-3 flex flex-wrap gap-2">
								{destination.categories.map((item) => (
									<span
										key={item.category.id}
										className="rounded-full bg-[#285260]/10 px-4 py-2 text-xs font-semibold text-[#285260]"
									>
										{item.category.name}
									</span>
								))}

								<span className="rounded-full bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700">
									AI Reviewed
								</span>
							</div>
						</div>

						<div
							className={`rounded-2xl px-5 py-3 text-sm font-bold capitalize ${
								isNeedRevision
									? "bg-red-500 text-white"
									: isPending
									? "bg-yellow-400 text-black"
									: "bg-green-500 text-white"
							}`}
						>
							{destination.status.replaceAll("_", " ")}
						</div>
					</div>
				</div>
			</header>

			<main className="min-h-screen bg-[#F5F7FB] px-10 py-8">
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
					{/* LEFT */}
					<div className="space-y-6">
						{/* HERO */}
						<div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm">
							{destination.imageUrl ? (
								<img
									src={destination.imageUrl}
									alt={destination.name}
									className="aspect-[16/7] w-full object-cover"
								/>
							) : (
								<div className="flex aspect-[16/7] w-full items-center justify-center bg-gray-100 text-gray-500">
									Belum ada gambar
								</div>
							)}

							<div className="p-6">
								<h2 className="text-2xl font-extrabold text-[#285260]">
									Deskripsi Wisata
								</h2>

								<p className="mt-4 leading-relaxed text-gray-700">
									{destination.description}
								</p>
							</div>
						</div>

						{/* MAP */}
						<div className="rounded-[32px] border border-gray-200 bg-white p-5 shadow-sm">
							<h2 className="text-2xl font-extrabold text-[#285260]">
								Lokasi Wisata
							</h2>

							<p className="mt-2 text-sm text-gray-500">
								Lokasi wisata berdasarkan koordinat yang telah
								didaftarkan.
							</p>

							<div className="mt-5 overflow-hidden rounded-3xl">
								<DestinationListMap
									destinations={[
										{
											id: destination.id,
											name: destination.name,
											address: destination.address,
											latitude: destination.latitude,
											longitude: destination.longitude,
										},
									]}
								/>
							</div>
						</div>

						{/* ADMIN FEEDBACK */}
						{destination.adminFeedback && (
							<div className="rounded-[32px] border border-red-100 bg-white p-6 shadow-sm">
								<p className="text-sm font-bold uppercase tracking-wide text-red-500">
									Feedback Admin
								</p>

								<p className="mt-3 leading-relaxed text-gray-700">
									{destination.adminFeedback}
								</p>
							</div>
						)}
					</div>

					{/* RIGHT */}
					<aside className="space-y-6">
						{/* AI ANALYSIS */}
						<div className="rounded-[32px] bg-[#285260] p-6 text-white shadow-sm">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm font-semibold uppercase tracking-wide text-[#F09A43]">
										AI Analysis
									</p>

									<h2 className="mt-2 text-2xl font-extrabold">
										Analisis Sistem
									</h2>
								</div>

								{analysis && (
									<div className="text-right">
										<p className="text-3xl font-extrabold text-[#F09A43]">
											{analysis.score}
										</p>

										<p className="text-xs font-semibold text-white/70">
											/100
										</p>
									</div>
								)}
							</div>

							{analysis ? (
								<>
									<div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/10">
										<div
											className="h-full rounded-full bg-[#F09A43]"
											style={{
												width: `${analysis.score}%`,
											}}
										/>
									</div>

									<div className="mt-6 space-y-5">
										<div>
											<p className="text-sm font-semibold text-white/70">
												Kategori Terdeteksi Terkuat
											</p>

											<p className="mt-1 text-lg font-bold text-[#F09A43]">
												{
													analysis.strongestCategory
														.categoryName
												}
											</p>
										</div>

										<div>
											<p className="text-sm font-semibold text-white/70">
												Keyword Match
											</p>

											<div className="mt-3 flex flex-wrap gap-2">
												{analysis.selectedCategories.flatMap(
													(category) =>
														category.matchedKeywords.map(
															(keyword) => (
																<span
																	key={keyword}
																	className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"
																>
																	{keyword}
																</span>
															)
														)
												)}
											</div>
										</div>
									</div>
								</>
							) : (
								<div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
									Belum ada hasil analisis AI.
								</div>
							)}
						</div>

						{/* INFO */}
						<div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
							<h2 className="text-2xl font-extrabold text-[#285260]">
								Informasi Wisata
							</h2>

							<div className="mt-6 space-y-5">
								<div>
									<p className="text-sm font-semibold text-gray-500">
										Alamat
									</p>

									<p className="mt-1 leading-relaxed text-gray-700">
										{destination.address}
									</p>
								</div>

								<div>
									<p className="text-sm font-semibold text-gray-500">
										Kontak
									</p>

									<p className="mt-1 text-gray-700">
										{destination.contact || "-"}
									</p>
								</div>

								<div>
									<p className="text-sm font-semibold text-gray-500">
										Latitude
									</p>

									<p className="mt-1 text-gray-700">
										{destination.latitude}
									</p>
								</div>

								<div>
									<p className="text-sm font-semibold text-gray-500">
										Longitude
									</p>

									<p className="mt-1 text-gray-700">
										{destination.longitude}
									</p>
								</div>
							</div>
						</div>

						{/* ACTION */}
						<div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
							<h2 className="text-2xl font-extrabold text-[#285260]">
								Aksi
							</h2>

							<div className="mt-5 space-y-3">
								<button
									type="button"
									onClick={() =>
										router.push(
											`/pengelola/destinasi/${destination.id}/edit`
										)
									}
									className="w-full rounded-2xl bg-[#285260] px-5 py-3 font-semibold text-white hover:opacity-90"
								>
									Edit Wisata
								</button>

								<button
									type="button"
									className="w-full rounded-2xl bg-red-100 px-5 py-3 font-semibold text-red-500 hover:bg-red-200"
								>
									Hapus Wisata
								</button>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</>
	);
}