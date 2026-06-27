"use client";
// app/pengunjung/components/LocationPickerModal.tsx
// BARU: modal pilih titik awal untuk acuan optimasi rute AI saat membuat
// itinerary. 3 opsi: GPS saat ini, titik pusat Kota Bandung, atau klik
// manual di peta. Dipakai di halaman buat-itinerary (mode AI).

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, MapPin, Crosshair, Building2, Loader2, Check } from "lucide-react";
import { BANDUNG_BOUNDS } from "@/lib/types";

const PickerMapClient = dynamic(() => import("./PickerMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={24} />
    </div>
  ),
});

export interface PickedLocation {
  lat: number;
  lng: number;
  label: string;
  type: "gps" | "bandung" | "manual";
}

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (location: PickedLocation) => void;
  gpsLocation: { lat: number; lng: number } | null;
  gpsLoading?: boolean;
  onRequestGps?: () => void;
}

export default function LocationPickerModal({
  open,
  onClose,
  onConfirm,
  gpsLocation,
  gpsLoading = false,
  onRequestGps,
}: LocationPickerModalProps) {
  const [selected, setSelected] = useState<"gps" | "bandung" | "manual" | null>(null);
  const [manualPoint, setManualPoint] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setManualPoint(null);
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    if (selected === "gps" && gpsLocation) {
      onConfirm({ ...gpsLocation, label: "Lokasi GPS Saat Ini", type: "gps" });
    } else if (selected === "bandung") {
      onConfirm({
        lat: BANDUNG_BOUNDS.center.lat,
        lng: BANDUNG_BOUNDS.center.lng,
        label: "Pusat Kota Bandung",
        type: "bandung",
      });
    } else if (selected === "manual" && manualPoint) {
      onConfirm({ ...manualPoint, label: "Lokasi Pilihan Manual", type: "manual" });
    }
  };

  const canConfirm =
    (selected === "gps" && !!gpsLocation) ||
    selected === "bandung" ||
    (selected === "manual" && !!manualPoint);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900">Titik Awal Perjalanan</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-500 -mt-1 mb-2">
            Lokasi ini hanya dipakai AI untuk menentukan urutan destinasi paling efisien.
          </p>

          {/* Opsi GPS */}
          <button
            onClick={() => {
              setSelected("gps");
              if (!gpsLocation) onRequestGps?.();
            }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
              selected === "gps" ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#006837]/10 flex items-center justify-center shrink-0">
              <Crosshair size={18} className="text-[#006837]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Gunakan GPS Saat Ini</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {selected === "gps" && gpsLoading
                  ? "Mendapatkan lokasi..."
                  : selected === "gps" && gpsLocation
                  ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}`
                  : "Lokasimu sekarang"}
              </p>
            </div>
            {selected === "gps" && gpsLoading && (
              <Loader2 size={16} className="animate-spin text-[#006837]" />
            )}
            {selected === "gps" && gpsLocation && !gpsLoading && (
              <Check size={16} className="text-[#006837]" />
            )}
          </button>

          {/* Opsi Pusat Kota Bandung */}
          <button
            onClick={() => setSelected("bandung")}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
              selected === "bandung" ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#f97316]/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-[#f97316]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Pusat Kota Bandung</p>
              <p className="text-xs text-gray-400 mt-0.5">Titik default, cocok jika belum tahu mulai dari mana</p>
            </div>
            {selected === "bandung" && <Check size={16} className="text-[#006837]" />}
          </button>

          {/* Opsi manual klik peta */}
          <button
            onClick={() => setSelected("manual")}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
              selected === "manual" ? "border-[#006837] bg-[#006837]/5" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Pilih di Peta</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {manualPoint
                  ? `${manualPoint.lat.toFixed(4)}, ${manualPoint.lng.toFixed(4)}`
                  : "Klik titik manapun di peta"}
              </p>
            </div>
            {selected === "manual" && manualPoint && <Check size={16} className="text-[#006837]" />}
          </button>

          {selected === "manual" && (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <PickerMapClient
                value={manualPoint}
                onPick={(lat, lng) => setManualPoint({ lat, lng })}
              />
            </div>
          )}
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gunakan Lokasi Ini
          </button>
        </div>
      </div>
    </div>
  );
}
