"use client";
// app/pengunjung/components/PickerMapClient.tsx
// BARU: peta mini khusus untuk klik-pilih 1 titik koordinat.
// Dipakai oleh LocationPickerModal (opsi "Pilih di Peta").
// Style mengikuti pola MiniMapClient.tsx yang sudah ada di project.

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { BANDUNG_BOUNDS } from "@/lib/types";

interface PickerMapClientProps {
  value: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
  height?: string;
}

export default function PickerMapClient({
  value,
  onPick,
  height = "224px",
}: PickerMapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<Marker | null>(null);
  const LRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      LRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const center: [number, number] = value
        ? [value.lat, value.lng]
        : [BANDUNG_BOUNDS.center.lat, BANDUNG_BOUNDS.center.lng];

      const map = L.map(containerRef.current!, {
        center,
        zoom: 13,
        maxBounds: L.latLngBounds(
          L.latLng(BANDUNG_BOUNDS.maxBounds[0]),
          L.latLng(BANDUNG_BOUNDS.maxBounds[1])
        ),
        maxBoundsViscosity: 1.0,
        minZoom: 10,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: "© OSM © CARTO", maxZoom: 19 }
      ).addTo(map);

      mapRef.current = map;

      if (value) {
        markerRef.current = createMarker(L, map, value.lat, value.lng);
      }

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        onPick(lat, lng);
      });
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker saat value berubah (termasuk dari klik)
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current) return;

    if (value) {
      if (markerRef.current) {
        markerRef.current.setLatLng([value.lat, value.lng]);
      } else {
        markerRef.current = createMarker(L, mapRef.current, value.lat, value.lng);
      }
    }
  }, [value]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center pointer-events-none">
        <p className="text-xs text-gray-500">Tap/klik di peta untuk pilih titik</p>
      </div>
    </div>
  );
}

function createMarker(L: any, map: LeafletMap, lat: number, lng: number): Marker {
  const icon = L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:#0ea5e9;border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
  return L.marker([lat, lng], { icon }).addTo(map);
}
