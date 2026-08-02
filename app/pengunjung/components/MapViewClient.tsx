"use client";
// app/pengunjung/components/MapViewClient.tsx
// UPDATE: fix bug — marker lokasi user tidak muncul kalau GPS resolve
// SETELAH peta selesai init (kasus umum karena useGeolocation bersifat async).
// Sekarang marker user disimpan di ref terpisah dan di-redraw setiap kali
// userLocation berubah, bukan cuma menggeser kamera.

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, Marker } from "leaflet";
import { getCategoryStyle } from "@/lib/hooks/useCategories";

interface Destination {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  imageUrl?: string | null;
  ticketPrice?: number | null;
  averageRating?: number | null;
  categories?: { category: { name: string } }[];
}

interface MapViewClientProps {
  destinations: Destination[];
  userLocation?: { lat: number; lng: number } | null;
  height?: string;

  activeCategories?: string[];   // kategori aktif dari luar
  onMarkerClick?: (id: number) => void;
  showRouteOrder?: boolean;
  routeItems?: { destinationId: number; order: number }[];
}

const getCategoryColor = (categoryName: string) => {
  return getCategoryStyle(categoryName).color;
};

// Batas wilayah yang ditampilkan
const BANDUNG_SW: [number, number] = [-7.35, 107.2];
const BANDUNG_NE: [number, number] = [-6.4, 108.0];
const BANDUNG_CENTER: [number, number] = [-6.9175, 107.6191];

