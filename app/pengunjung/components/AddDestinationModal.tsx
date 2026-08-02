"use client";
// app/pengunjung/components/AddDestinationModal.tsx
// BARU: modal "Tambah Destinasi" di halaman detail itinerary.
// Tab "Tersimpan" -> semua SavedDestination user + tombol "Tambahkan Semua".
// Tab kategori -> destinasi dari /api/pengunjung/destinations?category=...
// dipisah per kategori sesuai data di database.

import { useState, useEffect, useCallback } from "react";
import { X, Loader2, Search, Check, Heart } from "lucide-react";
import { getImageUrl, isOpenNow } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";
import { useLocalUser } from "@/lib/hooks/useLocalUser";

interface DestItem {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  ticketPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  categories: { category: { name: string } }[];
}

interface AddDestinationModalProps {
  open: boolean;
  onClose: () => void;
  existingIds: number[]; // destinasi yang sudah ada di itinerary, untuk disable
  onAdd: (destinationIds: number[]) => Promise<void>;
}

type Tab = "tersimpan" | string; // "tersimpan" atau nama kategori

export default function AddDestinationModal({
  open,
  onClose,
  existingIds,
  onAdd,
}: AddDestinationModalProps) {
  const { user } = useLocalUser();
  const [tab, setTab] = useState<Tab>("tersimpan");
  const [items, setItems] = useState<DestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (tab === "tersimpan") {
        const res = await fetch(`/api/pengunjung/saved?userId=${user.id}`);
        const json = await res.json();
        if (json.success) setItems(json.data);
      } else {
        const params = new URLSearchParams({ category: tab, limit: "30" });
        const res = await fetch(`/api/pengunjung/destinations?${params}`);
        const json = await res.json();
        if (json.success) setItems(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, tab]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, tab, fetchData]);

  useEffect(() => {
    if (!open) {
      setSelected(new Set());
      setSearch("");
      setTab("tersimpan");
    }
  }, [open]);

  if (!open) return null;

  const filtered = items.filter(
    (d) =>
      !existingIds.includes(d.id) &&
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleAddAll = async () => {
    const allIds = filtered.map((d) => d.id);
    if (allIds.length === 0) return;
    setSubmitting(true);
    await onAdd(allIds);
    setSubmitting(false);
    onClose();
  };

  const handleAddSelected = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    await onAdd(Array.from(selected));
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900">Tambah Destinasi</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 border-b border-gray-100 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setTab("tersimpan")}
            className={`px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              tab === "tersimpan" ? "border-[#f97316] text-[#f97316]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Heart size={13} />
            Tersimpan
          </button>
          {CATEGORIES.filter((c) => c.slug !== "populer").map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setTab(cat.name)}
              className={`px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === cat.name ? "border-[#f97316] text-[#f97316]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {cat.displayName}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-5 pt-3 shrink-0">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#006837]">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi..."
              className="flex-1 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#006837]" size={28} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              {tab === "tersimpan"
                ? "Tidak ada destinasi tersimpan yang bisa ditambahkan"
                : "Tidak ada destinasi di kategori ini"}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((dest) => {
                const open = isOpenNow(dest.openTime, dest.closeTime);
                const isSelected = selected.has(dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => toggleSelect(dest.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${
                      isSelected ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(dest.imageUrl, dest.name)}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&background=006837&color=fff&size=96`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{dest.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{dest.address}</p>
                      <span className={`text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                        {open ? "Buka" : "Tutup"}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#006837] border-[#006837]" : "border-gray-200"
                      }`}
                    >
                      {isSelected && <Check size={13} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
          {tab === "tersimpan" && filtered.length > 0 && (
            <button
              onClick={handleAddAll}
              disabled={submitting}
              className="px-4 py-3 border-2 border-[#006837] text-[#006837] rounded-xl font-semibold text-sm hover:bg-[#006837]/5 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Tambahkan Semua
            </button>
          )}
          <button
            onClick={handleAddSelected}
            disabled={selected.size === 0 || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              `Tambah${selected.size > 0 ? ` (${selected.size})` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
