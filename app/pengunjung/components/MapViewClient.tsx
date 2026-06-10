"use client";
// app/pengunjung/components/MapViewClient.tsx
// Peta Leaflet – dibatasi area Bandung Raya + Subang
// Kategori filter: klik kategori → tampil pin berwarna per kategori

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { CATEGORIES } from "@/lib/types";

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
  showHeatmap?: boolean;
  activeCategories?: string[];   // kategori aktif dari luar
  onMarkerClick?: (id: number) => void;
  showRouteOrder?: boolean;
  routeItems?: { destinationId: number; order: number }[];
}

// Warna pin per kategori
// const CATEGORY_COLORS: Record<string, string> = {
//   Alam:      "#16a34a",
//   Budaya:    "#d97706",
//   Kuliner:   "#dc2626",
//   Fashion:   "#7c3aed",
//   Hotel:     "#0891b2",
//   Populer:   "#e11d48",
// };
const getCategoryColor = (categoryName: string) => {
  return (
    CATEGORIES.find(c => c.name === categoryName)?.color ||
    "#1a6b3c"
  );
};

// Batas wilayah yang ditampilkan
const BANDUNG_SW: [number, number] = [-7.35, 107.2];   // Lebih lebar ke barat (Subang)
const BANDUNG_NE: [number, number] = [-6.4, 108.0];    // Lebih lebar ke utara (Subang)
const BANDUNG_CENTER: [number, number] = [-6.9175, 107.6191];

export default function MapViewClient({
  destinations,
  userLocation,
  height = "500px",
  showHeatmap = true,
  activeCategories = [],
  onMarkerClick,
  showRouteOrder = false,
  routeItems = [],
}: MapViewClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const heatLayersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const LRef = useRef<any>(null);

  // Init map sekali
  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah inisialisasi jika komponen keburu unmount

    if (!containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      
      // CEK PENTING: Hentikan eksekusi jika komponen unmount saat proses import berlangsung
      // ATAU jika map tiba-tiba sudah diinisialisasi oleh proses lain yang berjalan bersamaan
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

      // User location
      if (userLocation) {
        addUserMarker(L, map, userLocation);
        map.setView([userLocation.lat, userLocation.lng], 13);
      }

      if (isMounted) {
        setIsLoaded(true);
      }
    };

    initMap();

    return () => {
      isMounted = false; // Tandai bahwa komponen sedang di-unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers saat activeCategories atau destinations berubah
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    // Hapus heatmap lama
    heatLayersRef.current.forEach(l => mapRef.current?.removeLayer(l));
    heatLayersRef.current = [];

    // Hapus rute lama
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const filtered = activeCategories.length === 0
      ? [] // Tidak ada kategori aktif → hanya tampil user location
      : destinations.filter(d =>
          d.categories?.some(c =>
            activeCategories.includes(c.category.name)
          )
        );

    // Tambah marker
     filtered.forEach(dest => {
    //   const catName = dest.categories?.[0]?.category?.name || "Alam";
    //   const color = CATEGORY_COLORS[catName] || "#1a6b3c";
    const catName = dest.categories?.[0]?.category?.name || "Wisata Alam";
    const color = getCategoryColor(catName);

      // Route order number jika ada
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

    // Heatmap (hanya jika ada kategori aktif)
    if (showHeatmap && filtered.length > 0) {
      filtered.forEach(dest => {
        const intensity = Math.min(dest.visitCount / 500, 1);
        const radius = 400 + intensity * 600;
        const color = intensity > 0.6 ? "#ef4444" : intensity > 0.3 ? "#f97316" : "#22c55e";
        const layer = L.circle([dest.latitude, dest.longitude], {
          radius,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.05 + intensity * 0.1,
        }).addTo(mapRef.current!);
        heatLayersRef.current.push(layer);
      });
    }

    // Gambar garis rute jika routeItems ada
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
  }, [activeCategories, destinations, showHeatmap, showRouteOrder, routeItems]);

  // Update user location
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current || !userLocation) return;
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
  }, [userLocation]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
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

function addUserMarker(L: any, map: LeafletMap, userLocation: { lat: number; lng: number }) {
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
  L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
    .addTo(map)
    .bindPopup("<b>Lokasi Anda</b>");
}