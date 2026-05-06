"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectRolePage() {
  const router = useRouter();
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

    if (role === "ADMIN") {
      window.location.href = "/admin";
      return;
    }

    if (role === "PENGELOLA") {
      window.location.href = "/pengelola";
      return;
    }

    // null atau WISATAWAN → tampilkan halaman
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
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

      const user = JSON.parse(stored);
      const userId = Number(user.id);

      const res = await fetch("/api/user/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: selectedRole.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menyimpan role");
        return;
      }

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, role: selectedRole.toUpperCase() })
      );

      if (selectedRole === "wisatawan") {
        window.location.href = "/pengunjung";
      } else if (selectedRole === "pengelola") {
        window.location.href = "/pengelola";
      }

    } catch (err) {
      console.error(err);
      alert("Terjadi error, coba lagi");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT = FORM */}
      <div className="flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md text-black">

          {/* Logo mobile only */}
          <div className="flex justify-center mb-6 md:hidden">
            <Image src="/images/logo.svg" alt="logo" width={70} height={60} />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[36px] font-bold">Pilih Peran Anda</h2>
            <p className="text-gray-500 text-sm mt-2">
              Pilih peran untuk melanjutkan ke halaman yang sesuai
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setSelectedRole("wisatawan")}
              className={`w-full rounded-full py-3 text-white text-sm font-semibold transition flex items-center justify-center gap-3 border-2 ${
                selectedRole === "wisatawan"
                  ? "bg-primary border-blue-800"
                  : "bg-primary border-transparent hover:bg-blue-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Wisatawan
            </button>

            <button
              onClick={() => setSelectedRole("pengelola")}
              className={`w-full rounded-full py-3 text-white text-sm font-semibold transition flex items-center justify-center gap-3 border-2 ${
                selectedRole === "pengelola"
                  ? "bg-emerald-600 border-emerald-800"
                  : "bg-emerald-600 border-transparent hover:bg-emerald-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
              Pengelola Wisata
            </button>
          </div>

          <button
            onClick={handleConfirmRole}
            disabled={!selectedRole}
            className={`w-full rounded-full py-3 text-white text-sm font-semibold transition mt-6 ${
              selectedRole
                ? "bg-gray-800 hover:bg-gray-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Pilih Peran Ini
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Pilih peran sesuai dengan kebutuhan Anda
          </p>

        </div>
      </div>

      {/* RIGHT = BANNER */}
      <div className="hidden md:block relative h-screen">
        <Image
          src="/images/banner.png"
          alt="banner"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white flex flex-col items-center gap-4 px-6">
          <Image src="/images/white_logo.svg" alt="logo" width={70} height={60} />
          <h1 className="text-2xl font-bold leading-tight text-center whitespace-nowrap">
            Jelajahi Keindahan Bandung
            <br />
            Bersama Kembara Bandung
          </h1>
        </div>
      </div>

    </main>
  );
}