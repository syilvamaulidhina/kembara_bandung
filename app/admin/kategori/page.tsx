"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, Tags } from "lucide-react";

type Keyword = {
  id: number;
  keyword: string;
  categoryId: number;
  createdAt: string;
};

type Category = {
  id: number;
  name: string;
  createdAt: string;
  keywords: Keyword[];
};

export default function KelolaKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Tags size={22} className="text-blue-600" />
            Kelola Kategori
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola kategori dan keyword untuk sistem AI semantic checker.
          </p>
        </div>

        <Link
            href="/admin/kategori/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
            <Plus size={16} />
            Tambah Kategori
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">Daftar Kategori</h2>

          <div className="relative max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <p className="text-sm text-gray-400">Memuat data kategori...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">Tidak ada kategori.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {category.keywords.length} keyword
                      </p>
                    </div>

                    <span className="text-xs font-mono text-gray-400">
                      #{category.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.keywords.length === 0 ? (
                      <span className="text-xs text-gray-400">
                        Belum ada keyword
                      </span>
                    ) : (
                      category.keywords.map((keyword) => (
                        <span
                          key={keyword.id}
                          className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
                        >
                          {keyword.keyword}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}