"use client";
// app/pengunjung/components/MiniMapClient.tsx
// Peta mini untuk detail destinasi

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface MiniMapClientProps {
  lat: number;
  lng: number;
  name: string;
  height?: string;
}

export default function MiniMapClient({ lat, lng, name, height = "192px" }: MiniMapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:#f97316;border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          transform:rotate(-45deg);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(name).openPopup();

      mapRef.current = map;
    };

    init();

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [lat, lng, name]);

  return <div ref={containerRef} style={{ height, width: "100%" }} />;
}
