"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type EventItem = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "pending" | "aktif" | "ditolak" | "selesai";
  destination?: {
    id: number;
    name: string;
    address: string;
  } | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusLabel(status: EventItem["status"]) {
  const labels = {
    pending: "Menunggu Verifikasi",
    aktif: "Aktif",
    ditolak: "Ditolak",
    selesai: "Selesai",
  };

  return labels[status];
}

export default function KelolaEventPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/pengelola/events");

        if (!response.ok) {
          throw new Error("Gagal mengambil data event.");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Event</h1>
          <p className="mt-2 text-sm text-gray-500">
            Kelola event yang berkaitan dengan destinasi wisata Anda.
          </p>
        </div>

        <Link
          href="/pengelola/event/tambah"
          className="rounded-2xl bg-[#F09A43] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Tambah Event
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center">
          Memuat data event...
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">Belum ada event</h2>
          <p className="mt-2 text-sm text-gray-500">
            Tambahkan event pertama untuk ditampilkan di sistem.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 inline-flex rounded-full bg-[#285260]/10 px-3 py-1 text-xs font-semibold capitalize text-[#285260]">
                    {statusLabel(event.status)}
                  </div>

                  <h2 className="text-xl font-bold">{event.name}</h2>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {event.description}
                  </p>

                  <div className="mt-4 text-sm text-gray-600">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    Lokasi: {event.destination?.name || "Belum dikaitkan dengan wisata"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-[#285260]">
                    Detail
                  </button>
                  <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-[#285260]">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}