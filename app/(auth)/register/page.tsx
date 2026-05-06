"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { [key: string]: string } = {};

    if (!form.name) newErrors.name = "Nama wajib diisi";
    if (!form.email) newErrors.email = "Email wajib diisi";
    if (!form.password) newErrors.password = "Password wajib diisi";
    if (!form.confirmPassword) newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password tidak sama";
    if (!form.terms) newErrors.terms = "Harus disetujui";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal register");
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Langsung ke select-role
      window.location.href = "/select-role";

    } catch (err) {
      console.error(err);
      alert("Terjadi error, coba lagi");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT = FORM */}
      <div className="flex items-center justify-center bg-white px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md text-black">

          {/* Logo mobile only */}
          <div className="flex justify-center mb-6 md:hidden">
            <Image src="/images/logo.svg" alt="logo" width={70} height={60} />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[36px] font-bold">Daftar</h2>
            <p className="text-gray-500 text-sm mt-2">
              Buat akun untuk mulai menjelajah Bandung
            </p>
          </div>

          {/* Nama */}
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-4">{errors.name}</p>
            )}
          </div>

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
          <div className="mb-4 relative">
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

          {/* Konfirmasi Password */}
          <div className="mb-4 relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi password"
              className="w-full rounded-full border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-4">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-600">
                Setuju dengan syarat & ketentuan
              </span>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1 ml-6">{errors.terms}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-white text-sm font-semibold hover:bg-blue-600 transition"
          >
            Daftar
          </button>

          <p className="mt-5 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a href="/login" className="text-primary font-semibold">
              Masuk
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