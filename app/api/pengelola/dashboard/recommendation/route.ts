import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getUserFromCookie(req: NextRequest) {
	const userCookie = req.cookies.get("user");

	if (!userCookie) return null;

	try {
		return JSON.parse(userCookie.value);
	} catch {
		return null;
	}
}

function getHealthLabel(score: number) {
	if (score >= 80) return "Baik";
	if (score >= 60) return "Cukup";
	return "Perlu Perhatian";
}

function getFallbackRecommendation(context: any) {
	const isEmpty = context.totalDestinations === 0;

	return {
		health: {
			score: context.managementHealthScore,
			label: isEmpty
				? "Belum Ada Data"
				: getHealthLabel(context.managementHealthScore),
			description: isEmpty
				? "Belum ada data destinasi untuk dianalisis."
				: context.avgAiScore !== null
				? `Rata-rata skor AI Insight berada di ${context.avgAiScore}, dengan kesehatan pengelolaan ${context.managementHealthScore}/100.`
				: `Kesehatan pengelolaan berada di ${context.managementHealthScore}/100, namun belum ada cukup data AI Insight.`,
		},
		summary: isEmpty
			? "Belum ada destinasi yang dikelola."
			: context.revisionDestinations > 0
			? `Ada ${context.revisionDestinations} destinasi yang membutuhkan perbaikan dari admin.`
			: `Pengelolaan cukup stabil dengan ${context.activeDestinations} destinasi aktif dan ${context.pendingDestinations} destinasi menunggu review.`,
		priority: isEmpty
			? "Tambahkan destinasi pertama agar sistem dapat memberikan rekomendasi."
			: context.revisionDestinations > 0
			? "Prioritaskan destinasi berstatus butuh perbaikan."
			: context.pendingDestinations > 0
			? "Pantau destinasi pending dan pastikan datanya sudah lengkap."
			: "Pertahankan kualitas data dan lengkapi informasi pendukung.",
		recommendations: isEmpty
			? [
					{
						title: "Tambah Destinasi",
						description:
							"Tambahkan data destinasi wisata pertama terlebih dahulu.",
					},
					{
						title: "Lengkapi Informasi Dasar",
						description:
							"Isi kategori, alamat, gambar, kontak, jam operasional, dan harga tiket.",
					},
					{
						title: "Gunakan AI Insight",
						description:
							"Setelah data tersedia, jalankan AI Insight untuk mengecek kesesuaian kategori dan deskripsi.",
					},
			  ]
			: [
					{
						title: "Lengkapi Operasional",
						description: `${context.withoutOperationalHoursCount} destinasi belum memiliki jam operasional lengkap.`,
					},
					{
						title: "Perkuat Informasi Harga",
						description: `${context.withoutPriceInfoCount} destinasi belum memiliki informasi harga tiket.`,
					},
					{
						title: "Manfaatkan AI Insight",
						description:
							context.avgAiScore !== null
								? `Rata-rata skor AI Insight ${context.avgAiScore}. Gunakan untuk menjaga kesesuaian kategori.`
								: "Jalankan AI Insight agar kategori dan deskripsi bisa dianalisis.",
					},
			  ],
	};
}

function safeParseRecommendation(content: string, fallback: any) {
	try {
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		if (!jsonMatch) return fallback;

		const parsed = JSON.parse(jsonMatch[0]);

		return {
			health: {
				score: Number(parsed.health?.score || fallback.health.score),
				label: String(parsed.health?.label || fallback.health.label),
				description: String(
					parsed.health?.description || fallback.health.description
				),
			},
			summary: String(parsed.summary || fallback.summary),
			priority: String(parsed.priority || fallback.priority),
			recommendations: Array.isArray(parsed.recommendations)
				? parsed.recommendations.slice(0, 3).map((item: any) => ({
						title: String(item.title || "Rekomendasi"),
						description: String(item.description || ""),
				  }))
				: fallback.recommendations,
		};
	} catch {
		return fallback;
	}
}

