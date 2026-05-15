"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DestinationMap from "@/components/destination-map";

type CategoryAnalysis = {
  categoryId: number;
  categoryName: string;
  isSelected: boolean;
  matchedKeywords: string[];
  matchCount: number;
};

type AnalysisResult = {
  status: string;
  score: number;
  selectedCategories: CategoryAnalysis[];
  selectedWithMatches: CategoryAnalysis[];
  selectedWithoutMatches: CategoryAnalysis[];
  strongestCategory: CategoryAnalysis;
  unselectedStrongMatches: CategoryAnalysis[];
  allCategoryAnalysis: CategoryAnalysis[];
  message: string;
};

export default function TambahDestinasiPage() {
  const router = useRouter();
  const MIN_AI_SCORE = 60;

  const [form, setForm] = useState({
    name: "",
    categoryIds: [] as number[],
    description: "",
    contact: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAreaValid, setIsAreaValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAI, setIsCheckingAI] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/pengelola/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  function updateForm(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleCategory(categoryId: number) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));

    setAnalysisResult(null);
  }

  async function handleCheckAI() {
    if (!form.name.trim()) {
      alert("Nama wisata wajib diisi sebelum analisis.");
      return;
    }

    if (form.categoryIds.length === 0) {
      alert("Pilih minimal 1 kategori wisata sebelum analisis.");
      return;
    }

    if (!form.description.trim()) {
      alert("Deskripsi wajib diisi sebelum analisis.");
      return;
    }

    try {
      setIsCheckingAI(true);

      const response = await fetch("/api/pengelola/ai-insight/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryIds: form.categoryIds,
          name: form.name,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal melakukan analisis.");
        return;
      }

      setAnalysisResult(data);
      setShowAnalysisModal(true);
    } catch (error) {
      console.error("CHECK AI ERROR:", error);
      alert("Terjadi kesalahan saat melakukan analisis.");
    } finally {
      setIsCheckingAI(false);
    }
  }

  async function submitDestination() {
    if (!analysisResult) {
      alert("Lakukan Check AI terlebih dahulu.");
      return;
    }

    if (analysisResult.score < MIN_AI_SCORE) {
      alert(`Skor minimal untuk submit adalah ${MIN_AI_SCORE}/100.`);
      return;
    }

    if (!form.name.trim()) {
      alert("Nama wisata wajib diisi.");
      return;
    }

    if (form.categoryIds.length === 0) {
      alert("Pilih minimal 1 kategori wisata.");
      return;
    }

    if (!form.description.trim()) {
      alert("Deskripsi wajib diisi.");
      return;
    }

    if (!form.address.trim()) {
      alert("Alamat wajib diisi.");
      return;
    }

    if (!form.latitude || !form.longitude) {
      alert("Pilih titik lokasi pada map terlebih dahulu.");
      return;
    }

    if (!isAreaValid) {
      alert("Lokasi berada di luar area Bandung Raya.");
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = "";

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResponse = await fetch("/api/pengelola/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          alert(uploadData.message || "Gagal upload gambar.");
          return;
        }

        imageUrl = uploadData.imageUrl;
      }

      const response = await fetch("/api/pengelola/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menyimpan wisata.");
        return;
      }

      alert("Wisata berhasil disubmit dan masuk status pending.");
      router.push("/pengelola/destinasi");
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert("Terjadi kesalahan saat submit wisata.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedKeywords =
    analysisResult?.selectedCategories.flatMap(
      (category) => category.matchedKeywords
    ) || [];

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="w-full px-10 py-8">
          <h1 className="text-3xl font-extrabold text-[#285260]">
            Tambah Wisata
          </h1>
          <p className="mt-2 font-semibold text-[#285260]">
            Lengkapi data wisata dan tentukan lokasi pada peta.
          </p>
        </div>
      </header>

      <main className="bg-[#F5F7FB] px-10 py-8">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="min-h-[690px] rounded-[28px] bg-[#285260] p-4 md:p-5"
        >
          <div className="grid min-h-[650px] grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={form.name}
                onChange={(event) => {
                  updateForm("name", event.target.value);
                  setAnalysisResult(null);
                }}
                placeholder="Nama Wisata"
                className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
              />

              <div className="rounded-2xl bg-white p-4">
                <p className="mb-3 font-semibold text-[#285260]">
                  Kategori Wisata
                </p>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected = form.categoryIds.includes(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-[#F09A43] text-white"
                            : "bg-[#E9EEF0] text-[#285260] hover:bg-[#d8e1e4]"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => {
                  updateForm("description", event.target.value);
                  setAnalysisResult(null);
                }}
                placeholder="Deskripsi"
                className="w-full resize-none rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
              />

              <input
                type="text"
                value={form.contact}
                onChange={(event) => updateForm("contact", event.target.value)}
                placeholder="Kontak"
                className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
              />

              <input
                type="text"
                value={form.address}
                onChange={(event) => updateForm("address", event.target.value)}
                placeholder="Alamat"
                className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
              />

              {!isAreaValid && (
                <div className="rounded-xl bg-[#FFF3CD] px-4 py-3 text-sm text-[#856404]">
                  Lokasi yang dipilih berada di luar area Bandung Raya.
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Upload Gambar
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                  className="block w-full text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium file:text-[#285260]"
                />

                <p className="mt-2 text-sm text-white">
                  Gambar pertama akan dijadikan cover wisata.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.latitude}
                  readOnly
                  placeholder="Latitude"
                  className="w-full rounded-2xl border-0 bg-white/90 px-5 py-4 text-[#285260]"
                />

                <input
                  type="text"
                  value={form.longitude}
                  readOnly
                  placeholder="Longitude"
                  className="w-full rounded-2xl border-0 bg-white/90 px-5 py-4 text-[#285260]"
                />
              </div>

              <div className="mt-auto flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCheckAI}
                  disabled={isCheckingAI}
                  className="min-w-[120px] rounded-2xl bg-[#F09A43] px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckingAI ? "Checking..." : "Check AI"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/pengelola/destinasi")}
                  className="min-w-[120px] rounded-2xl bg-white px-6 py-3 font-semibold text-[#285260] shadow-sm hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-3">
              <DestinationMap
                latitude={form.latitude}
                longitude={form.longitude}
                address={form.address}
                onAddressChange={(value) => updateForm("address", value)}
                onLocationChange={(lat, lng) => {
                  updateForm("latitude", lat);
                  updateForm("longitude", lng);
                }}
                onAreaValidChange={setIsAreaValid}
              />
            </div>
          </div>
        </form>
      </main>

      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="grid md:grid-cols-[1fr_320px]">
              <div className="bg-[#285260] p-6 text-white">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#F09A43]">
                      Hasil Analisis Domain Knowledge
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold leading-tight">
                      {analysisResult.status === "konsisten"
                        ? "Data Cukup Selaras"
                        : "Perlu Perbaikan"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAnalysisModal(false)}
                    className="rounded-full bg-white/10 px-3 py-1 text-xl font-bold hover:bg-white/20"
                  >
                    ×
                  </button>
                </div>

                <div className="rounded-3xl bg-white/10 p-5">
                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white/80">
                        Skor Kecocokan
                      </p>

                      <p className="text-2xl font-extrabold">
                        {analysisResult.score}/100
                      </p>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-[#F09A43]"
                        style={{ width: `${analysisResult.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Kategori Dipilih
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {analysisResult.selectedCategories
                          .map((category) => category.categoryName)
                          .join(", ")}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedKeywords.length > 0 ? (
                          selectedKeywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-white/60">
                            Tidak ada keyword cocok
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Kategori Terdeteksi
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-[#F09A43]">
                        {analysisResult.strongestCategory.categoryName}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysisResult.strongestCategory.matchedKeywords
                          .length > 0 ? (
                          analysisResult.strongestCategory.matchedKeywords.map(
                            (keyword) => (
                              <span
                                key={keyword}
                                className="rounded-full bg-[#F09A43]/20 px-3 py-1 text-xs font-semibold text-[#FFD7A8]"
                              >
                                {keyword}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-white/60">
                            Tidak ada keyword terdeteksi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-[#F8F8F8] p-6">
                <div>
                  <div className="mb-5 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#285260]">
                        {analysisResult.score >= MIN_AI_SCORE ? (
                          <span className="text-5xl font-black leading-none text-[#4ADE80]">
                            ✓
                          </span>
                        ) : (
                          <span className="text-5xl font-black leading-none text-[#F09A43]">
                            !
                          </span>
                        )}
                      </div>

                    <p className="text-xl font-extrabold text-[#F09A43]">
                      {analysisResult.score >= MIN_AI_SCORE
                        ? "Bisa Disubmit"
                        : "Perlu Perbaikan"}
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#285260]">
                      Skor: {analysisResult.score}/100
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#285260] p-5 text-center text-white">
                    <p className="text-lg font-semibold leading-relaxed">
                      {analysisResult.message}
                    </p>

                    <p className="mt-4 text-xs text-white/60">
                      Minimal skor submit adalah {MIN_AI_SCORE}/100.
                    </p>
                  </div>

                  {analysisResult.score < MIN_AI_SCORE && (
                    <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                      Skor belum memenuhi batas minimal. Silakan perbaiki data
                      terlebih dahulu.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAnalysisModal(false)}
                    className="flex-1 rounded-2xl bg-[#C45454] px-5 py-3 font-bold text-white transition hover:opacity-90"
                  >
                    Perbaiki
                  </button>

                  <button
                    type="button"
                    disabled={analysisResult.score < MIN_AI_SCORE || isSubmitting}
                    onClick={submitDestination}
                    className="flex-1 rounded-2xl bg-[#F09A43] px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}