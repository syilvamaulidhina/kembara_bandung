"use client";
// app/pengunjung/rencana/page.tsx — GANTI TOTAL v7
// Dulu: 1 user = 1 itinerary, halaman ini langsung tampilkan itinerary
// (atau form pilih destinasi dari tersimpan).
// Sekarang: halaman ini jadi PUSAT PENGELOLAAN ITINERARY —
// - Section "Perjalanan Aktif" di atas (kalau ada itinerary status aktif)
// - List semua itinerary milik user (draft/aktif/selesai)
// - Tombol "Buat Rencana Baru" -> CreateItineraryModal
// - Tombol hapus per itinerary
// Detail/edit itinerary dipindah ke /pengunjung/rencana/[id]

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Route, Plus, MapPin, Clock, Trash2, Loader2, ArrowLeft,
  Sparkles, Bot, PenLine, ChevronRight, Navigation, CheckCircle2
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { formatTripDate, formatRupiah, getImageUrl } from "@/lib/utils";
import CreateItineraryModal from "../components/CreateItineraryModal";

interface ItineraryListItem {
  id: number;
  title: string;
  tripDate: string | null;
  status: "draft" | "aktif" | "selesai";
  isAiGenerated: boolean;
  totalDistance: number | null;
  estimatedCost: number | null;
  visitedCount: number;
  totalItems: number;
  items: {
    destination: { id: number; name: string; imageUrl: string | null };
  }[];
}

interface ActiveItinerary extends ItineraryListItem {
  nextDestination: { id: number; name: string; imageUrl: string | null } | null;
}

export default function RencanaPage() {
  const { user, loading: userLoading } = useLocalUser();
  const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [listRes, activeRes] = await Promise.all([
        fetch(`/api/pengunjung/itinerary?userId=${user.id}`),
        fetch(`/api/pengunjung/itinerary/active?userId=${user.id}`),
      ]);
      const listJson = await listRes.json();
      const activeJson = await activeRes.json();
      if (listJson.success) setItineraries(listJson.data);
      if (activeJson.success) setActiveTrip(activeJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) fetchAll();
    else if (!userLoading && !user) setLoading(false);
  }, [user, userLoading, fetchAll]);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus rencana perjalanan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/pengunjung/itinerary/${id}`, { method: "DELETE" });
      setItineraries((prev) => prev.filter((it) => it.id !== id));
      if (activeTrip?.id === id) setActiveTrip(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#006837]" size={32} />
      </div>
    );
  }

  // Itinerary non-aktif yang ditampilkan di list bawah (aktif sudah tampil di section khusus)
  const otherItineraries = itineraries.filter((it) => it.id !== activeTrip?.id);

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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea6a0a] transition-colors shadow-md"
        >
          <Sparkles size={15} />
          Buat Rencana Baru
        </button>
      </div>

      {/* SECTION: PERJALANAN AKTIF */}
      {activeTrip && (
        <div className="mb-8 bg-gradient-to-r from-[#1a3a2a] to-[#006837] rounded-2xl p-5 md:p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Perjalanan Aktif</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">{activeTrip.title}</h2>
              <p className="text-sm text-white/70 mb-3">{formatTripDate(activeTrip.tripDate)}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="font-semibold">{activeTrip.visitedCount}/{activeTrip.totalItems}</span>
                  <span className="text-white/60">destinasi dikunjungi</span>
                </div>
              </div>
              {activeTrip.nextDestination && (
                <p className="text-sm text-white/70 mt-2">
                  Berikutnya: <span className="font-semibold text-white">{activeTrip.nextDestination.name}</span>
                </p>
              )}
            </div>
            <Link
              href="/pengunjung/navigasi"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors shrink-0"
            >
              <Navigation size={16} />
              Lanjutkan Navigasi
            </Link>
          </div>
        </div>
      )}

      {/* LIST ITINERARY */}
      {otherItineraries.length === 0 && !activeTrip ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-[#006837]/10 flex items-center justify-center mx-auto mb-4">
            <Route size={36} className="text-[#006837]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Rencana</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Buat rencana perjalanan pertamamu, bisa disusun manual atau dibantu AI.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors shadow-md"
          >
            <Sparkles size={15} />
            Mulai Buat Rencana
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherItineraries.map((it) => (
            <ItineraryCard
              key={it.id}
              itinerary={it}
              onDelete={() => handleDelete(it.id)}
              deleting={deletingId === it.id}
            />
          ))}
        </div>
      )}

      <CreateItineraryModal open={showCreateModal} onClose={() => { setShowCreateModal(false); fetchAll(); }} />
    </div>
  );
}

function ItineraryCard({
  itinerary,
  onDelete,
  deleting,
}: {
  itinerary: ItineraryListItem;
  onDelete: () => void;
  deleting: boolean;
}) {
  const previewImages = itinerary.items.slice(0, 3);
  const statusBadge =
    {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-500" },
      aktif: { label: "Aktif", className: "bg-[#006837]/10 text-[#006837]" },
      selesai: { label: "Selesai", className: "bg-blue-50 text-blue-600" },
    }[itinerary.status] ?? { label: "Unknown", className: "bg-gray-100 text-gray-500" };


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <Link href={`/pengunjung/rencana/${itinerary.id}`} className="block">
        <div className="relative h-32 flex">
          {previewImages.length > 0 ? (
            previewImages.map((item, idx) => (
              <div key={idx} className="flex-1 relative overflow-hidden border-r border-white last:border-r-0">
                <img
                  src={getImageUrl(item.destination.imageUrl, item.destination.name)}
                  alt={item.destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.destination.name)}&background=006837&color=fff&size=200`;
                  }}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Route size={28} className="text-gray-300" />
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
            {itinerary.isAiGenerated && (
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/90 text-[#f97316] flex items-center gap-1">
                <Bot size={10} /> AI
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/pengunjung/rencana/${itinerary.id}`}>
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 hover:text-[#006837] transition-colors">
            {itinerary.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mb-3">{formatTripDate(itinerary.tripDate)}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {itinerary.totalItems} destinasi
          </span>
          {itinerary.totalDistance !== null && itinerary.totalDistance > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {itinerary.totalDistance.toFixed(1)} km
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/pengunjung/rencana/${itinerary.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#006837]/5 text-[#006837] rounded-xl text-xs font-bold hover:bg-[#006837]/10 transition-colors"
          >
            Lihat Detail <ChevronRight size={13} />
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
