"use client";
// app/pengunjung/destinasi/[id]/page.tsx
// Halaman Detail Destinasi Wisata

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Star, MapPin, Phone, Clock, DollarSign,
  Heart, Navigation, Plus, Globe, Share2, Cloud, Thermometer,
  Droplets, Wind, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import {
  formatDistance, formatPriceRange, isOpenNow,
  formatOperationalHours, getImageUrl
} from "@/lib/utils";

const MiniMapClient = dynamic(() => import("../../components/MiniMapClient"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />,
});

interface DestinationDetail {
  id: number;
  name: string;
  description: string;
  address: string;
  contact: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  website: string | null;
  visitCount: number;
  averageRating: number | null;
  reviewCount: number;
  isSaved: boolean;
  distance?: number;
  categories: { category: { id: number; name: string } }[];
  reviews: {
    id: number;
    rating: number;
    comment: string | null;
    photoUrl: string | null;
    createdAt: string;
    user: { id: number; name: string; photo: string | null };
  }[];
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  isReal: boolean;
}

const GALLERY_IMAGES = [
  null, // main image
  "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
  "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?w=800",
];

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { location } = useGeolocation(false);
  const { user } = useLocalUser();

  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [addingToItinerary, setAddingToItinerary] = useState(false);
  const [itinerarySuccess, setItinerarySuccess] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const params = new URLSearchParams({
          ...(location && { lat: String(location.lat), lng: String(location.lng) }),
          ...(user && { userId: String(user.id) }),
        });

        const res = await fetch(`/api/pengunjung/destinations/${id}?${params}`);
        const json = await res.json();

        if (json.success) {
          setDestination(json.data);
          setSaved(json.data.isSaved);

          // Fetch weather for this location
          const weatherRes = await fetch(
            `/api/pengunjung/weather?lat=${json.data.latitude}&lng=${json.data.longitude}`
          );
          const weatherJson = await weatherRes.json();
          if (weatherJson.success) setWeather(weatherJson.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, location, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pengunjung/destinasi/${id}`;
      return;
    }
    setSavingToggle(true);
    try {
      if (saved) {
        await fetch(`/api/pengunjung/saved?userId=${user.id}&destinationId=${id}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await fetch("/api/pengunjung/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId: parseInt(id) }),
        });
        setSaved(true);
      }
    } catch (e) { console.error(e); }
    finally { setSavingToggle(false); }
  };

  const handleAddToItinerary = async () => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/pengunjung/destinasi/${id}`;
      return;
    }
    // Save dulu lalu redirect ke rencana
    if (!saved) await handleSaveToggle();
    window.location.href = `/pengunjung/rencana?add=${id}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: destination?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#1a6b3c]" size={36} />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Destinasi tidak ditemukan</p>
        <Link href="/pengunjung" className="mt-4 text-[#1a6b3c] hover:underline inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const open = isOpenNow(destination.openTime, destination.closeTime);
  const categoryName = destination.categories[0]?.category?.name;
  const galleryImages = [destination.imageUrl, ...GALLERY_IMAGES.slice(1)].filter(Boolean) as string[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/pengunjung" className="hover:text-[#1a6b3c] flex items-center gap-1">
          <ArrowLeft size={14} /> Beranda
        </Link>
        {categoryName && (
          <>
            <span>/</span>
            <Link href={`/pengunjung/kategori/${categoryName.toLowerCase()}`} className="hover:text-[#1a6b3c]">
              {categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1">{destination.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero image with gallery */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="h-72 md:h-96">
              <img
                src={getImageUrl(galleryImages[activeImg] || null, destination.name)}
                alt={destination.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(destination.name)}&size=800&background=1a6b3c&color=fff`;
                }}
              />
            </div>

            {/* Category badge */}
            {categoryName && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#f97316] text-white text-xs font-bold rounded-full">
                {categoryName.toUpperCase()}
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleSaveToggle}
                disabled={savingToggle}
                className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md transition-all ${
                  saved ? "bg-red-500" : "bg-white/90"
                }`}
              >
                {savingToggle ? (
                  <Loader2 size={16} className="animate-spin text-gray-600" />
                ) : (
                  <Heart size={18} className={saved ? "fill-white text-white" : "text-gray-600"} />
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <Share2 size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Gallery dots */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeImg ? "bg-white w-5" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Gallery navigation */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Name + rating */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{destination.name}</h1>
              {destination.averageRating && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900 text-lg">{destination.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({destination.reviewCount} ulasan)</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <MapPin size={14} />
              <span>{destination.address}</span>
            </div>
            {destination.distance !== undefined && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-[#1a6b3c]">
                <Navigation size={13} />
                <span>{formatDistance(destination.distance)} dari lokasi kamu</span>
              </div>
            )}
          </div>

          {/* Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${open ? "bg-green-100" : "bg-red-50"}`}>
                <Clock size={18} className={open ? "text-green-600" : "text-red-400"} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">STATUS OPERASIONAL</p>
                <p className={`font-bold ${open ? "text-green-600" : "text-red-500"}`}>
                  {open ? "Buka Sekarang" : "Tutup Saat Ini"}
                </p>
              </div>
              <span className={`ml-auto w-2.5 h-2.5 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-red-300"}`} />
            </div>

            {weather && (
              <div className="bg-[#1a3a5c] rounded-xl p-4 flex items-center gap-3">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-12 h-12 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div>
                  <p className="text-xs text-white/60 font-medium uppercase">
                    CUACA {weather.cityName.toUpperCase()}
                  </p>
                  <p className="text-white font-bold text-lg">{weather.temp}°C · {weather.description}</p>
                </div>
                {!weather.isReal && (
                  <span className="ml-auto text-xs text-white/40">Demo</span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3">Tentang Destinasi</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{destination.description}</p>
          </div>

          {/* Ticket info + Jam buka */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-[#f97316]" />
                Informasi Tiket
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Wisatawan Domestik</span>
                  <span className="font-semibold text-gray-900">
                    {destination.ticketPrice === 0 ? "Gratis" : destination.ticketPrice ? `Rp ${destination.ticketPrice.toLocaleString("id-ID")}` : "–"}
                  </span>
                </div>
                {destination.maxPrice && destination.maxPrice !== destination.ticketPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Maksimal</span>
                    <span className="font-semibold text-gray-900">
                      Rp {destination.maxPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {destination.contact && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-50 text-sm text-gray-500">
                    <Phone size={13} />
                    <span>{destination.contact}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-[#1a6b3c]" />
                Jam Operasional
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{formatOperationalHours(destination.openTime, destination.closeTime)}</p>
                {weather && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Droplets size={11} /> {weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind size={11} /> {weather.windSpeed} m/s
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          {destination.reviews.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4 text-lg">Ulasan Pengunjung</h2>
              <div className="space-y-4">
                {destination.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1a6b3c] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 text-sm">{review.user.name}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="flex gap-0.5 my-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                        {review.comment && (
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        )}
                        {review.photoUrl && (
                          <img src={review.photoUrl} alt="review" className="mt-2 h-24 rounded-lg object-cover" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <button
              onClick={handleSaveToggle}
              disabled={savingToggle}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors ${
                saved
                  ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#1a6b3c] hover:text-[#1a6b3c]"
              }`}
            >
              <Heart size={16} className={saved ? "fill-red-500" : ""} />
              {saved ? "Tersimpan" : "Simpan"}
            </button>

            <Link
              href={`/pengunjung/navigasi`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1a6b3c] text-white hover:bg-[#155c33] transition-colors"
            >
              <Navigation size={16} />
              Rute ke Sini
            </Link>

            <button
              onClick={handleAddToItinerary}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#f97316] text-white hover:bg-[#ea6a0a] transition-colors"
            >
              <Plus size={16} />
              Tambah ke Itinerary
            </button>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Lokasi</h3>
              <p className="text-xs text-gray-400 mt-0.5">{destination.address}</p>
            </div>
            <MiniMapClient
              lat={destination.latitude}
              lng={destination.longitude}
              name={destination.name}
            />
            <div className="p-3 flex justify-around border-t border-gray-50">
              {destination.contact && (
                <a href={`tel:${destination.contact}`} className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-[#1a6b3c] transition-colors">
                  <Phone size={16} />
                  Kontak
                </a>
              )}
              {destination.website && (
                <a href={destination.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-[#1a6b3c] transition-colors">
                  <Globe size={16} />
                  Situs
                </a>
              )}
              <button onClick={handleShare} className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-[#1a6b3c] transition-colors">
                <Share2 size={16} />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
