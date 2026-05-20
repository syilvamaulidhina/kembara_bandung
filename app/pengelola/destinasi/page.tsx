"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function DestinasiPage() {
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/pengelola/destinations");

        if (!res.ok) {
          throw new Error("Gagal mengambil data destinasi");
        }

        const data = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        destinations.flatMap((item) =>
          item.categories.map((cat) => cat.category.name)
        )
      )
    );
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" ||
        item.categories.some((cat) => cat.category.name === category);

      return matchSearch && matchCategory;
    });
  }, [destinations, search, category]);

  const totalWisata = filteredDestinations.length;

  const pendingReview = filteredDestinations.filter((item) =>
    item.status.toLowerCase().includes("pending")
  ).length;

  const wisataAktif = filteredDestinations.filter((item) =>
    item.status.toLowerCase().includes("aktif")
  ).length;

  const butuhPerbaikan = filteredDestinations.filter((item) =>
    item.status.toLowerCase().includes("perbaikan")
  ).length;

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#285260] tracking-tight">
              Kelola Wisata
            </h1>

            <p className="mt-1 text-[#285260]/80 text-sm">
              Kelola destinasi wisata dan validasi AI dalam satu dashboard.
            </p>
          </div>

          <button
            onClick={() => router.push("/pengelola/destinasi/tambah")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#285260] px-5 py-3 text-sm text-white font-semibold hover:opacity-90 transition shadow-sm"
          >
            + Tambah Wisata
          </button>
        </div>
      </header>

      <main className="bg-[#F5F7FB] min-h-screen py-5">
        <div className="w-full px-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* LEFT */}
          <div className="space-y-4">
            {/* MAP */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-4 overflow-hidden">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-[#285260]">
                  Persebaran Wisata
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Lokasi seluruh destinasi wisata yang terdaftar.
                </p>
              </div>

              {loading ? (
                <div className="h-[240px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                  Loading map...
                </div>
              ) : (
                <DestinationListMap destinations={filteredDestinations} />
              )}
            </div>

            {/* DESTINATION LIST */}
            {loading ? (
              <div className="bg-white rounded-[22px] border border-gray-200 p-5 text-gray-500">
                Loading data wisata...
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="bg-white rounded-[22px] border border-gray-200 p-5 text-gray-500">
                Belum ada data wisata.
              </div>
            ) : (
              filteredDestinations.map((item) => {
                const isNeedRevision = item.status
                  .toLowerCase()
                  .includes("perbaikan");

                const isPending = item.status
                  .toLowerCase()
                  .includes("pending");

                return (
                  <div
                    key={item.id}
                    className="bg-[#F4F4F4] rounded-[22px] border border-gray-200 p-3 shadow-sm"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-3 items-stretch">
                      {/* IMAGE */}
                      <div className="h-full">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full min-h-[220px] object-cover rounded-[18px]"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[220px] rounded-[18px] bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            Gambar Wisata
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="h-full flex flex-col">
                        <div>
                          <h2 className="text-[22px] leading-tight font-bold text-[#285260]">
                            {item.name}
                          </h2>

                          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                            {item.categories.map((cat) => (
                              <span
                                key={cat.category.id}
                                className="bg-[#285260]/10 text-[#285260] text-[10px] font-semibold px-2.5 py-1 rounded-full"
                              >
                                {cat.category.name}
                              </span>
                            ))}

                            <span className="bg-gray-200 text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                              AI Reviewed
                            </span>
                          </div>

                          <p className="text-gray-700 leading-relaxed text-[13px] mb-3">
                            {item.description}
                          </p>
                        </div>

                        {/* INFO BOX */}
                        <div className="bg-white rounded-2xl p-3 border border-gray-200 flex-1">
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium mb-1">
                              Address
                            </p>

                            <p className="text-xs text-gray-700 leading-relaxed">
                              {item.address}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Contact
                              </p>

                              <p className="text-xs text-gray-700">
                                {item.contact || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Status
                              </p>

                              <p className="text-xs font-semibold text-[#285260] capitalize">
                                {item.status.replaceAll("_", " ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI ANALYSIS */}
                      <div className="h-full bg-[#285260] rounded-[20px] p-3 text-white flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold mb-3 text-center">
                            Analisis Sistem
                          </h3>

                          <div className="space-y-2.5 text-xs">
                            <div className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                                ✓
                              </div>

                              <div>
                                <p className="font-semibold text-[11px]">
                                  Nama Wisata
                                </p>

                                <p className="text-white/70 text-[10px] mt-0.5 leading-snug">
                                  Sistem berhasil mengenali nama wisata.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  isNeedRevision
                                    ? "bg-red-500"
                                    : "bg-orange-400"
                                }`}
                              >
                                {isNeedRevision ? "✕" : "✓"}
                              </div>

                              <div>
                                <p className="font-semibold text-[11px]">
                                  Deskripsi
                                </p>

                                <p className="text-white/70 text-[10px] mt-0.5 leading-snug">
                                  {isNeedRevision
                                    ? "Deskripsi kurang relevan."
                                    : "Deskripsi sesuai kategori."}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                                ✓
                              </div>

                              <div>
                                <p className="font-semibold text-[11px]">
                                  Kategori
                                </p>

                                <p className="text-white/70 text-[10px] mt-0.5 leading-snug">
                                  AI mengenali kategori wisata.
                                </p>
                              </div>
                            </div>
                          </div>

                          {isNeedRevision && (
                            <div className="mt-3 bg-white rounded-xl p-2 text-[#285260]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs">
                                  !
                                </div>

                                <div>
                                  <p className="font-semibold text-[11px]">
                                    Perlu Perbaikan
                                  </p>

                                  <p className="text-[9px] text-gray-500 mt-0.5">
                                    Deskripsi kurang relevan.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* STATUS + BUTTON */}
                        <div className="mt-3">
                          <div
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold text-center mb-2 capitalize ${
                              isNeedRevision
                                ? "bg-red-500 text-white"
                                : isPending
                                ? "bg-yellow-400 text-black"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {item.status.replaceAll("_", " ")}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => router.push(`/pengelola/destinasi/${item.id}/edit`)}
                              className="bg-[#F29B4B] text-white py-1.5 rounded-full text-[11px] font-semibold hover:opacity-90 transition"
                            >
                              Edit
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(`/pengelola/destinasi/${item.id}`)
                                }
                                className="bg-white text-[#285260] py-1.5 rounded-full text-[11px] font-semibold hover:bg-gray-100 transition"
                              >
                                Detail
                              </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5 sticky top-24 h-fit">
            {/* FILTER */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-[#285260] text-lg mb-4">
                Filter Wisata
              </h3>

              <input
                type="text"
                placeholder="Cari wisata..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-3 w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20"
              >
                <option value="all">Semua Kategori</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-[#285260] text-lg mb-4">
                Ringkasan Sistem
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#285260]/10 rounded-2xl p-4 text-center">
                  <p className="text-[11px] text-gray-600 mb-1">
                    Total Wisata
                  </p>

                  <p className="text-xl font-bold text-[#285260]">
                    {totalWisata}
                  </p>
                </div>

                <div className="bg-yellow-100 rounded-2xl p-4 text-center">
                  <p className="text-[11px] text-gray-600 mb-1">Pending</p>

                  <p className="text-xl font-bold text-yellow-600">
                    {pendingReview}
                  </p>
                </div>

                <div className="bg-red-100 rounded-2xl p-4 text-center">
                  <p className="text-[11px] text-gray-600 mb-1">
                    Perbaikan
                  </p>

                  <p className="text-xl font-bold text-red-500">
                    {butuhPerbaikan}
                  </p>
                </div>

                <div className="bg-green-100 rounded-2xl p-4 text-center">
                  <p className="text-[11px] text-gray-600 mb-1">Aktif</p>

                  <p className="text-xl font-bold text-green-600">
                    {wisataAktif}
                  </p>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="bg-[#285260] text-white rounded-[24px] shadow-sm p-4">
              <h3 className="font-bold text-lg mb-3">Tips Pengelolaan</h3>

              <p className="text-xs leading-relaxed text-white/80">
                Pastikan nama wisata, kategori, deskripsi, alamat,
                koordinat, dan gambar wisata sudah sesuai agar sistem AI
                dapat melakukan validasi dengan lebih akurat.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}