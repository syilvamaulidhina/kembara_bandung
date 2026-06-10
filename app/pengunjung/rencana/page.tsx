"use client";
// app/pengunjung/rencana/page.tsx — FIXED FLOW v6
// Alur: Simpan ❤️ → Tersimpan → klik "Buat Rencana" → pilih dari tersimpan → itinerary

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, GripVertical, Trash2, Plus, Sparkles, Navigation,
  Clock, MapPin, Loader2, CheckCircle2, Route, ExternalLink,
  Bot, AlertCircle, Heart
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatRupiah, isOpenNow, getImageUrl, calculateTotalDistance } from "@/lib/utils";

const MapViewClient = dynamic(() => import("../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />,
});

interface SavedDest {
  id: number; name: string; address: string; imageUrl: string | null;
  latitude: number; longitude: number; ticketPrice: number | null;
  openTime: string | null; closeTime: string | null;
  categories: { category: { name: string } }[];
}

interface ItineraryItem {
  id: number; order: number; visitTime: string | null;
  destination: SavedDest & { averageRating?: number | null };
}

interface Itinerary {
  id: number; title: string; isAiGenerated: boolean; items: ItineraryItem[];
}

type PageView = "choose" | "itinerary";

export default function RencanaPage() {
  const { user, loading: userLoading } = useLocalUser();
  const { location, requestLocation } = useGeolocation(true);

  const [view, setView] = useState<PageView>("itinerary");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [savedDests, setSavedDests] = useState<SavedDest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  // orderedIds: urutan destinasi yang dipilih user (untuk mode manual)
  const [orderedIds, setOrderedIds] = useState<number[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [summary, setSummary] = useState({ distance: 0, time: 0, cost: 0 });

  // Ref untuk drag reorder di panel manual (hindari stale closure)
  const dragOrderIdxRef = useRef<number | null>(null);

  const fetchItinerary = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/pengunjung/itinerary?userId=${user.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setItinerary(json.data);
        setView("itinerary");
      } else {
        setItinerary(null);
        setView("choose");
      }
    } catch (e) { console.error(e); }
  }, [user]);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    try {
      const params = new URLSearchParams({ userId: String(user.id) });
      if (location) { params.set("lat", String(location.lat)); params.set("lng", String(location.lng)); }
      const res = await fetch(`/api/pengunjung/saved?${params}`);
      const json = await res.json();
      if (json.success) setSavedDests(json.data);
    } catch (e) { console.error(e); }
    finally { setLoadingSaved(false); }
  }, [user, location]);

  // useEffect(() => {
  //   const init = async () => {
  //     if (!userLoading && user) {
  //       await fetchItinerary();
  //       await fetchSaved();
  //     }
  //     setLoadingPage(false);
  //   };
  //   init();
  // }, [user, userLoading, fetchItinerary, fetchSaved]);
  useEffect(() => {
  // ← TAMBAHAN: tunggu auth selesai dulu sebelum lanjut
  if (userLoading) return;

  const init = async () => {
    if (user) {
      await fetchItinerary();
      await fetchSaved();
    }
    setLoadingPage(false);
  };
  init();
}, [user, userLoading, fetchItinerary, fetchSaved]);

  useEffect(() => {
    if (!itinerary?.items?.length) { setSummary({ distance: 0, time: 0, cost: 0 }); return; }
    const sorted = [...itinerary.items].sort((a, b) => a.order - b.order);
    const dests = sorted.map((i) => i.destination);
    const startLat = location?.lat ?? dests[0].latitude;
    const startLng = location?.lng ?? dests[0].longitude;
    const dist = calculateTotalDistance(startLat, startLng, dests);
    const cost = dests.reduce((s, d) => s + (d.ticketPrice || 0), 0);
    setSummary({ distance: dist, time: Math.round((dist / 40) * 60) + dests.length * 90, cost });
  }, [itinerary?.items, location]);

  // Toggle pilih destinasi — update selectedIds & orderedIds sekaligus
  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
      setOrderedIds((prev) => prev.filter((i) => i !== id));
    } else {
      next.add(id);
      setOrderedIds((prev) => [...prev, id]);
    }
    setSelectedIds(next);
  };

  // Pilih semua / batal semua
  const toggleAll = () => {
    if (selectedIds.size === savedDests.length) {
      setSelectedIds(new Set());
      setOrderedIds([]);
    } else {
      const allIds = savedDests.map((d) => d.id);
      setSelectedIds(new Set(allIds));
      setOrderedIds(allIds);
    }
  };

  const handleCreate = async () => {
    if (!user || selectedIds.size === 0) return;
    setGenerating(true);
    try {
      // Mode manual: kirim urutan sesuai orderedIds; mode AI: urutan bebas (backend yang atur)
      const destinationIds = useAI ? Array.from(selectedIds) : orderedIds;
      const res = await fetch("/api/pengunjung/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destinationIds,
          startLat: location?.lat, startLng: location?.lng, useAI,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setItinerary(json.data);
        setView("itinerary");
        setSelectedIds(new Set());
        setOrderedIds([]);
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!itinerary) return;
    try {
      await fetch(`/api/pengunjung/itinerary?itemId=${itemId}`, { method: "DELETE" });
      setItinerary({ ...itinerary, items: itinerary.items.filter((i) => i.id !== itemId) });
    } catch (e) { console.error(e); }
  };

  // Drag reorder di view itinerary (sudah ada, tidak diubah)
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !itinerary) return;
    const newItems = [...itinerary.items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    setItinerary({ ...itinerary, items: newItems });
    setDragIdx(idx);
  };
  // const handleDragEnd = async () => {
  //   setDragIdx(null);
  //   if (!itinerary) return;
  //   await fetch("/api/pengunjung/itinerary", {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       itineraryId: itinerary.id,
  //       items: itinerary.items.map((item, idx) => ({ id: item.id, order: idx + 1 })),
  //     }),
  //   });
  // };
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
  // Fetch ulang dari server agar urutan tampil sesuai DB
  await fetchItinerary();
};

  const routeItemsForMap = itinerary?.items.map((item, idx) => ({ destinationId: item.destination.id, order: idx + 1 })) || [];

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Route size={48} className="mx-auto mb-4 text-[#f97316] opacity-40" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Buat Rencana Perjalananmu</h2>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk membuat rencana wisata di Bandung.</p>
        <Link href="/auth/login?redirect=/pengunjung/rencana"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#006837]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        {view === "itinerary" && (
          <button onClick={async () => { await fetchSaved(); setSelectedIds(new Set()); setOrderedIds([]); setView("choose"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea6a0a] transition-colors shadow-md">
            <Sparkles size={15} />
            Buat Baru
          </button>
        )}
      </div>

      {/* VIEW: PILIH DESTINASI */}
      {view === "choose" && (
        <div className="max-w-3xl mx-auto">
          {loadingSaved ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#006837]" size={32} />
            </div>
          ) : savedDests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={36} className="text-gray-300" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Destinasi Tersimpan</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Simpan dulu destinasi yang ingin dikunjungi dengan menekan tombol <strong>❤️ Simpan</strong> di halaman detail destinasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/pengunjung/kategori"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#006837] text-[#006837] rounded-xl font-semibold text-sm">
                  <MapPin size={15} />
                  Jelajahi Destinasi
                </Link>
                {itinerary && (
                  <button onClick={() => setView("itinerary")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                    Lihat Rencana Sebelumnya
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-gray-900">Pilih Destinasi yang Ingin Dikunjungi</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{savedDests.length} tersimpan · {selectedIds.size} dipilih</p>
                  </div>
                  <button onClick={toggleAll} className="text-xs text-[#006837] font-medium hover:underline">
                    {selectedIds.size === savedDests.length ? "Batal Semua" : "Pilih Semua"}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {savedDests.map((dest) => {
                    const selected = selectedIds.has(dest.id);
                    const open = isOpenNow(dest.openTime, dest.closeTime);
                    const orderNum = orderedIds.indexOf(dest.id) + 1;
                    return (
                      <button key={dest.id}
                        onClick={() => toggleSelect(dest.id)}
                        className={`relative text-left rounded-xl overflow-hidden border-2 transition-all ${selected ? "border-[#006837] shadow-md" : "border-gray-100 hover:border-gray-300"}`}>
                        <div className="h-28 overflow-hidden bg-gray-100">
                          <img src={getImageUrl(dest.imageUrl, dest.name)} alt={dest.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&background=006837&color=fff&size=200`; }} />
                        </div>
                        <div className="p-2.5">
                          <p className="font-semibold text-gray-900 text-xs line-clamp-1">{dest.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{dest.address}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>{open ? "• Buka" : "• Tutup"}</span>
                            {dest.ticketPrice !== null && (
                              <span className="text-xs text-gray-400">{dest.ticketPrice === 0 ? "· Gratis" : `· Rp ${dest.ticketPrice.toLocaleString("id-ID")}`}</span>
                            )}
                          </div>
                        </div>
                        {selected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#006837] flex items-center justify-center shadow">
                            {/* Mode AI: tampilkan checkmark; mode manual: tampilkan nomor urut */}
                            {useAI
                              ? <CheckCircle2 size={13} className="text-white" />
                              : <span className="text-white text-xs font-bold">{orderNum}</span>
                            }
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel reorder — hanya muncul saat mode manual & ada yang dipilih */}
              {!useAI && orderedIds.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Urutan Kunjungan · drag untuk mengubah
                  </p>
                  <div className="space-y-2">
                    {orderedIds.map((id, idx) => {
                      const dest = savedDests.find((d) => d.id === id)!;
                      return (
                        <div
                          key={id}
                          draggable
                          onDragStart={() => { dragOrderIdxRef.current = idx; }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            const from = dragOrderIdxRef.current;
                            if (from === null || from === idx) return;
                            setOrderedIds((prev) => {
                              const next = [...prev];
                              const [moved] = next.splice(from, 1);
                              next.splice(idx, 0, moved);
                              return next;
                            });
                            dragOrderIdxRef.current = idx;
                          }}
                          onDragEnd={() => { dragOrderIdxRef.current = null; }}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing select-none"
                        >
                          <GripVertical size={14} className="text-gray-300 shrink-0" />
                          <div className="w-6 h-6 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <img
                            src={getImageUrl(dest.imageUrl, dest.name)}
                            alt={dest.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&background=006837&color=fff&size=64`; }}
                          />
                          <span className="text-sm font-medium text-gray-800 flex-1 line-clamp-1">{dest.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(id); }}
                            className="p-1 rounded-lg hover:bg-red-50 hover:text-red-400 text-gray-300 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#1a3a2a] to-[#006837] rounded-2xl p-5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Urutkan dengan AI</p>
                    <p className="text-white/70 text-xs">Rute paling efisien dari lokasimu</p>
                  </div>
                </div>
                <button onClick={() => setUseAI(!useAI)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${useAI ? "bg-[#f97316]" : "bg-white/20"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${useAI ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>

              {useAI && !location && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-sm text-amber-800">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>GPS belum aktif. <button onClick={requestLocation} className="font-bold underline">Aktifkan GPS</button> agar AI bisa mengoptimalkan rute.</span>
                </div>
              )}

              <div className="flex gap-3">
                {itinerary && (
                  <button onClick={() => setView("itinerary")}
                    className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    ← Kembali
                  </button>
                )}
                <button onClick={handleCreate} disabled={selectedIds.size === 0 || generating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                  {generating
                    ? <><Loader2 size={16} className="animate-spin" /> Menyusun Rencana...</>
                    : <><Sparkles size={16} />{useAI ? "Buat dengan AI" : "Buat Manual"}{selectedIds.size > 0 && ` (${selectedIds.size} destinasi)`}</>}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW: ITINERARY */}
      {view === "itinerary" && itinerary && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">
                {itinerary.items.length} destinasi
                {itinerary.isAiGenerated && <span className="ml-2 text-[#006837] font-semibold">✨ AI</span>}
              </p>
              <button onClick={async () => { if (confirm("Hapus rencana ini?")) { setItinerary(null); await fetchSaved(); setSelectedIds(new Set()); setOrderedIds([]); setView("choose"); } }}
                className="text-xs text-red-400 hover:text-red-600 hover:underline">
                Hapus & Buat Baru
              </button>
            </div>

            {[...itinerary.items].sort((a, b) => a.order - b.order).map((item, idx) => {
              const open = isOpenNow(item.destination.openTime, item.destination.closeTime);
              return (
                <div key={item.id} draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl border border-gray-100 flex gap-3 p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all ${dragIdx === idx ? "opacity-40 scale-95" : "hover:shadow-md"}`}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <GripVertical size={15} className="text-gray-200" />
                    <div className="w-7 h-7 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center">{idx + 1}</div>
                    {idx < itinerary.items.length - 1 && <div className="w-px flex-1 bg-gray-100 my-0.5" />}
                  </div>
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0">
                    <img src={getImageUrl(item.destination.imageUrl, item.destination.name)} alt={item.destination.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.destination.name)}&background=006837&color=fff&size=144`; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/pengunjung/destinasi/${item.destination.id}`}
                        className="font-bold text-gray-900 text-sm hover:text-[#006837] transition-colors line-clamp-1">
                        {item.destination.name}
                      </Link>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={13} className="text-gray-300" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 line-clamp-1"><MapPin size={10} />{item.destination.address}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.visitTime && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#006837] bg-[#006837]/10 px-2 py-0.5 rounded-full">
                          <Clock size={10} />{item.visitTime}
                        </span>
                      )}
                      <span className={`text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>{open ? "• Buka" : "• Tutup"}</span>
                      {item.destination.ticketPrice !== null && (
                        <span className="text-xs text-gray-400">
                          {item.destination.ticketPrice === 0 ? "Gratis" : `Rp ${item.destination.ticketPrice.toLocaleString("id-ID")}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={async () => { await fetchSaved(); setSelectedIds(new Set()); setOrderedIds([]); setView("choose"); }}
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-[#006837] hover:text-[#006837] transition-colors">
              <Plus size={15} />
              Tambah / Ubah Destinasi
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#1a3a2a] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Route size={16} className="text-[#f97316]" />
                <h3 className="font-bold text-sm">Ringkasan Perjalanan</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-0.5">Total Jarak</p>
                  <p className="font-bold text-xl">{summary.distance > 0 ? summary.distance.toFixed(1) : "—"}<span className="text-sm font-normal ml-1 text-white/60">km</span></p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-0.5">Est. Waktu</p>
                  <p className="font-bold text-xl">{summary.time > 0 ? (summary.time / 60).toFixed(1) : "—"}<span className="text-sm font-normal ml-1 text-white/60">jam</span></p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm py-2.5 border-t border-white/10">
                <span className="text-white/60">Estimasi Tiket</span>
                <span className="font-semibold">{summary.cost === 0 ? "Gratis" : formatRupiah(summary.cost)}</span>
              </div>
              <Link href="/pengunjung/navigasi"
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors">
                <Navigation size={15} />
                Mulai Navigasi
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={13} className="text-[#006837]" />
                  Pratinjau Rute
                </span>
                <Link href="/pengunjung/peta-rute" className="text-xs text-[#006837] flex items-center gap-1 hover:underline">
                  Buka Peta Penuh <ExternalLink size={11} />
                </Link>
              </div>
              <MapViewClient
                destinations={itinerary.items.map((i) => i.destination)}
                userLocation={location} height="240px" showHeatmap={false}
                activeCategories={["Wisata Alam","Wisata Budaya","Wisata Kuliner","Wisata Edukasi","Wisata Hiburan","Wisata Belanja","Wisata Religi"]}
                showRouteOrder={true} routeItems={routeItemsForMap}
              />
            </div>
          </div>
        </div>
      )}

      {/* Belum ada itinerary */}
      {view === "itinerary" && !itinerary && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-[#006837]/10 flex items-center justify-center mx-auto mb-4">
            <Route size={36} className="text-[#006837]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Rencana</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Simpan destinasi yang ingin dikunjungi, lalu kembali ke sini untuk membuat rencana perjalanan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pengunjung/kategori"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#006837] text-[#006837] rounded-xl font-semibold text-sm">
              <MapPin size={15} />
              Jelajahi Destinasi
            </Link>
            <button onClick={async () => { await fetchSaved(); setView("choose"); }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors shadow-md">
              <Sparkles size={15} />
              Mulai Buat Rencana
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
