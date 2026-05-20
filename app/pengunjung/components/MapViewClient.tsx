"use client";
// app/pengunjung/components/MapViewClient.tsx
// Peta interaktif Leaflet dengan heatmap dan marker wisata
// Dibatasi area Bandung Raya saja

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

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
  onMarkerClick?: (id: number) => void;
}

export default function MapViewClient({
  destinations,
  userLocation,
  height = "500px",
  showHeatmap = true,
  onMarkerClick,
}: MapViewClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default icon path issue in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Bandung center
      const BANDUNG_CENTER: [number, number] = [-6.9175, 107.6191];

      const map = L.map(containerRef.current!, {
        center: BANDUNG_CENTER,
        zoom: 12,
        maxBounds: L.latLngBounds(
          L.latLng(-7.35, 107.3), // SW
          L.latLng(-6.55, 108.0)  // NE
        ),
        maxBoundsViscosity: 0.9,
      });

      // Tile layer - CartoDB dark style (cocok dengan desain)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;

      // Custom destination marker icon
      const createDestIcon = (category: string) => {
        const colors: Record<string, string> = {
          Alam: "#16a34a",
          Budaya: "#d97706",
          Kuliner: "#dc2626",
          Fashion: "#7c3aed",
          Hotel: "#0891b2",
        };
        const color = colors[category] || "#1a6b3c";
        return L.divIcon({
          className: "",
          html: `<div style="
            width:32px;height:32px;border-radius:50% 50% 50% 0;
            background:${color};border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            transform:rotate(-45deg);
            display:flex;align-items:center;justify-content:center;
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -35],
        });
      };

      // Add destination markers
      destinations.forEach((dest) => {
        const categoryName = dest.categories?.[0]?.category?.name || "Alam";
        const icon = createDestIcon(categoryName);

        const marker = L.marker([dest.latitude, dest.longitude], { icon }).addTo(map);

        // Popup content
        const rating = dest.averageRating ? `⭐ ${dest.averageRating.toFixed(1)}` : "";
        const price =
          dest.ticketPrice === 0
            ? "Gratis"
            : dest.ticketPrice
            ? `Rp ${dest.ticketPrice.toLocaleString("id-ID")}`
            : "";

        marker.bindPopup(`
          <div style="min-width:180px;font-family:sans-serif;">
            ${dest.imageUrl ? `<img src="${dest.imageUrl}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" onerror="this.style.display='none'" />` : ""}
            <div style="font-weight:700;font-size:14px;color:#111;margin-bottom:4px;">${dest.name}</div>
            <div style="display:flex;gap:8px;font-size:12px;color:#666;margin-bottom:8px;">
              ${rating ? `<span>${rating}</span>` : ""}
              ${price ? `<span style="color:#1a6b3c;font-weight:600;">${price}</span>` : ""}
            </div>
            <a href="/pengunjung/destinasi/${dest.id}" 
               style="display:block;padding:6px 12px;background:#1a6b3c;color:white;border-radius:8px;text-align:center;text-decoration:none;font-size:12px;font-weight:600;">
              Lihat Detail →
            </a>
          </div>
        `, { maxWidth: 220 });

        marker.on("click", () => {
          onMarkerClick?.(dest.id);
        });
      });

      // Heatmap layer
      if (showHeatmap && destinations.length > 0) {
        try {
          // Dynamic import leaflet.heat
          const heatData = destinations.map((d) => [
            d.latitude,
            d.longitude,
            Math.min(d.visitCount / 100, 1),
          ]);

          // Inline heatmap implementation (tanpa plugin)
          // Menggunakan circle layers sebagai simulasi heatmap
          destinations.forEach((dest) => {
            const intensity = Math.min(dest.visitCount / 500, 1);
            const radius = 300 + intensity * 700;
            L.circle([dest.latitude, dest.longitude], {
              radius,
              color: "transparent",
              fillColor: intensity > 0.6 ? "#ef4444" : intensity > 0.3 ? "#f97316" : "#22c55e",
              fillOpacity: 0.08 + intensity * 0.12,
            }).addTo(map);
          });
        } catch (e) {
          console.log("Heatmap skipped:", e);
        }
      }

      // User location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:#3b82f6;border:3px solid white;
            box-shadow:0 0 0 4px rgba(59,130,246,0.3);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<b>Lokasi Anda</b>");

        // Pan to user location
        map.setView([userLocation.lat, userLocation.lng], 13);
      }

      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update user location marker when it changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
  }, [userLocation]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Memuat peta...</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
