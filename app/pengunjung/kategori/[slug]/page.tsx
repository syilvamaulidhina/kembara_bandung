"use client";
// app/pengunjung/kategori/[slug]/page.tsx
// UPDATE: support slug dari DB, fix filter jarak pakai GPS, fix search query

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  SlidersHorizontal,
  Map,
  List,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Flame,
  MapPinned,
} from "lucide-react";
import DestinationCard from "../../components/DestinationCard";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import {
  useCategories,
  getCategoryStyle,
  categoryNameToSlug,
} from "@/lib/hooks/useCategories";

const MapViewClient = dynamic(() => import("../../components/MapViewClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
  ),
});

const ITEMS_PER_PAGE = 8;
const NEARBY_RADIUS_KM = 5;

// Slugify (harus sama dengan categoryNameToSlug di useCategories)
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Kategori built-in yang tidak berasal dari DB
// "semua" dipakai navbar search untuk mencari lintas kategori
const BUILTIN_SLUGS = ["populer", "terdekat", "semua"];

export default function KategoriDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // search= dari URL (dipakai saat user search dari halaman kategori)
  const searchQuery = searchParams.get("search") || "";

  // GPS — WAJIB diambil agar filter jarak bisa pakai koordinat real
  const { location, requestLocation, permissionDenied } = useGeolocation(true);
  const { user } = useLocalUser();

  // Ambil kategori DB untuk resolve slug → nama
  const { categories: dbCategories, loading: catLoading } = useCategories();

  // Resolve nama kategori dari slug
  const resolvedCategory =
    dbCategories.find((c) => slugify(c.name) === slug) ?? null;

  const isBuiltin = BUILTIN_SLUGS.includes(slug);
  const isNearby = slug === "terdekat";
  const isPopuler = slug === "populer";
  // "semua" = search lintas kategori dari navbar, tidak filter kategori tertentu
  const isAll = slug === "semua";

  // State filter
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilter, setShowFilter] = useState(false);

  // Filter — maxDistance default 15 km untuk "terdekat", 50 km untuk lainnya
  const [maxDistance, setMaxDistance] = useState(
    isNearby ? NEARBY_RADIUS_KM : 50
  );
  const [maxBudget, setMaxBudget] = useState(500000);
  const [minRating, setMinRating] = useState(0);

  // Fetch destinasi
  const fetchDestinations = useCallback(async () => {
    // Kalau ini kategori DB tapi belum ada kategori yang di-load, tunggu dulu
    if (!isBuiltin && catLoading) return;
    // Kalau slug tidak dikenali sama sekali, jangan fetch
    if (!isBuiltin && !resolvedCategory && !catLoading) return;

    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        // "populer" → sort by visitCount desc (kompatibel dengan API asli)
        ...(isPopuler && { popular: "true" }),
        // Nama kategori langsung dari DB (bukan slug)
        ...(resolvedCategory && { category: resolvedCategory.name }),
        // Search lintas kategori
        ...(searchQuery && { search: searchQuery }),
        // Koordinat GPS — wajib ada agar jarak dihitung dari posisi user
        ...(location && { lat: String(location.lat), lng: String(location.lng) }),
        // nearby=true → aktifkan filter+sort jarak di API (kompatibel dengan API asli)
        // Kirim nearby hanya kalau GPS aktif DAN bukan slug semua/populer
        ...(location && !isAll && !isPopuler && { nearby: "true" }),
        // maxDistance — nilai slider dari panel filter, default 50 km
        ...(location && !isAll && !isPopuler && { maxDistance: String(maxDistance) }),
        ...(maxBudget < 500000 && { maxPrice: String(maxBudget) }),
        ...(minRating > 0 && { minRating: String(minRating) }),
        ...(user && { userId: String(user.id) }),
      });

      const res = await fetch(`/api/pengunjung/destinations?${qParams}`);
      const json = await res.json();

      if (json.success) {
        setDestinations(json.data);
        setTotal(json.pagination?.total ?? json.data.length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    slug,
    page,
    location,
    maxDistance,
    maxBudget,
    minRating,
    user,
    searchQuery,
    resolvedCategory,
    isBuiltin,
    isPopuler,
    isNearby,
    isAll,
    catLoading,
  ]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Reset page ke 1 kalau search query berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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

  // ── Meta tampilan ──────────────────────────────────────────────
  // Tentukan style berdasarkan slug
  const getDisplayMeta = () => {
    if (isPopuler) {
      return {
        name: "Destinasi Populer",
        description: "Tempat yang paling banyak dikunjungi wisatawan Bandung",
        color: "#f97316",
        icon: "🔥",
        bgImage: "/images/categories/populer.jpg",
      };
    }
    if (isNearby) {
      return {
        name: `Terdekat (${NEARBY_RADIUS_KM} km)`,
        description: `Destinasi wisata dalam radius ${NEARBY_RADIUS_KM} km dari lokasimu`,
        color: "#0284c7",
        icon: "📍",
        bgImage: "/images/categories/terdekat.jpg",
      };
    }
    if (isAll) {
      return {
        name: searchQuery ? `Hasil Pencarian` : "Semua Destinasi",
        description: searchQuery
          ? `Mencari: "${searchQuery}"`
          : "Semua destinasi wisata Bandung Raya",
        color: "#006837",
        icon: "🔍",
        bgImage: "/images/categories/default.jpg",
      };
    }
    if (resolvedCategory) {
      const style = getCategoryStyle(resolvedCategory.name);
      return {
        name: resolvedCategory.name,
        description: `${resolvedCategory._count.destinations} destinasi tersedia`,
        ...style,
      };
    }
    return null;
  };

  const displayMeta = getDisplayMeta();

  // Kategori tidak ditemukan (bukan builtin dan bukan dari DB)
  if (!isBuiltin && !catLoading && !resolvedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Kategori tidak ditemukan</p>
        <Link
          href="/pengunjung/kategori"
          className="text-[#006837] mt-2 inline-block"
        >
          Kembali ke Kategori
        </Link>
      </div>
    );
  }

  // Loading awal (nunggu kategori DB di-load)
  if (!isBuiltin && catLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/pengunjung" className="hover:text-[#006837]">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/pengunjung/kategori" className="hover:text-[#006837]">
          Kategori
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {displayMeta?.name ?? slug}
        </span>
      </div>

      {/* Header hero */}
      {displayMeta && (
        <div className="relative rounded-2xl overflow-hidden mb-6 h-36">
          <img
            src={displayMeta.bgImage}
            alt={displayMeta.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${displayMeta.color}dd, ${displayMeta.color}88, transparent)`,
            }}
          />
          <div className="absolute inset-0 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
              {displayMeta.icon}
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">
                {displayMeta.name}
              </h1>
              <p className="text-white/80 text-sm">{displayMeta.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info filter jarak — tampil kalau GPS belum aktif */}
      {!location && !permissionDenied && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
          <MapPinned size={5} />
          <span>
            Aktifkan GPS agar filter{" "}
            <strong>Jarak Maksimal</strong> bekerja dari posisimu.{" "}
            <button
              onClick={requestLocation}
              className="underline font-semibold"
            >
              Aktifkan sekarang
            </button>
          </span>
        </div>
      )}
      {permissionDenied && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          GPS diblokir browser. Filter jarak tidak tersedia. Izinkan lokasi di
          pengaturan browser untuk menggunakannya.
        </div>
      )}

      {/* Search info — kalau ada query aktif */}
      {searchQuery && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 flex items-center justify-between">
          <span>
            Hasil pencarian untuk:{" "}
            <strong>&quot;{searchQuery}&quot;</strong>
          </span>
          <Link
            href={`/pengunjung/kategori/${slug}`}
            className="text-[#006837] font-medium hover:underline"
          >
            Hapus pencarian ✕
          </Link>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-end mb-4">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#006837] hover:text-[#006837] transition-colors"
        >
          {viewMode === "list" ? (
            <>
              <Map size={15} /> Peta
            </>
          ) : (
            <>
              <List size={15} /> Daftar
            </>
          )}
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

              {/* Filter Jarak — hanya aktif kalau GPS ada */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Jarak Maksimal
                </label>
                {location ? (
                  <>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>1 km</span>
                      <span className="font-semibold text-[#006837]">
                        {maxDistance} km dari lokasimu
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                      className="w-full accent-[#006837]"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Koordinat GPS aktif ✓
                    </p>
                  </>
                ) : (
                  <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    GPS belum aktif. Filter jarak tidak tersedia.
                    <button
                      onClick={requestLocation}
                      className="block mt-1 underline font-medium"
                    >
                      Aktifkan GPS
                    </button>
                  </div>
                )}
              </div>

              {/* Filter Budget */}
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
                  min={0}
                  max={500000}
                  step={10000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full accent-[#006837]"
                />
              </div>

              {/* Filter Rating */}
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
                onClick={() => {
                  setPage(1);
                  fetchDestinations();
                }}
                className="w-full py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold hover:bg-[#005229] transition-colors"
              >
                Terapkan Filter
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  setMaxDistance(isNearby ? NEARBY_RADIUS_KM : 50);
                  setMaxBudget(500000);
                  setMinRating(0);
                  setPage(1);
                }}
                className="w-full py-2 text-gray-400 text-xs mt-2 hover:text-gray-600 transition-colors"
              >
                Reset filter
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
              activeCategories={
                resolvedCategory ? [resolvedCategory.name] : undefined
              }
            />
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                >
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
              <p className="mb-2">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : isNearby && !location
                    ? "Aktifkan GPS untuk melihat destinasi terdekat"
                    : "Tidak ada destinasi ditemukan"}
              </p>
              <button
                onClick={() => {
                  setMaxDistance(isNearby ? NEARBY_RADIUS_KM : 50);
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
                {searchQuery && (
                  <span className="font-medium text-gray-700">
                    &ldquo;{searchQuery}&rdquo; —{" "}
                  </span>
                )}
                Menampilkan {destinations.length} dari {total} destinasi
                {location && (
                  <span className="text-xs text-gray-400 ml-2">
                    (jarak maks. {maxDistance} km)
                  </span>
                )}
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
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
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