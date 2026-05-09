"use client";

import { useEffect, useMemo, useState } from "react";
import DestinationListMap from "@/components/destination-list-map";
import { useRouter } from "next/navigation";

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
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();
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

  const filteredDestinations = useMemo(() => {
      return destinations.filter((item) => {
        const matchSearch = item.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchCategory =
          category === "all" ||
          item.categories.some(
            (cat) => cat.category.name === category
          );

        return matchSearch && matchCategory;
      });
    }, [destinations, search, category]);

  const categories = Array.from(
      new Set(
          destinations.flatMap((item) =>
              item.categories.map((cat) => cat.category.name)
          )
      )
  );  

  const totalWisata = filteredDestinations.length;

  const pendingReview = filteredDestinations.filter(
    (item) => item.status === "pending"
  ).length;

  const wisataAktif = filteredDestinations.filter(
    (item) => item.status === "aktif"
  ).length;

  const butuhPerbaikan = filteredDestinations.filter(
    (item) => item.status === "butuh_perbaikan"
  ).length;

  return (
    <>
      <header className="bg-white border-b border-gray-200">
            <div className="w-full px-10 py-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#285260]">
                        Kelola Wisata
                    </h1>
                    <p className="mt-2 text-[#285260] font-semibold">
                        Kelola Destinasi Wisata Anda Dari 1 Tempat.
                    </p>
                    </div>

                    <button
                    onClick={() => router.push("/pengelola/destinasi/tambah")}
                    className="flex items-center gap-2 rounded-xl bg-[#285260] px-5 py-3 text-white font-semibold hover:opacity-90 shadow-sm"
                    >
                    + Tambah Wisata
                    </button>
            </div>
      </header>

      <main className="bg-[#F5F7FB] py-8">
        <div className="w-full px-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                {loading ? (
                    <div className="h-[330px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                    Loading map...
                    </div>
                ) : (
                    <DestinationListMap destinations={filteredDestinations} />
                )}
                </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">
                    Loading data wisata...
                </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">
                Belum ada data wisata.
              </div>
            ) : (
              filteredDestinations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-[180px_1fr_240px] gap-6">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-[150px] w-full rounded-lg object-cover"
                        />
                        ) : (
                        <div className="h-[150px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            Gambar Wisata
                        </div>
                        )}

                    <div>
                      <h2 className="text-xl font-bold text-[#285260] mb-2">
                        {item.name}
                      </h2>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Address:</span>{" "}
                        {item.address}
                      </p>

                      <p className="text-sm text-gray-800 mt-2">
                        <span className="font-bold">Contact:</span>{" "}
                        {item.contact || "-"}
                      </p>
                    </div>

                    <div className="bg-[#285260] text-white rounded-lg p-4">
                      <h3 className="font-bold mb-3">Analisis Sistem</h3>

                      <div className="space-y-2 text-sm">
                        <p>✓ Nama Wisata</p>
                        <p>✓ Deskripsi</p>
                        <p>✓ Kategori</p>
                      </div>

                      <div className="mt-4 bg-white text-[#285260] rounded-md px-3 py-2 text-sm">
                        {item.status}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm">
                          Edit
                        </button>
                        <button className="bg-white text-[#285260] px-3 py-2 rounded-md text-sm">
                          Detail
                        </button>
                        <button className="bg-red-500 text-white px-3 py-2 rounded-md text-sm">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-[#285260] mb-3">Filter</h3>

              <input
                type="text"
                placeholder="Cari wisata..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20"
              />

              <select
                  value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20"
                >
                  <option value="all">Semua Kategori</option>

                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-[#285260] mb-4">Ringkasan</h3>

              <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Total Wisata</p>
                      <p className="text-lg font-bold text-[#285260]">
                          {totalWisata}
                      </p>
                  </div>
                
                  <div className="bg-yellow-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Pending Review</p>
                      <p className="text-lg font-bold text-yellow-600">
                          {pendingReview}
                      </p>
                  </div>

                  <div className="bg-red-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Butuh Perbaikan</p>
                      <p className="text-lg font-bold text-red-500">
                        {butuhPerbaikan}
                      </p>
                  </div>

                  <div className="bg-blue-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Wisata Aktif</p>
                      <p className="text-lg font-bold text-blue-600">
                          {wisataAktif}
                      </p>
                  </div>
              </div>
            </div>

            <div className="bg-[#285260] text-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold mb-2">Tips Pengelolaan</h3>
              <p className="text-sm text-white/80">
                Pastikan nama, deskripsi, kategori, alamat, kontak, dan
                koordinat wisata sudah lengkap sebelum dipublikasikan.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}