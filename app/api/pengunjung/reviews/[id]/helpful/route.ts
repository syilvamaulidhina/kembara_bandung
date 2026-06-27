import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reviewId = parseInt(params.id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { success: false, error: "ID ulasan tidak valid" },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyukai ulasan" },
      { status: 500 }
    );
  }
}
