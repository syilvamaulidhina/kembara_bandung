"use client";
// app/pengunjung/peta-rute/page.tsx
// Peta penuh rute itinerary sebelum mulai navigasi

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Navigation, Loader2, MapPin, Clock, DollarSign } from "lucide-react";
import { useLocalUser } from "@/lib/hooks/useLocalUser";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { formatRupiah, isOpenNow, getImageUrl } from "@/lib/utils";

const PetaRuteClient = dynamic(() => import("../components/PetaRuteClient"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-[#006837]" size={36} />
        <span className="text-gray-500 text-sm">Memuat peta rute...</span>
      </div>
    </div>
  ),
});

interface ItineraryItem {
  id: number;
  order: number;
  visitTime: string | null;
  destination: {
    id: number;
    name: string;
    address: string;
    imageUrl: string | null;
    latitude: number;
    longitude: number;
    ticketPrice: number | null;
    openTime: string | null;
    closeTime: string | null;
  };
}

export default function PetaRutePage() {
  const { user } = useLocalUser();
  const { location } = useGeolocation(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/pengunjung/itinerary?userId=${user.id}`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.items) setItems(json.data.items);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-[#006837]" size={40} />
    </div>
  );

  if (items.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">Belum ada rencana perjalanan</p>
        <Link href="/pengunjung/rencana" className="px-5 py-2.5 bg-[#006837] text-white rounded-xl font-semibold text-sm">
          Buat Rencana
        </Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10 shrink-0">
        <Link href="/pengunjung/rencana" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-bold text-gray-900 text-base">Rute Perjalanan</h1>
          <p className="text-xs text-gray-500">{items.length} destinasi · klik marker untuk detail</p>
        </div>
        <Link
          href="/pengunjung/navigasi"
          className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-xl text-sm font-bold hover:bg-[#ea6a0a] transition-colors shadow-md"
        >
          <Navigation size={16} />
          Mulai Navigasi
        </Link>
      </div>

      {/* Main: map + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <PetaRuteClient
            items={items}
            userLocation={location}
            activeIdx={activeIdx}
            onMarkerClick={(idx) => setActiveIdx(activeIdx === idx ? null : idx)}
          />
        </div>

        {/* Sidebar – daftar destinasi */}
        <div className="w-72 bg-white border-l border-gray-100 overflow-y-auto shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">Urutan Kunjungan</p>
            <p className="text-xs text-gray-400 mt-0.5">Seret di halaman rencana untuk mengubah urutan</p>
          </div>
          {items.map((item, idx) => {
            const open = isOpenNow(item.destination.openTime, item.destination.closeTime);
            const isActive = activeIdx === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIdx(isActive ? null : idx)}
                className={`w-full text-left p-4 border-b border-gray-50 flex gap-3 transition-colors ${
                  isActive ? "bg-[#006837]/5 border-l-3 border-l-[#006837]" : "hover:bg-gray-50"
                }`}
              >
                {/* Number */}
                <div className="w-8 h-8 rounded-full bg-[#f97316] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.destination.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.destination.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {item.visitTime && (
                      <span className="flex items-center gap-0.5 text-xs text-[#006837] font-medium">
                        <Clock size={10} />{item.visitTime}
                      </span>
                    )}
                    <span className={`text-xs font-medium ${open ? "text-green-600" : "text-red-400"}`}>
                      {open ? "Buka" : "Tutup"}
                    </span>
                    {item.destination.ticketPrice !== null && (
                      <span className="text-xs text-gray-400">
                        {item.destination.ticketPrice === 0 ? "Gratis" : `Rp ${item.destination.ticketPrice.toLocaleString("id-ID")}`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* CTA */}
          <div className="p-4">
            <Link href="/pengunjung/navigasi"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea6a0a] transition-colors">
              <Navigation size={15} />
              Mulai Navigasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
