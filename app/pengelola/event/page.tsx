"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EventStatus = "pending" | "aktif" | "ditolak" | "selesai";
type EventProgress = "upcoming" | "ongoing" | "finished";

type DestinationFilter = {
  id: number;
  name: string;
  status: string;
};

type EventItem = {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string | null;
  startDate: string;
  endDate: string;
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

type EventResponse = {
  summary: {
    total: number;
    pending: number;
    aktif: number;
    ditolak: number;
    selesai: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  destinations: DestinationFilter[];
  events: EventItem[];
};

const statusStyles: Record<EventStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  aktif: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
  selesai: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<EventStatus, string> = {
  pending: "Menunggu Verifikasi",
  aktif: "Aktif",
  ditolak: "Ditolak",
  selesai: "Selesai",
};

const progressLabels: Record<EventProgress, string> = {
  upcoming: "Belum dimulai",
  ongoing: "Sedang berlangsung",
  finished: "Sudah selesai",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatUpdatedAt(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-gray-200" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function KelolaEventPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [destinations, setDestinations] = useState<DestinationFilter[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    aktif: 0,
    ditolak: 0,
    selesai: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("semua");
  const [destinationId, setDestinationId] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", "8");
    params.set("sort", sort);

    if (search.trim()) params.set("search", search.trim());
    if (status !== "semua") params.set("status", status);
    if (destinationId) params.set("destinationId", destinationId);

    return params.toString();
  }, [page, search, status, destinationId, sort]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/pengelola/events?${queryString}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Gagal mengambil data event.");
        }

        const data: EventResponse = await response.json();

        setEvents(data.events);
        setDestinations(data.destinations);
        setSummary(data.summary);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data event."
        );
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [queryString]);

  function resetFilter() {
    setSearch("");
    setStatus("semua");
    setDestinationId("");
    setSort("latest");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#F09A43]">
            Manajemen Event
          </p>
          <h1 className="text-3xl font-bold">Kelola Event</h1>
          <p className="mt-2 text-sm text-gray-500">
            Pantau, cari, dan kelola event yang berkaitan dengan destinasi
            wisata Anda.
          </p>
        </div>

        <Link
          href="/pengelola/event/tambah"
          className="inline-flex w-fit rounded-2xl bg-[#F09A43] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          + Tambah Event
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Event</p>
          <h2 className="mt-2 text-3xl font-bold">{summary.total}</h2>
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {summary.pending}
          </h2>
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Aktif</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {summary.aktif}
          </h2>
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {summary.ditolak}
          </h2>
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Selesai</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-500">
            {summary.selesai}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Cari nama event, deskripsi, atau destinasi..."
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
          >
            <option value="semua">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="aktif">Aktif</option>
            <option value="ditolak">Ditolak</option>
            <option value="selesai">Selesai</option>
          </select>

          <select
            value={destinationId}
            onChange={(event) => {
              setDestinationId(event.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
          >
            <option value="">Semua Destinasi</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name_asc">Nama A-Z</option>
            <option value="name_desc">Nama Z-A</option>
            <option value="start_asc">Tanggal Terdekat</option>
            <option value="start_desc">Tanggal Terjauh</option>
          </select>

          <button
            type="button"
            onClick={resetFilter}
            className="rounded-2xl bg-[#285260]/10 px-5 py-3 text-sm font-semibold text-[#285260] hover:bg-[#285260]/15"
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F09A43]/10 text-3xl">
            🎉
          </div>
          <h2 className="text-xl font-bold">Belum ada event</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Belum ada event yang sesuai dengan pencarian atau filter saat ini.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={resetFilter}
              className="rounded-2xl bg-[#285260]/10 px-5 py-3 text-sm font-semibold text-[#285260]"
            >
              Reset Filter
            </button>
            <Link
              href="/pengelola/event/tambah"
              className="rounded-2xl bg-[#F09A43] px-5 py-3 text-sm font-semibold text-white"
            >
              Tambah Event
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {event.bannerUrl ? (
                    <Image
                      src={event.bannerUrl}
                      alt={event.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Tidak ada poster
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[event.status]}`}
                    >
                      {statusLabels[event.status]}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#285260]">
                    {event.countdown}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-full bg-[#285260]/10 px-3 py-1 text-xs font-semibold text-[#285260]">
                    {progressLabels[event.progress]}
                  </div>

                  <h2 className="line-clamp-2 text-lg font-bold">
                    {event.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-[#285260]">
                        Tanggal:
                      </span>{" "}
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>

                    <p className="line-clamp-1">
                      <span className="font-semibold text-[#285260]">
                        Lokasi:
                      </span>{" "}
                      {event.destination?.name || "Belum dikaitkan"}
                    </p>

                    {event.destination?.addressCity && (
                      <p className="line-clamp-1">
                        <span className="font-semibold text-[#285260]">
                          Kota:
                        </span>{" "}
                        {event.destination.addressCity}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
                    Terakhir diperbarui {formatUpdatedAt(event.updatedAt)}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/pengelola/event/${event.id}`}
                      className="rounded-xl bg-[#285260]/10 px-4 py-2 text-center text-sm font-semibold text-[#285260] hover:bg-[#285260]/15"
                    >
                      Detail
                    </Link>

                    <Link
                      href={`/pengelola/event/${event.id}/edit`}
                      className="rounded-xl bg-[#F09A43] px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between rounded-[24px] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-gray-500">
                Menampilkan {events.length} dari {pagination.total} event
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-xl bg-[#285260]/10 px-4 py-2 text-sm font-semibold text-[#285260] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                <div className="rounded-xl bg-[#285260] px-4 py-2 text-sm font-bold text-white">
                  {pagination.page} / {pagination.totalPages}
                </div>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  className="rounded-xl bg-[#285260]/10 px-4 py-2 text-sm font-semibold text-[#285260] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}