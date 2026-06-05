"use client";

import { useEffect, useState } from "react";

type User = {
	id: number;
	name?: string;
	email?: string;
	role?: string;
	verificationStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
	verificationDocument?: string | null;
	rejectionReason?: string | null;
};

export default function VerifikasiPage() {
	const [user, setUser] = useState<User | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("user");

		if (!stored) {
			window.location.href = "/login";
			return;
		}

		const parsedUser = JSON.parse(stored);

		if (parsedUser.role !== "PENGELOLA") {
			window.location.href = "/unauthorized";
			return;
		}

		if (parsedUser.verificationStatus === "APPROVED") {
			window.location.href = "/pengelola/dashboard";
			return;
		}

		setUser(parsedUser);
		setLoading(false);
	}, []);

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const res = await fetch("/api/user/me");

				if (!res.ok) return;

				const data = await res.json();
				const latestUser = data.user;

				localStorage.setItem("user", JSON.stringify(latestUser));
				setUser(latestUser);

				if (latestUser.verificationStatus === "APPROVED") {
					window.location.href = "/pengelola/dashboard";
				}
			} catch (error) {
				console.error(error);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) return;

		if (!file) {
			alert("Pilih dokumen terlebih dahulu");
			return;
		}

		const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

		if (!allowedTypes.includes(file.type)) {
			alert("Format file harus PDF, JPG, atau PNG");
			return;
		}

		try {
			setSubmitting(true);

			const formData = new FormData();
			formData.append("userId", String(user.id));
			formData.append("file", file);

			const res = await fetch("/api/pengelola/verifikasi", {
				method: "PATCH",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || "Gagal upload dokumen");
				return;
			}

			localStorage.setItem("user", JSON.stringify(data.user));
			setUser(data.user);
			setFile(null);

			alert("Dokumen berhasil dikirim. Mohon tunggu verifikasi admin.");
		} catch (error) {
			console.error(error);
			alert("Terjadi kesalahan saat upload dokumen");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-slate-50">
				<p className="text-sm text-gray-500">Memuat...</p>
			</main>
		);
	}

	const isPending = user?.verificationStatus === "PENDING";
	const isRejected = user?.verificationStatus === "REJECTED";
	const hasDocument = Boolean(user?.verificationDocument);

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
			<section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Verifikasi Akun Pengelola
					</h1>
					<p className="mt-2 text-sm text-gray-500">
						Unggah bukti pengelolaan untuk melanjutkan akses ke dashboard
						pengelola.
					</p>
				</div>

				{isPending && hasDocument && (
					<div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
						<p className="text-3xl">⏳</p>
						<h2 className="mt-3 text-lg font-semibold text-amber-800">
							Pengajuan Sedang Ditinjau
						</h2>
						<p className="mt-2 text-sm text-amber-700">
							Dokumen Anda telah diterima dan sedang diperiksa oleh admin.
						</p>
						<a
							href={user?.verificationDocument || "#"}
							target="_blank"
							className="mt-4 inline-block text-sm font-semibold text-amber-800 underline"
						>
							Lihat dokumen yang diunggah
						</a>
					</div>
				)}

				{isRejected && (
					<div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
						<h2 className="text-lg font-semibold text-red-700">
							Pengajuan Ditolak
						</h2>
						<p className="mt-2 text-sm text-red-600">
							{user?.rejectionReason ||
								"Dokumen tidak dapat diverifikasi. Silakan unggah ulang dokumen yang sesuai."}
						</p>
					</div>
				)}

				{(!hasDocument || isRejected) && (
					<form onSubmit={handleUpload} className="space-y-5">
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700">
								Upload Surat Izin Usaha / Bukti Pengelolaan
							</label>
							<input
								type="file"
								accept=".pdf,.jpg,.jpeg,.png"
								onChange={(e) => setFile(e.target.files?.[0] || null)}
								className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700"
							/>
							<p className="mt-2 text-xs text-gray-500">
								Format yang diterima: PDF, JPG, PNG.
							</p>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-100"
						>
							{submitting ? "Mengirim..." : "Kirim Pengajuan"}
						</button>
					</form>
				)}
			</section>
		</main>
	);
}