"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  MapPinned,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

import DestinationListMap from "@/components/destination-list-map";

type Destination = {
  id: number;
  name: string;
  description: string;
  address: string;
  contact: string | null;
  status: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  categories: {
    category: {
      id: number;
      name: string;
    };
  }[];
};

type StatusFilter = "all" | "aktif" | "pending" | "butuh_perbaikan";

function normalizeStatus(status: string) {
  return status.toLowerCase().replaceAll(" ", "_");
}

function getStatusMeta(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized.includes("perbaikan")) {
    return {
      label: "Butuh Perbaikan",
      badge: "bg-red-50 text-red-700 ring-red-200",
      border: "border-l-red-500",
      icon: AlertTriangle,
      iconClass: "text-red-600",
    };
  }

  if (normalized.includes("pending")) {
    return {
      label: "Menunggu Review",
      badge: "bg-amber-50 text-amber-700 ring-amber-200",
      border: "border-l-amber-400",
      icon: Clock3,
      iconClass: "text-amber-600",
    };
  }

  if (normalized.includes("aktif")) {
    return {
      label: "Aktif",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      border: "border-l-emerald-500",
      icon: CheckCircle2,
      iconClass: "text-emerald-600",
    };
  }

  return {
    label: status.replaceAll("_", " "),
    badge: "bg-gray-100 text-gray-700 ring-gray-200",
    border: "border-l-gray-400",
    icon: Activity,
    iconClass: "text-gray-500",
  };
}

