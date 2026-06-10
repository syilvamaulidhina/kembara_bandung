"use client";
// app/pengunjung/kategori/[slug]/page.tsx — UPDATED: 7 kategori baru

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, SlidersHorizontal, Map, List,
  Star, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { CATEGORIES, getCategoryBySlug } from "@/lib/types";
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
  const searchQuery = searchParams.get("search") || "";

  const { location } = useGeolocation(true);
  const { user } = useLocalUser();

  const category = getCategoryBySlug(slug);

  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilter, setShowFilter] = useState(false);

  const [maxDistance, setMaxDistance] = useState(50);
  const [maxBudget, setMaxBudget] = useState(500000);
  const [minRating, setMinRating] = useState(0);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        ...(slug === "populer" && { popular: "true" }),
        ...(slug !== "populer" && category && { category: category.name }),
        ...(searchQuery && { search: searchQuery }),
        ...(location && {
          lat: String(location.lat),
          lng: String(location.lng),
          maxDistance: String(maxDistance),
        }),
        ...(maxBudget < 500000 && { maxPrice: String(maxBudget) }),
        ...(minRating > 0 && { minRating: String(minRating) }),
        ...(user && { userId: String(user.id) }),
      });

      const res = await fetch(`/api/pengunjung/destinations?${qParams}`);
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
  }, [slug, page, location, maxDistance, maxBudget, minRating, user, searchQuery, category]);

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
        await fetch(
          `/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`,
          { method: "DELETE" }
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  if (!category && slug !== "populer") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Kategori tidak ditemukan</p>
        <Link href="/pengunjung/kategori" className="text-[#006837] mt-2 inline-block">
          Kembali ke Kategori
        </Link>
      </div>
    );
  }

  const displayCategory = category || CATEGORIES.find((c) => c.slug === "populer")!;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/pengunjung" className="hover:text-[#006837]">Beranda</Link>
        <span>/</span>
        <Link href="/pengunjung/kategori" className="hover:text-[#006837]">Kategori</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{displayCategory.displayName}</span>
      </div>

      {/* Header with hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-36">
        <img
          src={displayCategory.bgImage}
          alt={displayCategory.displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${displayCategory.color}dd, ${displayCategory.color}88, transparent)`,
          }}
        />
        <div className="absolute inset-0 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            {displayCategory.icon}
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl">{displayCategory.displayName}</h1>
            <p className="text-white/80 text-sm">{displayCategory.description}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-end mb-4">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#006837] hover:text-[#006837] transition-colors"
        >
          {viewMode === "list" ? <><Map size={15} /> Peta</> : <><List size={15} /> Daftar</>}
        </button>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-colors ${
            showFilter
              ? "border-[#006837] text-[#006837] bg-[#006837]/5"
              : "border-gray-200 text-gray-600 hover:border-[#006837] hover:text-[#006837]"
          }`}
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filter Panel */}
        {showFilter && (
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter</h3>
                <button onClick={() => setShowFilter(false)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Jarak Maksimal
                </label>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>1 km</span>
                  <span className="font-semibold text-[#006837]">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min={1} max={100} value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-[#006837]"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Budget Tiket (Rp)
                </label>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Gratis</span>
                  <span className="font-semibold text-[#006837]">
                    {maxBudget >= 500000
                      ? "Semua"
                      : `Rp ${(maxBudget / 1000).toFixed(0)}k`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0} max={500000} step={10000} value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full accent-[#006837]"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Rating Minimum
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        minRating === r
                          ? "bg-[#006837] text-white border-[#006837]"
                          : "border-gray-200 text-gray-600 hover:border-[#006837]"
                      }`}
                    >
                      {r === 0 ? (
                        "Semua"
                      ) : (
                        <>
                          <Star size={11} className="fill-current" />
                          {r}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setPage(1); fetchDestinations(); }}
                className="w-full py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold hover:bg-[#005229] transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {viewMode === "map" ? (
            <MapViewClient
              destinations={destinations}
              userLocation={location}
              height="500px"
              activeCategories={[displayCategory.name]}
            />
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="mb-3">Tidak ada destinasi ditemukan</p>
              <button
                onClick={() => {
                  setMaxDistance(100);
                  setMaxBudget(500000);
                  setMinRating(0);
                }}
                className="text-[#006837] text-sm underline"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Menampilkan {destinations.length} dari {total} destinasi
              </p>
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#006837] transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === p
                              ? "bg-[#006837] text-white"
                              : "border border-gray-200 text-gray-600 hover:border-[#006837]"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#006837] transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
