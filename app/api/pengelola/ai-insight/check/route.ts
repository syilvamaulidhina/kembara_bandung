import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CategoryAnalysis = {
  categoryId: number;
  categoryName: string;
  isSelected: boolean;

  matchedKeywords: string[];
  nameMatchedKeywords: string[];
  descriptionMatchedKeywords: string[];

  matchCount: number;
  nameMatchCount: number;
  descriptionMatchCount: number;

  fieldScore: number;
};

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

function getUniqueKeywords(keywords: string[]) {
  return Array.from(new Set(keywords));
}

function roundScore(value: number) {
  return Math.round(value);
}

function getFieldScore(nameMatchCount: number, descriptionMatchCount: number) {
  const nameScore = nameMatchCount > 0 ? 50 : 0;
  const descriptionScore = descriptionMatchCount > 0 ? 50 : 0;

  return nameScore + descriptionScore;
}

function getStrongestCategory(analysis: CategoryAnalysis[]) {
  const sortedAnalysis = [...analysis].sort((a, b) => {
    if (b.fieldScore !== a.fieldScore) {
      return b.fieldScore - a.fieldScore;
    }

    return b.matchCount - a.matchCount;
  });

  return sortedAnalysis[0] && sortedAnalysis[0].fieldScore > 0
    ? sortedAnalysis[0]
    : null;
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

    const nameText = normalizeText(name);
    const descriptionText = normalizeText(description);

    const categories = await prisma.category.findMany({
      include: {
        keywords: true,
      },
    });

    const analysis: CategoryAnalysis[] = categories.map((category) => {
      const keywords = category.keywords.map((item) => item.keyword);

      const nameMatchedKeywords = findMatches(nameText, keywords);
      const descriptionMatchedKeywords = findMatches(descriptionText, keywords);

      const matchedKeywords = getUniqueKeywords([
        ...nameMatchedKeywords,
        ...descriptionMatchedKeywords,
      ]);

      const nameMatchCount = nameMatchedKeywords.length;
      const descriptionMatchCount = descriptionMatchedKeywords.length;
      const matchCount = matchedKeywords.length;

      const fieldScore = getFieldScore(nameMatchCount, descriptionMatchCount);

      return {
        categoryId: category.id,
        categoryName: category.name,
        isSelected: categoryIds.includes(category.id),

        matchedKeywords,
        nameMatchedKeywords,
        descriptionMatchedKeywords,

        matchCount,
        nameMatchCount,
        descriptionMatchCount,

        fieldScore,
      };
    });

    const selectedAnalysis = analysis.filter((item) => item.isSelected);

    const strongestCategory = getStrongestCategory(analysis);

    const selectedWithMatches = selectedAnalysis.filter(
      (item) => item.fieldScore > 0
    );

    const selectedWithoutMatches = selectedAnalysis.filter(
      (item) => item.fieldScore === 0
    );

    const unselectedStrongMatches = analysis.filter(
      (item) => !item.isSelected && item.fieldScore > 0
    );

    const totalSelectedCategories = selectedAnalysis.length;

    const selectedWithAnyEvidence = selectedAnalysis.filter(
      (item) => item.nameMatchCount > 0 || item.descriptionMatchCount > 0
    ).length;

    const coverageScore =
      totalSelectedCategories > 0
        ? (selectedWithAnyEvidence / totalSelectedCategories) * 100
        : 0;

    const selectedNameMatchCount = selectedAnalysis.reduce(
      (total, item) => total + item.nameMatchCount,
      0
    );

    const selectedDescriptionMatchCount = selectedAnalysis.reduce(
      (total, item) => total + item.descriptionMatchCount,
      0
    );

    const totalNameMatchCount = analysis.reduce(
      (total, item) => total + item.nameMatchCount,
      0
    );

    const totalDescriptionMatchCount = analysis.reduce(
      (total, item) => total + item.descriptionMatchCount,
      0
    );

    const nameDominanceScore =
      totalNameMatchCount > 0
        ? (selectedNameMatchCount / totalNameMatchCount) * 100
        : 0;

    const descriptionDominanceScore =
      totalDescriptionMatchCount > 0
        ? (selectedDescriptionMatchCount / totalDescriptionMatchCount) * 100
        : 0;

    const dominanceScore =
      nameDominanceScore * 0.5 + descriptionDominanceScore * 0.5;

    const nameSortedAnalysis = [...analysis].sort(
      (a, b) => b.nameMatchCount - a.nameMatchCount
    );

    const descriptionSortedAnalysis = [...analysis].sort(
      (a, b) => b.descriptionMatchCount - a.descriptionMatchCount
    );

    const strongestNameCategory =
      nameSortedAnalysis[0] && nameSortedAnalysis[0].nameMatchCount > 0
        ? nameSortedAnalysis[0]
        : null;

    const strongestDescriptionCategory =
      descriptionSortedAnalysis[0] &&
      descriptionSortedAnalysis[0].descriptionMatchCount > 0
        ? descriptionSortedAnalysis[0]
        : null;

    const nameAlignmentScore =
      strongestNameCategory &&
      categoryIds.includes(strongestNameCategory.categoryId)
        ? 100
        : 0;

    const descriptionAlignmentScore =
      strongestDescriptionCategory &&
      categoryIds.includes(strongestDescriptionCategory.categoryId)
        ? 100
        : 0;

    const strongestAlignmentScore =
      nameAlignmentScore * 0.5 + descriptionAlignmentScore * 0.5;

    const score = roundScore(
      coverageScore * 0.5 +
        dominanceScore * 0.3 +
        strongestAlignmentScore * 0.2
    );

    const status =
      score >= 75
        ? "konsisten"
        : score >= 60
        ? "perlu_perbaikan"
        : "inkonsisten";

    const message =
      status === "konsisten"
        ? "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih."
        : status === "perlu_perbaikan"
        ? `Sebagian kategori sudah sesuai, tetapi masih ada kategori yang belum memiliki kecocokan semantik${
            unselectedStrongMatches.length > 0
              ? ` dan konten juga mengarah ke ${unselectedStrongMatches[0].categoryName}`
              : ""
          }.`
        : strongestCategory
        ? `Data belum cukup selaras dengan kategori yang dipilih. Konten lebih mengarah ke ${strongestCategory.categoryName}.`
        : "Data belum cukup selaras dengan kategori yang dipilih.";

    return NextResponse.json({
      status,
      score,
      scoringDetail: {
        coverageScore: roundScore(coverageScore),
        dominanceScore: roundScore(dominanceScore),
        strongestAlignmentScore: roundScore(strongestAlignmentScore),
        formula:
          "score = (coverageScore * 0.5) + (dominanceScore * 0.3) + (strongestAlignmentScore * 0.2)",
        fieldFormula:
          "Kategori dianggap tercakup jika memiliki bukti pada nama atau deskripsi. Nama dan deskripsi tetap digunakan setara pada dominance dan alignment.",
        breakdown: {
          selectedWithAnyEvidence,
          totalSelectedCategories,
          nameDominanceScore: roundScore(nameDominanceScore),
          descriptionDominanceScore: roundScore(descriptionDominanceScore),
          nameAlignmentScore: roundScore(nameAlignmentScore),
          descriptionAlignmentScore: roundScore(descriptionAlignmentScore),
        },
      },
      selectedCategories: selectedAnalysis,
      selectedWithMatches,
      selectedWithoutMatches,
      strongestCategory,
      strongestNameCategory,
      strongestDescriptionCategory,
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