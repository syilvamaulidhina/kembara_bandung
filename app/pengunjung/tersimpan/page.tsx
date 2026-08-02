"use client";
// app/pengunjung/tersimpan/page.tsx
// SIMPLIFIED: Tidak perlu tombol "Tambah ke Rencana" yang rumit.
// Semua destinasi tersimpan langsung bisa dipilih di halaman rencana.
// Klik card -> detail destinasi.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Trash2, MapPin, Navigation, Plus, ArrowLeft,
  Loader2, Route, Star, Heart, ListPlus
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatDistance, getImageUrl, isOpenNow } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";
import AddToItineraryModal from "../components/AddToItineraryModal";

const CATEGORY_TABS = [
  { label: "Semua", value: "semua" },
  { label: "Wisata Alam", value: "wisata alam" },
  { label: "Wisata Budaya", value: "wisata budaya" },
  { label: "Wisata Kuliner", value: "wisata kuliner" },
  { label: "Wisata Edukasi", value: "wisata edukasi" },
  { label: "Wisata Hiburan", value: "wisata hiburan" },
  { label: "Wisata Belanja", value: "wisata belanja" },
  { label: "Wisata Religi", value: "wisata religi" },
];

interface SavedDest {
  savedId: number;
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  ticketPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  distance?: number;
  averageRating?: number | null;
  categories: { category: { name: string } }[];
}

export default function TersimpanPage() {
  const { user, loading: userLoading } = useLocalUser();
  const { location } = useGeolocation(false);
  const [saved, setSaved] = useState<SavedDest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addToItinDest, setAddToItinDest] = useState<{ id: number; name: string } | null>(null);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId: String(user.id) });
      if (location) {
        params.set("lat", String(location.lat));
        params.set("lng", String(location.lng));
      }
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

  const handleDelete = async (e: React.MouseEvent, destinationId: number) => {
    e.preventDefault();
    e.stopPropagation();
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

  const filtered =
    activeTab === "semua"
      ? saved
      : saved.filter((s) =>
          s.categories.some((c) => c.category.name.toLowerCase() === activeTab)
        );

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Heart size={40} className="mx-auto mb-4 text-[#006837] opacity-40" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Simpan Destinasi Favoritmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk menyimpan destinasi favorit.</p>
        <Link href="/auth/login?redirect=/pengunjung/tersimpan"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <nav className="text-sm text-gray-500">
          <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Tersimpan</span>
        </nav>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tempat Tersimpan</h1>
          <p className="text-gray-500 text-sm mt-1">{saved.length} destinasi tersimpan</p>
        </div>
        <div className="flex gap-2">
          {saved.length > 0 && (
            <Link href="/pengunjung/rencana"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors shadow-md">
              <Route size={15} />
              Buat Rencana
            </Link>
          )}
          <Link href="/pengunjung/kategori"
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#006837] hover:text-[#006837] transition-colors">
            <Plus size={14} />
            Tambah
          </Link>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-[#006837]/5 border border-[#006837]/15 rounded-xl flex items-center gap-2 text-sm text-[#006837]">
          <Route size={15} className="shrink-0" />
          <span>Tekan <strong>Tambah ke Rencana</strong> pada destinasi untuk langsung memasukkannya ke itinerary.</span>
          <Link href="/pengunjung/rencana" className="ml-auto font-bold underline whitespace-nowrap">
            Lihat Rencana →
          </Link>
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab.value ? "border-[#f97316] text-[#f97316]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 text-sm">
            {activeTab === "semua" ? "Belum ada destinasi tersimpan" : `Tidak ada destinasi "${activeTab}" tersimpan`}
          </p>
          <Link href="/pengunjung/kategori"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold">
            Jelajahi Destinasi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((dest) => {
            const open = isOpenNow(dest.openTime, dest.closeTime);
            let catName = dest.categories[0]?.category?.name;
            if (activeTab !== "semua") {
              const matchedCat = dest.categories.find(c => c.category?.name.toLowerCase() === activeTab.toLowerCase());
              if (matchedCat) {
                catName = matchedCat.category.name;
              }
            }
            const catInfo = CATEGORIES.find((c) => c.name.toLowerCase() === catName?.toLowerCase());
            return (
              <Link key={dest.id} href={`/pengunjung/destinasi/${dest.id}`}
                className="block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(dest.imageUrl, dest.name)}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&size=400&background=006837&color=fff`; }}
                  />
                  {catName && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: catInfo?.color || "#006837" }}>
                      {catName}
                    </div>
                  )}
                  <button onClick={(e) => handleDelete(e, dest.id)} disabled={deletingId === dest.id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 transition-colors z-10">
                    {deletingId === dest.id
                      ? <Loader2 size={13} className="animate-spin text-gray-400" />
                      : <Trash2 size={13} className="text-gray-500" />}
                  </button>
                  {dest.averageRating && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-semibold">{dest.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAddToItinDest({ id: dest.id, name: dest.name }); }}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 rounded-full shadow text-xs font-bold text-[#006837] hover:bg-white transition-colors z-10"
                  >
                    <ListPlus size={12} />
                    Tambah ke Rencana
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#006837] transition-colors">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={11} />
                    <span className="line-clamp-1">{dest.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1 text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500" : "bg-red-400"}`} />
                      {open ? "Buka" : "Tutup"}
                    </span>
                    {dest.distance !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Navigation size={10} />
                        {formatDistance(dest.distance)}
                      </span>
                    )}
                    {dest.ticketPrice !== null && (
                      <span className="text-xs font-semibold text-[#006837]">
                        {dest.ticketPrice === 0 ? "Gratis" : `Rp ${dest.ticketPrice.toLocaleString("id-ID")}`}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <AddToItineraryModal
        open={!!addToItinDest}
        onClose={() => setAddToItinDest(null)}
        destinationId={addToItinDest?.id ?? null}
        destinationName={addToItinDest?.name}
      />
    </div>
  );
}
