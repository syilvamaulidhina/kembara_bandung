"use client";
// app/pengunjung/navigasi/page.tsx — UPDATED v8
// Perubahan dari versi sebelumnya:
// 1. Fetch itinerary AKTIF (bukan asumsi "1 user = 1 itinerary") lewat
//    /api/pengunjung/itinerary/active, dan simpan itineraryId + itemId
//    supaya bisa sinkron progress "visited" ke DB per item.
// 2. Geofencing auto check-in (50m) DIHAPUS sesuai requirement — checkin
//    harus selalu manual klik "Sudah Sampai" (syarat boleh kirim ulasan).
// 3. doCheckin sekarang PATCH dua tempat: VisitedPlace (syarat ulasan,
//    sudah ada sebelumnya) DAN ItineraryItem.visited (progress Perjalanan
//    Aktif di halaman Rencana).
// 4. "Daftar Destinasi" diubah dari overlay full-height (menutupi sisi
//    kanan peta total) jadi BOTTOM SHEET (slide dari bawah, max-height
//    60vh) supaya peta tetap terlihat di belakangnya.

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft, CheckCircle2, Clock, MapPin, ChevronRight,
  X, List, Loader2, Navigation, Route
} from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { calculateDistance } from "@/lib/utils";

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
  id: number; // itemId, dipakai untuk PATCH visited
  order: number;
  visitTime: string | null;
  visited: boolean;
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

// Mode navigasi: "itinerary" = dari rencana, "direct" = langsung ke 1 destinasi
type NavMode = "itinerary" | "direct";

import { Suspense } from "react";

export default function NavigasiPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#0f1a14]">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    }>
      <NavigasiContent />
    </Suspense>
  );
}

