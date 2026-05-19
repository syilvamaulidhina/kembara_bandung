"use client";
// app/pengunjung/page.tsx
// Halaman Beranda – Peta SIG + Tempat Terdekat + Kategori

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, MapPin, ChevronRight, Loader2, Navigation, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import DestinationCard from "./components/DestinationCard";
import { CATEGORIES } from "@/lib/types";
import { useLocalUser } from "@/lib/hooks/useLocalUser";

// Lazy load peta (SSR tidak bisa render Leaflet)
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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [nearbyDests, setNearbyDests] = useState<Destination[]>([]);
  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [loadingDests, setLoadingDests] = useState(true);

  // Fetch destinations
  const fetchDestinations = useCallback(async () => {
    setLoadingDests(true);
    try {
      const params = new URLSearchParams({
        limit: "20",
        ...(location && { lat: String(location.lat), lng: String(location.lng) }),
        ...(user && { userId: String(user.id) }),
      });

      const res = await fetch(`/api/pengunjung/destinations?${params}`);
      const json = await res.json();

      if (json.success) {
        const dests: Destination[] = json.data;
        setAllDests(dests);

        // Filter nearby (< 30 km)
        if (location) {
          const nearby = dests
            .filter((d) => d.distance !== undefined && d.distance <= 30)
            .sort((a, b) => (a.distance || 0) - (b.distance || 0))
            .slice(0, 8);
          setNearbyDests(nearby);
        } else {
          // Tampilkan yang paling banyak dikunjungi sebagai fallback
          setNearbyDests(dests.slice(0, 8));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDests(false);
    }
  }, [location, user]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/pengunjung/kategori?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSaveToggle = async (id: number, isSaved: boolean) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pengunjung`;
      return;
    }
    try {
      if (isSaved) {
        await fetch("/api/pengunjung/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId: id }),
        });
      } else {
        await fetch(
          `/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`,
          { method: "DELETE" }
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayedDests = activeCategory
    ? nearbyDests.filter((d) =>
        d.categories.some(
          (c) => c.category.name.toLowerCase() === activeCategory.toLowerCase()
        )
      )
    : nearbyDests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* GPS Permission Banner */}
      {gpsError && !permissionDenied && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={16} />
          {gpsError} —{" "}
          <button onClick={requestLocation} className="underline font-medium">
            Coba lagi
          </button>
        </div>
      )}
      {permissionDenied && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
          <Navigation size={16} />
          Aktifkan GPS di browser untuk melihat destinasi terdekat dan fitur navigasi.
        </div>
      )}

      {/* MAP SECTION */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#1a3a2a]/5 z-0 pointer-events-none" />

        {/* Search Bar Floating */}
        <div className="relative z-20 pt-4 px-4 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2 shadow-lg">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-100">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari destinasi di Bandung..."
                className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#1a6b3c] text-white rounded-xl text-sm font-semibold hover:bg-[#155c33] transition-colors shadow-md"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Category filter pills */}
        <div className="relative z-20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.filter(c => c.slug !== "populer").map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                }
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? "bg-[#1a6b3c] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a6b3c] hover:text-[#1a6b3c]"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="px-4 max-w-7xl mx-auto pb-4">
          <MapViewClient
            destinations={allDests}
            userLocation={location}
            height="420px"
            showHeatmap={true}
          />
        </div>
      </div>

      {/* NEARBY SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {location ? "Tempat Terdekat" : "Destinasi Populer"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {location
                ? "Wisata di sekitar lokasi kamu saat ini"
                : "Destinasi paling banyak dikunjungi"}
            </p>
          </div>
          <Link
            href="/pengunjung/kategori"
            className="flex items-center gap-1 text-sm text-[#1a6b3c] font-medium hover:underline"
          >
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
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedDests.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedDests.map((dest) => (
              <DestinationCard
                key={dest.id}
                {...dest}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada destinasi ditemukan di kategori ini</p>
          </div>
        )}
      </div>

      {/* CATEGORY GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Jelajahi Kategori</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/pengunjung/kategori/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-square"
            >
              <img
                src={cat.bgImage}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${cat.color}cc, transparent)`,
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-xl mb-0.5">{cat.icon}</div>
                <div className="text-white font-bold text-sm">{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAB - AI Itinerary */}
      <Link
        href="/pengunjung/rencana"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-full shadow-lg hover:bg-[#ea6a0a] transition-all hover:scale-105 font-semibold text-sm"
      >
        <span>✨</span>
        Buat Rencana
      </Link>
    </div>
  );
}
