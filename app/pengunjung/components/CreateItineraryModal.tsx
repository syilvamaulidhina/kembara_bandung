"use client";
// app/pengunjung/components/CreateItineraryModal.tsx
// BARU: modal "Buat Rencana Baru" dari halaman /pengunjung/rencana.
// Step 1: judul + tanggal + pilih metode (Manual / AI)
// Step 2 (manual): langsung create itinerary kosong -> redirect ke detail
// Step 2 (AI): pilih kategori, budget, sumber destinasi, lokasi awal -> generate

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, ArrowLeft, Loader2, Bot, PenLine, ChevronRight,
  Heart, Globe2, Wallet, MapPin
} from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { CATEGORIES, BANDUNG_BOUNDS } from "@/lib/types";
import LocationPickerModal, { PickedLocation } from "./LocationPickerModal";

interface CreateItineraryModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "info" | "ai-detail";
type Method = "Custom Itinerary" | "Smart Itinerary" | null;
type SourceMode = "tersimpan" | "semua" | "kombinasi";

export default function CreateItineraryModal({ open, onClose }: CreateItineraryModalProps) {
  const router = useRouter();
  const { user } = useLocalUser();
  const { location: gpsLocation, loading: gpsLoading, requestLocation } = useGeolocation(false);

  const [step, setStep] = useState<Step>("info");
  const [title, setTitle] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [method, setMethod] = useState<Method>(null);
  const [submitting, setSubmitting] = useState(false);

  // AI detail state
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState<string>("");
  const [sourceMode, setSourceMode] = useState<SourceMode>("kombinasi");
  const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const reset = () => {
    setStep("info");
    setTitle("");
    setTripDate("");
    setMethod(null);
    setSelectedCategories(new Set());
    setBudget("");
    setSourceMode("kombinasi");
    setPickedLocation(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  const toggleCategory = (name: string) => {
    const next = new Set(selectedCategories);
    next.has(name) ? next.delete(name) : next.add(name);
    setSelectedCategories(next);
  };

  // Step 1 lanjut: manual -> create langsung, AI -> ke step detail
  const handleContinue = async () => {
    if (!user || !method) return;

    if (method === "Custom Itinerary") {
      setSubmitting(true);
      try {
        const res = await fetch("/api/pengunjung/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            title: title.trim() || "Rencana Perjalananku",
            tripDate: tripDate || null,
            useAI: false,
          }),
        });
        const json = await res.json();
        if (json.success) {
          handleClose();
          router.push(`/pengunjung/rencana/${json.data.id}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStep("ai-detail");
  };

  // Generate itinerary AI
  const handleGenerateAI = async () => {
    if (!user || !pickedLocation) return;
    setSubmitting(true);
    try {
      // Ambil kandidat destinasi sesuai sumber & kategori & budget
      const params = new URLSearchParams({ limit: "100", userId: String(user.id) });
      if (budget) params.set("maxPrice", budget);

      let candidateIds: number[] = [];

      const fetchByCategory = async (categoryName?: string) => {
        const p = new URLSearchParams(params);
        if (categoryName) p.set("category", categoryName);
        const res = await fetch(`/api/pengunjung/destinations?${p}`);
        const json = await res.json();
        return json.success ? json.data : [];
      };

      let pool: any[] = [];
      if (selectedCategories.size > 0) {
        const results = await Promise.all(
          Array.from(selectedCategories).map((c) => fetchByCategory(c))
        );
        pool = results.flat();
      } else {
        pool = await fetchByCategory();
      }

      // Dedup
      const uniquePool = Array.from(new Map(pool.map((d: any) => [d.id, d])).values());

      if (sourceMode === "tersimpan") {
        candidateIds = uniquePool.filter((d: any) => d.isSaved).map((d: any) => d.id);
      } else if (sourceMode === "semua") {
        candidateIds = uniquePool.map((d: any) => d.id);
      } else {
        // kombinasi: prioritaskan tersimpan, lalu tambahkan sisanya sampai max 8
        const saved = uniquePool.filter((d: any) => d.isSaved);
        const others = uniquePool.filter((d: any) => !d.isSaved);
        candidateIds = [...saved, ...others].slice(0, 8).map((d: any) => d.id);
      }

      if (candidateIds.length === 0) {
        alert("Tidak ada destinasi yang cocok dengan kriteria. Coba ubah kategori atau budget.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/pengunjung/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: title.trim() || "Rencana Perjalananku",
          tripDate: tripDate || null,
          useAI: true,
          destinationIds: candidateIds,
          startLat: pickedLocation.lat,
          startLng: pickedLocation.lng,
          startLabel: pickedLocation.label,
          startType: pickedLocation.type,
        }),
      });
      const json = await res.json();
      if (json.success) {
        handleClose();
        router.push(`/pengunjung/rencana/${json.data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
            {step === "ai-detail" && (
              <button onClick={() => setStep("info")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={18} className="text-gray-500" />
              </button>
            )}
            <h3 className="font-bold text-gray-900 flex-1">
              {step === "info" ? "Buat Rencana Baru" : "Detail untuk AI"}
            </h3>
            <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {step === "info" && (
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Judul Rencana Perjalanan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Liburan Bandung 3 Hari"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#006837] focus:ring-2 focus:ring-[#006837]/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Tanggal Perjalanan
                </label>
                <input
                  type="date"
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#006837] focus:ring-2 focus:ring-[#006837]/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Metode Pembuatan Itinerary
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod("Custom Itinerary")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${method === "Custom Itinerary" ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <PenLine size={22} className="text-[#006837]" />
                    <span className="text-sm font-semibold text-gray-800">Custom Itinerary</span>
                    <span className="text-xs text-gray-400 text-center">Susun sendiri destinasinya</span>
                  </button>
                  <button
                    onClick={() => setMethod("Smart Itinerary")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${method === "Smart Itinerary" ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <Bot size={22} className="text-[#f97316]" />
                    <span className="text-sm font-semibold text-gray-800">Smart Itinerary</span>
                    <span className="text-xs text-gray-400 text-center">Direkomendasikan otomatis</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!method || submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Lanjutkan <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === "ai-detail" && (
            <div className="p-5 space-y-5">
              {/* Kategori */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Kategori Wisata yang Diinginkan
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c.slug !== "populer").map((cat) => {
                    const active = selectedCategories.has(cat.name);
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => toggleCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${active
                            ? "border-[#006837] bg-[#006837] text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                      >
                        {cat.icon} {cat.displayName}
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.size === 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">Tidak pilih kategori = semua kategori dipertimbangkan</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Wallet size={12} /> Batas Anggaran Tiket per Destinasi
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#006837] bg-white"
                >
                  <option value="">Tanpa batas</option>
                  <option value="0">Gratis saja</option>
                  <option value="25000">Maks Rp 25.000</option>
                  <option value="50000">Maks Rp 50.000</option>
                  <option value="100000">Maks Rp 100.000</option>
                  <option value="250000">Maks Rp 250.000</option>
                </select>
              </div>

              {/* Sumber destinasi */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Sumber Destinasi
                </label>
                <div className="space-y-2">
                  {[
                    { value: "tersimpan", label: "Hanya Destinasi Tersimpan", icon: Heart },
                    { value: "semua", label: "Semua Destinasi", icon: Globe2 },
                    { value: "kombinasi", label: "Kombinasi (prioritas tersimpan)", icon: Bot },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSourceMode(opt.value as SourceMode)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-left transition-all ${sourceMode === opt.value ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
                        }`}
                    >
                      <opt.icon size={15} className="text-gray-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lokasi awal */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} /> Lokasi Awal Perjalanan
                </label>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-[#006837] transition-colors"
                >
                  <span className={pickedLocation ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {pickedLocation ? pickedLocation.label : "Pilih lokasi awal..."}
                  </span>
                  <ChevronRight size={15} className="text-gray-400" />
                </button>
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={!pickedLocation || submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menyusun Rencana...
                  </>
                ) : (
                  <>
                    <Bot size={16} /> Buat dengan AI
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <LocationPickerModal
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onConfirm={(loc) => {
          setPickedLocation(loc);
          setShowLocationPicker(false);
        }}
        gpsLocation={gpsLocation}
        gpsLoading={gpsLoading}
        onRequestGps={requestLocation}
      />
    </>
  );
}
