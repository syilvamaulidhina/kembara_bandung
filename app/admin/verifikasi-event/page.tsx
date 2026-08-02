"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarCheck, Clock, CheckCircle2, XCircle, MapPin, User, ExternalLink, Image as ImageIcon } from "lucide-react";

type EventItem = {
  id: number;
  name: string;
  description: string;
  bannerUrl: string | null;
  startDate: string;
  endDate: string;
  contact: string | null;
  registrationUrl: string | null;
  status: string;
  createdAt: string;
  owner: { id: number; name: string; email: string };
  destination: { id: number; name: string; address: string } | null;
};

type TabKey = "pending" | "aktif" | "ditolak";

const TABS: { key: TabKey; label: string; icon: typeof Clock }[] = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "aktif", label: "Disetujui", icon: CheckCircle2 },
  { key: "ditolak", label: "Ditolak", icon: XCircle },
];

export default function VerifikasiEventPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifikasi-event?status=${activeTab}`);
      const json = await res.json();
      if (json.success) setEvents(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      await fetch("/api/admin/verifikasi-event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      await fetchEvents();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarCheck size={22} className="text-primary" />
          Verifikasi Event
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola pengajuan event wisata dari pengelola
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
              style={active ? { backgroundColor: "#130F6A" } : {}}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Tidak ada data
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row gap-4"
              >
                <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                  {event.bannerUrl ? (
                    <img
                      src={event.bannerUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={28} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800">{event.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={12} />
                      {event.owner.name}
                    </span>
                    {event.destination && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {event.destination.name}
                      </span>
                    )}
                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-500 hover:underline"
                      >
                        <ExternalLink size={12} />
                        Link Pendaftaran
                      </a>
                    )}
                  </div>
                </div>

                {activeTab === "pending" && (
                  <div className="flex md:flex-col gap-2 shrink-0 md:w-32">
                    <button
                      onClick={() => handleAction(event.id, "approve")}
                      disabled={processingId === event.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2.5 rounded-xl transition disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} /> Setujui
                    </button>
                    <button
                      onClick={() => handleAction(event.id, "reject")}
                      disabled={processingId === event.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium py-2.5 rounded-xl transition disabled:opacity-50"
                    >
                      <XCircle size={14} /> Tolak
                    </button>
                  </div>
                )}

                {activeTab === "aktif" && (
                  <div className="flex md:flex-col shrink-0 md:w-32 items-center md:items-end justify-center">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Disetujui
                    </span>
                  </div>
                )}

                {activeTab === "ditolak" && (
                  <div className="flex md:flex-col shrink-0 md:w-32 items-center md:items-end justify-center">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      Ditolak
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
