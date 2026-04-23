"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { [key: string]: string } = {};

    if (!form.email) newErrors.email = "Email wajib diisi";
    if (!form.password) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Gagal login" });
        return;
      }

      const role = data.user.role;

      // Simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect berdasarkan role
      if (role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (role === "PENGELOLA") {
        window.location.href = "/pengelola";
      } else if (role === "WISATAWAN") {
        window.location.href = "/pengunjung";
      } else {
        // role null → belum pilih role
        window.location.href = "/select-role";
      }

    } catch (err) {
      console.error(err);
      setErrors({ general: "Terjadi error, coba lagi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT = FORM */}
      <div className="flex items-center justify-center bg-white px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md text-black">

          {/* Logo mobile only */}
          <div className="flex justify-center mb-6 md:hidden">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={70}
              height={60}
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[36px] font-bold">Login</h2>
            <p className="text-gray-500 text-sm mt-2">
              Selamat datang kembali di Kembara Bandung
            </p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl text-center">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-full border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>
            )}
          </div>

          {/* Lupa Password */}
          <div className="mb-6 flex justify-end">
            <a href="/forgot-password" className="text-sm text-primary font-semibold hover:underline">
              Lupa Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/register" className="text-primary font-semibold">
              Daftar
            </a>
          </p>

        </form>
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
          <Image
            src="/images/white_logo.svg"
            alt="logo"
            width={70}
            height={60}
          />
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