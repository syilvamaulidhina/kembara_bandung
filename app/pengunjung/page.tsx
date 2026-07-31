"use client";
// app/pengunjung/page.tsx — Beranda
// UPDATE v3: hapus shortcut row kategori (link ke halaman lain).
//   Filter kategori di atas peta sekarang SATU-SATUNYA kontrol kategori,
//   sifatnya filter peta saja (tidak pindah halaman).
//   Tambah pill khusus "Populer" (by visitCount) dan "Terdekat" (radius 5 km),
//   keduanya multi-select bareng kategori DB lainnya.
//   Default (tidak ada pill aktif): tampilkan radius 5 km dari GPS user di peta.
//   Pills di-wrap ke bawah (flex-wrap), tidak horizontal-scroll.

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ChevronRight, Loader2, Navigation, AlertCircle, Sparkles, Flame, MapPinned } from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import DestinationCard from "./components/DestinationCard";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useCategories, getCategoryStyle } from "@/lib/hooks/useCategories";

const MapViewClient = dynamic(() => import("./components/MapViewClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  ),
});

interface Destination {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  distance?: number;
  averageRating?: number | null;
  reviewCount?: number;
  isSaved?: boolean;
  visitCount: number;
  categories: { category: { name: string } }[];
}

// Radius destinasi "Terdekat" — 5 km dari lokasi user (sesuai permintaan)
const NEARBY_RADIUS_KM = 5;
// Jumlah destinasi yang dianggap "Populer" di peta (top by visitCount)
const POPULAR_MAP_LIMIT = 15;

// ID khusus untuk pill non-DB (Populer & Terdekat)
const SPECIAL_POPULER = "__populer__";
const SPECIAL_TERDEKAT = "__terdekat__";

