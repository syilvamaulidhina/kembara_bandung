"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Phone, Globe, Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import MiniMapClient from "../../components/MiniMapClient";

interface EventDetail {
  id: number;
  name: string;
  description: string;
  bannerUrl: string | null;
  startDate: string;
  endDate: string;
  contact: string | null;
  registrationUrl: string | null;
  destination: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
}

export default function VisitorEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/pengunjung/events/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setEvent(data.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#006837]" size={40} />
        <p className="mt-4 text-gray-500 font-medium">Memuat event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-gray-500 mb-4">Event tidak ditemukan atau sudah tidak aktif.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#006837] text-white rounded-full font-semibold">
          Kembali
        </button>
      </div>
    );
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const isSameDay = start.toDateString() === end.toDateString();
  const dateStr = isSameDay 
    ? start.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
    : `${start.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}`;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Hadirilah event ${event.name} di ${event.destination?.name || 'Bandung'} pada ${dateStr}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan berhasil disalin!");
    }
  };

  const handleRuteKeSini = () => {
    if (!event.destination) return;
    const navParams = new URLSearchParams({
      destId: String(event.destination.id),
      destName: event.destination.name,
      destLat: String(event.destination.latitude),
      destLng: String(event.destination.longitude),
      destAddress: event.destination.address,
    });
    router.push(`/pengunjung/navigasi?${navParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER & BANNER */}
      <div className="relative h-72 md:h-96 bg-gray-900">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {event.bannerUrl && (
          <img 
            src={event.bannerUrl} 
            alt={event.name} 
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.name)}&background=006837&color=fff&size=800`;
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f97316] rounded-full text-xs font-bold mb-3">
            <Calendar size={14} />
            {dateStr}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.name}</h1>
          {event.destination && (
            <Link href={`/pengunjung/destinasi/${event.destination.id}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <MapPin size={16} />
              <span className="text-sm">{event.destination.name}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT / MAIN CONTENT */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tentang Event</h2>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </section>

          {/* Lokasi Event */}
          {event.destination && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Lokasi Event</h2>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{event.destination.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{event.destination.address}</p>
                  </div>
                </div>
                <div className="h-48 relative">
                  <MiniMapClient 
                    lat={event.destination.latitude} 
                    lng={event.destination.longitude} 
                    name={event.destination.name}
                    height="100%"
                    onClickMap={handleRuteKeSini}
                  />
                </div>
                <div className="p-3 bg-white">
                  <button 
                    onClick={handleRuteKeSini}
                    className="w-full py-2.5 rounded-xl border-2 border-[#006837] text-[#006837] font-semibold text-sm hover:bg-green-50 transition-colors"
                  >
                    Buka Rute Navigasi
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT / SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Informasi Tambahan</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Jadwal</p>
                <div className="flex items-start gap-2 text-sm text-gray-800">
                  <Calendar size={16} className="text-[#f97316] shrink-0 mt-0.5" />
                  <div>
                    <p>{start.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-gray-500">{start.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB - Selesai</p>
                  </div>
                </div>
              </div>

              {event.contact ? (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Kontak Penyelenggara</p>
                  <a href={`tel:${event.contact}`} className="flex items-center gap-2 text-sm text-gray-800 hover:text-[#006837]">
                    <Phone size={16} className="text-[#006837] shrink-0" />
                    {event.contact}
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Kontak Penyelenggara</p>
                  <p className="flex items-center gap-2 text-sm text-gray-500 italic">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    Tidak ada kontak
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3">
              {event.registrationUrl ? (
                <a 
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#006837] text-white font-semibold text-sm hover:bg-[#005229] transition-colors shadow-md shadow-green-900/20"
                >
                  <Globe size={18} />
                  Daftar Sekarang
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-medium text-sm border border-gray-200">
                  Pendaftaran Langsung di Tempat
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
