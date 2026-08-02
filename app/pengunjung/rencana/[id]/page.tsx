"use client";
// app/pengunjung/rencana/[id]/page.tsx — BARU
// Halaman detail 1 itinerary. Styling & komponen visual diambil persis dari
// versi lama app/pengunjung/rencana/page.tsx (view "itinerary"), supaya
// tampilan tidak berubah. Bedanya: sekarang scoped ke 1 itinerary by id,
// destinasi ditambah lewat AddDestinationModal, dan ada tombol Mulai Navigasi
// yang cek GPS terbaru dulu sebelum redirect ke halaman navigasi.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft, GripVertical, Trash2, Plus, Navigation,
  Clock, MapPin, Loader2, Route, ExternalLink, Bot,
  AlertCircle, MoreVertical, PenLine, Check, X, Crosshair
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import {
  formatRupiah, formatTripDate, isOpenNow, getImageUrl,
  calculateTotalDistance, isLocationSignificantlyDifferent,
} from "@/lib/utils";
import AddDestinationModal from "../../components/AddDestinationModal";

const MapViewClient = dynamic(() => import("../../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />,
});

interface Destination {
  id: number; name: string; address: string; imageUrl: string | null;
  latitude: number; longitude: number; ticketPrice: number | null;
  openTime: string | null; closeTime: string | null;
  categories: { category: { name: string } }[];
  averageRating?: number | null;
}

interface ItineraryItem {
  id: number; order: number; visitTime: string | null; visited: boolean;
  destination: Destination;
}

interface Itinerary {
  id: number; title: string; tripDate: string | null;
  status: "draft" | "aktif" | "selesai";
  isAiGenerated: boolean; startLat: number | null; startLng: number | null;
  items: ItineraryItem[];
}

