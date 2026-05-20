"use client";
// app/pengunjung/kategori/[slug]/page.tsx
// Daftar destinasi per kategori dengan filter

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Filter, Map, List, SlidersHorizontal,
  Star, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import DestinationCard from "../../components/DestinationCard";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";

const MapViewClient = dynamic(() => import("../../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse" />,
});

const ITEMS_PER_PAGE = 8;

export default function KategoriDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { location } = useGeolocation(true);
  const { user } = useLocalUser();

  const category = CATEGORIES.find((c) => c.slug === slug);

  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilter, setShowFilter] = useState(false);

  // Filter state
  const [maxDistance, setMaxDistance] = useState(20);
  const [maxBudget, setMaxBudget] = useState(500000);
  const [minRating, setMinRating] = useState(0);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: slug,
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        ...(slug === "populer" && { popular: "true" }),
        ...(location && {
          lat: String(location.lat),
          lng: String(location.lng),
          maxDistance: String(maxDistance),
        }),
        ...(maxBudget < 500000 && { maxPrice: String(maxBudget) }),
        ...(minRating > 0 && { minRating: String(minRating) }),
        ...(user && { userId: String(user.id) }),
      });

      const res = await fetch(`/api/pengunjung/destinations?${params}`);
      const json = await res.json();

      if (json.success) {
        setDestinations(json.data);
        setTotal(json.pagination.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [slug, page, location, maxDistance, maxBudget, minRating, user]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleSaveToggle = async (id: number, isSaved: boolean) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pengunjung/kategori/${slug}`;
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
        await fetch(`/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`, {
          method: "DELETE",
        });
      }
    } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Kategori tidak ditemukan</p>
        <Link href="/pengunjung/kategori" className="text-[#1a6b3c] mt-2 inline-block">
          Kembali ke Kategori
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/pengunjung" className="hover:text-[#1a6b3c]">Beranda</Link>
        <span>/</span>
        <Link href="/pengunjung/kategori" className="hover:text-[#1a6b3c]">Kategori</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{category.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {category.slug === "populer" ? "🔥 Destinasi Populer" : `${category.icon} Wisata ${category.name}`}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors"
          >
            {viewMode === "list" ? <><Map size={16} /> Peta</> : <><List size={16} /> Daftar</>}
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        {showFilter && (
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter Pencarian</h3>
                <button onClick={() => setShowFilter(false)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Distance */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Jarak Maksimal
                </label>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>1 km</span>
                  <span className="font-semibold text-[#1a6b3c]">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-[#1a6b3c]"
                />
              </div>

              {/* Budget */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Budget (Rp)
                </label>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Rp 0</span>
                  <span className="font-semibold text-[#1a6b3c]">
                    {maxBudget >= 500000 ? "5jt+" : `Rp ${(maxBudget / 1000).toFixed(0)}k`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={10000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full accent-[#1a6b3c]"
                />
              </div>

              {/* Rating */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">Rating Minimum</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        minRating === r
                          ? "bg-[#1a6b3c] text-white border-[#1a6b3c]"
                          : "border-gray-200 text-gray-600 hover:border-[#1a6b3c]"
                      }`}
                    >
                      {r === 0 ? "Semua" : <><Star size={12} className="fill-current" />{r}+</>}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={fetchDestinations}
                className="w-full py-2.5 bg-[#1a6b3c] text-white rounded-xl text-sm font-semibold hover:bg-[#155c33] transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {viewMode === "map" ? (
            <MapViewClient
              destinations={destinations}
              userLocation={location}
              height="500px"
            />
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {destinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    {...dest}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#1a6b3c] transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-[#1a6b3c] text-white"
                            : "border border-gray-200 text-gray-600 hover:border-[#1a6b3c]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#1a6b3c] transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>Tidak ada destinasi ditemukan</p>
              <button
                onClick={() => { setMaxDistance(100); setMaxBudget(500000); setMinRating(0); }}
                className="mt-3 text-[#1a6b3c] text-sm underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
