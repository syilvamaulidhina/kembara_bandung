"use client";
// app/pengunjung/components/AddToItineraryModal.tsx
// BARU: dipanggil dari kartu destinasi di halaman /pengunjung/tersimpan saat
// klik "Tambah ke Rencana". Menampilkan daftar itinerary milik user,
// destinasi langsung ditambahkan ke itinerary yang dipilih tanpa membuka
// halaman detail itinerary.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Loader2, Route, Check, Plus } from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { formatTripDate } from "@/lib/utils";

interface ItinerarySummary {
  id: number;
  title: string;
  tripDate: string | null;
  status: "draft" | "aktif" | "selesai";
  totalItems: number;
  items: { destination: { id: number } }[];
}

interface AddToItineraryModalProps {
  open: boolean;
  onClose: () => void;
  destinationId: number | null;
  destinationName?: string;
}

export default function AddToItineraryModal({
  open,
  onClose,
  destinationId,
  destinationName,
}: AddToItineraryModalProps) {
  const { user } = useLocalUser();
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  const fetchItineraries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pengunjung/itinerary?userId=${user.id}`);
      const json = await res.json();
      if (json.success) setItineraries(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchItineraries();
      setAddedId(null);
    }
  }, [open, fetchItineraries]);

  if (!open) return null;

  const handleAdd = async (itineraryId: number) => {
    if (!destinationId) return;
    setAddingId(itineraryId);
    try {
      const res = await fetch(`/api/pengunjung/itinerary/${itineraryId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationIds: [destinationId] }),
      });
      const json = await res.json();
      if (json.success) setAddedId(itineraryId);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">Tambah ke Rencana</h3>
            {destinationName && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{destinationName}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#006837]" size={28} />
            </div>
          ) : itineraries.length === 0 ? (
            <div className="text-center py-10">
              <Route size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400 mb-4">Belum ada rencana perjalanan</p>
              <Link
                href="/pengunjung/rencana"
                className="inline-flex px-4 py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold"
              >
                Buat Rencana Baru
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {itineraries.map((it) => {
                const alreadyIn = it.items.some((i) => i.destination.id === destinationId);
                const isAdded = addedId === it.id || alreadyIn;
                return (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#006837]/10 flex items-center justify-center shrink-0">
                      <Route size={16} className="text-[#006837]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{it.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTripDate(it.tripDate)} · {it.totalItems} destinasi
                      </p>
                    </div>
                    <button
                      onClick={() => !isAdded && handleAdd(it.id)}
                      disabled={isAdded || addingId === it.id}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        isAdded
                          ? "bg-green-50 text-green-600"
                          : "bg-[#f97316] text-white hover:bg-[#ea6a0a]"
                      }`}
                    >
                      {addingId === it.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check size={13} /> Ditambahkan
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> Tambah
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {itineraries.length > 0 && (
          <div className="p-4 border-t border-gray-100 shrink-0">
            <Link
              href="/pengunjung/rencana"
              className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#006837] hover:text-[#006837] transition-colors"
            >
              <Plus size={14} /> Buat Rencana Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