function NavigasiContent() {
  const { user } = useLocalUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { location, loading: gpsLoading, requestLocation } = useGeolocation(true, true);

  // Query params untuk navigasi langsung
  const directId = searchParams.get("destId");
  const directName = searchParams.get("destName");
  const directLat = searchParams.get("destLat");
  const directLng = searchParams.get("destLng");
  const directAddress = searchParams.get("destAddress");
  const directImage = searchParams.get("destImage");

  const navMode: NavMode =
    directId && directLat && directLng ? "direct" : "itinerary";

  const [itineraryId, setItineraryId] = useState<number | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set()); // berisi destination.id
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    instruction: string;
  } | null>(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);

  // Untuk mode direct: buat 1 item sementara
  const directItem: ItineraryItem | null =
    navMode === "direct" && directId && directLat && directLng
      ? {
          id: 0,
          order: 1,
          visitTime: null,
          visited: false,
          destination: {
            id: parseInt(directId),
            name: directName || "Destinasi",
            address: directAddress || "",
            imageUrl: directImage || null,
            latitude: parseFloat(directLat),
            longitude: parseFloat(directLng),
            ticketPrice: null,
            openTime: null,
            closeTime: null,
          },
        }
      : null;

  const effectiveItems = navMode === "direct" && directItem ? [directItem] : items;
  const currentDest = effectiveItems[currentIdx]?.destination;
  const currentItemId = effectiveItems[currentIdx]?.id;
  const allDone =
    effectiveItems.length > 0 &&
    effectiveItems.every((i) => checkedIn.has(i.destination.id));

  // Fetch itinerary AKTIF milik user (hanya jika mode itinerary)
  useEffect(() => {
    if (navMode === "direct") {
      setLoading(false);
      return;
    }
    if (!user) return;
    fetch(`/api/pengunjung/itinerary/active?userId=${user.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.items?.length) {
          const sortedItems = [...json.data.items].sort(
            (a: ItineraryItem, b: ItineraryItem) => a.order - b.order
          );
          setItineraryId(json.data.id);
          setItems(sortedItems);
          setCheckedIn(
            new Set(
              sortedItems
                .filter((i: ItineraryItem) => i.visited)
                .map((i: ItineraryItem) => i.destination.id)
            )
          );
          // Mulai dari destinasi pertama yang belum dikunjungi
          const firstUnvisitedIdx = sortedItems.findIndex((i: ItineraryItem) => !i.visited);
          setCurrentIdx(firstUnvisitedIdx >= 0 ? firstUnvisitedIdx : 0);
        }
      })
      .finally(() => setLoading(false));
  }, [user, navMode]);

  // Fetch OSRM route info
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
          const distStr =
            dist >= 1000
              ? `${(dist / 1000).toFixed(1)} km`
              : `${dist} m`;
          if (t === "turn")
            instruction = `Belok ${m === "left" ? "kiri" : "kanan"} ke ${name} (${distStr})`;
          else if (t === "depart")
            instruction = `Mulai di ${name} (${distStr})`;
          else if (t === "arrive")
            instruction = `Tiba di ${currentDest.name}`;
          else instruction = `Lurus di ${name} (${distStr})`;
        }
        setRouteInfo({
          distance: route.distance / 1000,
          duration: Math.round(route.duration / 60),
          instruction,
        });
      }
    } catch {
      const dist = calculateDistance(
        location.lat,
        location.lng,
        currentDest.latitude,
        currentDest.longitude
      );
      setRouteInfo({
        distance: dist,
        duration: Math.round((dist / 40) * 60),
        instruction: "Ikuti rute menuju tujuan",
      });
    } finally {
      setFetchingRoute(false);
    }
  }, [location, currentDest]);

  useEffect(() => {
    fetchRouteInfo();
  }, [fetchRouteInfo]);

  // Auto check-in (50m)
  useEffect(() => {
    if (!location || !currentDest || checkedIn.has(currentDest.id) || checkingIn) return;
    
    const dist = calculateDistance(
      location.lat,
      location.lng,
      currentDest.latitude,
      currentDest.longitude
    );
    
    // Jika jarak kurang dari 50 meter (0.05 km), lakukan checkin otomatis
    if (dist <= 0.05) {
      doCheckin(currentDest.id);
    }
  }, [location, currentDest, checkedIn, checkingIn]);

  const doCheckin = async (destId: number) => {
    if (checkedIn.has(destId) || checkingIn) return;
    setCheckingIn(true);
    setCheckedIn((prev) => new Set([...prev, destId]));
    try {
      // 1. VisitedPlace global — syarat boleh mengirim ulasan (sudah ada sebelumnya)
      if (user) {
        await fetch("/api/pengunjung/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId: destId }),
        });
      }
      // 2. ItineraryItem.visited — progress checkpoint "Perjalanan Aktif" (BARU)
      if (navMode === "itinerary" && itineraryId && currentItemId) {
        const res = await fetch(`/api/pengunjung/itinerary/${itineraryId}/items`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: currentItemId, visited: true }),
        });
        const json = await res.json();
        setItems((prev) =>
          prev.map((i) => (i.id === currentItemId ? { ...i, visited: true } : i))
        );
        if (json.itineraryCompleted) {
          // Semua destinasi sudah dikunjungi -> itinerary otomatis jadi "selesai"
          // (sudah ditangani di backend), tidak perlu aksi tambahan di sini.
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualCheckin = () => {
    if (!currentDest) return;
    doCheckin(currentDest.id);
  };

  const handleNext = () => {
    if (currentIdx < effectiveItems.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRouteInfo(null);
    }
  };

  // Auto advance setelah check-in
  useEffect(() => {
    if (!currentDest || !checkedIn.has(currentDest.id)) return;
    if (currentIdx < effectiveItems.length - 1) {
      const timer = setTimeout(() => setCurrentIdx((prev) => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [checkedIn, currentDest, currentIdx, effectiveItems.length]);

  // Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f1a14]">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  // Tidak ada rencana aktif & bukan mode direct
  if (navMode === "itinerary" && effectiveItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <Route size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Belum Ada Perjalanan Aktif
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Buka salah satu rencana perjalanan dan tekan "Mulai Navigasi" untuk memulai.
          </p>
          <Link
            href="/pengunjung/rencana"
            className="px-6 py-3 bg-[#f97316] text-white rounded-xl font-semibold inline-flex items-center gap-2"
          >
            <Navigation size={16} />
            Buka Rencana
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f1a14] overflow-hidden">
      {/* TOP BAR */}
      <div className="relative z-[500] bg-[#0a120e]/95 backdrop-blur-sm text-white px-4 py-3 flex items-center gap-3 shrink-0 border-b border-white/5">
        <Link
          href={
            navMode === "direct"
              ? `/pengunjung/destinasi/${directId}`
              : itineraryId
              ? `/pengunjung/rencana/${itineraryId}`
              : "/pengunjung/rencana"
          }
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* GPS status */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              location ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span className="text-white/60">
            {location ? "GPS Aktif" : "GPS Tidak Aktif"}
          </span>
          {!location && (
            <button
              onClick={requestLocation}
              className="text-[#f97316] font-medium underline"
            >
              Aktifkan
            </button>
          )}
        </div>

        {/* Mode label */}
        {navMode === "direct" && (
          <div className="ml-auto px-2 py-1 bg-[#f97316]/20 text-[#f97316] text-xs font-bold rounded-lg">
            Navigasi Langsung
          </div>
        )}

        {/* Progress dots (hanya itinerary mode) */}
        {navMode === "itinerary" && effectiveItems.length > 1 && (
          <div className="ml-auto flex gap-1.5">
            {effectiveItems.map((item, idx) => (
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
        )}

        {navMode === "itinerary" && effectiveItems.length > 1 && (
          <button
            onClick={() => setShowList(!showList)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <List size={18} className="text-white" />
          </button>
        )}
      </div>

      {/* TURN INSTRUCTION */}
      {routeInfo && !checkedIn.has(currentDest?.id || -1) && (
        <div className="relative z-[500] bg-white px-4 py-3 flex items-center gap-3 shrink-0 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#006837] flex items-center justify-center shrink-0">
            <ChevronRight size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
              Arah Berikutnya
            </p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">
              {routeInfo.instruction}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-gray-400">Jarak</p>
            <p className="text-sm font-bold text-[#006837]">
              {routeInfo.distance.toFixed(1)} km
            </p>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="flex-1 relative overflow-hidden">
        <NavigasiMapClient
          userLocation={location}
          destination={
            currentDest
              ? {
                  lat: currentDest.latitude,
                  lng: currentDest.longitude,
                  name: currentDest.name,
                }
              : null
          }
          allDestinations={effectiveItems.map((item, idx) => ({
            id: item.destination.id,
            lat: item.destination.latitude,
            lng: item.destination.longitude,
            name: item.destination.name,
            checked: checkedIn.has(item.destination.id),
            order: idx + 1,
          }))}
          currentIdx={currentIdx}
        />

        {/* DAFTAR DESTINASI — BOTTOM SHEET (BARU)
            Sebelumnya: overlay absolute inset-y-0 right-0 w-72 yang menutupi
            seluruh sisi kanan peta dari atas ke bawah. Sekarang: slide dari
            bawah, max-height 60vh, supaya peta tetap terlihat di atasnya
            dan tidak menutupi marker/instruksi arah. */}
        {showList && navMode === "itinerary" && (
          <>
            <div
              className="absolute inset-0 bg-black/40 z-30"
              onClick={() => setShowList(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#0a120e]/98 backdrop-blur-sm rounded-t-2xl border-t border-white/10 max-h-[60vh] flex flex-col">
              <div className="flex items-center justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="text-white font-bold text-sm">Daftar Destinasi</h3>
                <button onClick={() => setShowList(false)}>
                  <X size={18} className="text-white/50" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {effectiveItems.map((item, idx) => {
                  const done = checkedIn.has(item.destination.id);
                  const isCurr = idx === currentIdx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentIdx(idx);
                        setShowList(false);
                      }}
                      className={`w-full text-left p-4 border-b border-white/5 flex items-start gap-3 transition-colors ${
                        isCurr ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          done
                            ? "bg-green-500 border-green-500"
                            : isCurr
                            ? "border-[#f97316] bg-[#f97316]/20"
                            : "border-white/30"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 size={13} className="text-white" />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            done ? "line-through text-white/30" : "text-white"
                          }`}
                        >
                          {item.destination.name}
                        </p>
                        {item.visitTime && (
                          <p className="text-xs text-white/40 mt-0.5">
                            {item.visitTime}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* BOTTOM PANEL */}
      <div className="bg-white border-t border-gray-100 shrink-0 z-20">
        {allDone ? (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {navMode === "direct"
                    ? "Sudah Sampai! 🎉"
                    : "Perjalanan Selesai! 🎉"}
                </p>
                <p className="text-xs text-gray-500">
                  {navMode === "direct"
                    ? `Kamu sudah tiba di ${currentDest?.name}`
                    : `Semua ${effectiveItems.length} destinasi telah dikunjungi`}
                </p>
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
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={
                      currentDest.imageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=006837&color=fff&size=112`
                    }
                    alt={currentDest.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDest.name)}&background=006837&color=fff&size=112`;
                    }}
                  />
                </div>
                {navMode === "itinerary" && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    {currentIdx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {navMode === "itinerary" && (
                  <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider mb-0.5">
                    {currentIdx + 1} dari {effectiveItems.length} ·{" "}
                    {checkedIn.size} selesai
                  </p>
                )}
                {navMode === "direct" && (
                  <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider mb-0.5">
                    MENUJU DESTINASI
                  </p>
                )}
                <p className="font-bold text-gray-900 text-base line-clamp-1">
                  {currentDest.name}
                </p>
                {currentDest.address && (
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                    {currentDest.address}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  {routeInfo && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        {routeInfo.duration < 60
                          ? `${routeInfo.duration} mnt`
                          : `${(routeInfo.duration / 60).toFixed(1)} jam`}
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
                  {currentIdx < effectiveItems.length - 1 &&
                    " Beralih ke berikutnya..."}
                </div>
              ) : (
                <button
                  onClick={handleManualCheckin}
                  disabled={checkingIn}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#006837] text-white rounded-xl text-sm font-bold hover:bg-[#005229] transition-colors active:scale-95 disabled:opacity-60"
                >
                  {checkingIn ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Sudah Sampai
                </button>
              )}
              {navMode === "itinerary" &&
                currentIdx < effectiveItems.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-3 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors active:scale-95"
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
