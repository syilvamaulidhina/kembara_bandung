"use client";
// app/pengunjung/components/NavigasiMapClient.tsx
// Peta navigasi aktif – tracking GPS real-time, reroute otomatis, dark mode

import { useEffect, useRef, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";

interface NavDest {
  id: number;
  lat: number;
  lng: number;
  name: string;
  checked: boolean;
  order: number;
}

interface NavigasiMapClientProps {
  userLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number; name: string } | null;
  allDestinations: NavDest[];
  currentIdx: number;
}

export default function NavigasiMapClient({
  userLocation,
  destination,
  allDestinations,
  currentIdx,
}: NavigasiMapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const destMarkersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);
  const prevDestRef = useRef<string>("");
  const isFollowingRef = useRef(true);

  const isInitializingRef = useRef(false);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || isInitializingRef.current) return;
    if ((containerRef.current as any)._leaflet_id) return;
    isInitializingRef.current = true;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      LRef.current = L;
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const center: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [-6.9175, 107.6191];

      const map = L.map(containerRef.current!, {
        center,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Terang (Voyager) tile style untuk navigasi (konsisten dengan peta utama)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      // Zoom di kanan bawah
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Attribution kecil
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addAttribution("© OSM © CARTO").addTo(map);

      mapRef.current = map;

      // Stop follow saat user drag peta
      map.on("dragstart", () => { isFollowingRef.current = false; });

      // Re-center button
      const RecenterControl = L.Control.extend({
        onAdd: () => {
          const btn = L.DomUtil.create("button", "");
          btn.innerHTML = "🎯";
          btn.title = "Kembali ke lokasiku";
          btn.style.cssText = `
            width:36px;height:36px;border-radius:50%;background:white;
            border:none;font-size:18px;cursor:pointer;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
          `;
          L.DomEvent.on(btn, "click", () => {
            isFollowingRef.current = true;
            if (userLocation && mapRef.current) {
              mapRef.current.setView([userLocation.lat, userLocation.lng], 16, { animate: true });
            }
          });
          return btn;
        },
      });
      new RecenterControl({ position: "bottomright" }).addTo(map);

      // Add all destination markers
      renderDestMarkers(L, map);

      // User marker
      if (userLocation) {
        userMarkerRef.current = createUserMarker(L, map, userLocation);
        map.setView([userLocation.lat, userLocation.lng], 16);
      }

      // Draw initial route
      if (userLocation && destination) {
        await drawRoute(L, map, userLocation, destination);
      }
    };

    init();
    return () => {
      isInitializingRef.current = false;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Re-render destination markers when checked state changes
  const renderDestMarkers = useCallback((L: any, map: LeafletMap) => {
    destMarkersRef.current.forEach(m => map.removeLayer(m));
    destMarkersRef.current = [];

    allDestinations.forEach((dest, idx) => {
      const isCurrent = idx === currentIdx;
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:${isCurrent ? 40 : 32}px;height:${isCurrent ? 40 : 32}px;
          border-radius:50%;
          background:${dest.checked ? "#22c55e" : isCurrent ? "#f97316" : "rgba(255,255,255,0.8)"};
          border:3px solid ${dest.checked ? "#16a34a" : isCurrent ? "white" : "rgba(255,255,255,0.5)"};
          box-shadow:0 2px 12px rgba(0,0,0,0.4);
          display:flex;align-items:center;justify-content:center;
          font-weight:bold;font-size:${isCurrent ? 15 : 13}px;
          color:${dest.checked ? "white" : isCurrent ? "white" : "#374151"};
          transition:all .3s;
        ">${dest.checked ? "✓" : dest.order}</div>`,
        iconSize: [isCurrent ? 40 : 32, isCurrent ? 40 : 32],
        iconAnchor: [isCurrent ? 20 : 16, isCurrent ? 20 : 16],
      });

      const marker = L.marker([dest.lat, dest.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:140px;">
            <div style="font-size:11px;color:${dest.checked ? "#22c55e" : "#f97316"};font-weight:700;margin-bottom:3px;">
              ${dest.checked ? "✓ SUDAH DIKUNJUNGI" : `DESTINASI ${dest.order}`}
            </div>
            <div style="font-weight:700;font-size:13px;">${dest.name}</div>
          </div>
        `);
      destMarkersRef.current.push(marker);
    });
  }, [allDestinations, currentIdx]);

  // Update user marker position smoothly
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current || !userLocation) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = createUserMarker(L, mapRef.current, userLocation);
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }

    if (isFollowingRef.current) {
      mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true, duration: 0.5 });
    }
  }, [userLocation]);

  // Redraw markers when destinations/currentIdx changes
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current) return;
    renderDestMarkers(L, mapRef.current);
  }, [allDestinations, currentIdx, renderDestMarkers]);

  // Redraw route when destination changes
  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current || !userLocation || !destination) return;

    const destKey = `${destination.lat},${destination.lng}`;
    if (destKey === prevDestRef.current) return;
    prevDestRef.current = destKey;

    drawRoute(L, mapRef.current, userLocation, destination);
  }, [destination, userLocation]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

function createUserMarker(L: any, map: LeafletMap, loc: { lat: number; lng: number }) {
  const icon = L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;inset:-6px;border-radius:50%;
          background:rgba(59,130,246,0.2);
          animation:navPulse 2s infinite;
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#3b82f6;border:3px solid white;
          box-shadow:0 0 12px rgba(59,130,246,0.6);
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          width:6px;height:6px;background:white;border-radius:50%;
          transform:translate(-50%,-50%);
        "></div>
      </div>
      <style>
        @keyframes navPulse {
          0%,100%{transform:scale(1);opacity:.5}
          50%{transform:scale(2.5);opacity:0}
        }
      </style>
    `,
    iconSize: [24, 24], iconAnchor: [12, 12],
  });
  return L.marker([loc.lat, loc.lng], { icon, zIndexOffset: 9999 })
    .addTo(map).bindPopup("<b>📍 Lokasi Anda</b>");
}

async function drawRoute(
  L: any,
  map: LeafletMap,
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
) {
  // Hapus route lama
  map.eachLayer((layer: any) => {
    if (layer._isRouteLayer) map.removeLayer(layer);
  });

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    if (data.routes?.[0]?.geometry) {
      const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );

      // Shadow line
      const shadow = L.polyline(coords, {
        color: "rgba(255,255,255,0.15)", weight: 12,
        lineCap: "round", lineJoin: "round",
      }).addTo(map);
      (shadow as any)._isRouteLayer = true;

      // Main route line
      const route = L.polyline(coords, {
        color: "#f97316", weight: 6, opacity: 0.95,
        lineCap: "round", lineJoin: "round",
      }).addTo(map);
      (route as any)._isRouteLayer = true;

      // Destination pulse circle
      const pulse = L.circle([end.lat, end.lng], {
        radius: 80, color: "#f97316",
        fillColor: "#f97316", fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);
      (pulse as any)._isRouteLayer = true;

      return data.routes[0];
    }
  } catch {
    // Fallback dashed line
    const fallback = L.polyline(
      [[start.lat, start.lng], [end.lat, end.lng]],
      { color: "#f97316", weight: 4, dashArray: "10,8", opacity: 0.8 }
    ).addTo(map);
    (fallback as any)._isRouteLayer = true;
  }
}
