"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Destination = {
  id: number;
  name: string;
  status?: string;
};

type EventDetail = {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string | null;
  startDate: string;
  endDate: string;
  contact?: string | null;
  registrationUrl?: string | null;
  status: string;
  destination?: {
    id: number;
    name: string;
  } | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function isValidUrl(value: string) {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function formatPreviewDate(value: string) {
  if (!value) return "Tanggal belum dipilih";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
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
    bannerUrl: "",
  });

  const selectedDestination = useMemo(
    () => destinations.find((item) => String(item.id) === form.destinationId),
    [destinations, form.destinationId]
  );

  function updateForm(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleBannerChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Format poster harus JPG, JPEG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran poster maksimal 5 MB.");
      return;
    }

    setError("");
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  async function uploadBanner() {
    if (!bannerFile) return form.bannerUrl;

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

    return data.imageUrl || data.url;
  }

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        setError("");

        const [eventResponse, destinationsResponse] = await Promise.all([
          fetch(`/api/pengelola/events/${eventId}`),
          fetch("/api/pengelola/destinations"),
        ]);

        const eventData = await eventResponse.json();

        if (!eventResponse.ok) {
          throw new Error(eventData.message || "Gagal mengambil data event.");
        }

        const destinationsData = await destinationsResponse.json();

        if (!destinationsResponse.ok) {
          throw new Error("Gagal mengambil data destinasi.");
        }

        const event: EventDetail = eventData.event;

        setDestinations(destinationsData);

        setForm({
          name: event.name || "",
          description: event.description || "",
          destinationId: event.destination?.id ? String(event.destination.id) : "",
          startDate: toDatetimeLocal(event.startDate),
          endDate: toDatetimeLocal(event.endDate),
          contact: event.contact || "",
          registrationUrl: event.registrationUrl || "",
          bannerUrl: event.bannerUrl || "",
        });

        setBannerPreview(event.bannerUrl || "");
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
    }

    if (eventId) fetchInitialData();
  }, [eventId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.destinationId ||
      !form.startDate ||
      !form.endDate ||
      !form.bannerUrl && !bannerFile
    ) {
      setError(
        "Nama, poster event, destinasi, deskripsi, tanggal mulai, dan tanggal selesai wajib diisi."
      );
      return;
    }

    if (form.name.trim().length < 3 || form.name.trim().length > 100) {
      setError("Nama event harus terdiri dari 3 sampai 100 karakter.");
      return;
    }

    if (form.description.trim().length < 30) {
      setError("Deskripsi event minimal 30 karakter.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
      return;
    }

    if (form.registrationUrl && !isValidUrl(form.registrationUrl)) {
      setError("Link pendaftaran atau informasi event tidak valid.");
      return;
    }

    setSubmitting(true);

    try {
      const bannerUrl = await uploadBanner();

      const response = await fetch(`/api/pengelola/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          destinationId: form.destinationId,
          startDate: form.startDate,
          endDate: form.endDate,
          contact: form.contact.trim(),
          registrationUrl: form.registrationUrl.trim(),
          bannerUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal memperbarui event.");
        return;
      }

      router.push(`/pengelola/event/${eventId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui event."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="h-[600px] animate-pulse rounded-[28px] bg-white" />
          <div className="h-[500px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#F09A43]">
            Manajemen Event
          </p>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="mt-2 text-sm text-gray-500">
            Perubahan event akan dikirim kembali untuk proses verifikasi admin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/pengelola/event/${eventId}`)}
          className="rounded-2xl border border-[#285260]/15 bg-white px-5 py-3 text-sm font-semibold text-[#285260] hover:bg-[#285260]/5"
        >
          Kembali
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-3xl border border-yellow-100 bg-yellow-50 p-5 text-sm text-yellow-700">
        <b>Catatan:</b> Setelah event diperbarui, status event akan kembali menjadi{" "}
        <b>Menunggu Verifikasi</b>.
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Event</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Event
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  maxLength={100}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
                <p className="mt-2 text-xs text-gray-400">
                  {form.name.length}/100 karakter
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Poster / Banner Event
                </label>
                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#285260]/20 bg-[#F6F8F8] px-5 py-6 text-center hover:border-[#F09A43]">
                  <span className="text-sm font-semibold">
                    Klik untuk mengganti poster
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP. Maksimal 5 MB.
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>

                {bannerPreview && (
                  <div className="relative mt-4 h-64 overflow-hidden rounded-3xl bg-gray-100">
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

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Deskripsi Event
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Minimal 30 karakter.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Pelaksanaan Event</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Destinasi Terkait
                </label>
                <select
                  value={form.destinationId}
                  onChange={(event) =>
                    updateForm("destinationId", event.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                >
                  <option value="">Pilih destinasi terkait</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Tanggal Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(event) =>
                      updateForm("startDate", event.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Tanggal Selesai
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(event) =>
                      updateForm("endDate", event.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Informasi Tambahan</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Kontak Event
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(event) => updateForm("contact", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Link Pendaftaran / Informasi
                </label>
                <input
                  type="url"
                  value={form.registrationUrl}
                  onChange={(event) =>
                    updateForm("registrationUrl", event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/pengelola/event/${eventId}`)}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#285260] hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-[#F09A43] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[28px] bg-[#285260] p-5 text-white shadow-sm xl:sticky xl:top-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Preview Event</h2>
            <span className="rounded-full bg-[#F09A43] px-3 py-1 text-xs font-bold">
              Pending
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white text-[#285260]">
            <div className="relative h-56 bg-gray-100">
              {bannerPreview ? (
                <Image
                  src={bannerPreview}
                  alt="Preview event"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Poster belum dipilih
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold">{form.name || "Nama Event"}</h3>

              <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                {form.description || "Deskripsi event akan tampil di sini."}
              </p>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Mulai:</span>{" "}
                  {formatPreviewDate(form.startDate)}
                </p>
                <p>
                  <span className="font-semibold">Selesai:</span>{" "}
                  {formatPreviewDate(form.endDate)}
                </p>
                <p>
                  <span className="font-semibold">Lokasi:</span>{" "}
                  {selectedDestination?.name || "Destinasi belum dipilih"}
                </p>
              </div>

              {form.registrationUrl && (
                <div className="mt-5 rounded-2xl bg-[#F09A43] px-4 py-3 text-center text-sm font-bold text-white">
                  Link informasi tersedia
                </div>
              )}
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}