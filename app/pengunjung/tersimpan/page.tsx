"use client";
// app/pengunjung/tersimpan/page.tsx — UPDATED: Tambah ke Rencana → masuk antrean

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Heart, Trash2, MapPin, Navigation, Plus, ArrowLeft,
  Loader2, CheckCircle2, Route
} from "lucide-react";
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
  const [queuedIds, setQueuedIds] = useState<Set<number>>(new Set());
  const [addingId, setAddingId] = useState<number | null>(null);

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user, location]);

  const fetchQueue = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/pengunjung/rencana-queue?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setQueuedIds(new Set(json.data.map((d: any) => d.id)));
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) { fetchSaved(); fetchQueue(); }
    else if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchSaved, fetchQueue]);

  const handleDelete = async (destinationId: number) => {
    if (!user) return;
    setDeletingId(destinationId);
    try {
      await fetch(`/api/pengunjung/saved?userId=${user.id}&destinationId=${destinationId}`, { method: "DELETE" });
      setSaved(prev => prev.filter(s => s.id !== destinationId));
      // Juga hapus dari queue kalau ada
      if (queuedIds.has(destinationId)) {
        await fetch(`/api/pengunjung/rencana-queue?userId=${user.id}&destinationId=${destinationId}`, { method: "DELETE" });
        setQueuedIds(prev => { const n = new Set(prev); n.delete(destinationId); return n; });
      }
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const handleToggleQueue = async (dest: SavedDest) => {
    if (!user) { window.location.href = `/auth/login?redirect=/pengunjung/tersimpan`; return; }
    setAddingId(dest.id);
    try {
      if (queuedIds.has(dest.id)) {
        // Hapus dari queue
        await fetch(`/api/pengunjung/rencana-queue?userId=${user.id}&destinationId=${dest.id}`, { method: "DELETE" });
        setQueuedIds(prev => { const n = new Set(prev); n.delete(dest.id); return n; });
      } else {
        // Tambah ke queue
        await fetch("/api/pengunjung/rencana-queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId: dest.id }),
        });
        setQueuedIds(prev => new Set([...prev, dest.id]));
      }
    } catch (e) { console.error(e); }
    finally { setAddingId(null); }
  };

  const filtered = activeTab === "semua"
    ? saved
    : saved.filter(s => s.categories.some(c => c.category.name.toLowerCase() === activeTab));

  const queueCount = queuedIds.size;

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Heart size={40} className="mx-auto mb-4 text-[#006837] opacity-40" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Simpan Destinasi Favoritmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk menyimpan dan mengelola destinasi favorit.</p>
        <Link href="/auth/login?redirect=/pengunjung/tersimpan"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm hover:bg-[#005229] transition-colors">
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
        <nav className="text-sm text-gray-500">
          <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Tersimpan</span>
        </nav>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tempat Tersimpan</h1>
          <p className="text-gray-500 text-sm mt-1">
            {saved.length} destinasi · {queueCount} ditambahkan ke rencana
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {queueCount > 0 && (
            <Link href="/pengunjung/rencana"
              className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors shadow-md">
              <Route size={15} />
              Buat Rencana ({queueCount})
            </Link>
          )}
          <Link href="/pengunjung/kategori"
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#006837] hover:text-[#006837] transition-colors">
            <Plus size={15} />
            Tambah
          </Link>
        </div>
      </div>

      {/* Queue info banner */}
      {queueCount > 0 && (
        <div className="mb-4 p-3 bg-[#006837]/5 border border-[#006837]/20 rounded-xl flex items-center gap-2 text-sm text-[#006837]">
          <CheckCircle2 size={15} />
          {queueCount} destinasi siap dibuat menjadi rencana perjalanan.
          <Link href="/pengunjung/rencana" className="font-bold underline ml-auto">Buat Sekarang →</Link>
        </div>
      )}

      {/* Tabs */}
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

      {/* Content */}
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
          <p className="text-gray-400">
            {activeTab === "semua" ? "Belum ada destinasi tersimpan" : `Tidak ada destinasi ${activeTab}`}
          </p>
          <Link href="/pengunjung/kategori"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold hover:bg-[#005229] transition-colors">
            Jelajahi Destinasi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((dest) => {
            const open = isOpenNow(dest.openTime, dest.closeTime);
            const catName = dest.categories[0]?.category?.name;
            const catInfo = CATEGORIES.find(c => c.name.toLowerCase() === catName?.toLowerCase());
            const isQueued = queuedIds.has(dest.id);

            return (
              <div key={dest.id} className={`bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all group ${
                isQueued ? "border-[#006837]/30 ring-1 ring-[#006837]/10" : "border-gray-100"
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(dest.imageUrl, dest.name)}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&size=400&background=006837&color=fff`; }}
                  />
                  {catName && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: catInfo?.color || "#006837" }}>
                      {catName.toUpperCase()}
                    </div>
                  )}
                  {isQueued && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-[#006837] text-white text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 size={10} /> Di Rencana
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(dest.id)}
                    disabled={deletingId === dest.id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    {deletingId === dest.id
                      ? <Loader2 size={13} className="animate-spin text-gray-400" />
                      : <Trash2 size={13} className="text-gray-500" />}
                  </button>
                  {dest.averageRating && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white text-xs font-semibold">{dest.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link href={`/pengunjung/destinasi/${dest.id}`}>
                    <h3 className="font-bold text-gray-900 mb-1 hover:text-[#006837] transition-colors line-clamp-1">{dest.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={11} />
                    <span className="line-clamp-1">{dest.address}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
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
                  </div>

                  <button
                    onClick={() => handleToggleQueue(dest)}
                    disabled={addingId === dest.id}
                    className={`w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition-colors ${
                      isQueued
                        ? "bg-[#006837] text-white hover:bg-red-500"
                        : "text-[#006837] border border-[#006837]/20 hover:bg-[#006837] hover:text-white"
                    }`}
                  >
                    {addingId === dest.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : isQueued ? (
                      <><CheckCircle2 size={13} /> Sudah di Rencana (klik untuk batal)</>
                    ) : (
                      <><Plus size={13} /> Tambah ke Rencana</>
                    )}
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