export async function GET(req: NextRequest) {
	try {
		const user = getUserFromCookie(req);

		if (!user) {
			return NextResponse.json(
				{ message: "User belum login." },
				{ status: 401 }
			);
		}

		if (user.role !== "PENGELOLA") {
			return NextResponse.json(
				{ message: "Akses ditolak." },
				{ status: 403 }
			);
		}

		const ownerFilter = {
			ownerId: Number(user.id),
			isDeleted: false,
		};

		const [
			totalDestinations,
			activeDestinations,
			pendingDestinations,
			revisionDestinations,
			canceledDestinations,
			destinations,
		] = await Promise.all([
			prisma.destination.count({ where: ownerFilter }),
			prisma.destination.count({
				where: { ...ownerFilter, status: "aktif" },
			}),
			prisma.destination.count({
				where: { ...ownerFilter, status: "pending" },
			}),
			prisma.destination.count({
				where: { ...ownerFilter, status: "butuh_perbaikan" },
			}),
			prisma.destination.count({
				where: { ...ownerFilter, status: "canceled" },
			}),
			prisma.destination.findMany({
				where: ownerFilter,
				select: {
					id: true,
					name: true,
					description: true,
					imageUrl: true,
					contact: true,
					openTime: true,
					closeTime: true,
					ticketPrice: true,
					maxPrice: true,
					website: true,
					status: true,
					aiAnalyses: {
						orderBy: { createdAt: "desc" },
						take: 1,
						select: {
							score: true,
							status: true,
							message: true,
						},
					},
				},
			}),
		]);

		const withoutImageCount = destinations.filter(
			(item) => !item.imageUrl || item.imageUrl.trim() === ""
		).length;

		const withoutContactCount = destinations.filter(
			(item) => !item.contact || item.contact.trim() === ""
		).length;

		const withoutOperationalHoursCount = destinations.filter(
			(item) => !item.openTime || !item.closeTime
		).length;

		const withoutPriceInfoCount = destinations.filter(
			(item) => item.ticketPrice === null && item.maxPrice === null
		).length;

		const withoutWebsiteCount = destinations.filter(
			(item) => !item.website || item.website.trim() === ""
		).length;

		const shortDescriptionCount = destinations.filter(
			(item) => item.description.trim().length < 120
		).length;

		const incompleteDataCount = destinations.filter((item) => {
			return (
				!item.imageUrl ||
				!item.contact ||
				!item.openTime ||
				!item.closeTime ||
				!item.website ||
				item.description.trim().length < 120
			);
		}).length;

		const aiScores = destinations
			.map((item) => item.aiAnalyses[0]?.score)
			.filter((score): score is number => typeof score === "number");

		const avgAiScore =
			aiScores.length > 0
				? Math.round(
						aiScores.reduce((total, score) => total + score, 0) /
							aiScores.length
				  )
				: null;

		const dataCompleteness =
			totalDestinations === 0
				? 0
				: Math.round(
					destinations.reduce((total, item) => {
					let score = 0;

					if (item.name?.trim()) score += 15;
					if (item.description?.trim().length >= 80) score += 20;
					if (item.imageUrl?.trim()) score += 15;
					if (item.contact?.trim()) score += 10;
					if (item.openTime && item.closeTime) score += 15;
					if (item.ticketPrice !== null && item.maxPrice !== null) score += 15;
					if (item.website?.trim()) score += 10;

					return total + score;
					}, 0) / totalDestinations
				);

		const managementHealthScore = 
		totalDestinations === 0
			? 0
			: Math.round(
			(avgAiScore || 80) * 0.6 +
				dataCompleteness * 0.25 +
				(activeDestinations / Math.max(totalDestinations, 1)) *
					100 *
					0.15
		);

		const lowAiScoreCount = aiScores.filter((score) => score < 60).length;

		const latestAiIssues = destinations
			.map((item) => item.aiAnalyses[0]?.message)
			.filter(Boolean)
			.slice(0, 5);

		const context = {
			totalDestinations,
			activeDestinations,
			pendingDestinations,
			revisionDestinations,
			canceledDestinations,

			managementHealthScore,
			dataCompleteness,

			withoutImageCount,
			withoutContactCount,
			withoutOperationalHoursCount,
			withoutPriceInfoCount,
			withoutWebsiteCount,
			shortDescriptionCount,
			incompleteDataCount,

			avgAiScore,
			lowAiScoreCount,
			latestAiIssues,
		};

		const fallback = getFallbackRecommendation(context);

		if (!process.env.GROQ_API_KEY_PENGELOLA) {
			return NextResponse.json({
				recommendation: fallback,
				context,
				source: "fallback_no_api_key",
			});
		}

		const systemPrompt = `
Kamu adalah Asisten Pengelolaan untuk dashboard pengelola wisata Kembara Bandung.

Tugasmu:
1. Analisis kesehatan pengelolaan destinasi.
2. Perhatikan status review, kelengkapan data, dan hasil AI Insight.
3. Tentukan prioritas paling penting bagi pengelola.
4. Berikan maksimal 3 rekomendasi konkret.

Prioritas rekomendasi:
1. Destinasi butuh perbaikan
2. Destinasi pending
3. AI Insight rendah
4. Data tidak lengkap
5. Website dan informasi tambahan

Aturan:
- Gunakan managementHealthScore sebagai health.score.
- Wajib sebutkan AI Insight jika avgAiScore tersedia.
- Jangan menentukan status destinasi.
- Status destinasi adalah keputusan admin.
- Jangan mengarang data di luar context.
- Gunakan bahasa Indonesia yang singkat, jelas, dan ramah.
- Fokus pada pengelola, bukan admin.
- Summary maksimal 2 kalimat.
- Priority maksimal 1 kalimat.
- Setiap recommendation maksimal 25 kata.

Format respons HARUS JSON object valid:
{
  "health": {
    "score": 85,
    "label": "Baik",
    "description": "Penjelasan singkat kesehatan pengelolaan berdasarkan status, kelengkapan data, dan AI Insight."
  },
  "summary": "Ringkasan kondisi maksimal 2 kalimat.",
  "priority": "Prioritas utama maksimal 1 kalimat.",
  "recommendations": [
    {
      "title": "Judul singkat maksimal 6 kata",
      "description": "Penjelasan maksimal 25 kata."
    }
  ]
}
`;

		let response: Response;

		try {
			response = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.GROQ_API_KEY_PENGELOLA}`,
					},
					body: JSON.stringify({
						model: "llama-3.1-8b-instant",
						temperature: 0.35,
						max_tokens: 800,
						messages: [
							{
								role: "system",
								content: systemPrompt,
							},
							{
								role: "user",
								content: `Context dashboard pengelola:\n${JSON.stringify(
									context,
									null,
									2
								)}`,
							},
						],
					}),
				}
			);
		} catch (error) {
			console.error("GROQ CONNECTION ERROR:", error);

			return NextResponse.json({
				recommendation: fallback,
				context,
				source: "fallback_connection_error",
			});
		}

		if (!response.ok) {
			console.error("GROQ API ERROR:", await response.text());

			return NextResponse.json({
				recommendation: fallback,
				context,
				source: "fallback_groq_error",
			});
		}

		const aiData = await response.json();
		const aiContent = aiData.choices?.[0]?.message?.content || "";

		return NextResponse.json({
			recommendation: safeParseRecommendation(aiContent, fallback),
			context,
			source: "llm",
		});
	} catch (error) {
		console.error("DASHBOARD RECOMMENDATION ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal membuat rekomendasi dashboard." },
			{ status: 500 }
		);
	}
}