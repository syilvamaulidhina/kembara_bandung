"use client";
// app/pengunjung/kategori/page.tsx
// UPDATE: support kategori dari DB + selalu ada Populer & Terdekat

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Flame, MapPinned } from "lucide-react";
import {
  useCategories,
  getCategoryStyle,
  categoryNameToSlug,
} from "@/lib/hooks/useCategories";
import { useGeolocation } from "@/lib/hooks/useGeolocation";

// Radius "Terdekat" — sama dengan konstanta di beranda
const NEARBY_RADIUS_KM = 15;

export default function KategoriPage() {
  const { categories: dbCategories, loading: catLoading } = useCategories();
  const { location } = useGeolocation(true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link
          href="/pengunjung"
          className="hover:text-[#006837] flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Beranda
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Kategori</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Jelajahi Kategori Wisata
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl text-sm">
            Temukan keindahan Bandung dari berbagai sudut pandang. Pilih
            kategori yang paling sesuai dengan rencanamu.
          </p>
        </div>
      </div>

      {/* === KATEGORI KHUSUS: Terdekat + Populer === */}
      {/* Selalu ditampilkan, tidak tergantung DB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Terdekat — hanya tampil kalau GPS aktif */}
        {location ? (
          <Link
            href="/pengunjung/kategori/terdekat"
            className="group relative overflow-hidden rounded-2xl h-36 block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-[#0284c7]/90 via-[#0284c7]/70 to-[#0ea5e9]/50"
          >
            <div className="absolute inset-0 p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MapPinned size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">
                  📍 Terdekat dari Lokasimu
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Destinasi wisata dalam radius {NEARBY_RADIUS_KM} km
                </p>
              </div>
              <div className="ml-auto px-4 py-2 bg-white text-[#0284c7] rounded-xl font-bold text-sm hidden md:block group-hover:bg-blue-50 transition-colors">
                Lihat →
              </div>
            </div>
            <div
              className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: "#0284c7" }}
            />
          </Link>
        ) : (
          // Kalau GPS belum aktif, tampil banner ajakan aktifkan GPS
          <div className="rounded-2xl h-36 border-2 border-dashed border-[#0284c7]/40 flex items-center gap-5 px-6 bg-[#0284c7]/5">
            <div className="w-14 h-14 rounded-2xl bg-[#0284c7]/10 flex items-center justify-center">
              <MapPinned size={28} className="text-[#0284c7]" />
            </div>
            <div>
              <h3 className="text-[#0284c7] font-bold text-lg">
                📍 Terdekat dari Lokasimu
              </h3>
              <p className="text-[#0284c7]/70 text-sm mt-1">
                Aktifkan GPS untuk melihat destinasi dalam {NEARBY_RADIUS_KM}{" "}
                km
              </p>
            </div>
          </div>
        )}

        {/* Populer — selalu ada */}
        <Link
          href="/pengunjung/kategori/populer"
          className="group relative overflow-hidden rounded-2xl h-36 block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/90 via-[#f97316]/60 to-transparent" />
          <div className="absolute inset-0 p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Flame size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">
                🔥 Destinasi Populer
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Tempat yang paling banyak dikunjungi wisatawan
              </p>
            </div>
            <div className="ml-auto px-4 py-2 bg-white text-[#f97316] rounded-xl font-bold text-sm hidden md:block group-hover:bg-orange-50 transition-colors">
              Lihat →
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ borderColor: "#f97316" }}
          />
        </Link>
      </div>

      {/* === KATEGORI DARI DB (dibuat oleh admin) === */}
      {catLoading ? (
        // Skeleton loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-52 bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : dbCategories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Belum ada kategori yang dibuat admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {dbCategories.map((cat) => {
            const style = getCategoryStyle(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/pengunjung/kategori/${categoryNameToSlug(cat.name)}`}
                className="group relative overflow-hidden rounded-2xl h-52 block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                <img
                  src={style.bgImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${style.color}cc 0%, ${style.color}44 40%, transparent 70%)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
                    style={{ backgroundColor: style.color + "dd" }}
                  >
                    {style.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-1">
                      {cat._count.destinations} destinasi tersedia
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-white/60 text-xs">
                      <span>Lihat semua</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                {/* Hover border */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderColor: style.color }}
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* AI Guide Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1a3a2a] to-[#006837] p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">
            Bingung mau wisata ke mana?
          </h3>
          <p className="text-white/70 text-sm">
            Biarkan AI menyusun itinerary terbaik berdasarkan preferensi dan
            lokasimu.
          </p>
        </div>
        <Link
          href="/pengunjung/rencana"
          className="flex items-center gap-2 px-5 py-3 bg-[#f97316] text-white rounded-xl font-semibold text-sm hover:bg-[#ea6a0a] transition-colors whitespace-nowrap shrink-0 shadow-md"
        >
          <Bot size={18} />
          Buat Itinerary AI
        </Link>
      </div>
    </div>
  );
}
