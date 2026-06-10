"use client";
// app/pengunjung/page.tsx  — Beranda

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ChevronRight, Loader2, Navigation, AlertCircle, Sparkles } from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import DestinationCard from "./components/DestinationCard";
import { CATEGORIES } from "@/lib/types";
import { useLocalUser } from "@/lib/hooks/useLocalUser";

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

export default function BerandaPage() {
  const { location, loading: gpsLoading, error: gpsError, permissionDenied, requestLocation } = useGeolocation(true);
  const { user } = useLocalUser();

  // Kategori yang aktif di filter (bisa multi-select untuk peta)
  const [activeMapCategories, setActiveMapCategories] = useState<string[]>([]);
  const [nearbyDests, setNearbyDests] = useState<Destination[]>([]);
  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [loadingDests, setLoadingDests] = useState(true);

  const fetchDestinations = useCallback(async () => {
    setLoadingDests(true);
    try {
      const params = new URLSearchParams({
        limit: "40",
        ...(location && { lat: String(location.lat), lng: String(location.lng) }),
        ...(user && { userId: String(user.id) }),
      });
      const res = await fetch(`/api/pengunjung/destinations?${params}`);
      const json = await res.json();
      if (json.success) {
        setAllDests(json.data);
        if (location) {
          const nearby = json.data
            .filter((d: Destination) => d.distance !== undefined && d.distance <= 30)
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

  const toggleMapCategory = (catName: string) => {
    setActiveMapCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const handleSaveToggle = async (id: number, isSaved: boolean) => {
    if (!user) { window.location.href = `/auth/login?redirect=/pengunjung`; return; }
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

  // Nearby cards – filter by active category kalau ada
  const displayedDests = activeMapCategories.length > 0
    ? nearbyDests.filter(d =>
        d.categories.some(c => activeMapCategories.includes(c.category.name))
      )
    : nearbyDests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* GPS banners */}
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
        {/* Kategori filter – TENGAH, mengontrol pin peta */}
        <div className="py-3 px-4">
          <div className="flex gap-2 justify-center flex-wrap">
            {CATEGORIES.filter(c => c.slug !== "populer").map((cat) => {
              const active = activeMapCategories.includes(cat.name);
              return (
                <button
                  key={cat.slug}
                  onClick={() => toggleMapCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    active
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                  style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
          {activeMapCategories.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Pilih kategori untuk menampilkan pin lokasi di peta
            </p>
          )}
        </div>

        {/* Map */}
        <div className="px-4 pb-4 max-w-7xl mx-auto">
          <MapViewClient
            destinations={allDests}
            userLocation={location}
            height="420px"
            showHeatmap={activeMapCategories.length > 0}
            activeCategories={activeMapCategories}
          />
        </div>
      </div>

      {/* NEARBY / POPULAR SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeMapCategories.length > 0
                ? `Destinasi ${activeMapCategories.join(", ")}`
                : location ? "Tempat Terdekat" : "Destinasi Populer"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {location ? "Wisata di sekitar lokasi kamu" : "Paling banyak dikunjungi"}
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
            <p className="text-sm">
              {activeMapCategories.length > 0
                ? "Tidak ada destinasi di kategori ini di sekitarmu"
                : "Tidak ada destinasi ditemukan"}
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/pengunjung/rencana"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-full shadow-lg hover:bg-[#ea6a0a] transition-all hover:scale-105 font-semibold text-sm"
      >
        <Sparkles size={16} />
        Buat Rencana
      </Link>
    </div>
  );
}
