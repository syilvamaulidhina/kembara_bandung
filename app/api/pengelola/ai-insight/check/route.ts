import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findMatches(text: string, keywords: string[]) {
  return keywords.filter((keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) return false;

    const pattern = new RegExp(
      `(^|\\s)${escapeRegex(normalizedKeyword)}(\\s|$)`,
      "i"
    );

    return pattern.test(text);
  });
}

function roundScore(value: number) {
  return Math.round(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map(Number).filter(Boolean)
      : [];

    const name = String(body.name || "");
    const description = String(body.description || "");

    if (categoryIds.length === 0 || !name.trim() || !description.trim()) {
      return NextResponse.json(
        { message: "Kategori, nama wisata, dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    const text = normalizeText(`${name} ${description}`);

    const categories = await prisma.category.findMany({
      include: {
        keywords: true,
      },
    });

    const analysis = categories.map((category) => {
      const keywords = category.keywords.map((item) => item.keyword);
      const matches = findMatches(text, keywords);
      const isSelected = categoryIds.includes(category.id);

      return {
        categoryId: category.id,
        categoryName: category.name,
        isSelected,
        matchedKeywords: matches,
        matchCount: matches.length,
      };
    });

    const selectedAnalysis = analysis.filter((item) => item.isSelected);

    const strongestCategory = [...analysis].sort(
      (a, b) => b.matchCount - a.matchCount
    )[0];

    const selectedWithMatches = selectedAnalysis.filter(
      (item) => item.matchCount > 0
    );

    const selectedWithoutMatches = selectedAnalysis.filter(
      (item) => item.matchCount === 0
    );

    const unselectedStrongMatches = analysis.filter(
      (item) => !item.isSelected && item.matchCount > 0
    );

    const totalSelectedCategories = selectedAnalysis.length;
    const totalSelectedWithMatches = selectedWithMatches.length;

    const selectedMatchCount = selectedAnalysis.reduce(
      (total, item) => total + item.matchCount,
      0
    );

    const totalMatchCount = analysis.reduce(
      (total, item) => total + item.matchCount,
      0
    );

    const coverageScore =
      totalSelectedCategories > 0
        ? (totalSelectedWithMatches / totalSelectedCategories) * 100
        : 0;

    const dominanceScore =
      totalMatchCount > 0 ? (selectedMatchCount / totalMatchCount) * 100 : 0;

    const strongestAlignmentScore =
      strongestCategory && categoryIds.includes(strongestCategory.categoryId)
        ? 100
        : 0;

    const score = roundScore(
      coverageScore * 0.5 +
        dominanceScore * 0.3 +
        strongestAlignmentScore * 0.2
    );

    const status =
      score >= 75 ? "konsisten" : score >= 60 ? "perlu_perbaikan" : "inkonsisten";

    const message =
      status === "konsisten"
        ? "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih."
        : status === "perlu_perbaikan"
        ? `Sebagian kategori sudah sesuai, tetapi masih ada kategori yang belum memiliki kecocokan semantik${
            unselectedStrongMatches.length > 0
              ? ` dan konten juga mengarah ke ${unselectedStrongMatches[0].categoryName}`
              : ""
          }.`
        : `Data belum cukup selaras dengan kategori yang dipilih${
            strongestCategory?.matchCount > 0
              ? `. Konten lebih mengarah ke ${strongestCategory.categoryName}`
              : ""
          }.`;

    return NextResponse.json({
      status,
      score,
      scoringDetail: {
        coverageScore: roundScore(coverageScore),
        dominanceScore: roundScore(dominanceScore),
        strongestAlignmentScore,
        formula:
          "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)",
      },
      selectedCategories: selectedAnalysis,
      selectedWithMatches,
      selectedWithoutMatches,
      strongestCategory,
      unselectedStrongMatches,
      allCategoryAnalysis: analysis,
      message,
    });
  } catch (error) {
    console.error("AI INSIGHT CHECK ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat menganalisis data" },
      { status: 500 }
    );
  }
}