import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeText(text: string) {
  return text.toLowerCase().trim();
}

function findMatches(text: string, keywords: string[]) {
  return keywords.filter((keyword) =>
    text.includes(keyword.toLowerCase())
  );
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

    const allSelectedHaveMatches = selectedWithoutMatches.length === 0;

    const strongestIsSelected = strongestCategory
      ? categoryIds.includes(strongestCategory.categoryId)
      : false;

    const isConsistent =
      allSelectedHaveMatches &&
      selectedWithMatches.length > 0 &&
      strongestIsSelected;

    const isPartial =
      selectedWithMatches.length > 0 &&
      (!allSelectedHaveMatches || !strongestIsSelected);

    const status = isConsistent
      ? "konsisten"
      : isPartial
      ? "perlu_perbaikan"
      : "inkonsisten";

    const score = isConsistent ? 85 : isPartial ? 60 : 40;

    const message = isConsistent
      ? "Nama dan deskripsi cukup selaras dengan kategori wisata yang dipilih."
      : isPartial
      ? `Sebagian kategori sudah sesuai, tetapi ada kategori yang belum memiliki kecocokan semantik${
          unselectedStrongMatches.length > 0
            ? ` dan konten juga mengarah ke ${unselectedStrongMatches[0].categoryName}`
            : ""
        }.`
      : `Data belum menunjukkan kecocokan dengan kategori yang dipilih. Konten lebih mengarah ke ${strongestCategory.categoryName}.`;

    return NextResponse.json({
      status,
      score,
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