"use client";
// app/pengunjung/navigasi/page.tsx — NAVIGASI AKTIF (UPDATED)

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, CheckCircle2, Clock, MapPin, ChevronRight,
  X, List, Loader2, Navigation, AlertCircle, Route
} from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { calculateDistance, formatDistance } from "@/lib/utils";

const NavigasiMapClient = dynamic(() => import("../components/NavigasiMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-white" size={36} />
        <span className="text-white/60 text-sm">Memuat peta...</span>
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

  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; instruction: string } | null>(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const geofenceChecked = useRef<Set<number>>(new Set());

  const currentDest = items[currentIdx]?.destination;
  const allDone = items.length > 0 && items.every(i => checkedIn.has(i.destination.id));

  // Fetch itinerary
  useEffect(() => {
    if (!user) return;
    fetch(`/api/pengunjung/itinerary?userId=${user.id}`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.items?.length) {
          setItems(json.data.items.sort((a: ItineraryItem, b: ItineraryItem) => a.order - b.order));
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch OSRM route info untuk current destination
  const fetchRouteInfo = useCallback(async () => {
    if (!location || !currentDest) return;
    setFetchingRoute(true);
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${currentDest.longitude},${currentDest.latitude}?overview=false&steps=true`
      );
      const data = await res.json();
      if (data.routes?.[0]) {
        const route = data.routes[0];
        const steps = route.legs[0]?.steps || [];
        const firstStep = steps[0];
        let instruction = "Ikuti rute menuju tujuan";
        if (firstStep) {
          const t = firstStep.maneuver?.type;
          const m = firstStep.maneuver?.modifier;
          const name = firstStep.name || "jalan";
          const dist = Math.round(firstStep.distance);
          const distStr = dist >= 1000 ? `${(dist/1000).toFixed(1)} km` : `${dist} m`;
          if (t === "turn") instruction = `Belok ${m === "left" ? "kiri" : "kanan"} ke ${name} (${distStr})`;
          else if (t === "depart") instruction = `Mulai perjalanan di ${name} (${distStr})`;
          else if (t === "arrive") instruction = `Tiba di ${currentDest.name}`;
          else instruction = `Lurus di ${name} (${distStr})`;
        }
        setRouteInfo({
          distance: route.distance / 1000,
          duration: Math.round(route.duration / 60),
          instruction,
        });
      }
    } catch {
      const dist = calculateDistance(location.lat, location.lng, currentDest.latitude, currentDest.longitude);
      setRouteInfo({
        distance: dist,
        duration: Math.round((dist / 40) * 60),
        instruction: "Ikuti rute menuju tujuan",
      });
    } finally {
      setFetchingRoute(false); }
  }, [location, currentDest]);

  useEffect(() => { fetchRouteInfo(); }, [fetchRouteInfo]);

  // Geofencing auto check-in (50m)
  useEffect(() => {
    if (!location || !currentDest || !user) return;
    if (geofenceChecked.current.has(currentDest.id)) return;

    const dist = calculateDistance(location.lat, location.lng, currentDest.latitude, currentDest.longitude);
    if (dist <= 0.05) {
      geofenceChecked.current.add(currentDest.id);
      doCheckin(currentDest.id);
    }
  }, [location, currentDest, user]);

  const doCheckin = async (destId: number) => {
    if (!user || checkedIn.has(destId)) return;
    setCheckedIn(prev => new Set([...prev, destId]));
    try {
      await fetch("/api/pengunjung/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, destinationId: destId }),
      });
    } catch (e) { console.error(e); }
  };

  const handleManualCheckin = () => {
    if (!currentDest) return;
    doCheckin(currentDest.id);
  };

  const handleNext = () => {
    if (currentIdx < items.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setRouteInfo(null);
    }
  };

  // Auto advance ke destinasi berikutnya setelah check-in
  useEffect(() => {
    if (!currentDest || !checkedIn.has(currentDest.id)) return;
    if (currentIdx < items.length - 1) {
      const timer = setTimeout(() => setCurrentIdx(prev => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [checkedIn, currentDest, currentIdx, items.length]);

  // Not logged in
  if (!user && !loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f1a14]">
      <div className="text-center px-4">
        <Navigation size={48} className="mx-auto mb-4 text-white/30" />
        <p className="text-white/70 mb-4">Masuk untuk menggunakan navigasi</p>
        <Link href="/auth/login?redirect=/pengunjung/navigasi"
          className="px-6 py-3 bg-[#f97316] text-white rounded-xl font-semibold">
          Masuk
        </Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f1a14]">
      <Loader2 className="animate-spin text-white" size={40} />
    </div>
  );

  if (items.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-sm px-4">
        <Route size={48} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Rencana</h2>
        <p className="text-gray-500 text-sm mb-6">Buat rencana perjalanan terlebih dahulu.</p>
        <Link href="/pengunjung/rencana"
          className="px-6 py-3 bg-[#f97316] text-white rounded-xl font-semibold inline-flex items-center gap-2">
          <Navigation size={16} />
          Buat Rencana
        </Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#0f1a14] overflow-hidden">

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className="bg-[#0a120e]/95 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-3 shrink-0 z-20 border-b border-white/5">
        <Link href="/pengunjung/rencana" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </Link>

        {/* GPS status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${location ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-white/60">{location ? "GPS Aktif" : "GPS Tidak Aktif"}</span>
          {!location && (
            <button onClick={requestLocation} className="text-[#f97316] font-medium">Aktifkan</button>
          )}
        </div>

        {/* Progress */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-1.5">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all ${
                  checkedIn.has(item.destination.id)
                    ? "bg-green-400 w-4"
                    : idx === currentIdx
                    ? "bg-[#f97316] w-6"
                    : "bg-white/20 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        <button onClick={() => setShowList(!showList)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <List size={18} className="text-white" />
        </button>
      </div>

      {/* ── TURN INSTRUCTION BAR ───────────────────── */}
      {routeInfo && !checkedIn.has(currentDest?.id || -1) && (
        <div className="bg-white px-4 py-3 flex items-center gap-3 shrink-0 z-20 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#006837] flex items-center justify-center shrink-0">
            <ChevronRight size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Arah Berikutnya</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">{routeInfo.instruction}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">Jarak</p>
            <p className="text-sm font-bold text-[#006837]">{routeInfo.distance.toFixed(1)} km</p>
          </div>
        </div>
      )}

      {/* ── MAP ────────────────────────────────────── */}
      <div className="flex-1 relative">
        <NavigasiMapClient
          userLocation={location}
          destination={currentDest ? { lat: currentDest.latitude, lng: currentDest.longitude, name: currentDest.name } : null}
          allDestinations={items.map((item, idx) => ({
            id: item.destination.id,
            lat: item.destination.latitude,
            lng: item.destination.longitude,
            name: item.destination.name,
            checked: checkedIn.has(item.destination.id),
            order: idx + 1,
          }))}
          currentIdx={currentIdx}
        />

        {/* Destination List Overlay */}
        {showList && (
          <div className="absolute inset-y-0 right-0 w-72 bg-[#0a120e]/95 backdrop-blur-sm z-30 overflow-y-auto border-l border-white/10">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Daftar Destinasi</h3>
              <button onClick={() => setShowList(false)}>
                <X size={18} className="text-white/50" />
              </button>
            </div>
            {items.map((item, idx) => {
              const done = checkedIn.has(item.destination.id);
              const isCurr = idx === currentIdx;
              return (
                <button key={item.id} onClick={() => { setCurrentIdx(idx); setShowList(false); }}
                  className={`w-full text-left p-4 border-b border-white/5 flex items-start gap-3 transition-colors ${
                    isCurr ? "bg-white/10" : "hover:bg-white/5"
                  }`}>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    done ? "bg-green-500 border-green-500" : isCurr ? "border-[#f97316] bg-[#f97316]/20" : "border-white/30"
                  }`}>
                    {done
                      ? <CheckCircle2 size={13} className="text-white" />
                      : <span className="text-xs font-bold text-white">{idx + 1}</span>}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${done ? "line-through text-white/30" : "text-white"}`}>
                      {item.destination.name}
                    </p>
                    {item.visitTime && <p className="text-xs text-white/40 mt-0.5">{item.visitTime}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── BOTTOM PANEL ───────────────────────────── */}
      <div className="bg-white border-t border-gray-100 shrink-0 z-20">
        {allDone ? (
          /* Selesai */
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Perjalanan Selesai! 🎉</p>
                <p className="text-xs text-gray-500">Semua {items.length} destinasi telah dikunjungi</p>
              </div>
            </div>
            <Link href="/pengunjung/ulasan"
              className="px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors">
              Tulis Ulasan
            </Link>
          </div>
        ) : currentDest ? (
          <div className="p-4">
            {/* Destination info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={currentDest.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=006837&color=fff&size=112`}
                    alt={currentDest.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=006837&color=fff&size=112`; }}
                  />
                </div>
                {/* Step badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                  {currentIdx + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider mb-0.5">
                  {currentIdx + 1} dari {items.length} · {checkedIn.size} selesai
                </p>
                <p className="font-bold text-gray-900 text-base line-clamp-1">{currentDest.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  {routeInfo && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        {routeInfo.duration < 60
                          ? `${routeInfo.duration} mnt`
                          : `${(routeInfo.duration/60).toFixed(1)} jam`}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} />
                        {routeInfo.distance.toFixed(1)} km
                      </span>
                    </>
                  )}
                  {items[currentIdx]?.visitTime && (
                    <span className="text-xs text-[#006837] font-medium">
                      🕐 {items[currentIdx].visitTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {checkedIn.has(currentDest.id) ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200 animate-pulse">
                  <CheckCircle2 size={16} />
                  Sudah Sampai! Beralih ke destinasi berikutnya...
                </div>
              ) : (
                <button onClick={handleManualCheckin}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#006837] text-white rounded-xl text-sm font-bold hover:bg-[#005229] transition-colors active:scale-95">
                  <CheckCircle2 size={16} />
                  Sudah Sampai
                </button>
              )}
              {currentIdx < items.length - 1 && (
                <button onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors active:scale-95">
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
