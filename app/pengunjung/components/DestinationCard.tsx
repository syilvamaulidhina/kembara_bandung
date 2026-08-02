"use client";
// app/pengunjung/components/DestinationCard.tsx

import Link from "next/link";
import { MapPin, Star, Heart, Clock, Navigation } from "lucide-react";
import { formatDistance, formatPriceRange, getImageUrl, isOpenNow } from "@/lib/utils";
import { useState } from "react";

interface DestinationCardProps {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  openTime?: string | null;
  closeTime?: string | null;
  distance?: number;
  averageRating?: number | null;
  reviewCount?: number;
  isSaved?: boolean;
  categories?: { category: { name: string } }[];
  onSaveToggle?: (id: number, isSaved: boolean) => void;
  onAddToItinerary?: (id: number) => void;
  compact?: boolean;
}

export default function DestinationCard({
  id,
  name,
  address,
  imageUrl,
  ticketPrice,
  maxPrice,
  openTime,
  closeTime,
  distance,
  averageRating,
  reviewCount = 0,
  isSaved = false,
  categories = [],
  onSaveToggle,
  onAddToItinerary,
  compact = false,
}: DestinationCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const open = isOpenNow(openTime || null, closeTime || null);
  const categoryName = categories[0]?.category?.name;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    onSaveToggle?.(id, !saved);
  };

  const handleAddToItinerary = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToItinerary?.(id);
  };

  return (
    <Link href={`/pengunjung/destinasi/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: compact ? "160px" : "200px" }}>
          <img
            src={getImageUrl(imageUrl, name)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=1a6b3c&color=ffffff&bold=true`;
            }}
          />

          {/* Category badge */}
          {categoryName && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                {categoryName}
              </span>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={16}
              className={saved ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>

          {/* Rating badge */}
          {averageRating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
            <MapPin size={11} className="shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Open/Closed status */}
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  open ? "text-green-600" : "text-red-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    open ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                {open ? "Buka" : "Tutup"}
              </span>

              {/* Distance */}
              {distance !== undefined && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Navigation size={11} />
                  {formatDistance(distance)}
                </span>
              )}
            </div>

            {/* Price */}
            <span className="text-xs font-semibold text-[#1a6b3c]">
              {ticketPrice === 0
                ? "Gratis"
                : ticketPrice
                ? `Rp ${ticketPrice.toLocaleString("id-ID")}`
                : "—"}
            </span>
          </div>

          {/* Add to Itinerary button */}
          {onAddToItinerary && (
            <button
              onClick={handleAddToItinerary}
              className="mt-3 w-full py-2 text-xs font-medium text-[#1a6b3c] border border-[#1a6b3c]/30 rounded-xl hover:bg-[#1a6b3c] hover:text-white transition-colors"
            >
              + Tambah ke Rencana
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
