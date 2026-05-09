"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DestinationMap from "@/components/destination-map";

const categories = [
  { id: 1, name: "Wisata Alam" },
  { id: 2, name: "Wisata Budaya" },
  { id: 3, name: "Wisata Kuliner" },
  { id: 4, name: "Wisata Edukasi" },
  { id: 5, name: "Wisata Hiburan" },
  { id: 6, name: "Wisata Belanja" },
];

export default function TambahDestinasiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    categoryIds: [] as number[],
    description: "",
    contact: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAreaValid, setIsAreaValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

  return (
    <>
      <header className="bg-white border-b border-gray-200">
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
          onSubmit={handleSubmit}
          className="min-h-[690px] rounded-[28px] bg-[#285260] p-4 md:p-5"
        >
          <div className="grid min-h-[650px] grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
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
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
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

                    if (file) {
                      setImageFile(file);
                    }
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
                  className="min-w-[120px] rounded-2xl bg-[#F09A43] px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90"
                >
                  Check AI
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] rounded-2xl bg-white px-6 py-3 font-semibold text-[#285260] shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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
    </>
  );
}