export default function ItineraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itineraryId = Number(params.id);
  const { user, loading: userLoading } = useLocalUser();
  const { location, requestLocation } = useGeolocation(true);

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragEnabled, setDragEnabled] = useState<number | null>(null);
  const [summary, setSummary] = useState({ distance: 0, time: 0, cost: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [startingNav, setStartingNav] = useState(false);
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);

  const fetchItinerary = useCallback(async () => {
    if (!itineraryId) return;
    try {
      const res = await fetch(`/api/pengunjung/itinerary/${itineraryId}`);
      const json = await res.json();
      if (json.success) {
        setItinerary(json.data);
        setTitleInput(json.data.title);
      }
    } catch (e) {
      console.error(e);
    }
  }, [itineraryId]);

  useEffect(() => {
    if (userLoading) return;
    const init = async () => {
      await fetchItinerary();
      setLoading(false);
    };
    init();
  }, [userLoading, fetchItinerary]);

  useEffect(() => {
    if (!itinerary?.items?.length) {
      setSummary({ distance: 0, time: 0, cost: 0 });
      return;
    }
    const sorted = [...itinerary.items].sort((a, b) => a.order - b.order);
    const dests = sorted.map((i) => i.destination);
    const startLat = itinerary.startLat ?? location?.lat ?? dests[0].latitude;
    const startLng = itinerary.startLng ?? location?.lng ?? dests[0].longitude;
    const dist = calculateTotalDistance(startLat, startLng, dests);
    const cost = dests.reduce((s, d) => s + (d.ticketPrice || 0), 0);
    setSummary({ distance: dist, time: Math.round((dist / 40) * 60) + dests.length * 90, cost });
  }, [itinerary, location]);

  const handleAddDestinations = async (destinationIds: number[]) => {
    if (!itinerary) return;
    try {
      await fetch(`/api/pengunjung/itinerary/${itinerary.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationIds }),
      });
      await fetchItinerary();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!itinerary) return;
    try {
      await fetch(`/api/pengunjung/itinerary/${itinerary.id}/items?itemId=${itemId}`, { method: "DELETE" });
      setItinerary({ ...itinerary, items: itinerary.items.filter((i) => i.id !== itemId) });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTitle = async () => {
    if (!itinerary || !titleInput.trim()) return;
    try {
      await fetch(`/api/pengunjung/itinerary/${itinerary.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleInput.trim() }),
      });
      setItinerary({ ...itinerary, title: titleInput.trim() });
      setEditingTitle(false);
    } catch (e) {
      console.error(e);
    }
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
  };
  const handleDragEnd = async () => {
    setDragIdx(null);
    if (!itinerary) return;
    await fetch(`/api/pengunjung/itinerary/${itinerary.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: itinerary.items.map((item, idx) => ({ id: item.id, order: idx + 1 })),
      }),
    });
    await fetchItinerary();
  };

  // Tombol "Mulai Navigasi" — cek GPS terbaru vs lokasi awal itinerary
  const handleStartNavigationClick = () => {
    if (!itinerary) return;
    const hasStartPoint = itinerary.startLat && itinerary.startLng;
    const gpsDifferent =
      hasStartPoint && location
        ? isLocationSignificantlyDifferent(
          itinerary.startLat!, itinerary.startLng!, location.lat, location.lng
        )
        : false;

    if (hasStartPoint && location && gpsDifferent) {
      setShowLocationConfirm(true);
    } else {
      // Tidak ada lokasi awal tersimpan, atau lokasi GPS sama saja -> langsung mulai
      startNavigation(!hasStartPoint && !!location);
    }
  };

  const startNavigation = async (useCurrentLocation: boolean) => {
    if (!itinerary) return;
    setStartingNav(true);
    try {
      await fetch(`/api/pengunjung/itinerary/${itinerary.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useCurrentLocation,
          currentLat: location?.lat,
          currentLng: location?.lng,
        }),
      });
      setShowLocationConfirm(false);
      router.push("/pengunjung/navigasi");
    } catch (e) {
      console.error(e);
    } finally {
      setStartingNav(false);
    }
  };

  const routeItemsForMap = itinerary?.items.map((item, idx) => ({ destinationId: item.destination.id, order: idx + 1 })) || [];
  const existingIds = itinerary?.items.map((i) => i.destination.id) || [];

  if (!userLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Route size={48} className="mx-auto mb-4 text-[#f97316] opacity-40" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Masuk untuk Melihat Rencana</h2>
        <Link href="/auth/login?redirect=/pengunjung/rencana"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#006837]" size={32} />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Route size={48} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Rencana Tidak Ditemukan</h2>
        <Link href="/pengunjung/rencana"
          className="inline-flex px-6 py-3 bg-[#006837] text-white rounded-xl font-semibold text-sm">
          Kembali ke Rencana
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/pengunjung/rencana" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <nav className="text-sm text-gray-500">
          <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/pengunjung/rencana" className="hover:text-[#006837]">Rencana</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{itinerary.title}</span>
        </nav>
      </div>

      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                className="text-2xl font-bold text-gray-900 border-b-2 border-[#006837] focus:outline-none bg-transparent"
              />
              <button onClick={handleSaveTitle} className="p-1.5 rounded-lg bg-[#006837] text-white">
                <Check size={16} />
              </button>
              <button onClick={() => { setEditingTitle(false); setTitleInput(itinerary.title); }} className="p-1.5 rounded-lg bg-gray-100 text-gray-500">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">{itinerary.title}</h1>
              <button onClick={() => setEditingTitle(true)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition-all shrink-0">
                <PenLine size={14} className="text-gray-400" />
              </button>
            </div>
          )}
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            {formatTripDate(itinerary.tripDate)}
            {itinerary.isAiGenerated && <span className="text-[#006837] font-semibold">· ✨ AI</span>}
          </p>
        </div>
      </div>

      {itinerary.items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-[#006837]/10 flex items-center justify-center mx-auto mb-4">
            <Route size={36} className="text-[#006837]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Destinasi</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Tambahkan destinasi dari daftar tersimpan atau jelajahi kategori wisata.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors shadow-md"
          >
            <Plus size={15} />
            Tambah Destinasi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{itinerary.items.length} destinasi</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 text-xs text-[#006837] font-bold hover:underline"
              >
                <Plus size={13} /> Tambah Destinasi
              </button>
            </div>

            {[...itinerary.items].sort((a, b) => a.order - b.order).map((item, idx) => {
              const open = isOpenNow(item.destination.openTime, item.destination.closeTime);
              return (
                <div key={item.id} draggable={dragEnabled === idx}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl border border-gray-100 flex gap-3 p-4 shadow-sm transition-all ${dragIdx === idx ? "opacity-40 scale-95" : "hover:shadow-md"}`}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded-lg"
                      onMouseEnter={() => setDragEnabled(idx)}
                      onMouseLeave={() => setDragEnabled(null)}
                      onTouchStart={() => setDragEnabled(idx)}
                      onTouchEnd={() => setDragEnabled(null)}
                    >
                      <GripVertical size={24} className="text-gray-400" />
                    </div>
                    <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mt-1 ${item.visited ? "bg-green-500" : "bg-[#f97316]"}`}>
                      {item.visited ? <Check size={13} /> : idx + 1}
                    </div>
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
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 -mr-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors shrink-0" title="Hapus dari rencana">
                        <Trash2 size={20} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 line-clamp-1"><MapPin size={10} />{item.destination.address}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.visitTime && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#006837] bg-[#006837]/10 px-2 py-0.5 rounded-full">
                          <Clock size={10} />{item.visitTime}
                        </span>
                      )}
                      <span className={`text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                        {open ? "• Buka" : "• Tutup"}
                      </span>
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

            <button onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-[#006837] hover:text-[#006837] transition-colors">
              <Plus size={15} />
              Tambah Destinasi
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
              {itinerary.status === "selesai" ? (
                <div className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white rounded-xl font-bold text-sm">
                  <Check size={15} /> Perjalanan Selesai
                </div>
              ) : itinerary.status === "aktif" ? (
                <Link href="/pengunjung/navigasi"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors">
                  <Navigation size={15} />
                  Lanjutkan Navigasi
                </Link>
              ) : (
                <button
                  onClick={handleStartNavigationClick}
                  disabled={startingNav}
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-60"
                >
                  {startingNav ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
                  Mulai Navigasi
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={13} className="text-[#006837]" />
                  Pratinjau Rute
                </span>
                <Link href={`/pengunjung/peta-rute?id=${itinerary.id}`} className="text-xs text-[#006837] flex items-center gap-1 hover:underline">
                  Buka Peta Penuh <ExternalLink size={11} />
                </Link>
              </div>
              <MapViewClient
                destinations={itinerary.items.map((i) => ({ ...i.destination, visitCount: 0 }))}
                userLocation={location} height="240px"
                activeCategories={["Wisata Alam", "Wisata Budaya", "Wisata Kuliner", "Wisata Edukasi", "Wisata Hiburan", "Wisata Belanja", "Wisata Religi"]}
                showRouteOrder={true} routeItems={routeItemsForMap}
              />
            </div>
          </div>
        </div>
      )}

      <AddDestinationModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        existingIds={existingIds}
        onAdd={handleAddDestinations}
      />

      {/* Modal konfirmasi lokasi sebelum mulai navigasi */}
      {showLocationConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <AlertCircle size={22} className="text-amber-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5">Lokasimu Sudah Berubah</h3>
            <p className="text-sm text-gray-500 mb-5">
              Lokasimu sekarang berbeda dari saat rencana ini dibuat. Mau urutkan ulang rute berdasarkan lokasi saat ini, atau tetap pakai urutan yang sudah ada?
            </p>
            <div className="space-y-2">
              <button
                onClick={() => startNavigation(true)}
                disabled={startingNav}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-60"
              >
                {startingNav ? <Loader2 size={15} className="animate-spin" /> : <Crosshair size={15} />}
                Gunakan Lokasi Sekarang
              </button>
              <button
                onClick={() => startNavigation(false)}
                disabled={startingNav}
                className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Tetap Pakai Rute Asli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
