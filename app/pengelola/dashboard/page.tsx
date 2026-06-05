"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import StatCard from "@/components/dashboard/stat-card";
import RecentDestinations from "@/components/dashboard/recent-destinations";

type Destination = {
	id: number;
	name: string;
	status: string;
	createdAt: string;
	imageUrl?: string | null;
};

type DashboardData = {
	totalDestinations: number;
	activeDestinations: number;
	pendingDestinations: number;
	revisionDestinations: number;
	recentDestinations: Destination[];
};

function formatDate(date: string) {
	return new Date(date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function DashboardPage() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchDashboard() {
			try {
				const res = await fetch("/api/pengelola/dashboard");
				const result = await res.json();

				setData(result);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchDashboard();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F5F7FB] p-6">
				<div className="animate-pulse space-y-6">
					<div className="h-40 rounded-[28px] bg-white" />

					<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
						<div className="h-36 rounded-[24px] bg-white" />
						<div className="h-36 rounded-[24px] bg-white" />
						<div className="h-36 rounded-[24px] bg-white" />
					</div>

					<div className="h-96 rounded-[24px] bg-white" />
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-[#F5F7FB] p-6">
				<div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-red-600">
					Gagal memuat dashboard.
				</div>
			</div>
		);
	}

	const attentionTotal =
		data.pendingDestinations + data.revisionDestinations;

	const revisionDestination = data.recentDestinations.find(
		(destination) => destination.status === "butuh_perbaikan"
	);

	return (
		<div className="min-h-screen bg-[#F5F7FB] p-6">
			<div className="space-y-6">
				<section className="relative overflow-hidden rounded-[28px] bg-[#285260] p-8 text-white shadow-sm">
					<div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F29B4B]/20 blur-3xl" />
					<div className="absolute bottom-0 right-80 h-48 w-48 rounded-full bg-green-400/10 blur-3xl" />

					<div className="relative grid gap-8 xl:grid-cols-[1fr_360px] xl:items-center">
						<div>
							<p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F29B4B]">
								Kembara Bandung
							</p>

							<h1 className="mt-3 text-4xl font-bold">
								Ringkasan Hari Ini
							</h1>

							<p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
								Pantau status destinasi wisata yang kamu kelola,
								mulai dari data aktif, pengajuan yang menunggu
								review admin, hingga data yang perlu diperbaiki.
							</p>

							<div className="mt-6 flex flex-wrap gap-3">
								<Link
									href="/pengelola/destinasi/tambah"
									className="rounded-full bg-[#F29B4B] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
								>
									+ Tambah Wisata
								</Link>

								<Link
									href="/pengelola/destinasi"
									className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#285260] transition hover:bg-gray-100"
								>
									Kelola Wisata
								</Link>
							</div>
						</div>

						<div className="rounded-[24px] bg-white p-6 text-[#1F2937] shadow-sm">
							<p className="text-sm font-bold text-[#285260]">
								Fokus Hari Ini
							</p>

							<div className="mt-4 flex items-end gap-3">
								<p className="text-6xl font-bold">
									{attentionTotal}
								</p>

								<p className="pb-2 text-sm font-medium text-gray-500">
									wisata
								</p>
							</div>

							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between rounded-2xl bg-yellow-50 px-4 py-3">
									<span className="text-sm font-semibold text-yellow-800">
										Menunggu Review
									</span>
									<span className="text-lg font-bold text-yellow-700">
										{data.pendingDestinations}
									</span>
								</div>

								<div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
									<span className="text-sm font-semibold text-red-700">
										Butuh Perbaikan
									</span>
									<span className="text-lg font-bold text-red-600">
										{data.revisionDestinations}
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-5 md:grid-cols-3">
					<StatCard
						title="Wisata Aktif"
						value={data.activeDestinations}
						description="Destinasi yang sudah tampil ke pengunjung."
						variant="active"
					/>

					<StatCard
						title="Menunggu Review"
						value={data.pendingDestinations}
						description="Destinasi yang sedang divalidasi admin."
						variant="pending"
					/>

					<StatCard
						title="Butuh Perbaikan"
						value={data.revisionDestinations}
						description="Destinasi yang perlu direvisi pengelola."
						variant="revision"
					/>
				</section>

				{data.revisionDestinations > 0 && (
					<section className="rounded-[24px] border border-red-100 bg-red-50 p-6 shadow-sm">
						<div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
							<div>
								<p className="text-sm font-bold uppercase tracking-[0.18em] text-red-500">
									Perlu Tindakan
								</p>

								<h2 className="mt-2 text-2xl font-extrabold text-red-700">
									{data.revisionDestinations} destinasi perlu
									diperbaiki
								</h2>

								<p className="mt-2 text-sm leading-6 text-red-700/80">
									Admin mengembalikan beberapa data wisata
									untuk diperbaiki sebelum dapat diajukan ulang.
								</p>

								{revisionDestination && (
									<p className="mt-3 text-sm font-semibold text-red-700">
										Contoh: {revisionDestination.name}
									</p>
								)}
							</div>

							<Link
								href="/pengelola/destinasi"
								className="rounded-full bg-red-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-red-600"
							>
								Lihat Perbaikan
							</Link>
						</div>
					</section>
				)}

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
					<RecentDestinations
						destinations={data.recentDestinations}
					/>

					<div className="space-y-6">
						<div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
							<p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F29B4B]">
								AI Insight
							</p>

							<h2 className="mt-2 text-2xl font-extrabold text-[#285260]">
								Insight Sistem
							</h2>

							<p className="mt-3 text-sm leading-6 text-gray-500">
								Sebagian besar destinasi yang kamu kelola sedang
								berada pada tahap review admin. Sistem AI
								digunakan sebagai validasi awal sebelum data
								diajukan ke admin. (hardcoded untuk demo)
							</p>

							<div className="mt-5 grid grid-cols-2 gap-3">
								<div className="rounded-2xl bg-[#F5F7FB] p-4">
									<p className="text-xs font-semibold text-gray-500">
										Total Wisata
									</p>
									<p className="mt-2 text-3xl font-extrabold text-[#285260]">
										{data.totalDestinations}
									</p>
								</div>

								<div className="rounded-2xl bg-yellow-50 p-4">
									<p className="text-xs font-semibold text-yellow-700">
										Menunggu Review
									</p>
									<p className="mt-2 text-3xl font-extrabold text-yellow-700">
										{data.pendingDestinations}
									</p>
								</div>

								<div className="rounded-2xl bg-red-50 p-4">
									<p className="text-xs font-semibold text-red-700">
										Perlu Perbaikan
									</p>
									<p className="mt-2 text-3xl font-extrabold text-red-600">
										{data.revisionDestinations}
									</p>
								</div>

								<div className="rounded-2xl bg-green-50 p-4">
									<p className="text-xs font-semibold text-green-700">
										Aktif
									</p>
									<p className="mt-2 text-3xl font-extrabold text-green-600">
										{data.activeDestinations}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-[24px] bg-[#285260] p-6 text-white shadow-sm">
							<p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F29B4B]">
								Rekomendasi Sistem
							</p>

							<h2 className="mt-2 text-2xl font-extrabold">
								Prioritas Pengelolaan
							</h2>

							<div className="mt-5 space-y-4">
								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-sm font-bold">
										1. Periksa status revisi
									</p>
									<p className="mt-1 text-sm leading-6 text-white/70">
										Destinasi berstatus butuh perbaikan perlu
										diperbarui sesuai catatan admin.
									</p>
								</div>

								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-sm font-bold">
										2. Pantau pengajuan pending
									</p>
									<p className="mt-1 text-sm leading-6 text-white/70">
										Destinasi pending sedang menunggu validasi
										admin sebelum tampil ke pengunjung.
									</p>
								</div>

								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-sm font-bold">
										3. Lengkapi informasi wisata
									</p>
									<p className="mt-1 text-sm leading-6 text-white/70">
										Pastikan nama, kategori, deskripsi, kontak,
										alamat, dan gambar wisata sudah sesuai.
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
							<h2 className="text-xl font-bold text-[#1F2937]">
								Update Terakhir
							</h2>

							<p className="mt-1 text-sm text-gray-500">
								Destinasi terbaru yang masuk ke sistem.
							</p>

							<div className="mt-5 space-y-4">
								{data.recentDestinations
									.slice(0, 3)
									.map((destination) => (
										<div
											key={destination.id}
											className="rounded-2xl bg-[#F5F7FB] p-4"
										>
											<p className="text-sm font-bold text-gray-900">
												{destination.name}
											</p>

											<p className="mt-1 text-xs capitalize text-gray-500">
												{destination.status.replaceAll(
													"_",
													" "
												)}
											</p>

											<p className="mt-1 text-xs text-gray-400">
												{formatDate(
													destination.createdAt
												)}
											</p>
										</div>
									))}
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}