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
		strongestCategory?: CategoryAnalysis;
		selectedCategories?: CategoryAnalysis[];
		allCategoryAnalysis?: CategoryAnalysis[];
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

					<div className="rounded-[32px] bg-white p-6 shadow-sm">
						<h2 className="text-2xl font-extrabold text-[#285260]">
							Analisis AI
						</h2>

						{analysis ? (
							<div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr]">
								<div className="rounded-[24px] bg-[#285260] p-5 text-white">
									<p className="text-sm font-bold uppercase text-[#F09A43]">
										Skor AI
									</p>

									<p className="mt-3 text-5xl font-extrabold text-[#F09A43]">
										{analysis.score}
									</p>

									<p className="text-sm font-semibold text-white/70">/100</p>

									<div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/15">
										<div
											className="h-full rounded-full bg-[#F09A43]"
											style={{ width: `${analysis.score}%` }}
										/>
									</div>
								</div>

								<div className="space-y-5">
									<div>
										<p className="text-sm font-bold text-gray-500">
											Status Analisis
										</p>
										<p className="mt-1 font-bold capitalize text-[#285260]">
											{analysis.status}
										</p>
									</div>

									<div>
										<p className="text-sm font-bold text-gray-500">
											Kategori Terdeteksi Terkuat
										</p>
										<p className="mt-1 font-bold text-[#F09A43]">
											{analysis.strongestCategory?.categoryName || "-"}
										</p>
									</div>

									<div>
										<p className="text-sm font-bold text-gray-500">
											Pesan Analisis
										</p>
										<p className="mt-1 leading-relaxed text-gray-700">
											{analysis.message || "-"}
										</p>
									</div>

									<div>
										<p className="text-sm font-bold text-gray-500">
											Keyword Cocok
										</p>

										<div className="mt-2 flex flex-wrap gap-2">
											{analysis.selectedCategories
												?.flatMap((category) =>
													category.matchedKeywords.map((keyword) => ({
														keyword,
														categoryId: category.categoryId,
													}))
												)
												.map((item) => (
													<span
														key={`${item.categoryId}-${item.keyword}`}
														className="rounded-full bg-[#285260]/10 px-3 py-1 text-xs font-bold text-[#285260]"
													>
														{item.keyword}
													</span>
												))}
										</div>
									</div>
								</div>
							</div>
						) : (
							<p className="mt-4 text-gray-500">Belum ada hasil analisis AI.</p>
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