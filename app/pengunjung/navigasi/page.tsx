"use client";
// app/pengunjung/navigasi/page.tsx
// Halaman Navigasi Aktif – Fullscreen turn-by-turn navigation dengan Leaflet + OSRM

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Navigation, CheckCircle2, Clock, MapPin,
  ChevronRight, X, List, Maximize2, Loader2, AlertCircle
} from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { formatDistance, calculateDistance } from "@/lib/utils";

// Navigasi map khusus – SSR disabled
const NavigasiMapClient = dynamic(() => import("../components/NavigasiMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-white" size={36} />
        <span className="text-white/70 text-sm">Memuat peta navigasi...</span>
      </div>
    </div>
  ),
});

interface ItineraryItem {
  id: number;
  order: number;
  visitTime: string | null;
  destination: {
    id: number;
    name: string;
    address: string;
    imageUrl: string | null;
    latitude: number;
    longitude: number;
    ticketPrice: number | null;
    openTime: string | null;
    closeTime: string | null;
  };
}

export default function NavigasiPage() {
  const { user } = useLocalUser();
  const { location, loading: gpsLoading, requestLocation } = useGeolocation(true);

  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    steps: string[];
  } | null>(null);

  const currentDest = itineraryItems[currentIdx]?.destination;
  const nextDest = itineraryItems[currentIdx + 1]?.destination;

  // Fetch itinerary
  useEffect(() => {
    if (!user) return;
    fetch(`/api/pengunjung/itinerary?userId=${user.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.items?.length) {
          setItineraryItems(json.data.items);
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Auto geofencing check-in (50m radius)
  useEffect(() => {
    if (!location || !currentDest || !user) return;

    const dist = calculateDistance(
      location.lat, location.lng,
      currentDest.latitude, currentDest.longitude
    );

    if (dist <= 0.05 && !checkedIn.has(currentDest.id)) {
      // Auto check-in!
      setCheckedIn((prev) => new Set([...prev, currentDest.id]));
      fetch("/api/pengunjung/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, destinationId: currentDest.id }),
      });
    }
  }, [location, currentDest, user, checkedIn]);

  // Fetch OSRM route
  const fetchRoute = useCallback(async () => {
    if (!location || !currentDest) return;

    try {
      const coords = `${location.lng},${location.lat};${currentDest.longitude},${currentDest.latitude}`;
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&steps=true`
      );
      const json = await res.json();

      if (json.routes?.[0]) {
        const route = json.routes[0];
        const steps = route.legs[0]?.steps?.slice(0, 5).map((s: any) => {
          const maneuver = s.maneuver?.type || "";
          const modifier = s.maneuver?.modifier || "";
          const name = s.name || "jalan";
          const distM = Math.round(s.distance);
          const distStr = distM >= 1000 ? `${(distM / 1000).toFixed(1)} km` : `${distM} m`;

          if (maneuver === "turn") return `Belok ${modifier === "left" ? "kiri" : "kanan"} ke ${name} (${distStr})`;
          if (maneuver === "arrive") return `Tiba di tujuan`;
          return `Lurus di ${name} (${distStr})`;
        }) || [];

        setRouteInfo({
          distance: route.distance / 1000,
          duration: Math.round(route.duration / 60),
          steps,
        });
      }
    } catch (e) {
      console.log("OSRM route fetch failed, using distance estimate");
      if (location && currentDest) {
        const dist = calculateDistance(location.lat, location.lng, currentDest.latitude, currentDest.longitude);
        setRouteInfo({
          distance: dist,
          duration: Math.round((dist / 40) * 60),
          steps: ["Ikuti arah ke tujuan"],
        });
      }
    }
  }, [location, currentDest]);

  useEffect(() => {
    if (location && currentDest) fetchRoute();
  }, [fetchRoute]);

  const handleManualCheckin = () => {
    if (!currentDest || !user) return;
    setCheckedIn((prev) => new Set([...prev, currentDest.id]));
    fetch("/api/pengunjung/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, destinationId: currentDest.id }),
    });
  };

  const handleNext = () => {
    if (currentIdx < itineraryItems.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setRouteInfo(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Masuk untuk menggunakan navigasi</p>
          <Link href="/auth/login?redirect=/pengunjung/navigasi"
            className="px-6 py-3 bg-[#1a6b3c] text-white rounded-xl font-semibold">
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  if (itineraryItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Rencana Perjalanan</h2>
          <p className="text-gray-500 text-sm mb-6">Buat rencana perjalanan terlebih dahulu untuk memulai navigasi.</p>
          <Link href="/pengunjung/rencana"
            className="px-6 py-3 bg-[#f97316] text-white rounded-xl font-semibold inline-flex items-center gap-2">
            <Navigation size={16} />
            Buat Rencana
          </Link>
        </div>
      </div>
    );
  }

  const allDone = itineraryItems.every((item) => checkedIn.has(item.destination.id));

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Top status bar */}
      <div className="bg-[#0f1f17] text-white px-4 py-3 flex items-center gap-4 shrink-0 z-20">
        <Link href="/pengunjung/rencana" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${location ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-white/70">GPS {location ? "Aktif" : "Tidak Aktif"}</span>
          </span>
          {location && <span className="text-white/40">|</span>}
          {location && (
            <span className="text-white/70">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowList(!showList)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Map fullscreen */}
      <div className="flex-1 relative">
        <NavigasiMapClient
          userLocation={location}
          destination={currentDest ? {
            lat: currentDest.latitude,
            lng: currentDest.longitude,
            name: currentDest.name,
          } : null}
          allDestinations={itineraryItems.map((item) => ({
            id: item.destination.id,
            lat: item.destination.latitude,
            lng: item.destination.longitude,
            name: item.destination.name,
            checked: checkedIn.has(item.destination.id),
          }))}
        />

        {/* Turn instruction overlay */}
        {routeInfo && routeInfo.steps.length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a6b3c] flex items-center justify-center shrink-0">
                <ChevronRight size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Arah Berikutnya</p>
                <p className="text-sm font-bold text-gray-900">{routeInfo.steps[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Destination list overlay */}
        {showList && (
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-30 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Daftar Destinasi</h3>
              <button onClick={() => setShowList(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            {itineraryItems.map((item, idx) => {
              const done = checkedIn.has(item.destination.id);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentIdx(idx); setShowList(false); }}
                  className={`w-full text-left p-4 border-b border-gray-50 flex items-start gap-3 transition-colors ${isCurrent ? "bg-[#1a6b3c]/5" : "hover:bg-gray-50"}`}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    done ? "bg-green-500 border-green-500" : isCurrent ? "border-[#f97316]" : "border-gray-300"
                  }`}>
                    {done ? (
                      <CheckCircle2 size={14} className="text-white fill-white" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${done ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {item.destination.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.visitTime}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="bg-white border-t border-gray-100 p-4 shrink-0 z-20">
        {allDone ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Perjalanan Selesai! 🎉</p>
                <p className="text-xs text-gray-500">Semua destinasi telah dikunjungi</p>
              </div>
            </div>
            <Link
              href="/pengunjung/ulasan"
              className="px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors"
            >
              Tulis Ulasan
            </Link>
          </div>
        ) : currentDest ? (
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img
                  src={currentDest.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=1a6b3c&color=fff&size=112`}
                  alt={currentDest.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=1a6b3c&color=fff&size=112`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#f97316] font-semibold uppercase tracking-wider mb-0.5">
                  Destinasi {currentIdx + 1} dari {itineraryItems.length}
                </p>
                <p className="font-bold text-gray-900 line-clamp-1">{currentDest.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  {routeInfo && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        {routeInfo.duration} menit
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} />
                        {routeInfo.distance.toFixed(1)} km
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {checkedIn.has(currentDest.id) ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200">
                  <CheckCircle2 size={16} />
                  Sudah Sampai!
                </div>
              ) : (
                <button
                  onClick={handleManualCheckin}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a6b3c] text-white rounded-xl text-sm font-bold hover:bg-[#155c33] transition-colors"
                >
                  <CheckCircle2 size={16} />
                  Tandai Sudah Sampai
                </button>
              )}
              {currentIdx < itineraryItems.length - 1 && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors"
                >
                  Berikutnya <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
