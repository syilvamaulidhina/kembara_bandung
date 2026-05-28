"use client";
// app/pengunjung/rencana/page.tsx — Rencana Perjalanan (FIXED)

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, GripVertical, Trash2, Plus, Sparkles, Navigation,
  Clock, MapPin, ChevronRight, Loader2, CheckCircle2, Route,
  ExternalLink, Bot, AlertCircle
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatRupiah, isOpenNow, getImageUrl, calculateTotalDistance } from "@/lib/utils";

const MapViewClient = dynamic(() => import("../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />,
});

interface ItineraryDest {
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
}

interface ItineraryItem {
  id: number;
  order: number;
  visitTime: string | null;
  destination: ItineraryDest;
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

// Destinasi yang sudah di-queue ke rencana (via "Tambah ke Rencana" di tersimpan)
interface QueuedDest {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  ticketPrice: number | null;
  categories: { category: { name: string } }[];
}

export default function RencanaPage() {
  const { user, loading: userLoading } = useLocalUser();
  const { location, requestLocation } = useGeolocation(false);

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [queuedDests, setQueuedDests] = useState<QueuedDest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<"select" | "view">("view");
  const [useAI, setUseAI] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [summary, setSummary] = useState({ distance: 0, time: 0, cost: 0 });

  // Fetch itinerary & queued dests
  const fetchAll = useCallback(async () => {
    if (!user) return;
    try {
      const [itinRes, queueRes] = await Promise.all([
        fetch(`/api/pengunjung/itinerary?userId=${user.id}`),
        fetch(`/api/pengunjung/rencana-queue?userId=${user.id}`),
      ]);
      const itinJson = await itinRes.json();
      const queueJson = await queueRes.json();

      if (itinJson.success && itinJson.data) {
        setItinerary(itinJson.data);
        setStep("view");
        recalcSummary(itinJson.data.items, location);
      } else {
        setStep("select");
      }
      if (queueJson.success) setQueuedDests(queueJson.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user, location]);

  useEffect(() => {
    if (!userLoading && user) fetchAll();
    else if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchAll]);

  // Hitung ulang summary berdasarkan items & lokasi user
  const recalcSummary = useCallback((items: ItineraryItem[], loc: typeof location) => {
    if (!items.length) { setSummary({ distance: 0, time: 0, cost: 0 }); return; }
    const dests = items.map(i => i.destination);
    const startLat = loc?.lat ?? dests[0].latitude;
    const startLng = loc?.lng ?? dests[0].longitude;
    const dist = calculateTotalDistance(startLat, startLng, dests);
    const travelMin = Math.round((dist / 40) * 60);
    const visitMin = items.length * 90;
    const cost = dests.reduce((s, d) => s + (d.ticketPrice || 0), 0);
    setSummary({ distance: dist, time: travelMin + visitMin, cost });
  }, []);

  useEffect(() => {
    if (itinerary?.items) recalcSummary(itinerary.items, location);
  }, [itinerary?.items, location, recalcSummary]);

  const handleCreate = async () => {
    if (!user || selectedIds.size === 0) return;
    if (useAI && !location) { requestLocation(); return; }
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
        recalcSummary(json.data.items, location);
        setStep("view");
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!itinerary) return;
    try {
      await fetch(`/api/pengunjung/itinerary?itemId=${itemId}`, { method: "DELETE" });
      const newItems = itinerary.items.filter(i => i.id !== itemId);
      setItinerary({ ...itinerary, items: newItems });
      recalcSummary(newItems, location);
    } catch (e) { console.error(e); }
  };

  // Drag reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !itinerary) return;
    const newItems = [...itinerary.items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    setItinerary({ ...itinerary, items: newItems });
    setDragIdx(idx);
    recalcSummary(newItems, location);
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

  // Route items untuk peta
  const routeItemsForMap = itinerary?.items.map((item, idx) => ({
    destinationId: item.destination.id,
    order: idx + 1,
  })) || [];

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Route size={48} className="mx-auto mb-4 text-[#f97316] opacity-50" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buat Rencana Perjalananmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk membuat dan menyimpan rencana perjalanan wisata di Bandung.</p>
        <Link href="/auth/login?redirect=/pengunjung/rencana"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm hover:bg-[#005229] transition-colors">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#006837]" size={32} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/pengunjung" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <nav className="text-sm text-gray-500 mb-0.5">
            <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Rencana Perjalanan</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Rencana Perjalanan</h1>
        </div>
        <button
          onClick={() => { setStep("select"); setSelectedIds(new Set()); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea6a0a] transition-colors shadow-md"
        >
          <Sparkles size={16} />
          Buat Baru
        </button>
      </div>

      {/* STEP SELECT */}
      {step === "select" && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
            <h2 className="font-bold text-gray-900 mb-1">Pilih Destinasi dari Antrean Rencana</h2>
            <p className="text-sm text-gray-500 mb-4">
              Hanya destinasi yang sudah kamu klik "Tambah ke Rencana" di halaman{" "}
              <Link href="/pengunjung/tersimpan" className="text-[#006837] underline">Tersimpan</Link>{" "}
              yang muncul di sini.
            </p>

            {queuedDests.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <MapPin size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm mb-3">Belum ada destinasi di antrean rencana.</p>
                <Link href="/pengunjung/tersimpan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006837] text-white rounded-xl text-sm font-semibold hover:bg-[#005229] transition-colors">
                  <Plus size={15} />
                  Tambah dari Tersimpan
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {queuedDests.map((dest) => {
                  const selected = selectedIds.has(dest.id);
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        const next = new Set(selectedIds);
                        selected ? next.delete(dest.id) : next.add(dest.id);
                        setSelectedIds(next);
                      }}
                      className={`relative text-left rounded-xl overflow-hidden border-2 transition-all ${
                        selected ? "border-[#006837] shadow-md scale-[1.02]" : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-28 overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(dest.imageUrl, dest.name)}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&background=006837&color=fff&size=200`; }}
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="font-semibold text-gray-900 text-xs line-clamp-1">{dest.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{dest.address}</p>
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#006837] flex items-center justify-center shadow">
                          <CheckCircle2 size={13} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Toggle */}
          <div className="bg-gradient-to-r from-[#1a3a2a] to-[#006837] rounded-2xl p-5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Urutkan dengan AI</p>
                <p className="text-white/70 text-xs">Rute paling efisien dari lokasi kamu sekarang</p>
              </div>
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative w-12 h-6 rounded-full transition-colors ${useAI ? "bg-[#f97316]" : "bg-white/20"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${useAI ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>

          {useAI && !location && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-amber-800">
              <AlertCircle size={15} className="shrink-0" />
              GPS belum aktif. AI akan tetap mengoptimalkan berdasarkan urutan jarak antar destinasi.
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("view")} className="px-5 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button
              onClick={handleCreate}
              disabled={selectedIds.size === 0 || generating}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors disabled:opacity-50 shadow-md"
            >
              {generating
                ? <><Loader2 size={16} className="animate-spin" /> Menyusun...</>
                : <><Sparkles size={16} /> {useAI ? "Buat dengan AI" : "Buat Manual"} ({selectedIds.size} destinasi)</>
              }
            </button>
          </div>
        </div>
      )}

      {/* STEP VIEW */}
      {step === "view" && itinerary && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list */}
          <div className="lg:col-span-3 space-y-3">
            {itinerary.isAiGenerated && (
              <div className="flex items-center gap-2 text-sm text-[#006837] bg-[#006837]/5 px-4 py-2.5 rounded-xl border border-[#006837]/20">
                <Sparkles size={15} />
                Rencana disusun AI – urutan paling efisien berdasarkan jarak & jam buka
              </div>
            )}

            {itinerary.items.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
                <Route size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Rencana kosong</p>
                <button onClick={() => setStep("select")} className="mt-3 text-[#006837] text-sm font-medium hover:underline">
                  + Tambah Destinasi
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
                      className={`bg-white rounded-2xl border border-gray-100 flex gap-3 p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                        dragIdx === idx ? "opacity-40 scale-95" : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <GripVertical size={16} className="text-gray-300" />
                        <div className="w-7 h-7 rounded-full bg-[#006837] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        {idx < itinerary.items.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                      </div>
                      <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0" style={{ width: 72, height: 72 }}>
                        <img
                          src={getImageUrl(item.destination.imageUrl, item.destination.name)}
                          alt={item.destination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.destination.name)}&background=006837&color=fff&size=144`; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/pengunjung/destinasi/${item.destination.id}`}
                            className="font-bold text-gray-900 text-sm hover:text-[#006837] transition-colors line-clamp-1">
                            {item.destination.name}
                          </Link>
                          <button onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                            <Trash2 size={13} className="text-gray-400" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 line-clamp-1">
                          <MapPin size={10} />{item.destination.address}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.visitTime && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#006837] bg-[#006837]/10 px-2 py-0.5 rounded-full">
                              <Clock size={10} />{item.visitTime}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500" : "bg-red-400"}`} />
                            {open ? "Buka" : "Tutup"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.destination.ticketPrice === 0 ? "Gratis"
                              : item.destination.ticketPrice ? `Rp ${item.destination.ticketPrice.toLocaleString("id-ID")}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => setStep("select")}
                  className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-[#006837] hover:text-[#006837] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={15} />
                  Tambah Destinasi
                </button>
              </>
            )}
          </div>

          {/* Right: summary + map */}
          <div className="lg:col-span-2 space-y-4">
            {/* Summary */}
            <div className="bg-[#1a3a2a] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Route size={17} className="text-[#f97316]" />
                <h3 className="font-bold">Ringkasan Perjalanan</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-1">Total Jarak</p>
                  <p className="font-bold text-xl">
                    {summary.distance > 0 ? summary.distance.toFixed(1) : "—"}
                    <span className="text-sm font-normal ml-1">km</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-1">Estimasi Waktu</p>
                  <p className="font-bold text-xl">
                    {summary.time > 0 ? (summary.time / 60).toFixed(1) : "—"}
                    <span className="text-sm font-normal ml-1">jam</span>
                  </p>
                </div>
              </div>
              {summary.cost >= 0 && itinerary.items.length > 0 && (
                <div className="flex items-center justify-between text-sm py-2 border-t border-white/10">
                  <span className="text-white/70">Estimasi Tiket</span>
                  <span className="font-semibold">{formatRupiah(summary.cost)}</span>
                </div>
              )}
              <Link href="/pengunjung/navigasi"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors">
                <Navigation size={15} />
                Mulai Navigasi
              </Link>
            </div>

            {/* Map preview dengan nomor urut */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={13} className="text-[#006837]" />
                  Pratinjau Rute Bandung
                </span>
                <Link href="/pengunjung/peta-rute"
                  className="text-xs text-[#006837] flex items-center gap-1 hover:underline">
                  Buka Peta Penuh <ExternalLink size={11} />
                </Link>
              </div>
              <MapViewClient
                destinations={itinerary.items.map(i => i.destination)}
                userLocation={location}
                height="240px"
                showHeatmap={false}
                activeCategories={["Alam", "Budaya", "Kuliner", "Fashion", "Hotel"]}
                showRouteOrder={true}
                routeItems={routeItemsForMap}
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty itinerary */}
      {step === "view" && !itinerary && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-[#006837]/10 flex items-center justify-center mx-auto mb-4">
            <Route size={36} className="text-[#006837]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Rencana Perjalanan</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Simpan dulu destinasi yang ingin dikunjungi, lalu tambahkan ke rencana dari halaman Tersimpan.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/pengunjung/tersimpan"
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#006837] text-[#006837] rounded-xl font-semibold text-sm hover:bg-[#006837]/5 transition-colors">
              Lihat Tersimpan
            </Link>
            <button onClick={() => setStep("select")}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors shadow-md">
              <Sparkles size={16} />
              Mulai Buat Rencana
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