export default function MapViewClient({
  destinations,
  userLocation,
  height = "500px",

  activeCategories = [],
  onMarkerClick,
  showRouteOrder = false,
  routeItems = [],
}: MapViewClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<LayerGroup | null>(null);

  const routeLineRef = useRef<any>(null);
  // TAMBAHAN: ref khusus untuk marker lokasi user, terpisah dari markersRef
  // (markersRef di-clear setiap kali filter kategori berubah, marker user TIDAK boleh ikut hilang)
  const userMarkerRef = useRef<Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const LRef = useRef<any>(null);
  // TAMBAHAN: flag agar map hanya auto pan-ke-user SEKALI saat GPS pertama resolve,
  // tidak setiap kali userLocation berubah (misal habis geolocation re-fetch tiap beberapa menit)
  const hasAutoPannedRef = useRef(false);

  // Init map sekali — TIDAK DIUBAH, kecuali addUserMarker dipanggil via fungsi baru
  useEffect(() => {
    let isMounted = true;

    if (!containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || mapRef.current) return;

      LRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current!, {
        center: BANDUNG_CENTER,
        zoom: 12,
        maxBounds: L.latLngBounds(L.latLng(BANDUNG_SW), L.latLng(BANDUNG_NE)),
        maxBoundsViscosity: 1.0,
        minZoom: 10,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: "© OSM © CARTO", maxZoom: 19 }
      ).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      // Kalau GPS SUDAH ada saat map pertama kali init (jarang, tapi mungkin),
      // langsung gambar marker user
      if (userLocation) {
        upsertUserMarker(L, map, userLocation, userMarkerRef);
        map.setView([userLocation.lat, userLocation.lng], 13);
        hasAutoPannedRef.current = true;
      }

      if (isMounted) {
        setIsLoaded(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers destinasi saat activeCategories atau destinations berubah — TIDAK DIUBAH
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();



    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const filtered = destinations;

    filtered.forEach(dest => {
      let catName = dest.categories?.[0]?.category?.name || "Wisata Alam";
      if (activeCategories && activeCategories.length > 0) {
        const matchedActiveCat = activeCategories.find(activeCat => 
          dest.categories?.some(c => c.category?.name === activeCat)
        );
        if (matchedActiveCat) {
          catName = matchedActiveCat;
        }
      }
      const color = getCategoryColor(catName);

      const orderItem = routeItems.find(r => r.destinationId === dest.id);
      const orderNum = orderItem ? orderItem.order : null;

      const icon = L.divIcon({
        className: "",
        html: orderNum
          ? `<div style="
              width:32px;height:32px;border-radius:50%;
              background:${color};border:3px solid white;
              box-shadow:0 2px 10px rgba(0,0,0,0.3);
              display:flex;align-items:center;justify-content:center;
              font-weight:bold;font-size:13px;color:white;
            ">${orderNum}</div>`
          : `<div style="
              width:28px;height:28px;border-radius:50% 50% 50% 0;
              background:${color};border:3px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              transform:rotate(-45deg);
            "></div>`,
        iconSize: [32, 32],
        iconAnchor: orderNum ? [16, 16] : [14, 28],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([dest.latitude, dest.longitude], { icon })
        .addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="min-width:170px;font-family:sans-serif;">
          ${dest.imageUrl ? `<img src="${dest.imageUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:6px;" onerror="this.style.display='none'"/>` : ""}
          <div style="font-weight:700;font-size:13px;color:#111;margin-bottom:2px;">${dest.name}</div>
          <div style="font-size:11px;color:#888;margin-bottom:6px;">
            ${dest.averageRating ? `⭐ ${dest.averageRating.toFixed(1)}` : ""}
            ${dest.ticketPrice === 0 ? " · Gratis" : dest.ticketPrice ? ` · Rp ${dest.ticketPrice.toLocaleString("id-ID")}` : ""}
          </div>
          <a href="/pengunjung/destinasi/${dest.id}"
             style="display:block;padding:5px 10px;background:${color};color:white;border-radius:6px;text-align:center;text-decoration:none;font-size:11px;font-weight:600;">
            Lihat Detail →
          </a>
        </div>
      `, { maxWidth: 200 });

      marker.on("click", () => onMarkerClick?.(dest.id));
    });



    if (showRouteOrder && routeItems.length > 1) {
      const ordered = routeItems
        .sort((a, b) => a.order - b.order)
        .map(r => destinations.find(d => d.id === r.destinationId))
        .filter(Boolean) as Destination[];

      if (ordered.length > 1) {
        const coords: [number, number][] = ordered.map(d => [d.latitude, d.longitude]);
        routeLineRef.current = L.polyline(coords, {
          color: "#f97316",
          weight: 3,
          opacity: 0.8,
          dashArray: "6, 4",
        }).addTo(mapRef.current);
      }
    }
  }, [activeCategories, destinations, showRouteOrder, routeItems]);

  // DIUBAH: dulu cuma setView, sekarang gambar/update marker user juga.
  // Ini yang fix bug "titik lokasi saya tidak muncul kalau GPS resolve belakangan".
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current) return;

    if (userLocation) {
      // Gambar ulang / pindahkan marker user ke posisi terbaru
      upsertUserMarker(L, mapRef.current, userLocation, userMarkerRef);

      // Auto pan ke lokasi user HANYA sekali (saat GPS pertama kali resolve),
      // supaya tidak mengganggu kalau user sedang pan/zoom manual di peta
      if (!hasAutoPannedRef.current) {
        mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
        hasAutoPannedRef.current = true;
      }
    } else {
      // GPS hilang/dicabut izinnya — hapus marker user dari peta
      if (userMarkerRef.current) {
        mapRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      hasAutoPannedRef.current = false;
    }
  }, [userLocation]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden z-0" style={{ height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#006837] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Memuat peta...</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

// DIUBAH: dulu nama fungsinya addUserMarker (selalu nambah baru, bisa duplikat).
// Sekarang upsertUserMarker — kalau marker sudah ada, geser posisinya (setLatLng);
// kalau belum ada, baru buat marker baru. Mencegah marker dobel kalau efek ini
// terpanggil berkali-kali (misal GPS browser update posisi tiap beberapa menit).
function upsertUserMarker(
  L: any,
  map: LeafletMap,
  userLocation: { lat: number; lng: number },
  userMarkerRef: { current: Marker | null }
) {
  if (userMarkerRef.current) {
    userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    return;
  }

  const userIcon = L.divIcon({
    className: "",
    html: `<div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;inset:-4px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulse 2s infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 8px rgba(59,130,246,0.5);"></div>
    </div>
    <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.8);opacity:0}}</style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
    .addTo(map)
    .bindPopup("<b>Lokasi Anda</b>");
}
