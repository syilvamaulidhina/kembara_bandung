"use client";
// app/pengunjung/components/MiniMapClient.tsx
// Peta mini untuk detail destinasi + modal lokasi (tanpa rute jalan asli, tanpa Google Maps)

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { createPortal } from "react-dom";

interface MiniMapClientProps {
  lat: number;
  lng: number;
  name: string;
  height?: string;
}

// Style marker
function destinationIconHtml() {
  return `<div style="
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    background:#f97316;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    transform:rotate(-45deg);
  "></div>`;
}

function userIconHtml() {
  return `<div style="position:relative;width:20px;height:20px;">
    <div style="
      position:absolute;inset:0;margin:auto;
      width:14px;height:14px;border-radius:50%;
      background:#3b82f6;border:3px solid white;
      box-shadow:0 0 0 2px rgba(59,130,246,0.4);
    "></div>
  </div>`;
}

export default function MiniMapClient({ lat, lng, name, height = "192px" }: MiniMapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  // Mini map (thumbnail, statis)
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const init = async () => {
      // Guard 1: cek sebelum async gap
      if (mapRef.current) return;
      if ((containerRef.current as any)?._leaflet_id) return;

      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Guard 2: cek lagi SETELAH await, karena efek bisa jalan 2x (StrictMode)
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current, {
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
        html: destinationIconHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(name).openPopup();

      mapRef.current = map;
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ height, width: "100%" }}
        className="relative z-0 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="absolute inset-0 z-[1000] bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center" />
      </div>

      {showModal && (
        <LocationModal
          lat={lat}
          lng={lng}
          name={name}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// ---------------- Modal Peta Lokasi ----------------
// ---------------- Modal Peta Lokasi ----------------

interface LocationModalProps {
  lat: number;
  lng: number;
  name: string;
  onClose: () => void;
}

type LocStatus =
  | "loading"
  | "found"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "insecure";

function LocationModal({ lat, lng, name, onClose }: LocationModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [locStatus, setLocStatus] = useState<LocStatus>("loading");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const retryRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let watchId: number | null = null;

    const init = async () => {
      // Guard 1: cek sebelum async gap
      if (mapRef.current) return;
      if ((containerRef.current as any)?._leaflet_id) return;

      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Guard 2: cek lagi SETELAH await
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, attribution: "&copy; OpenStreetMap &copy; CARTO" }
      ).addTo(map);

      const destIcon = L.divIcon({
        className: "",
        html: destinationIconHtml(), // Pastikan fungsi ini ada di atas
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([lat, lng], { icon: destIcon }).addTo(map).bindPopup(name).openPopup();

      mapRef.current = map;

      // Cek dukungan & konteks aman (https / localhost)
      if (!navigator.geolocation) {
        if (!cancelled) setLocStatus("unsupported");
        return;
      }
      if (typeof window !== "undefined" && !window.isSecureContext) {
        if (!cancelled) setLocStatus("insecure");
        return;
      }

      let userMarker: ReturnType<typeof L.marker> | null = null;
      let routeLine: ReturnType<typeof L.polyline> | null = null;

      const handlePosition = (pos: GeolocationPosition) => {
        if (cancelled || !mapRef.current) return;
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const userIcon = L.divIcon({
          className: "",
          html: userIconHtml(), // Pastikan fungsi ini ada di atas
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        if (userMarker) {
          userMarker.setLatLng([userLat, userLng]);
        } else {
          userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup("Lokasimu saat ini");
        }

        // --- FUNGSI MENGGAMBAR GARIS LURUS (FALLBACK) ---
        const drawFallbackLine = () => {
          if (routeLine) {
            routeLine.setLatLngs([
              [userLat, userLng],
              [lat, lng],
            ]);
            // Jika fallback, ubah style menjadi garis putus-putus
            routeLine.setStyle({ dashArray: "8, 8", color: "#9ca3af" }); 
          } else {
            routeLine = L.polyline(
              [
                [userLat, userLng],
                [lat, lng],
              ],
              { color: "#9ca3af", weight: 3, dashArray: "8, 8", opacity: 0.8 }
            ).addTo(mapRef.current!);
          }

          const bounds = L.latLngBounds([
            [lat, lng],
            [userLat, userLng],
          ]);
          mapRef.current!.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });

          const distMeters = L.latLng(userLat, userLng).distanceTo(L.latLng(lat, lng));
          setDistanceKm(Math.round((distMeters / 1000) * 10) / 10);
        };

        // --- FUNGSI MENGAMBIL RUTE ASLI DARI OSRM API ---
        const fetchRealRoute = async () => {
          try {
            // OSRM format urutan koordinat: longitude, latitude
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${lng},${lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
              const routeInfo = data.routes[0];
              // Konversi koordinat [lng, lat] dari GeoJSON menjadi [lat, lng] untuk Leaflet
              const routeCoords = routeInfo.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

              if (routeLine) {
                routeLine.setLatLngs(routeCoords);
                routeLine.setStyle({ dashArray: undefined, color: "#3b82f6" }); // Garis solid biru
              } else {
                routeLine = L.polyline(routeCoords, { color: "#3b82f6", weight: 4, opacity: 0.8 }).addTo(mapRef.current!);
              }

              // Paskan peta ke garis rute
              mapRef.current!.fitBounds(L.polyline(routeCoords).getBounds(), { padding: [50, 50], maxZoom: 16 });

              // Ambil jarak aktual (melalui jalan) yang dikembalikan oleh OSRM
              const actualDistanceKm = Math.round((routeInfo.distance / 1000) * 10) / 10;
              setDistanceKm(actualDistanceKm);
            } else {
              drawFallbackLine();
            }
          } catch (error) {
            console.error("Gagal mengambil rute OSRM:", error);
            drawFallbackLine(); // Jika API gagal, gambar garis lurus
          }
        };

        fetchRealRoute();
        setLocStatus("found");
      };

      const handleError = (err: GeolocationPositionError) => {
        console.warn("Geolocation error:", err.code, err.message);
        if (cancelled) return;
        if (err.code === err.PERMISSION_DENIED) setLocStatus("denied");
        else if (err.code === err.POSITION_UNAVAILABLE) setLocStatus("unavailable");
        else if (err.code === err.TIMEOUT) setLocStatus("timeout");
        else setLocStatus("denied");
      };

      const requestLocation = () => {
        setLocStatus("loading");
        navigator.geolocation.getCurrentPosition(
          handlePosition,
          (fastErr) => {
            console.warn("Fast geolocation failed, retrying with high accuracy:", fastErr.message);
            navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            });
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 30000 }
        );

        watchId = navigator.geolocation.watchPosition(handlePosition, () => {}, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 15000,
        });
      };

      requestLocation();
      retryRef.current = requestLocation;
    };

    init();

    return () => {
      cancelled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, name]);

  const statusText: Record<LocStatus, string> = {
    loading: "Mencari lokasimu...",
    found:
      distanceKm !== null
        ? `Lokasimu ditemukan • Jarak tempuh rute: ${distanceKm} km`
        : "Menampilkan lokasi destinasi dan lokasimu saat ini.",
    denied: "Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser untuk melihat posisimu.",
    unavailable: "Lokasi tidak dapat dideteksi. Coba pindah ke area dengan sinyal lebih baik.",
    timeout: "Waktu pencarian lokasi habis. Coba lagi atau periksa koneksimu.",
    unsupported: "Perangkat/browser tidak mendukung deteksi lokasi.",
    insecure: "Deteksi lokasi butuh koneksi HTTPS untuk berfungsi.",
  };

  const modalContent = (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">{name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none px-2"
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>

        <div ref={containerRef} style={{ height: "420px", width: "100%" }} />

        <div className="px-4 py-2 text-xs text-gray-500 border-t flex items-center justify-between">
          <span>{statusText[locStatus]}</span>
          {["denied", "unavailable", "timeout"].includes(locStatus) && (
            <button
              onClick={() => retryRef.current()}
              className="text-blue-600 hover:underline text-xs font-medium ml-2 whitespace-nowrap"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}