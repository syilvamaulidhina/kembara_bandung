"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DestinationMap from "@/components/destination-map";
import { ChevronDown } from "lucide-react";
import { CITY_OPTIONS, WILAYAH_BANDUNG } from "@/data/wilayah-bandung";

type Category = {
  id: number;
  name: string;
};

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

type AiReasoning = {
  explanation: string;
  potentialIssue: string;
  suggestion: string;
};

type Destination = {
  id: number;
  name: string;
  description: string;
  address: string;
  contact: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  status: string;
  adminFeedback?: string | null;
  categories: {
	category: {
	  id: number;
	  name: string;
	};
  }[];
  addressStreet: string | null;
  addressVillage: string | null;
  addressDistrict: string | null;
  addressCity: string | null;
  addressProvince: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  openTime: string | null;
  closeTime: string | null;
  website: string | null;
};

export default function EditDestinasiPage() {
  const router = useRouter();
  const params = useParams();

  const destinationId = params.id as string;
  const MIN_AI_SCORE = 55;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAreaValid, setIsAreaValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAI, setIsCheckingAI] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  const [analysisResult, setAnalysisResult] =
	useState<AnalysisResult | null>(null);

  const [aiReasoning, setAiReasoning] = useState<AiReasoning | null>(null);

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const [adminFeedback, setAdminFeedback] = useState("");

  const [form, setForm] = useState({
	name: "",
	categoryIds: [] as number[],
	description: "",
	contact: "",
	address: "",
	addressStreet: "",
	addressVillage: "",
	addressDistrict: "",
	addressCity: "",
	addressProvince: "Jawa Barat",
	latitude: "",
	longitude: "",
	imageUrl: "",

	isFree: false,
	ticketPrice: "",
	maxPrice: "",
	openTime: "",
	closeTime: "",
	website: "",
  });

  useEffect(() => {
	async function fetchData() {
	  try {
		const [destinationRes, categoriesRes] = await Promise.all([
		  fetch(`/api/pengelola/destinations/${destinationId}`),
		  fetch("/api/pengelola/categories"),
		]);

		if (!destinationRes.ok) {
		  throw new Error("Gagal mengambil detail wisata.");
		}

		if (!categoriesRes.ok) {
		  throw new Error("Gagal mengambil kategori.");
		}

		const destination: Destination = await destinationRes.json();
		const categoryData: Category[] = await categoriesRes.json();

		setCategories(categoryData);
		setOldImageUrl(destination.imageUrl || "");
		setAdminFeedback(destination.adminFeedback || "");

		setForm({
			name: destination.name || "",
			categoryIds: destination.categories.map((item) => item.category.id),
			description: destination.description || "",
			contact: destination.contact || "",
			address: destination.address || "",
			addressStreet: destination.addressStreet || "",
			addressVillage: destination.addressVillage || "",
			addressDistrict: destination.addressDistrict || "",
			addressCity: destination.addressCity || "",
			addressProvince: destination.addressProvince || "Jawa Barat",
			latitude: String(destination.latitude || ""),
			longitude: String(destination.longitude || ""),
			imageUrl: destination.imageUrl || "",

			isFree: destination.ticketPrice === 0 && destination.maxPrice === 0,
			ticketPrice:
			  destination.ticketPrice === null || destination.ticketPrice === undefined
				? ""
				: String(destination.ticketPrice),
			maxPrice:
			  destination.maxPrice === null || destination.maxPrice === undefined
				? ""
				: String(destination.maxPrice),
			openTime: destination.openTime || "",
			closeTime: destination.closeTime || "",
			website: destination.website || "",
		  });
	  } catch (error) {
		console.error(error);
		alert("Gagal mengambil data edit wisata.");
	  } finally {
		setLoading(false);
	  }
	}

	if (destinationId) {
	  fetchData();
	}
  }, [destinationId]);

  function buildFullAddress() {
	return [
	  form.addressStreet,
	  form.addressVillage,
	  form.addressDistrict,
	  form.addressCity,
	  form.addressProvince,
	]
	  .filter(Boolean)
	  .join(", ");
  }

  function updateForm(field: string, value: string) {
	setForm((prev) => ({
	  ...prev,
	  [field]: value,
	}));

	if (
	  field === "name" ||
	  field === "description" ||
	  field === "address" ||
	  field === "addressStreet" ||
	  field === "addressVillage" ||
	  field === "addressDistrict" ||
	  field === "addressCity" ||
	  field === "latitude" ||
	  field === "longitude"
	) {
	  setAnalysisResult(null);
	  setAiReasoning(null);
	}
  }

  function toggleCategory(categoryId: number) {
	setForm((prev) => ({
	  ...prev,
	  categoryIds: prev.categoryIds.includes(categoryId)
		? prev.categoryIds.filter((id) => id !== categoryId)
		: [...prev.categoryIds, categoryId],
	}));

	setAnalysisResult(null);
	setAiReasoning(null);
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

	if (
	  !form.addressStreet.trim() ||
	  !form.addressVillage.trim() ||
	  !form.addressDistrict.trim() ||
	  !form.addressCity.trim()
	) {
	  alert("Lengkapi alamat wisata terlebih dahulu.");
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
		  address: form.address || buildFullAddress(),
		  addressStreet: form.addressStreet,
		  addressVillage: form.addressVillage,
		  addressDistrict: form.addressDistrict,
		  addressCity: form.addressCity,
		  addressProvince: form.addressProvince,
		}),
	  });

	  const data = await response.json();

	  if (!response.ok) {
		alert(data.message || "Gagal melakukan analisis.");
		return;
	  }

	  let reasoning: AiReasoning | null = null;

	  try {
		const reasoningResponse = await fetch(
		  "/api/pengelola/ai-insight/check/reasoning",
		  {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  analysisResult: data,
			}),
		  }
		);

		if (reasoningResponse.ok) {
		  const reasoningData = await reasoningResponse.json();
		  reasoning = reasoningData.reasoning;
		} else {
		  console.error("AI REASONING ERROR:", await reasoningResponse.text());
		}
	  } catch (error) {
		console.error("AI REASONING CONNECTION ERROR:", error);
	  }

	  setAnalysisResult(data);
	  setAiReasoning(reasoning);
	  setShowAnalysisModal(true);
	} catch (error) {
	  console.error("CHECK AI ERROR:", error);
	  alert("Terjadi kesalahan saat melakukan analisis.");
	} finally {
	  setIsCheckingAI(false);
	}
  }

  async function handleSubmit() {
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

	if (
	  !form.addressStreet.trim() ||
	  !form.addressVillage.trim() ||
	  !form.addressDistrict.trim() ||
	  !form.addressCity.trim()
	) {
	  alert("Lengkapi alamat wisata terlebih dahulu.");
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

	  let finalImageUrl = oldImageUrl;

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

		finalImageUrl = uploadData.imageUrl;
	  }

	  const response = await fetch(`/api/pengelola/destinations/${destinationId}`, {
		method: "PATCH",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  name: form.name,
		  categoryIds: form.categoryIds,
		  description: form.description,
		  contact: form.contact,

		  address: form.address || buildFullAddress(),
		  addressStreet: form.addressStreet,
		  addressVillage: form.addressVillage,
		  addressDistrict: form.addressDistrict,
		  addressCity: form.addressCity,
		  addressProvince: form.addressProvince,

		  latitude: form.latitude,
		  longitude: form.longitude,
		  imageUrl: finalImageUrl,

		  isFree: form.isFree,
		  ticketPrice: form.isFree ? 0 : form.ticketPrice,
		  maxPrice: form.isFree ? 0 : form.maxPrice,
		  openTime: form.openTime,
		  closeTime: form.closeTime,
		  website: form.website,

		  analysisResult,
		}),
	  });

	  const data = await response.json();

	  if (!response.ok) {
		alert(data.message || "Gagal memperbarui wisata.");
		return;
	  }

	  alert("Wisata berhasil diperbarui dan masuk review ulang.");
	  router.push("/pengelola/destinasi");
	  router.refresh();
	} catch (error) {
	  console.error("UPDATE ERROR:", error);
	  alert("Terjadi kesalahan saat memperbarui wisata.");
	} finally {
	  setIsSubmitting(false);
	}
  }

  const wilayahBandung = WILAYAH_BANDUNG as Record<
	string,
	Record<string, readonly string[]>
  >;

  const districtOptions = form.addressCity
	? Object.keys(wilayahBandung[form.addressCity] || {})
	: [];

  const villageOptions =
	form.addressCity && form.addressDistrict
	  ? Array.from(
		  wilayahBandung[form.addressCity]?.[form.addressDistrict] || []
		)
	  : [];

  const selectedKeywords =
	analysisResult?.selectedCategories.flatMap(
	  (category) => category.matchedKeywords
	) || [];

  const previewImage = imageFile
	? URL.createObjectURL(imageFile)
	: oldImageUrl;

  if (loading) {
	return (
	  <main className="min-h-screen bg-[#F5F7FB] px-10 py-8">
		<div className="rounded-[24px] bg-white p-8 text-gray-500">
		  Loading data wisata...
		</div>
	  </main>
	);
  }

  return (
	<>
	  <header className="border-b border-gray-200 bg-white">
		<div className="w-full px-10 py-8">
		  <button
			type="button"
			onClick={() => router.push("/pengelola/destinasi")}
			className="mb-4 text-sm font-semibold text-[#285260] hover:underline"
		  >
			← Kembali ke Kelola Wisata
		  </button>

		  <h1 className="text-3xl font-extrabold text-[#285260]">
			Edit Wisata
		  </h1>

		  <p className="mt-2 font-semibold text-[#285260]">
			Perbarui data wisata, tentukan ulang titik lokasi, lalu lakukan
			validasi AI sebelum menyimpan.
		  </p>
		</div>
	  </header>

	  <main className="bg-[#F5F7FB] px-10 py-8">
		{adminFeedback && (
		  <div className="mb-6 rounded-[24px] border border-red-100 bg-white p-5 shadow-sm">
			<p className="mb-2 text-sm font-bold text-red-500">
			  Feedback Admin
			</p>

			<p className="text-sm leading-relaxed text-gray-700">
			  {adminFeedback}
			</p>
		  </div>
		)}

		<form
		  onSubmit={(event) => event.preventDefault()}
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

			  <div className="grid gap-4 md:grid-cols-2">
				<input
				  type="time"
				  value={form.openTime}
				  onChange={(event) => updateForm("openTime", event.target.value)}
				  className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
				/>

				<input
				  type="time"
				  value={form.closeTime}
				  onChange={(event) => updateForm("closeTime", event.target.value)}
				  className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
				/>

				<input
				  type="url"
				  value={form.website}
				  onChange={(event) => updateForm("website", event.target.value)}
				  placeholder="Website"
				  className="md:col-span-2 w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
				/>

				<label className="md:col-span-2 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-[#285260]">
				  <input
					type="checkbox"
					checked={form.isFree}
					onChange={(event) =>
					  setForm((prev) => ({
						...prev,
						isFree: event.target.checked,
						ticketPrice: event.target.checked ? "0" : "",
						maxPrice: event.target.checked ? "0" : "",
					  }))
					}
				  />
				  Wisata Gratis
				</label>

				<input
				  type="number"
				  value={form.ticketPrice}
				  disabled={form.isFree}
				  onChange={(event) => updateForm("ticketPrice", event.target.value)}
				  placeholder="Harga Tiket Minimum"
				  className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] disabled:opacity-60 focus:ring-2 focus:ring-[#F09A43]"
				/>

				<input
				  type="number"
				  value={form.maxPrice}
				  disabled={form.isFree}
				  onChange={(event) => updateForm("maxPrice", event.target.value)}
				  placeholder="Harga Tiket Maksimum"
				  className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] disabled:opacity-60 focus:ring-2 focus:ring-[#F09A43]"
				/>
			  </div>

			  <div className="grid gap-4 md:grid-cols-2">
				<div className="relative">
				  <select
					value={form.addressCity}
					onChange={(event) => {
					  setForm((prev) => ({
						...prev,
						addressCity: event.target.value,
						addressDistrict: "",
						addressVillage: "",
						address: "",
						latitude: "",
						longitude: "",
					  }));
					  setAnalysisResult(null);
					}}
					className="w-full appearance-none rounded-2xl border-0 bg-white px-5 py-4 pr-12 text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
				  >
					<option value="">Pilih Kota/Kabupaten</option>
					{CITY_OPTIONS.map((city) => (
					  <option key={city} value={city}>
						{city}
					  </option>
					))}
				  </select>

				  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#285260]" />
				</div>

				<div className="relative">
				  <select
					value={form.addressDistrict}
					disabled={!form.addressCity}
					onChange={(event) => {
					  setForm((prev) => ({
						...prev,
						addressDistrict: event.target.value,
						addressVillage: "",
						address: "",
						latitude: "",
						longitude: "",
					  }));
					  setAnalysisResult(null);
					}}
					className="w-full appearance-none rounded-2xl border-0 bg-white px-5 py-4 pr-12 text-[#285260] disabled:opacity-60 focus:ring-2 focus:ring-[#F09A43]"
				  >
					<option value="">Pilih Kecamatan</option>
					{districtOptions.map((district) => (
					  <option key={district} value={district}>
						{district}
					  </option>
					))}
				  </select>

				  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#285260]" />
				</div>

				<div className="relative">
				  <select
					value={form.addressVillage}
					disabled={!form.addressDistrict}
					onChange={(event) => {
					  setForm((prev) => ({
						...prev,
						addressVillage: event.target.value,
						address: "",
						latitude: "",
						longitude: "",
					  }));
					  setAnalysisResult(null);
					}}
					className="w-full appearance-none rounded-2xl border-0 bg-white px-5 py-4 pr-12 text-[#285260] disabled:opacity-60 focus:ring-2 focus:ring-[#F09A43]"
				  >
					<option value="">Pilih Kelurahan/Desa</option>
					{villageOptions.map((village) => (
					  <option key={village} value={village}>
						{village}
					  </option>
					))}
				  </select>

				  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#285260]" />
				</div>

				<input
				  type="text"
				  value={form.addressStreet}
				  onChange={(event) => {
					updateForm("addressStreet", event.target.value);
					updateForm("address", "");
					updateForm("latitude", "");
					updateForm("longitude", "");
				  }}
				  placeholder="Nama jalan / alamat detail"
				  className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
				/>

				<input
				  type="text"
				  value="Jawa Barat"
				  readOnly
				  className="w-full rounded-2xl border-0 bg-white/80 px-5 py-4 text-[#285260] md:col-span-2"
				/>

				{form.address && (
				  <div className="rounded-2xl bg-white/90 px-5 py-4 text-sm text-[#285260] md:col-span-2">
					<p className="mb-1 font-semibold">
					  Alamat terdeteksi dari peta:
					</p>
					<p>{form.address}</p>
				  </div>
				)}
			  </div>

			  {!isAreaValid && (
				<div className="rounded-xl bg-[#FFF3CD] px-4 py-3 text-sm text-[#856404]">
				  Lokasi yang dipilih berada di luar area Bandung Raya.
				</div>
			  )}

			  <div className="rounded-2xl bg-white p-4">
				<p className="mb-3 font-semibold text-[#285260]">
				  Gambar Wisata
				</p>

				{previewImage ? (
				  <img
					src={previewImage}
					alt={form.name}
					className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover"
				  />
				) : (
				  <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
					Belum ada gambar
				  </div>
				)}

				<input
				  type="file"
				  accept="image/*"
				  onChange={(event) => {
					const file = event.target.files?.[0];

					if (file) {
					  setImageFile(file);
					}
				  }}
				  className="block w-full text-sm text-[#285260] file:mr-4 file:rounded-xl file:border-0 file:bg-[#285260] file:px-4 file:py-2 file:font-medium file:text-white"
				/>

				<p className="mt-2 text-xs text-gray-500">
				  Kosongkan jika tidak ingin mengganti gambar.
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

			  {analysisResult && (
				<div className="rounded-2xl bg-white px-5 py-4">
				  <div className="flex items-center justify-between">
					<div>
					  <p className="text-sm font-bold text-[#285260]">
						Hasil Check AI
					  </p>

					  <p className="mt-1 text-xs text-gray-500">
						{analysisResult.message}
					  </p>
					</div>

					<div className="text-right">
					  <p className="text-2xl font-extrabold text-[#F09A43]">
						{analysisResult.score}
					  </p>

					  <p className="text-xs font-semibold text-gray-500">
						/100
					  </p>
					</div>
				  </div>
				</div>
			  )}

			  <div className="mt-auto flex flex-wrap justify-end gap-4 pt-4">
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

				<button
				  type="button"
				  onClick={handleSubmit}
				  disabled={
					isSubmitting ||
					!analysisResult ||
					analysisResult.score < MIN_AI_SCORE
				  }
				  className="min-w-[160px] rounded-2xl bg-white px-6 py-3 font-semibold text-[#285260] shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
				  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
				</button>
			  </div>
			</div>

			<div className="rounded-[24px] bg-white p-3">
			  <DestinationMap
				latitude={form.latitude}
				longitude={form.longitude}
				address={buildFullAddress() || form.address}
				addressFields={{
				  addressStreet: form.addressStreet,
				  addressVillage: form.addressVillage,
				  addressDistrict: form.addressDistrict,
				  addressCity: form.addressCity,
				  addressProvince: form.addressProvince,
				}}
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
				<div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
				<div className="grid lg:grid-cols-[1fr_1fr_0.9fr]">
					{/* LEFT */}
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

							<p className="text-3xl font-extrabold">
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

						<p className="text-sm leading-relaxed text-white/80">
						{analysisResult.message}
						</p>
					</div>

					<div className="mt-5 rounded-3xl bg-white/10 p-5">
						<p className="text-sm font-semibold text-white/80">
						Kategori Terdeteksi Terkuat
						</p>
						<p className="mt-2 text-xl font-extrabold text-[#F09A43]">
						{analysisResult.strongestCategory?.categoryName || "-"}
						</p>
					</div>
					</div>

					{/* MIDDLE */}
					<div className="bg-[#F7FAFA] p-6">
					<h3 className="text-xl font-extrabold text-[#285260]">
						Ringkasan Analisis
					</h3>

					<div className="mt-5 space-y-5">
						<div className="rounded-2xl bg-white p-4 shadow-sm">
						<p className="text-sm font-semibold text-gray-500">
							Kategori Dipilih
						</p>

						<p className="mt-2 font-bold text-[#285260]">
							{analysisResult.selectedCategories
							.map((category) => category.categoryName)
							.join(", ")}
						</p>
						</div>

						<div className="rounded-2xl bg-white p-4 shadow-sm">
						<p className="text-sm font-semibold text-gray-500">
							Keyword Cocok
						</p>

						<div className="mt-3 flex flex-wrap gap-2">
							{selectedKeywords.length > 0 ? (
							selectedKeywords.map((keyword) => (
								<span
								key={keyword}
								className="rounded-full bg-[#285260]/10 px-3 py-1 text-xs font-semibold text-[#285260]"
								>
								{keyword}
								</span>
							))
							) : (
							<span className="text-sm text-gray-400">
								Tidak ada keyword cocok
							</span>
							)}
						</div>
						</div>

						<div className="rounded-2xl bg-white p-4 shadow-sm">
						<p className="text-sm font-semibold text-gray-500">
							Kategori Dipilih Tanpa Keyword Cocok
						</p>

						<div className="mt-3 flex flex-wrap gap-2">
							{analysisResult.selectedWithoutMatches.length > 0 ? (
							analysisResult.selectedWithoutMatches.map((category) => (
								<span
								key={category.categoryId}
								className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
								>
								{category.categoryName}
								</span>
							))
							) : (
							<span className="text-sm text-gray-400">
								Semua kategori pilihan memiliki kecocokan.
							</span>
							)}
						</div>
						</div>

						<div className="rounded-2xl bg-white p-4 shadow-sm">
						<p className="text-sm font-semibold text-gray-500">
							Kategori Lain yang Terdeteksi
						</p>

						<div className="mt-3 flex flex-wrap gap-2">
							{analysisResult.unselectedStrongMatches.length > 0 ? (
							analysisResult.unselectedStrongMatches.map((category) => (
								<span
								key={category.categoryId}
								className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
								>
								{category.categoryName}
								</span>
							))
							) : (
							<span className="text-sm text-gray-400">
								Tidak ada kategori lain yang dominan.
							</span>
							)}
						</div>
						</div>
					</div>
					</div>

					{/* RIGHT */}
					<div className="flex flex-col justify-between bg-[#F8F8F8] p-6">
					<div>
						<h3 className="text-xl font-extrabold text-[#285260]">
						Reasoning AI
						</h3>

						<p className="mt-1 text-sm text-gray-500">
						Penjelasan hasil analisis dalam bahasa yang lebih mudah dipahami.
						</p>

						<div className="mt-5 space-y-4">
						<div className="rounded-2xl bg-white p-4 shadow-sm">
							<p className="text-sm font-bold text-[#285260]">
							Penalaran AI
							</p>
							<p className="mt-2 text-sm leading-6 text-gray-600">
							{aiReasoning?.explanation ||
								"Penalaran AI belum tersedia."}
							</p>
						</div>

						<div className="rounded-2xl bg-orange-50 p-4">
							<p className="text-sm font-bold text-orange-700">
							Catatan Potensial
							</p>
							<p className="mt-2 text-sm leading-6 text-gray-600">
							{aiReasoning?.potentialIssue ||
								"Belum ada catatan potensial."}
							</p>
						</div>

						<div className="rounded-2xl bg-green-50 p-4">
							<p className="text-sm font-bold text-green-700">
							Saran Perbaikan
							</p>
							<p className="mt-2 text-sm leading-6 text-gray-600">
							{aiReasoning?.suggestion ||
								"Belum ada saran perbaikan."}
							</p>
						</div>
						</div>
					</div>

					<div className="mt-6 space-y-3">
						<button
						type="button"
						onClick={() => setShowAnalysisModal(false)}
						className="w-full rounded-2xl bg-[#285260] px-5 py-3 font-semibold text-white hover:opacity-90"
						>
						Tutup
						</button>

						{analysisResult.score < MIN_AI_SCORE && (
						<p className="text-center text-xs font-semibold text-red-500">
							Skor belum memenuhi batas minimal {MIN_AI_SCORE}/100.
						</p>
						)}
					</div>
					</div>
				</div>
				</div>
			</div>
			)}
	</>
  );
}