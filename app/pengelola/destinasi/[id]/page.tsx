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

type AiReasoning = {
	explanation: string;
	potentialIssue: string;
	suggestion: string;
};

type Destination = {
	id: number;
	name: string;
	description: string;
	address: string;
	addressStreet: string | null;
	addressVillage: string | null;
	addressDistrict: string | null;
	addressCity: string | null;
	addressProvince: string | null;
	contact: string | null;
	latitude: number;
	longitude: number;
	imageUrl: string | null;
	status: string;
	createdAt?: string;
	updatedAt?: string;

	openTime: string | null;
	closeTime: string | null;
	ticketPrice: number | null;
	maxPrice: number | null;
	website: string | null;
	visitCount: number;

	categories: {
		category: {
			id: number;
			name: string;
		};
	}[];

	latestAnalysis?: {
		score: number;
		status: string;
		message: string;
		strongestCategory?: CategoryAnalysis | null;
		selectedCategories?: CategoryAnalysis[];
		allCategoryAnalysis?: CategoryAnalysis[];
		reasoning?: AiReasoning;
		reasoningSource?: string;
	} | null;
};

export default function DetailDestinasiPage() {
	const router = useRouter();
	const params = useParams();
	const destinationId = params.id as string;

	const [destination, setDestination] = useState<Destination | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchDestination() {
			try {
				const response = await fetch(
					`/api/pengelola/destinations/${destinationId}`
				);

				if (!response.ok) {
					throw new Error("Gagal mengambil detail wisata.");
				}

				const data = await response.json();
				setDestination(data);
			} catch (error) {
				console.error(error);
				alert("Gagal mengambil detail wisata.");
			} finally {
				setLoading(false);
			}
		}

		if (destinationId) fetchDestination();
	}, [destinationId]);

	if (loading) {
		return (
			<main className="min-h-screen bg-[#F5F7FB] px-8 py-8">
				<div className="rounded-[28px] bg-white p-8 text-gray-500">
					Loading detail wisata...
				</div>
			</main>
		);
	}

	if (!destination) {
		return (
			<main className="min-h-screen bg-[#F5F7FB] px-8 py-8">
				<div className="rounded-[28px] bg-white p-8 text-red-500">
					Data wisata tidak ditemukan.
				</div>
			</main>
		);
	}

	const analysis = destination.latestAnalysis;

	const matchedKeywords = Array.from(
		new Set(
			analysis?.selectedCategories?.flatMap(
				(category) => category.matchedKeywords || []
			) || []
		)
	);

	const hasReasoning =
		Boolean(analysis?.reasoning?.explanation) ||
		Boolean(analysis?.reasoning?.potentialIssue) ||
		Boolean(analysis?.reasoning?.suggestion);

	const isNeedRevision = destination.status.toLowerCase().includes("perbaikan");
	const isPending = destination.status.toLowerCase().includes("pending");
	const isFree = destination.ticketPrice === 0 && destination.maxPrice === 0;

	const formatPrice = (value: number | null) => {
		if (value === null || value === undefined) return "-";

		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(value);
	};

	const formatDate = (date?: string) => {
		if (!date) return "-";

		return new Intl.DateTimeFormat("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		}).format(new Date(date));
	};

	const detailWilayah =
		[
			destination.addressStreet,
			destination.addressVillage,
			destination.addressDistrict,
			destination.addressCity,
			destination.addressProvince,
		]
			.filter(Boolean)
			.join(", ") || "-";

	const googleMapsUrl = `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`;

	async function handleDelete() {
		if (!destination) return;

		if (!confirm("Yakin ingin menghapus wisata ini?")) return;

		try {
			const response = await fetch(
				`/api/pengelola/destinations/${destination.id}`,
				{
					method: "DELETE",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				alert(data.message || "Gagal menghapus wisata.");
				return;
			}

			alert("Wisata berhasil dihapus.");
			router.push("/pengelola/destinasi");
			router.refresh();
		} catch (error) {
			console.error("DELETE ERROR:", error);
			alert("Terjadi kesalahan saat menghapus wisata.");
		}
	}

	return (
		<main className="min-h-screen bg-[#F5F7FB] px-8 py-8">
			<button
				type="button"
				onClick={() => router.push("/pengelola/destinasi")}
				className="mb-5 text-sm font-semibold text-[#285260] hover:underline"
			>
				← Kembali ke Kelola Wisata
			</button>

			<section className="rounded-[32px] bg-white p-6 shadow-sm">
				<div className="grid gap-6 lg:grid-cols-[320px_1fr_auto] lg:items-start">
					{destination.imageUrl ? (
						<img
							src={destination.imageUrl}
							alt={destination.name}
							className="h-[220px] w-full rounded-[24px] object-cover lg:w-[320px]"
						/>
					) : (
						<div className="flex h-[220px] w-full items-center justify-center rounded-[24px] bg-gray-100 text-gray-500 lg:w-[320px]">
							Belum ada gambar
						</div>
					)}

					<div>
						<div className="flex flex-wrap gap-2">
							{destination.categories.map((item) => (
								<span
									key={item.category.id}
									className="rounded-full bg-[#285260]/10 px-4 py-2 text-xs font-bold text-[#285260]"
								>
									{item.category.name}
								</span>
							))}
						</div>

						<h1 className="mt-4 text-4xl font-extrabold text-[#285260]">
							{destination.name}
						</h1>

						<p className="mt-4 max-w-4xl leading-relaxed text-gray-700">
							{destination.description}
						</p>
					</div>

					<span
						className={`rounded-2xl px-5 py-3 text-center text-sm font-bold capitalize ${
							isNeedRevision
								? "bg-red-500 text-white"
								: isPending
								? "bg-yellow-400 text-black"
								: "bg-green-500 text-white"
						}`}
					>
						{destination.status.replaceAll("_", " ")}
					</span>
				</div>
			</section>

			<section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
				<div className="space-y-6">
					<div className="rounded-[32px] bg-white p-6 shadow-sm">
						<h2 className="text-2xl font-extrabold text-[#285260]">
							Lokasi Wisata
						</h2>

						<p className="mt-2 text-sm text-gray-500">
							Lokasi berdasarkan koordinat yang didaftarkan pengelola.
						</p>

						<div className="mt-5 overflow-hidden rounded-[24px]">
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

						<a
							href={googleMapsUrl}
							target="_blank"
							rel="noreferrer"
							className="mt-4 inline-block rounded-2xl bg-[#285260] px-5 py-3 text-sm font-bold text-white hover:opacity-90"
						>
							Buka di Google Maps
						</a>
					</div>

					<div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
						<div className="border-b border-gray-100 px-6 py-5">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F09A43]">
										Evaluasi Kualitas Data
									</p>

									<h2 className="mt-1 text-2xl font-extrabold text-[#285260]">
										Analisis Domain Knowledge
									</h2>

									<p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
										Hasil evaluasi diperoleh dari pencocokan kategori dan keyword
										berbasis domain knowledge. Reasoning AI digunakan untuk menjelaskan
										hasil tersebut dalam bentuk teks.
									</p>
								</div>

								{analysis && (
									<span
										className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${
											analysis.score >= 55
												? "bg-green-50 text-green-700"
												: "bg-orange-50 text-orange-700"
										}`}
									>
										{analysis.score >= 55
											? "Memenuhi batas evaluasi"
											: "Perlu perbaikan"}
									</span>
								)}
							</div>
						</div>

						{analysis ? (
							<div className="p-6">
								<div className="grid gap-5 lg:grid-cols-[220px_1fr]">
									<div className="rounded-[26px] bg-[#285260] p-6 text-white">
										<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F09A43]">
											Skor Evaluasi
										</p>

										<div className="mt-5 flex items-end gap-2">
											<p className="text-6xl font-extrabold leading-none text-[#F09A43]">
												{analysis.score}
											</p>

											<p className="pb-1 text-sm font-semibold text-white/60">
												/100
											</p>
										</div>

										<div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
											<div
												className="h-full rounded-full bg-[#F09A43] transition-all"
												style={{
													width: `${Math.min(Math.max(analysis.score, 0), 100)}%`,
												}}
											/>
										</div>

										<div className="mt-6 border-t border-white/10 pt-5">
											<p className="text-xs font-semibold uppercase tracking-wide text-white/50">
												Status analisis
											</p>

											<p className="mt-1 font-bold capitalize">
												{analysis.status?.replaceAll("_", " ") || "-"}
											</p>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div className="rounded-[22px] border border-gray-100 bg-[#F8FAFB] p-5">
											<p className="text-xs font-bold uppercase tracking-wide text-gray-400">
												Kategori terkuat
											</p>

											<p className="mt-2 text-lg font-extrabold text-[#285260]">
												{analysis.strongestCategory?.categoryName ||
													"Tidak terdeteksi"}
											</p>

											{analysis.strongestCategory?.matchCount !== undefined && (
												<p className="mt-1 text-sm text-gray-500">
													{analysis.strongestCategory.matchCount} keyword cocok
												</p>
											)}
										</div>

										<div className="rounded-[22px] border border-gray-100 bg-[#F8FAFB] p-5">
											<p className="text-xs font-bold uppercase tracking-wide text-gray-400">
												Kategori dipilih
											</p>

											<p className="mt-2 text-lg font-extrabold text-[#285260]">
												{analysis.selectedCategories?.length || 0} kategori
											</p>

											<p className="mt-1 line-clamp-2 text-sm text-gray-500">
												{analysis.selectedCategories
													?.map((category) => category.categoryName)
													.join(", ") || "-"}
											</p>
										</div>

										<div className="rounded-[22px] border border-gray-100 bg-white p-5 sm:col-span-2">
											<p className="text-xs font-bold uppercase tracking-wide text-gray-400">
												Kesimpulan sistem
											</p>

											<p className="mt-2 leading-7 text-gray-700">
												{analysis.message || "-"}
											</p>
										</div>
									</div>
								</div>

								<div className="mt-6">
									<div className="flex items-center justify-between gap-4">
										<div>
											<h3 className="font-extrabold text-[#285260]">
												Keyword yang Terdeteksi
											</h3>

											<p className="mt-1 text-sm text-gray-500">
												Keyword yang ditemukan pada nama dan deskripsi destinasi.
											</p>
										</div>

										<span className="rounded-full bg-[#285260]/10 px-3 py-1 text-xs font-bold text-[#285260]">
											{matchedKeywords.length} keyword
										</span>
									</div>

									<div className="mt-4 flex flex-wrap gap-2">
										{matchedKeywords.length > 0 ? (
											matchedKeywords.map((keyword) => (
												<span
													key={keyword}
													className="rounded-full border border-[#285260]/10 bg-[#285260]/5 px-3 py-1.5 text-xs font-bold text-[#285260]"
												>
													{keyword}
												</span>
											))
										) : (
											<p className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
												Belum ada keyword yang cocok.
											</p>
										)}
									</div>
								</div>

								<div className="mt-8 border-t border-gray-100 pt-6">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F09A43]">
											Reasoning AI
										</p>

										<h3 className="mt-1 text-xl font-extrabold text-[#285260]">
											Penjelasan Hasil Evaluasi
										</h3>

										<p className="mt-1 text-sm leading-6 text-gray-500">
											Penjelasan berikut tidak mengubah skor maupun keputusan
											verifikasi administrator.
										</p>
									</div>

									{hasReasoning && analysis.reasoning ? (
										<div className="mt-5 space-y-4">
											<div className="rounded-[22px] border border-gray-100 bg-[#F8FAFB] p-5">
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#285260] text-sm font-extrabold text-white">
														AI
													</div>

													<p className="font-extrabold text-[#285260]">
														Penjelasan
													</p>
												</div>

												<p className="mt-4 leading-7 text-gray-700">
													{analysis.reasoning.explanation || "-"}
												</p>
											</div>

											<div className="grid gap-4 md:grid-cols-2">
												<div className="rounded-[22px] border border-orange-100 bg-orange-50 p-5">
													<p className="text-sm font-extrabold text-orange-700">
														Catatan Potensial
													</p>

													<p className="mt-3 text-sm leading-6 text-gray-700">
														{analysis.reasoning.potentialIssue || "-"}
													</p>
												</div>

												<div className="rounded-[22px] border border-green-100 bg-green-50 p-5">
													<p className="text-sm font-extrabold text-green-700">
														Saran Perbaikan
													</p>

													<p className="mt-3 text-sm leading-6 text-gray-700">
														{analysis.reasoning.suggestion || "-"}
													</p>
												</div>
											</div>

											{analysis.reasoningSource && (
												<p className="text-right text-xs text-gray-400">
													Sumber reasoning:{" "}
													{analysis.reasoningSource === "llm"
														? "Groq LLM"
														: "Fallback sistem"}
												</p>
											)}
										</div>
									) : (
										<div className="mt-5 rounded-[22px] border border-dashed border-gray-200 bg-gray-50 p-5">
											<p className="font-bold text-gray-600">
												Reasoning belum tersedia
											</p>

											<p className="mt-1 text-sm leading-6 text-gray-500">
												Destinasi ini kemungkinan dibuat sebelum fitur reasoning
												diterapkan. Lakukan edit dan Check AI ulang untuk menghasilkan
												reasoning terbaru.
											</p>
										</div>
									)}
								</div>

								{analysis.allCategoryAnalysis &&
									analysis.allCategoryAnalysis.length > 0 && (
										<details className="mt-8 rounded-[22px] border border-gray-100 bg-white">
											<summary className="cursor-pointer px-5 py-4 font-extrabold text-[#285260]">
												Lihat detail analisis kategori
											</summary>

											<div className="space-y-3 border-t border-gray-100 p-5">
												{analysis.allCategoryAnalysis.map((category) => (
													<div
														key={category.categoryId}
														className="flex flex-col gap-3 rounded-2xl bg-[#F8FAFB] p-4 sm:flex-row sm:items-start sm:justify-between"
													>
														<div>
															<div className="flex flex-wrap items-center gap-2">
																<p className="font-bold text-[#285260]">
																	{category.categoryName}
																</p>

																<span
																	className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
																		category.isSelected
																			? "bg-[#285260]/10 text-[#285260]"
																			: "bg-gray-200 text-gray-500"
																	}`}
																>
																	{category.isSelected
																		? "Dipilih"
																		: "Tidak dipilih"}
																</span>
															</div>

															<div className="mt-2 flex flex-wrap gap-2">
																{category.matchedKeywords.length > 0 ? (
																	category.matchedKeywords.map((keyword) => (
																		<span
																			key={`${category.categoryId}-${keyword}`}
																			className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600"
																		>
																			{keyword}
																		</span>
																	))
																) : (
																	<span className="text-xs text-gray-400">
																		Tidak ada keyword cocok
																	</span>
																)}
															</div>
														</div>

														<p className="shrink-0 text-sm font-bold text-[#F09A43]">
															{category.matchCount} kecocokan
														</p>
													</div>
												))}
											</div>
										</details>
									)}
							</div>
						) : (
							<div className="p-6">
								<div className="rounded-[22px] border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
									<p className="font-bold text-gray-600">
										Belum ada hasil analisis AI
									</p>

									<p className="mt-1 text-sm text-gray-500">
										Lakukan Check AI dari halaman edit destinasi.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				<aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
					<div className="rounded-[32px] bg-white p-6 shadow-sm">
						<h2 className="text-2xl font-extrabold text-[#285260]">
							Informasi Wisata
						</h2>

						<div className="mt-6 space-y-5 text-sm">
							<div>
								<p className="font-bold text-gray-500">Alamat Lengkap</p>
								<p className="mt-1 leading-relaxed text-gray-700">
									{destination.address}
								</p>
							</div>

							<div>
								<p className="font-bold text-gray-500">Detail Wilayah</p>
								<p className="mt-1 leading-relaxed text-gray-700">
									{detailWilayah}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-bold text-gray-500">Jam Buka</p>
									<p className="mt-1 text-gray-700">
										{destination.openTime || "-"}
									</p>
								</div>

								<div>
									<p className="font-bold text-gray-500">Jam Tutup</p>
									<p className="mt-1 text-gray-700">
										{destination.closeTime || "-"}
									</p>
								</div>
							</div>

							<div>
								<p className="font-bold text-gray-500">Harga Tiket</p>
								<p className="mt-1 text-gray-700">
									{isFree
										? "Gratis"
										: `${formatPrice(destination.ticketPrice)} - ${formatPrice(
												destination.maxPrice
										  )}`}
								</p>
							</div>

							<div>
								<p className="font-bold text-gray-500">Website</p>
								{destination.website ? (
									<a
										href={destination.website}
										target="_blank"
										rel="noreferrer"
										className="mt-1 block break-all font-semibold text-[#285260] hover:underline"
									>
										{destination.website}
									</a>
								) : (
									<p className="mt-1 text-gray-700">-</p>
								)}
							</div>

							<div>
								<p className="font-bold text-gray-500">Kontak</p>
								<p className="mt-1 text-gray-700">
									{destination.contact || "-"}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-bold text-gray-500">Kunjungan</p>
									<p className="mt-1 text-gray-700">
										{destination.visitCount ?? 0}
									</p>
								</div>

								<div>
									<p className="font-bold text-gray-500">Dibuat</p>
									<p className="mt-1 text-gray-700">
										{formatDate(destination.createdAt)}
									</p>
								</div>
							</div>

							<div>
								<p className="font-bold text-gray-500">Terakhir Diperbarui</p>
								<p className="mt-1 text-gray-700">
									{formatDate(destination.updatedAt)}
								</p>
							</div>

							<div>
								<p className="font-bold text-gray-500">Koordinat</p>
								<p className="mt-1 break-all text-gray-700">
									{destination.latitude}, {destination.longitude}
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-[32px] bg-white p-6 shadow-sm">
						<h2 className="text-2xl font-extrabold text-[#285260]">Aksi</h2>

						<div className="mt-5 space-y-3">
							<button
								type="button"
								onClick={() =>
									router.push(`/pengelola/destinasi/${destination.id}/edit`)
								}
								className="w-full rounded-2xl bg-[#285260] px-5 py-3 font-bold text-white hover:opacity-90"
							>
								Edit Wisata
							</button>

							<button
								type="button"
								onClick={handleDelete}
								className="w-full rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-500 hover:bg-red-200"
							>
								Hapus Wisata
							</button>
						</div>
					</div>
				</aside>
			</section>
		</main>
	);
}