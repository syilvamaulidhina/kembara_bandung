"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Tags } from "lucide-react";

export default function TambahKategoriPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const keywords = useMemo(() => {
    const parsed = keywordsText
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword.length > 0);

    return Array.from(new Set(parsed));
  }, [keywordsText]);

  const isValid = name.trim().length > 0 && keywords.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Nama kategori wajib diisi.");
      return;
    }

    if (keywords.length < 10) {
      setErrorMessage("Minimal 10 keyword wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          keywords,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal menambahkan kategori.");
        return;
      }

      router.push("/admin/kategori");
      router.refresh();
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);
      setErrorMessage("Terjadi kesalahan saat menambahkan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/kategori"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={16} />
          Kembali ke Kelola Kategori
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Tags size={22} className="text-primary" />
          Tambah Kategori
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Tambahkan kategori baru beserta minimal 10 keyword untuk semantic
          checker.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Wisata Religi"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keyword Kategori
            </label>

            <textarea
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="Pisahkan keyword dengan koma. Contoh: masjid, mushola, religi, ziarah, makam, pesantren, ibadah, spiritual, islamic center, sejarah islam"
              rows={7}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            <div className="flex items-center justify-between mt-2 gap-3">
              <p
                className={`text-xs ${
                  keywords.length < 10 ? "text-red-500" : "text-green-600"
                }`}
              >
                {keywords.length} keyword unik terdeteksi. Minimal 10 keyword.
              </p>

              <p className="text-xs text-gray-400">
                Keyword duplikat otomatis diabaikan.
              </p>
            </div>
          </div>

          {keywords.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Preview Keyword
              </p>

              <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 p-4">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/kategori"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Batal
            </Link>

            <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                <Save size={16} />
                {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
          </div>
        </form>
      </div>
    </div>
  );
}