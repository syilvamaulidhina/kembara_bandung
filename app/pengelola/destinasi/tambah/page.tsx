"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DestinationMap from "@/components/destination-map";
import type { CoveragePolygon } from "@/types/coverage-polygon";
import { CITY_OPTIONS, WILAYAH_BANDUNG } from "@/data/wilayah-bandung";
import { ChevronDown, MapPin, Sparkles } from "lucide-react";

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
  strongestCategory: CategoryAnalysis | null;
  unselectedStrongMatches: CategoryAnalysis[];
  allCategoryAnalysis: CategoryAnalysis[];
  message: string;
  reasoning?: AiReasoning;
  reasoningSource?: string;
};

type AiReasoning = {
	explanation: string;
	potentialIssue: string;
	suggestion: string;
};

export default function TambahDestinasiPage() {
	const router = useRouter();
	const MIN_AI_SCORE = 55;

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

		isFree: false,
		ticketPrice: "",
		maxPrice: "",
		openTime: "",
		closeTime: "",
		website: "",
	});

	const [categories, setCategories] = useState<{ id: number; name: string }[]>(
		[]
	);

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isAreaValid, setIsAreaValid] = useState(true);

	const [hasCoverageArea, setHasCoverageArea] = useState(false);

	const [coveragePolygon, setCoveragePolygon] =
	useState<CoveragePolygon | null>(null);

	const [isCoverageValid, setIsCoverageValid] = useState(true);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCheckingAI, setIsCheckingAI] = useState(false);
	const [analysisResult, setAnalysisResult] =
		useState<AnalysisResult | null>(null);
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

	function resetAnalysis() {
		setAnalysisResult(null);
		setShowAnalysisModal(false);
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
			field === "latitude" ||
			field === "longitude" ||
			field === "ticketPrice" ||
			field === "maxPrice" ||
			field === "openTime" ||
			field === "closeTime" ||
			field === "website"
			) {
			resetAnalysis();
		}
	}

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

	function toggleCategory(categoryId: number) {
		setForm((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(categoryId)
				? prev.categoryIds.filter((id) => id !== categoryId)
				: [...prev.categoryIds, categoryId],
		}));

		resetAnalysis();
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

		if (!buildFullAddress().trim()) {
			alert("Alamat wajib diisi sebelum analisis.");
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

		if (hasCoverageArea && !coveragePolygon) {
			alert("Cakupan wilayah minimal harus memiliki 3 titik.");
			return;
		}

		if (hasCoverageArea && !isCoverageValid) {
			alert("Seluruh titik cakupan harus berada di Bandung Raya.");
			return;
		}

    if (!form.isFree) {
      if (!form.ticketPrice) {
        alert("Harga tiket mulai wajib diisi sebelum analisis.");
        return;
      }

      if (!form.maxPrice) {
        alert("Harga tiket maksimal wajib diisi sebelum analisis.");
        return;
      }

      if (Number(form.maxPrice) < Number(form.ticketPrice)) {
        alert("Harga maksimal tidak boleh lebih kecil dari harga mulai.");
        return;
      }
    }

    if (!form.openTime) {
      alert("Jam buka wajib diisi sebelum analisis.");
      return;
    }

    if (!form.closeTime) {
      alert("Jam tutup wajib diisi sebelum analisis.");
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

			let reasoning: AiReasoning | undefined;
			let reasoningSource: string | undefined;

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

			const reasoningData = await reasoningResponse.json();

			reasoning = reasoningData.reasoning;
			reasoningSource = reasoningData.source;
			} catch (error) {
			console.error("AI REASONING ERROR:", error);
			}

			setAnalysisResult({
			...data,
			reasoning,
			reasoningSource,
			});

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

		if (!buildFullAddress().trim()) {
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

		if (hasCoverageArea && !coveragePolygon) {
			alert("Cakupan wilayah minimal harus memiliki 3 titik.");
			return;
		}

		if (hasCoverageArea && !isCoverageValid) {
			alert("Seluruh titik cakupan harus berada di Bandung Raya.");
			return;
		}

    if (!form.isFree) {
        if (!form.ticketPrice) {
          alert("Harga tiket mulai wajib diisi.");
          return;
        }

        if (!form.maxPrice) {
          alert("Harga tiket maksimal wajib diisi.");
          return;
        }

        if (Number(form.maxPrice) < Number(form.ticketPrice)) {
          alert("Harga maksimal tidak boleh lebih kecil dari harga mulai.");
          return;
        }
    }

    if (!form.openTime) {
        alert("Jam buka wajib diisi.");
        return;
    }

    if (!form.closeTime) {
        alert("Jam tutup wajib diisi.");
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
					address: form.address || buildFullAddress(),

					coveragePolygon: hasCoverageArea ? coveragePolygon : null,

					imageUrl,
					analysisResult,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				alert(data.message || "Gagal menyimpan wisata.");
				return;
			}

			alert("Wisata berhasil disubmit dan masuk status pending.");
			router.push("/pengelola/destinasi");
			router.refresh();
		} catch (error) {
			console.error("SUBMIT ERROR:", error);
			alert("Terjadi kesalahan saat submit wisata.");
		} finally {
			setIsSubmitting(false);
		}
	}

	const districtOptions = form.addressCity
		? Object.keys(WILAYAH_BANDUNG[form.addressCity as keyof typeof WILAYAH_BANDUNG])
		: [];

	const villageOptions =
		form.addressCity && form.addressDistrict
			? WILAYAH_BANDUNG[
					form.addressCity as keyof typeof WILAYAH_BANDUNG
				][
					form.addressDistrict as keyof typeof WILAYAH_BANDUNG[keyof typeof WILAYAH_BANDUNG]
				] || []
			: [];

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
								onChange={(event) =>
									updateForm("name", event.target.value)
								}
								placeholder="Nama Wisata"
								className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
							/>

							<div className="rounded-2xl bg-white p-4">
								<p className="mb-3 font-semibold text-[#285260]">
									Kategori Wisata
								</p>

								<div className="flex flex-wrap gap-2">
									{categories.map((category) => {
										const isSelected = form.categoryIds.includes(
											category.id
										);

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
								onChange={(event) =>
									updateForm("contact", event.target.value)
								}
								placeholder="Kontak"
								className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-[#285260] placeholder:text-[#285260] focus:ring-2 focus:ring-[#F09A43]"
							/>

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
												latitude: "",
												longitude: "",
											}));
											resetAnalysis();
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
												latitude: "",
												longitude: "",
											}));
											resetAnalysis();
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
												latitude: "",
												longitude: "",
											}));
											resetAnalysis();
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
										<p className="mb-1 font-semibold">Alamat terdeteksi dari peta:</p>
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
									<label className="flex items-start gap-3">
										<input
										type="checkbox"
										checked={hasCoverageArea}
										onChange={(event) => {
											const checked = event.target.checked;

											setHasCoverageArea(checked);

											if (!checked) {
											setCoveragePolygon(null);
											setIsCoverageValid(true);
											}

											resetAnalysis();
										}}
										className="mt-1 h-4 w-4 accent-[#F09A43]"
										/>

										<div>
										<p className="font-semibold text-[#285260]">
											Destinasi memiliki cakupan wilayah
										</p>

										<p className="mt-1 text-sm text-gray-500">
											Aktifkan untuk menggambar area destinasi menggunakan titik-titik
											polygon pada peta.
										</p>
										</div>
									</label>

									{hasCoverageArea && (
										<div className="mt-3 rounded-xl bg-orange-50 px-4 py-3 text-sm text-[#C76B1F]">
										Klik peta untuk menambahkan titik cakupan. Minimal 3 titik dan
										maksimal 30 titik.
										</div>
									)}

									{hasCoverageArea && !isCoverageValid && (
										<div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
										Cakupan wilayah belum valid.
										</div>
									)}
									</div>

              <div className="rounded-2xl bg-white p-4">
                <p className="mb-4 font-semibold text-[#285260]">
                  	Informasi Tambahan
                </p>

                <label className="mb-4 flex items-center gap-3 text-sm font-semibold text-[#285260]">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setForm((prev) => ({
                        ...prev,
                        isFree: checked,
                        ticketPrice: checked ? "0" : "",
                        maxPrice: checked ? "0" : "",
                      }));

                      resetAnalysis();
                    }}
                    className="h-4 w-4 accent-[#F09A43]"
                  />
                  Wisata gratis
                </label>

                {!form.isFree && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={form.ticketPrice}
                      onChange={(event) =>
                        updateForm("ticketPrice", event.target.value)
                      }
                      placeholder="Harga Tiket Mulai"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#285260]"
                    />

                    <input
                      type="number"
                      value={form.maxPrice}
                      onChange={(event) =>
                        updateForm("maxPrice", event.target.value)
                      }
                      placeholder="Harga Tiket Maksimal"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#285260]"
                    />
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={form.openTime}
                    onChange={(event) =>
                      updateForm("openTime", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#285260]"
                  />

                  <input
                    type="time"
                    value={form.closeTime}
                    onChange={(event) =>
                      updateForm("closeTime", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#285260]"
                  />
                </div>

                <input
                  type="url"
                  value={form.website}
                  onChange={(event) =>
                    updateForm("website", event.target.value)
                  }
                  placeholder="Website (Opsional)"
                  className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-[#285260]"
                />
              </div>

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
							address={buildFullAddress()}
							addressFields={{
							addressStreet: form.addressStreet,
							addressVillage: form.addressVillage,
							addressDistrict: form.addressDistrict,
							addressCity: form.addressCity,
							addressProvince: form.addressProvince,
							}}
							onAddressChange={(address) => {
								updateForm("address", address);
							}}
							onLocationChange={(lat, lng) => {
							updateForm("latitude", lat);
							updateForm("longitude", lng);
							}}
							onAreaValidChange={setIsAreaValid}
							coverageEnabled={hasCoverageArea}
							coveragePolygon={coveragePolygon}
							onCoverageChange={(polygon) => {
							setCoveragePolygon(polygon);
							resetAnalysis();
							}}
							onCoverageValidChange={setIsCoverageValid}
						/>
						</div>
					</div>
				</form>
			</main>

			{showAnalysisModal && analysisResult && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
					<div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
						<div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[1.05fr_1.25fr_0.9fr]">
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
												Kategori dengan Kecocokan Tertinggi
											</p>

											<h3 className="mt-1 text-xl font-bold text-[#F09A43]">
												{analysisResult.strongestCategory?.categoryName ??
													"Tidak Terdeteksi"}
											</h3>

											<div className="mt-3 flex flex-wrap gap-2">
												{analysisResult.strongestCategory?.matchedKeywords
													?.length ? (
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

							<div className="bg-[#F7FAFA] p-6">
								<p className="text-sm font-semibold uppercase tracking-wide text-[#F09A43]">
									Reasoning AI
								</p>

								<h3 className="mt-2 text-2xl font-extrabold text-[#285260]">
									Penjelasan Hasil Analisis
								</h3>

								<p className="mt-2 text-sm leading-6 text-gray-500">
									Penjelasan ini dibuat berdasarkan hasil domain knowledge,
									bukan sebagai keputusan status destinasi.
								</p>

								{analysisResult.reasoning ? (
									<div className="mt-5 space-y-4">
										<div className="rounded-2xl bg-white p-4 text-left shadow-sm">
											<p className="text-sm font-extrabold text-[#285260]">
												Penalaran AI
											</p>

											<p className="mt-2 text-sm leading-6 text-gray-600">
												{analysisResult.reasoning.explanation}
											</p>
										</div>

										<div className="grid gap-4 xl:grid-cols-2">
											<div className="rounded-2xl bg-orange-50 p-4 text-left">
												<p className="text-sm font-extrabold text-[#C76B1F]">
													Catatan Potensial
												</p>

												<p className="mt-2 text-sm leading-6 text-gray-600">
													{analysisResult.reasoning.potentialIssue}
												</p>
											</div>

											<div className="rounded-2xl bg-green-50 p-4 text-left">
												<p className="text-sm font-extrabold text-green-700">
													Saran Perbaikan
												</p>

												<p className="mt-2 text-sm leading-6 text-gray-600">
													{analysisResult.reasoning.suggestion}
												</p>
											</div>
										</div>
									</div>
								) : (
									<div className="mt-5 rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm">
										Reasoning AI belum tersedia.
									</div>
								)}
							</div>

							<div className="flex flex-col justify-between bg-[#F8F8F8] p-6">
								<div>
									<div className="rounded-3xl bg-white p-5 text-center shadow-sm">
										<div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#285260]">
											{analysisResult.score >= MIN_AI_SCORE ? (
												<span className="text-4xl font-black leading-none text-[#4ADE80]">
													✓
												</span>
											) : (
												<span className="text-4xl font-black leading-none text-[#F09A43]">
													!
												</span>
											)}
										</div>

										<p className="text-lg font-extrabold text-[#F09A43]">
											{analysisResult.score >= MIN_AI_SCORE
												? "Bisa Disubmit"
												: "Perlu Perbaikan"}
										</p>

										<p className="mt-1 text-sm font-semibold text-gray-500">
											Skor minimal submit {MIN_AI_SCORE}/100
										</p>
									</div>

									<div className="mt-5 rounded-3xl bg-[#285260] p-5 text-left text-white">
										<p className="text-sm font-bold uppercase tracking-wide text-[#F09A43]">
											Kesimpulan Sistem
										</p>

										<p className="mt-2 text-base font-semibold leading-relaxed">
											{analysisResult.message}
										</p>
									</div>

									{analysisResult.score < MIN_AI_SCORE && (
										<p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
											Skor belum memenuhi batas minimal. Silakan
											perbaiki data terlebih dahulu.
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
										disabled={
											analysisResult.score < MIN_AI_SCORE || isSubmitting
										}
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