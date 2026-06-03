"use client";

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

function getActivityText(status: string) {
	if (status === "aktif") {
		return "sudah aktif dan tampil ke pengunjung.";
	}

	if (status === "pending") {
		return "sedang menunggu review admin.";
	}

	if (status === "butuh_perbaikan") {
		return "memerlukan perbaikan data.";
	}

	if (status === "canceled") {
		return "dibatalkan oleh admin.";
	}

	return "memiliki perubahan status terbaru.";
}

function getActivityStyle(status: string) {
	if (status === "aktif") return "bg-green-500";
	if (status === "pending") return "bg-[#F29B4B]";
	if (status === "butuh_perbaikan") return "bg-red-500";
	return "bg-gray-400";
}

export default function DashboardPage() {
	const [data, setData] =
		useState<DashboardData | null>(null);

	const [isLoading, setIsLoading] =
		useState(true);

	useEffect(() => {
		async function fetchDashboard() {
			try {
				const res = await fetch(
					"/api/pengelola/dashboard"
				);

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

					<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
						<div className="h-44 rounded-[24px] bg-white" />
						<div className="h-44 rounded-[24px] bg-white" />
						<div className="h-44 rounded-[24px] bg-white" />
						<div className="h-44 rounded-[24px] bg-white" />
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

	return (
	<div className="min-h-screen bg-[#F5F7FB] p-6">
		<div className="space-y-6">
			<section className="relative overflow-hidden rounded-[28px] bg-[#285260] p-8 text-white shadow-sm">
				<div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F29B4B]/20 blur-3xl" />
				<div className="absolute bottom-0 right-80 h-48 w-48 rounded-full bg-green-400/10 blur-3xl" />

				<div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
					<div className="max-w-2xl">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F29B4B]">
							Kembara Bandung
						</p>

						<h1 className="mt-3 text-4xl font-bold">
							Selamat datang, Pengelola!
						</h1>

						<p className="mt-3 text-sm leading-6 text-white/75">
							Pantau kondisi wisata yang kamu kelola, mulai dari
							destinasi aktif, pengajuan yang sedang direview,
							hingga data yang perlu diperbaiki sebelum tampil ke
							pengunjung.
						</p>
					</div>

					<div className="w-full rounded-[24px] bg-white p-6 text-[#1F2937] shadow-sm lg:w-[360px]">
						<p className="text-sm font-bold text-[#285260]">
							Fokus Hari Ini
						</p>

						<div className="mt-4 flex items-end gap-3">
							<p className="text-6xl font-bold">
								{data.pendingDestinations +
									data.revisionDestinations}
							</p>

							<p className="pb-2 text-sm font-medium text-gray-500">
								wisata
							</p>
						</div>

						<p className="mt-3 text-sm leading-6 text-gray-500">
							masih membutuhkan perhatian, baik karena menunggu
							review admin maupun perlu perbaikan data.
						</p>
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

			<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
				<RecentDestinations
					destinations={data.recentDestinations}
				/>

				<div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="text-xl font-bold text-[#1F2937]">
						Aktivitas Terbaru
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Update terakhir dari wisata yang kamu kelola.
					</p>

					<div className="mt-6 space-y-5">
						{data.recentDestinations.map((destination) => (
							<div key={destination.id} className="flex gap-3">
								<div
									className={`mt-1 h-3 w-3 rounded-full ${getActivityStyle(
										destination.status
									)}`}
								/>

								<div>
									<p className="text-sm font-bold text-gray-900">
										{destination.name}
									</p>

									<p className="mt-1 text-sm leading-6 text-gray-500">
										{getActivityText(destination.status)}
									</p>

									<p className="mt-1 text-xs text-gray-400">
										{new Date(
											destination.createdAt
										).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	</div>
);
}