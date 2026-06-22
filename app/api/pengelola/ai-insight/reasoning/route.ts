import { NextRequest, NextResponse } from "next/server";

function getFallbackReasoning(analysisResult: any) {
	const selectedCategories =
		analysisResult?.selectedCategories
			?.map((item: any) => item.categoryName)
			?.join(", ") || "kategori yang dipilih";

	const strongestCategory =
		analysisResult?.strongestCategory?.categoryName || "tidak terdeteksi";

	const selectedKeywords =
		analysisResult?.selectedCategories?.flatMap(
			(item: any) => item.matchedKeywords || []
		) || [];

	return {
		explanation:
			selectedKeywords.length > 0
				? `Kategori ${selectedCategories} memiliki bukti kecocokan dari keyword seperti ${selectedKeywords
						.slice(0, 5)
						.join(", ")}.`
				: `Kategori ${selectedCategories} belum memiliki bukti keyword yang kuat dari nama atau deskripsi.`,
		potentialIssue:
			analysisResult?.unselectedStrongMatches?.length > 0
				? `Konten juga mengarah ke kategori ${analysisResult.unselectedStrongMatches[0].categoryName}, sehingga kategori tambahan dapat dipertimbangkan.`
				: `Kategori terdeteksi utama adalah ${strongestCategory}.`,
		suggestion:
			"Perjelas deskripsi dengan menambahkan daya tarik utama, aktivitas wisata, fasilitas, dan karakteristik yang sesuai dengan kategori.",
	};
}

function safeParseReasoning(content: string, fallback: any) {
	try {
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		if (!jsonMatch) return fallback;

		const parsed = JSON.parse(jsonMatch[0]);

		return {
			explanation: String(parsed.explanation || fallback.explanation),
			potentialIssue: String(
				parsed.potentialIssue || fallback.potentialIssue
			),
			suggestion: String(parsed.suggestion || fallback.suggestion),
		};
	} catch {
		return fallback;
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const analysisResult = body.analysisResult;

		if (!analysisResult) {
			return NextResponse.json(
				{ message: "Hasil analisis wajib dikirim." },
				{ status: 400 }
			);
		}

		const fallback = getFallbackReasoning(analysisResult);

		if (!process.env.GROQ_API_KEY_PENGELOLA) {
			return NextResponse.json({
				reasoning: fallback,
				source: "fallback_no_api_key",
			});
		}

		const systemPrompt = `
Kamu adalah AI Reasoning Assistant untuk sistem Kembara Bandung.

Tugasmu:
- Menjelaskan hasil analisis domain knowledge dalam bahasa manusia.
- Jangan mengubah skor.
- Jangan menentukan status destinasi.
- Jangan menentukan keputusan admin.
- Jangan mengarang data di luar analysisResult.
- Fokus pada kesesuaian kategori, keyword, potensi masalah, dan saran perbaikan.

Format respons HARUS JSON valid:
{
  "explanation": "Penjelasan kenapa data dianggap sesuai/tidak sesuai berdasarkan keyword dan kategori.",
  "potentialIssue": "Potensi masalah atau kategori lain yang mungkin muncul.",
  "suggestion": "Saran perbaikan nama/deskripsi agar lebih sesuai."
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
						max_tokens: 700,
						messages: [
							{ role: "system", content: systemPrompt },
							{
								role: "user",
								content: `analysisResult:\n${JSON.stringify(
									analysisResult,
									null,
									2
								)}`,
							},
						],
					}),
				}
			);
		} catch (error) {
			console.error("AI REASONING CONNECTION ERROR:", error);

			return NextResponse.json({
				reasoning: fallback,
				source: "fallback_connection_error",
			});
		}

		if (!response.ok) {
			console.error("AI REASONING API ERROR:", await response.text());

			return NextResponse.json({
				reasoning: fallback,
				source: "fallback_groq_error",
			});
		}

		const aiData = await response.json();
		const content = aiData.choices?.[0]?.message?.content || "";

		return NextResponse.json({
			reasoning: safeParseReasoning(content, fallback),
			source: "llm",
		});
	} catch (error) {
		console.error("AI REASONING ERROR:", error);

		return NextResponse.json(
			{ message: "Gagal membuat reasoning AI." },
			{ status: 500 }
		);
	}
}