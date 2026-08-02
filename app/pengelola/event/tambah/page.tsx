"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Destination = {
  id: number;
  name: string;
  address: string;
};

export default function TambahEventPage() {
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    destinationId: "",
    startDate: "",
    endDate: "",
    contact: "",
    registrationUrl: "",
  });

  function updateForm(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleBannerChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  async function uploadBanner() {
    if (!bannerFile) return "";

    const formData = new FormData();
    formData.append("file", bannerFile);

    const response = await fetch("/api/pengelola/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengupload poster event.");
    }

    return data.url;
  }

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch("/api/pengelola/destinations");

        if (!response.ok) {
          throw new Error("Gagal mengambil data destinasi.");
        }

        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data destinasi.");
      } finally {
        setLoadingDestinations(false);
      }
    }

    fetchDestinations();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.description ||
      !form.destinationId ||
      !form.startDate ||
      !form.endDate ||
      !bannerFile
    ) {
      setError(
        "Nama, poster event, destinasi, deskripsi, tanggal mulai, dan tanggal selesai wajib diisi."
      );
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
      return;
    }

    setSubmitting(true);

    try {
      const bannerUrl = await uploadBanner();

      const response = await fetch("/api/pengelola/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          bannerUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal menambahkan event.");
        return;
      }

      router.push("/pengelola/event");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambahkan event."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tambah Event</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tambahkan event yang berkaitan dengan destinasi wisata Anda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-[28px] bg-[#285260] p-6"
      >
        {error && (
          <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <input
          type="text"
          value={form.name}
          onChange={(event) => updateForm("name", event.target.value)}
          placeholder="Nama Event"
          className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
        />

        <div className="rounded-2xl bg-white p-4">
          <label className="mb-3 block text-sm font-semibold text-[#285260]">
            Poster / Banner Event
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="w-full text-sm text-[#285260]"
          />

          {bannerPreview && (
            <div className="relative mt-4 h-56 overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={bannerPreview}
                alt="Preview poster event"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        <textarea
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          placeholder="Deskripsi Event"
          rows={5}
          className="w-full resize-none rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
        />

        <select
          value={form.destinationId}
          onChange={(event) => updateForm("destinationId", event.target.value)}
          className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
          disabled={loadingDestinations}
        >
          <option value="">
            {loadingDestinations ? "Memuat destinasi..." : "Pilih destinasi terkait"}
          </option>

          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(event) => updateForm("startDate", event.target.value)}
            className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
          />

          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(event) => updateForm("endDate", event.target.value)}
            className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
          />
        </div>

        <input
          type="text"
          value={form.contact}
          onChange={(event) => updateForm("contact", event.target.value)}
          placeholder="Kontak Event"
          className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
        />

        <input
          type="url"
          value={form.registrationUrl}
          onChange={(event) => updateForm("registrationUrl", event.target.value)}
          placeholder="Link Pendaftaran / Informasi Event (opsional)"
          className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/pengelola/event")}
            className="rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/30"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-[#F09A43] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan Event"}
          </button>
        </div>
      </form>
    </div>
  );
}