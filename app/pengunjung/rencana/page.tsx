"use client";
// app/pengunjung/rencana/page.tsx
// Halaman Rencana Perjalanan – Itinerary planner + AI optimization

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, GripVertical, Trash2, Plus, Sparkles, Navigation,
  Clock, DollarSign, MapPin, ChevronRight, Loader2, Star,
  CheckCircle2, AlertCircle, Route, ExternalLink, Bot, Heart
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatRupiah, formatDuration, isOpenNow, getImageUrl } from "@/lib/utils";

const MapViewClient = dynamic(() => import("../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />,
});

interface ItineraryItem {
  id: number;
  order: number;
  visitTime: string | null;
  destination: {
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
    averageRating?: number | null;
    categories: { category: { name: string } }[];
  };
}

interface Itinerary {
  id: number;
  title: string;
  totalDistance: number | null;
  estimatedTime: number | null;
  estimatedCost: number | null;
  isAiGenerated: boolean;
  items: ItineraryItem[];
}

interface SavedDest {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  ticketPrice: number | null;
  categories: { category: { name: string } }[];
}

export default function RencanaPage() {
  const { user, loading: userLoading } = useLocalUser();
  const { location, requestLocation } = useGeolocation(false);

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [savedDests, setSavedDests] = useState<SavedDest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<"select" | "view">("view");
  const [useAI, setUseAI] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Fetch itinerary
  const fetchItinerary = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/pengunjung/itinerary?userId=${user.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setItinerary(json.data);
        setStep("view");
      } else {
        setStep("select");
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  // Fetch saved destinations for selection
  const fetchSaved = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/pengunjung/saved?userId=${user.id}`);
      const json = await res.json();
      if (json.success) setSavedDests(json.data);
    } catch (e) { console.error(e); }
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) {
      fetchItinerary();
      fetchSaved();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, fetchItinerary, fetchSaved]);

  // Handle create itinerary
  const handleCreate = async () => {
    if (!user || selectedIds.size === 0) return;
    if (useAI && !location) {
      requestLocation();
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/pengunjung/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destinationIds: Array.from(selectedIds),
          startLat: location?.lat,
          startLng: location?.lng,
          useAI,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setItinerary(json.data);
        setStep("view");
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  // Delete item
  const handleDeleteItem = async (itemId: number) => {
    try {
      await fetch(`/api/pengunjung/itinerary?itemId=${itemId}`, { method: "DELETE" });
      setItinerary((prev) =>
        prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : null
      );
    } catch (e) { console.error(e); }
  };

  // Drag and drop reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...(itinerary?.items || [])];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    setItinerary((prev) => prev ? { ...prev, items: newItems } : null);
    setDragIdx(idx);
  };
  const handleDragEnd = async () => {
    setDragIdx(null);
    if (!itinerary) return;
    await fetch("/api/pengunjung/itinerary", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itineraryId: itinerary.id,
        items: itinerary.items.map((item, idx) => ({ id: item.id, order: idx + 1 })),
      }),
    });
  };

  // Not logged in
  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f97316]/10 flex items-center justify-center mx-auto mb-4">
          <Route size={28} className="text-[#f97316]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buat Rencana Perjalananmu</h2>
        <p className="text-gray-500 text-sm mb-6">
          Masuk untuk membuat dan menyimpan rencana perjalanan wisata di Bandung.
        </p>
        <Link
          href="/auth/login?redirect=/pengunjung/rencana"
          className="inline-flex px-6 py-3 bg-[#1a6b3c] text-white rounded-xl font-semibold text-sm hover:bg-[#155c33] transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#1a6b3c]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <nav className="text-sm text-gray-500 mb-0.5">
            <Link href="/pengunjung" className="hover:text-[#1a6b3c]">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Rencana Perjalanan</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Rencana Perjalanan</h1>
        </div>
        <button
          onClick={() => {
            setStep("select");
            setSelectedIds(new Set());
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea6a0a] transition-colors shadow-md"
        >
          <Sparkles size={16} />
          Buat Itinerary Baru
        </button>
      </div>

      {/* STEP 1: SELECT destinations */}
      {step === "select" && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-1">Pilih Destinasi</h2>
            <p className="text-sm text-gray-500 mb-4">
              Pilih dari destinasi tersimpanmu, lalu buat urutan perjalanan secara manual atau minta AI yang menyusunnya.
            </p>

            {savedDests.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Heart size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Belum ada destinasi tersimpan.</p>
                <Link
                  href="/pengunjung/kategori"
                  className="mt-3 inline-flex items-center gap-1 text-[#1a6b3c] text-sm font-medium hover:underline"
                >
                  Jelajahi Destinasi <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {savedDests.map((dest) => {
                  const selected = selectedIds.has(dest.id);
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        const next = new Set(selectedIds);
                        if (selected) next.delete(dest.id);
                        else next.add(dest.id);
                        setSelectedIds(next);
                      }}
                      className={`relative text-left rounded-xl overflow-hidden border-2 transition-all ${
                        selected
                          ? "border-[#1a6b3c] shadow-md scale-[1.02]"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={getImageUrl(dest.imageUrl, dest.name)}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&size=300&background=1a6b3c&color=fff`;
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-gray-900 text-xs line-clamp-1">{dest.name}</p>
                        <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{dest.address}</p>
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1a6b3c] flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Toggle */}
          <div className="bg-gradient-to-r from-[#1a3a2a] to-[#1a6b3c] rounded-2xl p-5 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Urutkan dengan AI</p>
                <p className="text-white/70 text-xs">AI akan menyusun rute paling efisien dari lokasi kamu</p>
              </div>
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative w-12 h-6 rounded-full transition-colors ${useAI ? "bg-[#f97316]" : "bg-white/20"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${useAI ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>

          {!useAI && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2 text-sm text-amber-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Mode manual: urutan akan mengikuti urutan kamu memilih destinasi.
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep("view")}
              className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleCreate}
              disabled={selectedIds.size === 0 || generating}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {generating ? (
                <><Loader2 size={16} className="animate-spin" /> Menyusun Rencana...</>
              ) : (
                <><Sparkles size={16} /> {useAI ? "Buat dengan AI" : "Buat Rencana"} ({selectedIds.size} destinasi)</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VIEW itinerary */}
      {step === "view" && itinerary && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Itinerary list */}
          <div className="lg:col-span-3 space-y-4">
            {itinerary.isAiGenerated && (
              <div className="flex items-center gap-2 text-sm text-[#1a6b3c] bg-[#1a6b3c]/5 px-4 py-2.5 rounded-xl border border-[#1a6b3c]/20">
                <Sparkles size={16} />
                Rencana ini dibuat oleh AI berdasarkan jarak dan waktu optimal
              </div>
            )}

            {itinerary.items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
                <Route size={36} className="mx-auto mb-3 opacity-30" />
                <p>Rencana perjalananmu kosong</p>
                <button
                  onClick={() => setStep("select")}
                  className="mt-3 text-[#1a6b3c] text-sm font-medium hover:underline"
                >
                  Tambah Destinasi
                </button>
              </div>
            ) : (
              <>
                {itinerary.items.map((item, idx) => {
                  const open = isOpenNow(item.destination.openTime, item.destination.closeTime);
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-2xl border border-gray-100 flex gap-3 p-4 shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                        dragIdx === idx ? "opacity-50 scale-95" : "hover:shadow-md"
                      }`}
                    >
                      {/* Drag handle + number */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <GripVertical size={18} className="text-gray-300" />
                        <div className="w-7 h-7 rounded-full bg-[#1a6b3c] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        {idx < itinerary.items.length - 1 && (
                          <div className="w-px flex-1 bg-gray-100 my-1" />
                        )}
                      </div>

                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={getImageUrl(item.destination.imageUrl, item.destination.name)}
                          alt={item.destination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.destination.name)}&size=160&background=1a6b3c&color=fff`;
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/pengunjung/destinasi/${item.destination.id}`}
                            className="font-bold text-gray-900 text-sm hover:text-[#1a6b3c] transition-colors line-clamp-1"
                          >
                            {item.destination.name}
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={14} className="text-gray-400" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin size={11} />
                          <span className="line-clamp-1">{item.destination.address}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {item.visitTime && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#1a6b3c] bg-[#1a6b3c]/10 px-2 py-1 rounded-full">
                              <Clock size={11} />
                              {item.visitTime}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500" : "bg-red-400"}`} />
                            {open ? "Buka" : "Tutup"}
                          </span>
                          {item.destination.ticketPrice !== null && (
                            <span className="text-xs text-gray-500">
                              {item.destination.ticketPrice === 0
                                ? "Gratis"
                                : `Rp ${item.destination.ticketPrice.toLocaleString("id-ID")}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add more */}
                <button
                  onClick={() => setStep("select")}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Tambah Destinasi Baru
                </button>
              </>
            )}
          </div>

          {/* Right: Summary + Map */}
          <div className="lg:col-span-2 space-y-4">
            {/* Summary card */}
            <div className="bg-[#1a3a2a] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Route size={18} className="text-[#f97316]" />
                <h3 className="font-bold">Ringkasan Perjalanan</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-1">Total Jarak</p>
                  <p className="font-bold text-xl">
                    {itinerary.totalDistance?.toFixed(1) || "—"}
                    <span className="text-sm font-normal ml-1">km</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-1">Estimasi Waktu</p>
                  <p className="font-bold text-xl">
                    {itinerary.estimatedTime
                      ? `${(itinerary.estimatedTime / 60).toFixed(1)}`
                      : "—"}
                    <span className="text-sm font-normal ml-1">jam</span>
                  </p>
                </div>
              </div>
              {itinerary.estimatedCost !== null && (
                <div className="flex items-center justify-between text-sm py-2 border-t border-white/10">
                  <span className="text-white/70">Estimasi Tiket</span>
                  <span className="font-semibold">
                    {formatRupiah(itinerary.estimatedCost)}
                  </span>
                </div>
              )}
              <Link
                href="/pengunjung/navigasi"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors"
              >
                <Navigation size={16} />
                Mulai Navigasi
              </Link>
            </div>

            {/* Map preview */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-[#1a6b3c]" />
                  Pratinjau Rute Bandung
                </span>
                <Link
                  href="/pengunjung/navigasi"
                  className="text-xs text-[#1a6b3c] flex items-center gap-1 hover:underline"
                >
                  Buka Peta Penuh <ExternalLink size={12} />
                </Link>
              </div>
              <MapViewClient
                destinations={itinerary.items.map((i) => i.destination)}
                userLocation={location}
                height="240px"
                showHeatmap={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no itinerary yet */}
      {step === "view" && !itinerary && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-[#1a6b3c]/10 flex items-center justify-center mx-auto mb-4">
            <Route size={36} className="text-[#1a6b3c]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Rencana Perjalanan</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Buat rencana perjalanan wisata Bandungmu. Pilih destinasi dari tempat tersimpan atau biarkan AI yang menyusun rute terbaik untukmu.
          </p>
          <button
            onClick={() => setStep("select")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-[#ea6a0a] transition-colors shadow-md"
          >
            <Sparkles size={18} />
            Mulai Buat Rencana
          </button>
        </div>
      )}
    </div>
  );
}
