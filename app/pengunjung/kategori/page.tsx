"use client";
// app/pengunjung/kategori/page.tsx — UPDATED: 7 kategori baru + gambar di tiap box

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Map, Bot, Flame } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export default function KategoriPage() {
  const router = useRouter();

  // Pisah kategori reguler dan populer
  const regularCategories = CATEGORIES.filter((c) => c.slug !== "populer");
  const populerCategory = CATEGORIES.find((c) => c.slug === "populer")!;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/pengunjung" className="hover:text-[#006837] flex items-center gap-1">
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
            Temukan keindahan Bandung dari berbagai sudut pandang. Pilih kategori
            yang paling sesuai dengan rencanamu.
          </p>
        </div>
      </div>

      {/* Category Grid - 7 kategori regular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {regularCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/pengunjung/kategori/${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl h-52 block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Background image */}
            <img
              src={cat.bgImage}
              alt={cat.displayName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${cat.color}cc 0%, ${cat.color}44 40%, transparent 70%)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              {/* Icon badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
                style={{ backgroundColor: cat.color + "dd" }}
              >
                {cat.icon}
              </div>

              {/* Name + description */}
              <div>
                <h3 className="text-white font-bold text-xl leading-tight">
                  {cat.displayName}
                </h3>
                <p className="text-white/75 text-xs mt-1">{cat.description}</p>
                <div className="mt-2 flex items-center gap-1 text-white/60 text-xs">
                  <span>Lihat semua</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Hover border */}
            <div
              className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: cat.color }}
            />
          </Link>
        ))}
      </div>

      {/* Populer – full width banner */}
      <Link
        href={`/pengunjung/kategori/${populerCategory.slug}`}
        className="group relative overflow-hidden rounded-2xl h-40 block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-8"
      >
        <img
          src={populerCategory.bgImage}
          alt={populerCategory.displayName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/90 via-[#f97316]/60 to-transparent" />
        <div className="absolute inset-0 p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Flame size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-2xl">🔥 Destinasi Populer</h3>
            <p className="text-white/80 text-sm mt-1">
              Tempat yang paling banyak dikunjungi wisatawan Bandung
            </p>
          </div>
          <div className="ml-auto px-5 py-2.5 bg-white text-[#f97316] rounded-xl font-bold text-sm hidden md:block group-hover:bg-[#fff3e0] transition-colors">
            Lihat Semua →
          </div>
        </div>
      </Link>

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