function truncateText(text: string, maxLength: number) {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export default function DestinasiPage() {
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [mapExpanded, setMapExpanded] = useState(true);

  async function fetchDestinations(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);

      const res = await fetch("/api/pengelola/destinations", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data destinasi");
      }

      const data = await res.json();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setDestinations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        destinations.flatMap((item) =>
          item.categories.map((cat) => cat.category.name)
        )
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [destinations]);

  const summary = useMemo(() => {
    const total = destinations.length;
    const pending = destinations.filter((item) =>
      normalizeStatus(item.status).includes("pending")
    ).length;
    const active = destinations.filter((item) =>
      normalizeStatus(item.status).includes("aktif")
    ).length;
    const revision = destinations.filter((item) =>
      normalizeStatus(item.status).includes("perbaikan")
    ).length;

    return { total, pending, active, revision };
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return destinations.filter((item) => {
      const matchSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.address.toLowerCase().includes(normalizedSearch);

      const matchCategory =
        category === "all" ||
        item.categories.some((cat) => cat.category.name === category);

      const normalizedStatus = normalizeStatus(item.status);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "aktif" && normalizedStatus.includes("aktif")) ||
        (statusFilter === "pending" && normalizedStatus.includes("pending")) ||
        (statusFilter === "butuh_perbaikan" &&
          normalizedStatus.includes("perbaikan"));

      return matchSearch && matchCategory && matchStatus;
    });
  }, [destinations, search, category, statusFilter]);

  const activePercentage =
    summary.total > 0 ? Math.round((summary.active / summary.total) * 100) : 0;

  const attentionTotal = summary.pending + summary.revision;

  const hasActiveFilter =
    search.trim() !== "" || category !== "all" || statusFilter !== "all";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setStatusFilter("all");
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F29B4B]">
              Destination Management
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#285260] md:text-3xl">
              Kelola Wisata
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data, status verifikasi, dan kualitas informasi destinasi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => fetchDestinations(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => router.push("/pengelola/destinasi/tambah")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#285260] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#214651]"
            >
              <Plus className="h-4 w-4" />
              Tambah Wisata
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6">
        <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Wisata",
              value: summary.total,
              description: `${activePercentage}% aktif`,
              className: "bg-[#285260]/10 text-[#285260]",
            },
            {
              label: "Aktif",
              value: summary.active,
              description: "Sudah dipublikasikan",
              className: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Menunggu Review",
              value: summary.pending,
              description: "Dalam verifikasi",
              className: "bg-amber-50 text-amber-700",
            },
            {
              label: "Butuh Perbaikan",
              value: summary.revision,
              description: "Perlu ditindaklanjuti",
              className: "bg-red-50 text-red-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-bold ${item.className}`}
              >
                {item.label}
              </div>
              <p className="mt-3 text-2xl font-extrabold text-gray-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-5">
                <div>
                  <h2 className="text-lg font-extrabold text-[#285260]">
                    Persebaran Wisata
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Lokasi destinasi berdasarkan hasil filter yang aktif.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMapExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F5F7FB] px-3 py-2 text-xs font-bold text-[#285260]"
                >
                  {mapExpanded ? "Sembunyikan" : "Tampilkan"}
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      mapExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {mapExpanded && (
                <div className="px-4 pb-4 md:px-5 md:pb-5">
                  {loading ? (
                    <div className="flex h-[210px] items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
                      Memuat peta...
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl">
                      <DestinationListMap destinations={filteredDestinations} />
                    </div>
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-xl font-extrabold text-[#285260]">
                    Daftar Destinasi
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Menampilkan {filteredDestinations.length} dari{" "}
                    {destinations.length} destinasi.
                  </p>
                </div>

                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm font-bold text-[#285260] hover:underline"
                  >
                    Reset filter
                  </button>
                )}
              </div>

              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 text-gray-500">
                  Memuat data wisata...
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                  <MapPinned className="mx-auto h-9 w-9 text-gray-300" />
                  <h3 className="mt-3 font-bold text-gray-800">
                    Destinasi tidak ditemukan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ubah kata pencarian atau filter yang digunakan.
                  </p>
                  {hasActiveFilter && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 rounded-xl bg-[#285260] px-4 py-2 text-sm font-bold text-white"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDestinations.map((item) => {
                    const statusMeta = getStatusMeta(item.status);
                    const StatusIcon = statusMeta.icon;

                    const isNeedRevision = normalizeStatus(item.status).includes(
                      "perbaikan"
                    );

                    return (
                      <article
                        key={item.id}
                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:border-gray-300 hover:shadow-md"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)]">
                          {/* IMAGE */}
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/pengelola/destinasi/${item.id}`)
                            }
                            className="relative min-h-[190px] overflow-hidden bg-gray-100 text-left md:min-h-full"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full min-h-[190px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="flex h-full min-h-[190px] items-center justify-center text-sm text-gray-400">
                                Gambar tidak tersedia
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

                            <div
                              className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${statusMeta.badge}`}
                            >
                              <StatusIcon
                                className={`h-3.5 w-3.5 ${statusMeta.iconClass}`}
                              />
                              {statusMeta.label}
                            </div>
                          </button>

                          {/* CONTENT */}
                          <div className="flex min-w-0 flex-col p-4 md:p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(`/pengelola/destinasi/${item.id}`)
                                  }
                                  className="block max-w-full text-left"
                                >
                                  <h3 className="truncate text-lg font-bold text-gray-900 transition group-hover:text-[#285260]">
                                    {item.name}
                                  </h3>
                                </button>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {item.categories.slice(0, 3).map((cat) => (
                                    <span
                                      key={cat.category.id}
                                      className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                                    >
                                      {cat.category.name}
                                    </span>
                                  ))}

                                  {item.categories.length > 3 && (
                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                      +{item.categories.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                              {truncateText(item.description, 190)}
                            </p>

                            <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                              <span className="line-clamp-2">
                                {item.address || "Alamat belum tersedia"}
                              </span>
                            </div>

                            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F7F9FC] px-3 py-2.5">
                              <Sparkles className="h-4 w-4 shrink-0 text-[#F29B4B]" />

                              <p className="min-w-0 truncate text-xs text-gray-600">
                                {isNeedRevision
                                  ? "Sistem mendeteksi data yang perlu diperbaiki sebelum diajukan ulang."
                                  : "Evaluasi awal tersedia. Buka detail untuk melihat hasil analisis."}
                              </p>
                            </div>

                            <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                              <div className="text-xs text-gray-400">
                                {item.contact
                                  ? `Kontak: ${item.contact}`
                                  : "Kontak belum tersedia"}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(
                                      `/pengelola/destinasi/${item.id}/edit`
                                    )
                                  }
                                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                    isNeedRevision
                                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {isNeedRevision ? "Perbaiki" : "Edit"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(`/pengelola/destinasi/${item.id}`)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F29B4B] px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Lihat detail
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit space-y-4 xl:sticky xl:top-28">
            <section className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#F29B4B]" />
                <h3 className="text-lg font-extrabold text-[#285260]">
                  Filter Wisata
                </h3>
              </div>

              <label className="relative block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau alamat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#285260]/40 focus:ring-2 focus:ring-[#285260]/10"
                />
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#285260]/40 focus:ring-2 focus:ring-[#285260]/10"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#285260]/40 focus:ring-2 focus:ring-[#285260]/10"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="pending">Menunggu Review</option>
                <option value="butuh_perbaikan">Butuh Perbaikan</option>
              </select>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 w-full rounded-xl bg-[#F5F7FB] px-4 py-2.5 text-xs font-bold text-[#285260]"
                >
                  Reset Filter
                </button>
              )}
            </section>

            <section className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#285260]">
                Ringkasan Sistem
              </h3>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-500">
                      Destinasi aktif
                    </span>
                    <span className="font-bold text-[#285260]">
                      {activePercentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${activePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#285260]/10 p-3">
                    <p className="text-[10px] font-semibold text-gray-500">
                      Total
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-[#285260]">
                      {summary.total}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-[10px] font-semibold text-gray-500">
                      Pending
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-amber-700">
                      {summary.pending}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-[10px] font-semibold text-gray-500">
                      Perbaikan
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-red-700">
                      {summary.revision}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-[10px] font-semibold text-gray-500">
                      Aktif
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-emerald-700">
                      {summary.active}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] bg-[#285260] p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F7B978]">
                    Quick Action
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold">
                    Perlu ditindaklanjuti
                  </h3>
                </div>
                <Bot className="h-6 w-6 text-[#F7B978]" />
              </div>

              <p className="mt-3 text-sm leading-6 text-white/70">
                {attentionTotal > 0
                  ? `${attentionTotal} destinasi masih menunggu review atau membutuhkan perbaikan.`
                  : "Semua destinasi saat ini tidak memiliki tindak lanjut mendesak."}
              </p>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter(
                    summary.revision > 0 ? "butuh_perbaikan" : "pending"
                  )
                }
                disabled={attentionTotal === 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F29B4B] px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lihat yang perlu perhatian
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}