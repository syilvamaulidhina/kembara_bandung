"use client";
// app/pengunjung/tersimpan/page.tsx
// Halaman Tempat Tersimpan

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Trash2, MapPin, Star, Navigation, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatDistance, getImageUrl, isOpenNow } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";

const CATEGORY_TABS = [
  { label: "Semua", value: "semua" },
  { label: "Alam", value: "alam" },
  { label: "Budaya", value: "budaya" },
  { label: "Kuliner", value: "kuliner" },
  { label: "Fashion", value: "fashion" },
  { label: "Hotel", value: "hotel" },
];

interface SavedDest {
  savedId: number;
  savedAt: string;
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  ticketPrice: number | null;
  maxPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  distance?: number;
  averageRating?: number | null;
  visitCount: number;
  categories: { category: { name: string } }[];
}

export default function TersimpanPage() {
  const { user, loading: userLoading } = useLocalUser();
  const { location } = useGeolocation(false);
  const [saved, setSaved] = useState<SavedDest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: String(user.id),
        ...(location && { lat: String(location.lat), lng: String(location.lng) }),
      });
      const res = await fetch(`/api/pengunjung/saved?${params}`);
      const json = await res.json();
      if (json.success) setSaved(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, location]);

  useEffect(() => {
    if (!userLoading && user) fetchSaved();
    else if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchSaved]);

  const handleDelete = async (destinationId: number) => {
    if (!user) return;
    setDeletingId(destinationId);
    try {
      await fetch(
        `/api/pengunjung/saved?userId=${user.id}&destinationId=${destinationId}`,
        { method: "DELETE" }
      );
      setSaved((prev) => prev.filter((s) => s.id !== destinationId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddToRencana = async (dest: SavedDest) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pengunjung/tersimpan`;
      return;
    }
    // Ambil itinerary sekarang lalu tambah
    window.location.href = `/pengunjung/rencana?add=${dest.id}`;
  };

  const filtered =
    activeTab === "semua"
      ? saved
      : saved.filter((s) =>
          s.categories.some(
            (c) => c.category.name.toLowerCase() === activeTab
          )
        );

  // Not logged in
  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-[#1a6b3c]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Simpan Destinasi Favoritmu</h2>
        <p className="text-gray-500 text-sm mb-6">
          Masuk terlebih dahulu untuk menyimpan dan mengelola destinasi favoritmu.
        </p>
        <Link
          href="/auth/login?redirect=/pengunjung/tersimpan"
          className="inline-flex px-6 py-3 bg-[#1a6b3c] text-white rounded-xl font-semibold text-sm hover:bg-[#155c33] transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <nav className="text-sm text-gray-500 mb-0.5">
            <Link href="/pengunjung" className="hover:text-[#1a6b3c]">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Tersimpan</span>
          </nav>
        </div>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tempat Tersimpan</h1>
          <p className="text-gray-500 text-sm mt-1">
            {saved.length} destinasi favorit yang siap kamu jelajahi di Bandung
          </p>
        </div>
        <Link
          href="/pengunjung/kategori"
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors"
        >
          <Plus size={16} />
          Tambah
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.value
                ? "border-[#f97316] text-[#f97316]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 font-medium">
            {activeTab === "semua"
              ? "Belum ada destinasi tersimpan"
              : `Tidak ada destinasi ${activeTab} tersimpan`}
          </p>
          <Link
            href="/pengunjung/kategori"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a6b3c] text-white rounded-xl text-sm font-semibold hover:bg-[#155c33] transition-colors"
          >
            Jelajahi Destinasi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((dest) => {
            const open = isOpenNow(dest.openTime, dest.closeTime);
            const categoryName = dest.categories[0]?.category?.name;
            const catInfo = CATEGORIES.find(
              (c) => c.name.toLowerCase() === categoryName?.toLowerCase()
            );

            return (
              <div
                key={dest.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(dest.imageUrl, dest.name)}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&size=400&background=1a6b3c&color=ffffff`;
                    }}
                  />
                  {/* Category badge */}
                  {categoryName && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: catInfo?.color || "#1a6b3c" }}
                    >
                      {categoryName.toUpperCase()}
                    </div>
                  )}
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(dest.id)}
                    disabled={deletingId === dest.id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    {deletingId === dest.id ? (
                      <Loader2 size={14} className="animate-spin text-gray-400" />
                    ) : (
                      <Trash2 size={14} className="text-gray-500" />
                    )}
                  </button>
                  {/* Rating */}
                  {dest.averageRating && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-semibold">
                        {dest.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/pengunjung/destinasi/${dest.id}`}>
                    <h3 className="font-bold text-gray-900 mb-1 hover:text-[#1a6b3c] transition-colors line-clamp-1">
                      {dest.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={11} />
                    <span className="line-clamp-1">{dest.address}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex items-center gap-1 text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500" : "bg-red-400"}`} />
                      {open ? "Buka Sekarang" : "Tutup"}
                    </span>
                    {dest.distance !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Navigation size={11} />
                        {formatDistance(dest.distance)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToRencana(dest)}
                    className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-[#1a6b3c] border border-[#1a6b3c]/20 rounded-xl hover:bg-[#1a6b3c] hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                    Tambah ke Rencana
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
