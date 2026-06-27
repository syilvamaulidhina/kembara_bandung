"use client";
// app/pengunjung/profil/page.tsx
// UPDATE: sesuai schema User (name required, ada gender/domisili/photo)

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Pencil,
  Save,
  X,
  LogOut,
  Bookmark,
  Star,
  MapPin,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  User,
  MapPinned,
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import DestinationCard from "../components/DestinationCard";

interface SavedDest {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  distance?: number;
  averageRating?: number | null;
  reviewCount?: number;
  isSaved: boolean;
  visitCount: number;
  categories: { category: { name: string } }[];
}

interface UserStats {
  savedCount: number;
  reviewCount: number;
  itineraryCount: number;
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, loading: userLoading, logout } = useLocalUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [savedDests, setSavedDests] = useState<SavedDest[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    savedCount: 0,
    reviewCount: 0,
    itineraryCount: 0,
  });

  // Redirect kalau tidak login — tunggu loading selesai dulu
  useEffect(() => {
    if (!userLoading && user === null) {
      router.replace("/auth/login?redirect=/pengunjung/profil");
    }
  }, [user, userLoading, router]);

  const fetchSavedAndStats = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    try {
      const [savedRes, statsRes] = await Promise.all([
        fetch(`/api/pengunjung/saved?userId=${user.id}&limit=6`),
        fetch(`/api/pengunjung/user/stats?userId=${user.id}`),
      ]);

      const savedJson = await savedRes.json();
      if (savedJson.success) setSavedDests(savedJson.data);

      const statsJson = await statsRes.json();
      if (statsJson.success) setStats(statsJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSaved(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedAndStats();
  }, [fetchSavedAndStats]);

  const handleStartEdit = () => {
    setEditName(user?.name || "");
    setSaveError("");
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      setSaveError("Nama tidak boleh kosong.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/pengunjung/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, name: editName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.message || "Gagal menyimpan.");
        return;
      }
      setSaveSuccess(true);
      setIsEditing(false);
      // Reload halaman agar useLocalUser fetch ulang dari /api/user/me
      router.refresh();
    } catch {
      setSaveError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnsave = async (id: number) => {
    if (!user) return;
    try {
      await fetch(
        `/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`,
        { method: "DELETE" }
      );
      setSavedDests((prev) => prev.filter((d) => d.id !== id));
      setStats((s) => ({ ...s, savedCount: Math.max(0, s.savedCount - 1) }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  // Kalau belum login (sudah redirect, ini hanya fallback)
  if (!user) return null;

  // Inisial avatar — name di schema required jadi pasti ada
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  // Label role yang friendly
  const roleLabel =
    user.role === "WISATAWAN" || user.role === null
      ? "Wisatawan"
      : user.role === "ADMIN"
        ? "Admin"
        : user.role === "PENGELOLA"
          ? "Pengelola"
          : user.role ?? "Wisatawan";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/pengunjung" className="hover:text-[#006837]">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Profil</span>
      </div>

      {/* Card Profil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar — pakai photo kalau ada, fallback inisial */}
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#006837] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
              {initials}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={60}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                />
                {saveError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {saveError}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#006837] text-white rounded-lg text-sm font-medium hover:bg-[#005229] transition-colors disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    <X size={14} />
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {/* Badge role */}
                  <span className="px-2 py-0.5 rounded-full bg-[#006837]/10 text-[#006837] text-xs font-semibold">
                    {roleLabel}
                  </span>
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Edit nama"
                  >
                    <Pencil size={14} />
                  </button>
                </div>

                {saveSuccess && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <Check size={12} />
                    Nama berhasil diperbarui
                  </p>
                )}

                {/* Email */}
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                  <Mail size={13} />
                  <span className="truncate">{user.email}</span>
                </div>

                {/* Domisili — kalau ada di schema dan dikembalikan API */}
                {user.domisili && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                    <MapPinned size={12} />
                    <span>{user.domisili}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Tombol Keluar */}
          {!isEditing && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors shrink-0"
            >
              <LogOut size={15} />
              Keluar
            </button>
          )}
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-[#006837]">
            {stats.savedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Bookmark size={11} />
            Disimpan
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-[#f97316]">
            {stats.reviewCount}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Star size={11} />
            Ulasan
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-[#0284c7]">
            {stats.itineraryCount}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <MapPin size={11} />
            Itinerary
          </p>
        </div>
      </div>

      {/* Destinasi Tersimpan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Bookmark size={16} className="text-[#006837]" />
            Destinasi Tersimpan
          </h2>
          {stats.savedCount > 6 && (
            <Link
              href="/pengunjung/tersimpan"
              className="text-sm text-[#006837] hover:underline flex items-center gap-1"
            >
              Lihat semua <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {loadingSaved ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : savedDests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bookmark size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada destinasi tersimpan.</p>
            <Link
              href="/pengunjung/kategori"
              className="text-[#006837] text-sm underline mt-2 inline-block"
            >
              Jelajahi destinasi →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {savedDests.map((dest) => (
              <DestinationCard
                key={dest.id}
                {...dest}
                isSaved={true}
                onSaveToggle={(id) => handleUnsave(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
