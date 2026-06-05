"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SelectRolePage() {
	const [loading, setLoading] = useState(true);
	const [selectedRole, setSelectedRole] = useState<string | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("user");

		if (!stored) {
			window.location.href = "/login";
			return;
		}

		const user = JSON.parse(stored);
		const role = user.role;
		const verificationStatus = user.verificationStatus;

		if (role === "ADMIN") {
			window.location.href = "/admin";
			return;
		}

		if (role === "PENGELOLA") {
			if (verificationStatus === "APPROVED") {
				window.location.href = "/pengelola";
			} else {
				window.location.href = "/pengelola/verifikasi";
			}
			return;
		}

		if (role === "WISATAWAN") {
			window.location.href = "/pengunjung";
			return;
		}

		setLoading(false);
	}, []);

	if (loading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-white">
				<p className="text-gray-500">Memuat...</p>
			</main>
		);
	}

	const handleConfirmRole = async () => {
		if (!selectedRole) {
			alert("Pilih peran terlebih dahulu");
			return;
		}

		try {
			const stored = localStorage.getItem("user");

			if (!stored) {
				alert("Session tidak ditemukan. Silakan login ulang.");
				window.location.href = "/login";
				return;
			}

			const currentUser = JSON.parse(stored);
			const userId = Number(currentUser.id);
			const role = selectedRole.toUpperCase();

			const res = await fetch("/api/user/role", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					role,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || "Gagal menyimpan role");
				return;
			}

			const updatedUser = data.user;

			localStorage.setItem(
				"user",
				JSON.stringify({
					...currentUser,
					role: updatedUser.role,
					verificationStatus: updatedUser.verificationStatus,
				})
			);

			if (updatedUser.role === "WISATAWAN") {
				window.location.href = "/pengunjung";
				return;
			}

			if (updatedUser.role === "PENGELOLA") {
				if (updatedUser.verificationStatus === "APPROVED") {
					window.location.href = "/pengelola";
				} else {
					window.location.href = "/pengelola/verifikasi";
				}
			}
		} catch (err) {
			console.error(err);
			alert("Terjadi error, coba lagi");
		}
	};

	return (
		<main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
			<div className="flex items-center justify-center bg-white px-8">
				<div className="w-full max-w-md text-black">
					<div className="mb-6 flex justify-center md:hidden">
						<Image src="/images/logo.svg" alt="logo" width={70} height={60} />
					</div>

					<div className="mb-8 text-center">
						<h2 className="text-[36px] font-bold">Pilih Peran Anda</h2>
						<p className="mt-2 text-sm text-gray-500">
							Pilih peran untuk melanjutkan ke halaman yang sesuai
						</p>
					</div>

					<div className="flex flex-col gap-4">
						<button
							onClick={() => setSelectedRole("wisatawan")}
							className={`flex w-full items-center justify-center gap-3 rounded-full border-2 py-3 text-sm font-semibold text-white transition ${
								selectedRole === "wisatawan"
									? "border-blue-800 bg-primary"
									: "border-transparent bg-primary hover:bg-blue-600"
							}`}
						>
							Wisatawan
						</button>

						<button
							onClick={() => setSelectedRole("pengelola")}
							className={`flex w-full items-center justify-center gap-3 rounded-full border-2 py-3 text-sm font-semibold text-white transition ${
								selectedRole === "pengelola"
									? "border-emerald-800 bg-emerald-600"
									: "border-transparent bg-emerald-600 hover:bg-emerald-700"
							}`}
						>
							Pengelola Wisata
						</button>
					</div>

					<button
						onClick={handleConfirmRole}
						disabled={!selectedRole}
						className={`mt-6 w-full rounded-full py-3 text-sm font-semibold text-white transition ${
							selectedRole
								? "bg-gray-800 hover:bg-gray-900"
								: "cursor-not-allowed bg-gray-400"
						}`}
					>
						Pilih Peran Ini
					</button>

					<p className="mt-4 text-center text-sm text-gray-600">
						Pilih peran sesuai dengan kebutuhan Anda
					</p>
				</div>
			</div>

			<div className="relative hidden h-screen md:block">
				<Image
					src="/images/banner.png"
					alt="banner"
					fill
					className="object-cover"
					unoptimized
				/>
				<div className="absolute inset-0 bg-black/40" />
				<div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 px-6 text-center text-white">
					<Image src="/images/white_logo.svg" alt="logo" width={70} height={60} />
					<h1 className="whitespace-nowrap text-center text-2xl font-bold leading-tight">
						Jelajahi Keindahan Bandung
						<br />
						Bersama Kembara Bandung
					</h1>
				</div>
			</div>
		</main>
	);
}