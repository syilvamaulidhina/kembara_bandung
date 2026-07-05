"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EventStatus = "pending" | "aktif" | "ditolak" | "selesai";
type EventProgress = "upcoming" | "ongoing" | "finished";

type EventDetail = {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string | null;
  startDate: string;
  endDate: string;
  contact?: string | null;
  registrationUrl?: string | null;
  status: EventStatus;
  progress: EventProgress;
  countdown: string;
  createdAt: string;
  updatedAt: string;
  destination?: {
    id: number;
    name: string;
    address?: string | null;
    addressCity?: string | null;
    imageUrl?: string | null;
    status?: string;
  } | null;
};

const statusLabels: Record<EventStatus, string> = {
  pending: "Menunggu Verifikasi",
  aktif: "Aktif",
  ditolak: "Ditolak",
  selesai: "Selesai",
};

const statusStyles: Record<EventStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  aktif: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
  selesai: "bg-gray-100 text-gray-600",
};

const progressLabels: Record<EventProgress, string> = {
  upcoming: "Belum dimulai",
  ongoing: "Sedang berlangsung",
  finished: "Sudah selesai",
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DetailEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/pengelola/events/${eventId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil detail event.");
        }

        setEvent(data.event);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil detail event."
        );
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
        <div className="mb-6 h-8 w-60 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="h-[420px] animate-pulse bg-gray-200" />
            <div className="space-y-4 p-6">
              <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
        <div className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Detail event tidak ditemukan</h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "Event tidak tersedia atau bukan milik Anda."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/pengelola/event")}
            className="mt-6 rounded-2xl bg-[#F09A43] px-5 py-3 text-sm font-semibold text-white"
          >
            Kembali ke Kelola Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#F09A43]">
            Detail Event
          </p>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Informasi lengkap event yang diajukan oleh pengelola wisata.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/pengelola/event")}
            className="rounded-2xl border border-[#285260]/15 bg-white px-5 py-3 text-sm font-semibold text-[#285260] hover:bg-[#285260]/5"
          >
            Kembali
          </button>

          <Link
            href={`/pengelola/event/${event.id}/edit`}
            className="rounded-2xl bg-[#F09A43] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Edit Event
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <main className="space-y-6">
          <section className="overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="relative h-[420px] bg-gray-100">
              {event.bannerUrl ? (
                <Image
                  src={event.bannerUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Poster event tidak tersedia
                </div>
              )}

              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${statusStyles[event.status]}`}
                >
                  {statusLabels[event.status]}
                </span>

                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#285260]">
                  {event.countdown}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 inline-flex rounded-full bg-[#285260]/10 px-4 py-2 text-xs font-bold text-[#285260]">
                {progressLabels[event.progress]}
              </div>

              <h2 className="text-2xl font-bold">{event.name}</h2>

              <div className="mt-5 rounded-3xl bg-[#F6F8F8] p-5">
                <h3 className="mb-3 text-base font-bold">Deskripsi Event</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Destinasi Terkait</h2>

            <div className="mt-5 flex gap-4 rounded-3xl bg-[#F6F8F8] p-4">
              <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {event.destination?.imageUrl ? (
                  <Image
                    src={event.destination.imageUrl}
                    alt={event.destination.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold">
                  {event.destination?.name || "Destinasi tidak tersedia"}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                  {event.destination?.address || "Alamat belum tersedia"}
                </p>

                {event.destination?.addressCity && (
                  <p className="mt-2 text-sm font-semibold text-[#F09A43]">
                    {event.destination.addressCity}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Ringkasan Event</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Status Verifikasi
                </p>
                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[event.status]}`}
                >
                  {statusLabels[event.status]}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Status Pelaksanaan
                </p>
                <p className="mt-2 text-sm font-bold">
                  {progressLabels[event.progress]}
                </p>
                <p className="mt-1 text-sm text-gray-500">{event.countdown}</p>
              </div>

              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Tanggal Mulai
                </p>
                <p className="mt-2 text-sm font-bold">
                  {formatDateTime(event.startDate)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Tanggal Selesai
                </p>
                <p className="mt-2 text-sm font-bold">
                  {formatDateTime(event.endDate)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Kontak</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">Kontak</p>
                <p className="mt-2 break-words text-sm font-bold">
                  {event.contact || "Kontak belum tersedia"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Link Pendaftaran / Informasi
                </p>

                {event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block break-words text-sm font-bold text-[#F09A43] hover:underline"
                  >
                    {event.registrationUrl}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-bold">
                    Link belum tersedia
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Sistem</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Dibuat pada
                </p>
                <p className="mt-1 text-sm font-bold">
                  {formatDateTime(event.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Terakhir diperbarui
                </p>
                <p className="mt-1 text-sm font-bold">
                  {formatDateTime(event.updatedAt)}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}