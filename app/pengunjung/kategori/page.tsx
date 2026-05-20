"use client";
// app/pengunjung/kategori/page.tsx
// Halaman Kategori Wisata

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Map, Bot } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import DestinationCard from "../components/DestinationCard";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapViewClient = dynamic(() => import("../components/MapViewClient"), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />,
});

export default function KategoriPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { location } = useGeolocation(true);
  const { user } = useLocalUser();
  const [showMap, setShowMap] = useState(false);
  const [allDests, setAllDests] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/pengunjung/destinations?limit=50&popular=true`)
      .then((r) => r.json())
      .then((j) => { if (j.success) setAllDests(j.data); });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/pengunjung" className="hover:text-[#1a6b3c] flex items-center gap-1">
          <ArrowLeft size={14} /> Beranda
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Kategori</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jelajahi Kategori Wisata</h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Temukan keindahan Bandung dari berbagai sudut pandang. Pilih kategori yang paling sesuai dengan rencanamu.
          </p>
        </div>
        <button
          onClick={() => setShowMap(!showMap)}
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors"
        >
          <Map size={16} />
          {showMap ? "Sembunyikan Peta" : "Pindah ke Map View"}
        </button>
      </div>

      {/* Map toggle */}
      {showMap && (
        <div className="mb-8">
          <MapViewClient destinations={allDests} userLocation={location} height="320px" />
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/pengunjung/kategori/${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl h-48 block"
          >
            <img
              src={cat.bgImage}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.background = cat.color;
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ background: `linear-gradient(to top, ${cat.color}ee, ${cat.color}44, transparent)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
              </div>
              <p className="text-white/80 text-sm">{cat.description}</p>
            </div>
            {cat.slug === "populer" && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-medium">
                Trending 🔥
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* AI Guide Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1a3a2a] to-[#1a6b3c] p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Bingung pilih yang mana?</h3>
          <p className="text-white/70 text-sm">
            Coba fitur AI Itinerary kami untuk rekomendasi perjalanan personal berdasarkan preferensimu.
          </p>
        </div>
        <Link
          href="/pengunjung/rencana"
          className="flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-semibold text-sm hover:bg-[#ea6a0a] transition-colors whitespace-nowrap shrink-0"
        >
          <Bot size={18} />
          Tanya AI Guide
        </Link>
      </div>
    </div>
  );
}
