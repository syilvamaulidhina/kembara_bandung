"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera, CheckCircle, FileText, Save, UserRound } from "lucide-react";

type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  gender?: string | null;
  domisili?: string | null;
  photo?: string | null;
  verificationStatus?: string | null;
  verificationDocument?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    destinations: number;
    events: number;
  };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function verificationLabel(status?: string | null) {
  if (status === "APPROVED") return "Terverifikasi";
  if (status === "PENDING") return "Menunggu Verifikasi";
  if (status === "REJECTED") return "Ditolak";
  return "Belum Diverifikasi";
}

function verificationStyle(status?: string | null) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

export default function PengelolaProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    gender: "",
    domisili: "",
    photo: "",
  });

  function updateForm(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Format foto harus JPG, JPEG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    setError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto() {
    if (!photoFile) return form.photo;

    const formData = new FormData();
    formData.append("file", photoFile);

    const response = await fetch("/api/pengelola/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengupload foto profil.");
    }

    return data.imageUrl || data.url;
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/pengelola/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data profil.");
        }

        const profileData: Profile = data.profile;

        setProfile(profileData);
        setForm({
          name: profileData.name || "",
          gender: profileData.gender || "",
          domisili: profileData.domisili || "",
          photo: profileData.photo || "",
        });
        setPhotoPreview(profileData.photo || "");
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil profil."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const photo = await uploadPhoto();

      const response = await fetch("/api/pengelola/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          gender: form.gender,
          domisili: form.domisili.trim(),
          photo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui profil.");
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: data.profile.name,
              gender: data.profile.gender,
              domisili: data.profile.domisili,
              photo: data.profile.photo,
              updatedAt: new Date().toISOString(),
            }
          : prev
      );

      setForm((prev) => ({
        ...prev,
        photo: data.profile.photo || "",
      }));

      setPhotoPreview(data.profile.photo || "");
      setPhotoFile(null);
      setSuccess("Profil berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui profil."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="h-[480px] animate-pulse rounded-[32px] bg-white" />
          <div className="h-[560px] animate-pulse rounded-[32px] bg-white" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
        <div className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Profil tidak ditemukan</h1>
          <p className="mt-2 text-sm text-gray-500">
            Data profil pengelola tidak dapat ditampilkan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F8] px-8 py-10 text-[#285260]">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-[#F09A43]">
          Akun Pengelola
        </p>
        <h1 className="text-3xl font-bold">Profile Pengelola</h1>
        <p className="mt-2 text-sm text-gray-500">
          Kelola informasi akun dan identitas pengelola wisata Anda.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <section className="rounded-[32px] bg-white p-6 text-center shadow-sm">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-[#285260]/10">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <UserRound size={48} className="text-[#285260]" />
                </div>
              )}
            </div>

            <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{profile.email}</p>

            <div
              className={`mx-auto mt-4 inline-flex rounded-full px-4 py-2 text-xs font-bold ${verificationStyle(
                profile.verificationStatus
              )}`}
            >
              {verificationLabel(profile.verificationStatus)}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-2xl font-bold">{profile._count.destinations}</p>
                <p className="text-xs text-gray-500">Destinasi</p>
              </div>

              <div className="rounded-2xl bg-[#F6F8F8] p-4">
                <p className="text-2xl font-bold">{profile._count.events}</p>
                <p className="text-xs text-gray-500">Event</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-[#285260] p-6 text-white shadow-sm">
			<div className="flex items-center gap-3">
				<CheckCircle className="text-[#F09A43]" />
				<div>
				<h2 className="font-bold">Status Verifikasi</h2>
				<p className="text-sm text-white/70">
					{verificationLabel(profile.verificationStatus)}
				</p>
				</div>
			</div>

			<div className="mt-5 rounded-2xl bg-white/10 p-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-[#F09A43]">
				Dokumen Verifikasi
				</p>

				{profile.verificationDocument ? (
				<>
					<p className="mt-2 text-sm text-white/80">
					Dokumen bukti pengelolaan telah diunggah dan tersimpan pada sistem.
					</p>

					<a
					href={profile.verificationDocument}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#285260] hover:bg-white/90"
					>
					<FileText size={16} />
					Lihat Dokumen Verifikasi
					</a>
				</>
				) : (
				<p className="mt-2 text-sm text-white/70">
					Belum ada dokumen verifikasi yang diunggah.
				</p>
				)}
			</div>

			{profile.rejectionReason && (
				<div className="mt-5 rounded-2xl bg-red-100 p-4 text-left text-sm text-red-700">
				<b>Alasan Penolakan:</b>
				<p className="mt-1">{profile.rejectionReason}</p>
				</div>
			)}
			</section>

          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="font-bold">Informasi Sistem</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Bergabung pada
                </p>
                <p className="mt-1 font-bold">{formatDate(profile.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Terakhir diperbarui
                </p>
                <p className="mt-1 font-bold">{formatDate(profile.updatedAt)}</p>
              </div>
            </div>
          </section>
        </aside>

        <main>
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <p className="mt-1 text-sm text-gray-500">
                Perbarui informasi dasar akun pengelola wisata.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Foto Profile
                </label>

                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#285260]/20 bg-[#F6F8F8] px-5 py-6 text-center hover:border-[#F09A43]">
                  <Camera className="mb-2 text-[#F09A43]" />
                  <span className="text-sm font-semibold">
                    Klik untuk upload foto
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP. Maksimal 5 MB.
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  maxLength={100}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-5 py-4 text-sm text-gray-500 outline-none"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Email tidak dapat diubah melalui halaman profile.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Jenis Kelamin
                </label>
                <select
                  value={form.gender}
                  onChange={(event) => updateForm("gender", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                >
                  	<option value="">Pilih jenis kelamin</option>
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Domisili
                </label>
                <input
                  type="text"
                  value={form.domisili}
                  onChange={(event) =>
                    updateForm("domisili", event.target.value)
                  }
                  placeholder="Contoh: Kota Bandung"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#F09A43] focus:ring-2 focus:ring-[#F09A43]/20"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#F09A43] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}