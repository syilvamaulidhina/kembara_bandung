"use client";
// app/pengunjung/components/NavigasiMapClient.tsx
// Peta khusus navigasi aktif dengan routing OSRM

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface NavigasiMapClientProps {
  userLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number; name: string } | null;
  allDestinations: {
    id: number;
    lat: number;
    lng: number;
    name: string;
    checked: boolean;
  }[];
}

export default function NavigasiMapClient({
  userLocation,
  destination,
  allDestinations,
}: NavigasiMapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const prevLocation = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const center: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [-6.9175, 107.6191];

      const map = L.map(containerRef.current!, {
        center,
        zoom: 15,
        zoomControl: false,
      });

      // Peta gelap untuk navigasi (lebih user friendly di malam hari)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; OSM &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      // Zoom controls di kanan
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      // Add all destination markers
      allDestinations.forEach((dest, idx) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width:36px;height:36px;border-radius:50%;
              background:${dest.checked ? "#22c55e" : "#f97316"};
              border:3px solid white;
              box-shadow:0 2px 12px rgba(0,0,0,0.4);
              display:flex;align-items:center;justify-content:center;
              font-weight:bold;font-size:13px;color:white;
            ">${dest.checked ? "✓" : idx + 1}</div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([dest.lat, dest.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${dest.name}</b>${dest.checked ? "<br><span style='color:green'>✓ Sudah dikunjungi</span>" : ""}`);
      });

      // User location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px;">
              <div style="
                position:absolute;inset:0;border-radius:50%;
                background:rgba(59,130,246,0.25);
                animation:pulse 2s infinite;
              "></div>
              <div style="
                position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                width:14px;height:14px;border-radius:50%;
                background:#3b82f6;border:3px solid white;
                box-shadow:0 0 8px rgba(59,130,246,0.6);
              "></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<b>Lokasi Anda</b>");
      }

      // Draw route to current destination
      if (userLocation && destination) {
        drawRoute(L, map, userLocation, destination);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update user position smoothly
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const L = require("leaflet");

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }

    // Smooth pan if moved significantly
    if (prevLocation.current) {
      const dist = Math.sqrt(
        Math.pow(userLocation.lat - prevLocation.current.lat, 2) +
        Math.pow(userLocation.lng - prevLocation.current.lng, 2)
      );
      if (dist > 0.0002) {
        mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true });
      }
    }

    prevLocation.current = userLocation;

    // Redraw route
    if (destination) {
      drawRoute(L, mapRef.current, userLocation, destination);
    }
  }, [userLocation]);

  const drawRoute = async (L: any, map: LeafletMap, start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    // Remove previous route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
    }

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();

      if (data.routes?.[0]?.geometry) {
        const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        routeLayerRef.current = L.polyline(coords, {
          color: "#f97316",
          weight: 5,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Fit bounds
        const bounds = L.latLngBounds([
          [start.lat, start.lng],
          [end.lat, end.lng],
        ]);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    } catch (e) {
      // Fallback: straight line
      routeLayerRef.current = L.polyline(
        [[start.lat, start.lng], [end.lat, end.lng]],
        { color: "#f97316", weight: 4, dashArray: "10, 10", opacity: 0.7 }
      ).addTo(map);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}