export default function BerandaPage() {
  const { location, loading: gpsLoading, error: gpsError, permissionDenied, requestLocation } = useGeolocation(true);
  const { user } = useLocalUser();

  const { categories: dbCategories, loading: catLoading } = useCategories();

  // activeMapCategories sekarang bisa isi: nama kategori DB, ATAU "__populer__" / "__terdekat__"
  const [activeMapCategories, setActiveMapCategories] = useState<string[]>([]);
  const [nearbyDests, setNearbyDests] = useState<Destination[]>([]);
  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [loadingDests, setLoadingDests] = useState(true);

  const fetchDestinations = useCallback(async () => {
    setLoadingDests(true);
    try {
      const params = new URLSearchParams({
        limit: "100", // ambil lebih banyak supaya filter kombinasi (populer/terdekat/kategori) representatif
        ...(location && { lat: String(location.lat), lng: String(location.lng) }),
        ...(user && { userId: String(user.id) }),
      });
      const res = await fetch(`/api/pengunjung/destinations?${params}`);
      const json = await res.json();
      if (json.success) {
        setAllDests(json.data);
        if (location) {
          const nearby = json.data
            .filter((d: Destination) => d.distance !== undefined && d.distance <= NEARBY_RADIUS_KM)
            .sort((a: Destination, b: Destination) => (a.distance || 0) - (b.distance || 0))
            .slice(0, 8);
          setNearbyDests(nearby);
        } else {
          setNearbyDests(json.data.slice(0, 8));
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoadingDests(false); }
  }, [location, user]);

  useEffect(() => { fetchDestinations(); }, [fetchDestinations]);

  const toggleMapCategory = (key: string) => {
    setActiveMapCategories(prev =>
      prev.includes(key)
        ? prev.filter(c => c !== key)
        : [...prev, key]
    );
  };

  const handleSaveToggle = async (id: number, isSaved: boolean) => {
    if (!user) { 
      alert("Silakan masuk (login) terlebih dahulu untuk menyimpan destinasi.");
      window.location.href = `/auth/login?redirect=/pengunjung`; 
      return; 
    }
    try {
      if (isSaved) {
        await fetch("/api/pengunjung/saved", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId: id }),
        });
      } else {
        await fetch(`/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`, { method: "DELETE" });
      }
    } catch (e) { console.error(e); }
  };

  // ── Marker yang tampil di peta ───────────────────────────────────
  // Union dari semua filter aktif: kategori DB + Populer + Terdekat.
  // Default (tidak ada pill aktif): otomatis tampilkan radius 5 km dari GPS
  // (perilaku sama seperti "Terdekat" aktif, hanya pill-nya tidak ikut ter-highlight).
  const mapMarkers = useMemo(() => {
    const isPopulerActive = activeMapCategories.includes(SPECIAL_POPULER);
    const isTerdekatActive = activeMapCategories.includes(SPECIAL_TERDEKAT);
    const activeCatNames = activeMapCategories.filter(
      (c) => c !== SPECIAL_POPULER && c !== SPECIAL_TERDEKAT
    );

    const noFilterActive =
      !isPopulerActive && !isTerdekatActive && activeCatNames.length === 0;

    // Default state: kalau tidak ada filter yang aktif, jangan tampilkan marker
    if (noFilterActive) {
      return [];
    }

    const resultMap = new Map<number, Destination>();

    if (isPopulerActive) {
      const topPopular = [...allDests]
        .sort((a, b) => b.visitCount - a.visitCount)
        .slice(0, POPULAR_MAP_LIMIT);
      topPopular.forEach((d) => resultMap.set(d.id, d));
    }

    if (isTerdekatActive && location) {
      allDests
        .filter((d) => d.distance !== undefined && d.distance <= NEARBY_RADIUS_KM)
        .forEach((d) => resultMap.set(d.id, d));
    }

    if (activeCatNames.length > 0) {
      allDests
        .filter((d) => d.categories.some((c) => activeCatNames.includes(c.category.name)))
        .forEach((d) => resultMap.set(d.id, d));
    }

    return Array.from(resultMap.values());
  }, [activeMapCategories, allDests, location]);

  // Kategori (nama) yang dipakai MapViewClient untuk pewarnaan marker.
  // Hanya kategori DB asli yang punya warna kategori; Populer/Terdekat tidak
  // mengubah skema warna — marker tetap diwarnai sesuai kategori aslinya.
  const activeCategoryNamesForMap = activeMapCategories.filter(
    (c) => c !== SPECIAL_POPULER && c !== SPECIAL_TERDEKAT
  );

  // Nearby cards section (di bawah peta) — TIDAK DIUBAH, tetap independen dari filter peta
  const displayedDests = nearbyDests;

  // Label pill terdekat — sertakan info radius di tooltip/aria, bukan di teks (biar compact)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GPS banners — TIDAK DIUBAH */}
      {gpsError && !permissionDenied && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={15} />
          {gpsError} — <button onClick={requestLocation} className="underline font-medium">Coba lagi</button>
        </div>
      )}
      {permissionDenied && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
          <Navigation size={15} />
          Aktifkan GPS untuk melihat destinasi terdekat dan fitur navigasi.
        </div>
      )}

      {/* MAP SECTION */}
      <div className="bg-white">
        {/* Kategori filter — SATU-SATUNYA kontrol kategori di beranda.
            Klik = filter marker peta. TIDAK pindah halaman.
            flex-wrap agar pill turun ke bawah kalau kebanyakan, bukan scroll. */}
        <div className="py-3 px-4">
          <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
            {/* Pill "Populer" — selalu ada, bukan dari DB */}
            <button
              onClick={() => toggleMapCategory(SPECIAL_POPULER)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeMapCategories.includes(SPECIAL_POPULER)
                  ? "text-white border-transparent shadow-md bg-[#f97316] border-[#f97316]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <Flame size={15} />
              Populer
            </button>

            {/* Pill "Terdekat" — selalu ada, bukan dari DB, hanya aktif kalau GPS ada */}
            <button
              onClick={() => location && toggleMapCategory(SPECIAL_TERDEKAT)}
              disabled={!location}
              title={!location ? "Aktifkan GPS untuk pakai filter ini" : `Radius ${NEARBY_RADIUS_KM} km dari lokasimu`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeMapCategories.includes(SPECIAL_TERDEKAT)
                  ? "text-white border-transparent shadow-md bg-[#0284c7] border-[#0284c7]"
                  : !location
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <MapPinned size={15} />
              Terdekat
            </button>

            {/* Kategori dari DB */}
            {catLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-28 bg-gray-100 rounded-full animate-pulse" />
              ))
            ) : (
              dbCategories.map((cat) => {
                const style = getCategoryStyle(cat.name);
                const active = activeMapCategories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleMapCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                      active
                        ? "text-white border-transparent shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                    style={active ? { backgroundColor: style.color, borderColor: style.color } : {}}
                  >
                    <span>{style.icon}</span>
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            {activeMapCategories.length === 0
              ? location
                ? `Menampilkan wisata dalam radius ${NEARBY_RADIUS_KM} km dari lokasimu`
                : "Pilih kategori untuk menampilkan pin lokasi di peta"
              : "Pilih kategori lain untuk menambah atau kurangi tampilan pin"}
          </p>
        </div>

        {/* Map — marker selalu tampil sesuai mapMarkers, warna tetap per kategori asli */}
        <div className="px-4 pb-4 max-w-7xl mx-auto">
          <MapViewClient
            destinations={mapMarkers}
            userLocation={location}
            height="420px"
            activeCategories={activeCategoryNamesForMap}
          />
        </div>
      </div>

      {/* NEARBY / POPULAR SECTION — TIDAK DIUBAH, independen dari filter peta di atas */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {location ? "Tempat Terdekat" : "Destinasi Populer"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {location ? `Wisata dalam radius ${NEARBY_RADIUS_KM} km dari lokasimu` : "Paling banyak dikunjungi"}
            </p>
          </div>
          <Link href="/pengunjung/kategori"
            className="flex items-center gap-1 text-sm text-[#006837] font-medium hover:underline">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        {loadingDests ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedDests.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedDests.map((dest) => (
              <DestinationCard key={dest.id} {...dest} onSaveToggle={handleSaveToggle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada destinasi ditemukan</p>
          </div>
        )}
      </div>

      {/* FAB — z-50 agar tidak ketutup peta saat scroll */}
      <button
        onClick={() => {
          if (!user) {
            alert("Silakan masuk (login) terlebih dahulu untuk membuat rencana perjalanan.");
            window.location.href = "/auth/login?redirect=/pengunjung/rencana";
          } else {
            window.location.href = "/pengunjung/rencana";
          }
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-full shadow-lg hover:bg-[#ea6a0a] transition-all hover:scale-105 font-semibold text-sm"
      >
        <Sparkles size={16} />
        Buat Rencana
      </button>
    </div>
  );
}
