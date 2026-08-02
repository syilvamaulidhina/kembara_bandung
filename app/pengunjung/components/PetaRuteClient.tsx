"use client";
// app/pengunjung/components/PetaRuteClient.tsx
// Peta rute penuh: marker bernomor + garis rute OSRM antar destinasi

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface RouteItem {
  id: number;
  order: number;
  visitTime: string | null;
  destination: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string | null;
    ticketPrice: number | null;
  };
}

interface PetaRuteClientProps {
  items: RouteItem[];
  userLocation: { lat: number; lng: number } | null;
  activeIdx: number | null;
  onMarkerClick: (idx: number) => void;
}

const BANDUNG_CENTER: [number, number] = [-6.9175, 107.6191];

export default function PetaRuteClient({
  items,
  userLocation,
  activeIdx,
  onMarkerClick,
}: PetaRuteClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      LRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current!, {
        center: BANDUNG_CENTER,
        zoom: 12,
        zoomControl: false,
      });

      // Dark tile untuk nuansa navigasi
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: "© OSM © CARTO", maxZoom: 19 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      // User location
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "",
          html: `<div style="position:relative;width:18px;height:18px;">
            <div style="position:absolute;inset:-5px;border-radius:50%;background:rgba(59,130,246,0.25);animation:gpsPulse 2s infinite;"></div>
            <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 8px rgba(59,130,246,0.5);"></div>
          </div>
          <style>@keyframes gpsPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(2.2);opacity:0}}</style>`,
          iconSize: [18, 18], iconAnchor: [9, 9],
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map).bindPopup("<b>Lokasi Anda</b>");
      }

      // Add numbered markers
      items.forEach((item, idx) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:36px;height:36px;border-radius:50%;
            background:#f97316;border:3px solid white;
            box-shadow:0 3px 12px rgba(249,115,22,0.4);
            display:flex;align-items:center;justify-content:center;
            font-weight:bold;font-size:14px;color:white;
            cursor:pointer;transition:transform .2s;
          ">${idx + 1}</div>`,
          iconSize: [36, 36], iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const marker = L.marker(
          [item.destination.latitude, item.destination.longitude],
          { icon, zIndexOffset: 1000 - idx }
        ).addTo(map);

        marker.bindPopup(`
          <div style="min-width:160px;font-family:sans-serif;">
            ${item.destination.imageUrl ? `<img src="${item.destination.imageUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px;" onerror="this.style.display='none'"/>` : ""}
            <div style="font-size:11px;color:#f97316;font-weight:700;margin-bottom:2px;">DESTINASI ${idx + 1}</div>
            <div style="font-weight:700;font-size:13px;color:#111;margin-bottom:4px;">${item.destination.name}</div>
            ${item.visitTime ? `<div style="font-size:11px;color:#006837;">🕐 ${item.visitTime}</div>` : ""}
            <a href="/pengunjung/destinasi/${item.destination.id}"
               style="display:block;margin-top:6px;padding:4px 8px;background:#006837;color:white;border-radius:5px;text-align:center;text-decoration:none;font-size:11px;font-weight:600;">
              Detail →
            </a>
          </div>
        `, { maxWidth: 190 });

        marker.on("click", () => onMarkerClick(idx));
        markersRef.current.push(marker);
      });

      // Draw OSRM routes between consecutive destinations
      await drawAllRoutes(L, map, items, userLocation);

      // Fit map to all markers
      if (items.length > 0) {
        const allCoords: [number, number][] = items.map(i => [i.destination.latitude, i.destination.longitude]);
        if (userLocation) allCoords.push([userLocation.lat, userLocation.lng]);
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    };

    init();
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Open popup when activeIdx changes
  useEffect(() => {
    if (activeIdx !== null && markersRef.current[activeIdx] && mapRef.current) {
      markersRef.current[activeIdx].openPopup();
      const dest = items[activeIdx]?.destination;
      if (dest) mapRef.current.setView([dest.latitude, dest.longitude], 15, { animate: true });
    }
  }, [activeIdx]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

async function drawAllRoutes(
  L: any,
  map: LeafletMap,
  items: RouteItem[],
  userLocation: { lat: number; lng: number } | null
) {
  // Build waypoints: userLocation → dest1 → dest2 → ...
  const waypoints: [number, number][] = [];
  if (userLocation) waypoints.push([userLocation.lat, userLocation.lng]);
  items.forEach(i => waypoints.push([i.destination.latitude, i.destination.longitude]));

  if (waypoints.length < 2) return;

  // Draw segment by segment
  const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b"];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [startLat, startLng] = waypoints[i];
    const [endLat, endLng] = waypoints[i + 1];
    const color = colors[i % colors.length];

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );
      const data = await res.json();

      if (data.routes?.[0]?.geometry) {
        const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        // Garis utama
        L.polyline(coords, {
          color,
          weight: 5,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Garis bayangan
        L.polyline(coords, {
          color: "white",
          weight: 9,
          opacity: 0.3,
          lineCap: "round",
        }).addTo(map);

        // Arrow di tengah rute
        const midIdx = Math.floor(coords.length / 2);
        if (midIdx > 0 && midIdx < coords.length) {
          const [lat1, lng1] = coords[midIdx - 1];
          const [lat2, lng2] = coords[midIdx];
          const angle = Math.atan2(lat2 - lat1, lng2 - lng1) * (180 / Math.PI);
          const arrowIcon = L.divIcon({
            className: "",
            html: `<div style="
              width:20px;height:20px;
              display:flex;align-items:center;justify-content:center;
              transform:rotate(${angle}deg);
              font-size:16px;
            ">→</div>`,
            iconSize: [20, 20], iconAnchor: [10, 10],
          });
          L.marker([lat2, lng2], { icon: arrowIcon, interactive: false }).addTo(map);
        }
      }
    } catch {
      // Fallback straight line
      L.polyline([[startLat, startLng], [endLat, endLng]], {
        color, weight: 4, dashArray: "8, 6", opacity: 0.7,
      }).addTo(map);
    }
  }
}
