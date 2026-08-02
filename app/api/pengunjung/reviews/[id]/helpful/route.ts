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

    let action = 'like';
    let userId = null;
    try {
      const body = await request.json();
      if (body && body.action === 'unlike') {
        action = 'unlike';
      }
      if (body && body.userId) {
        userId = parseInt(body.userId);
      }
    } catch (e) {
      // Body might be empty
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID wajib disertakan" },
        { status: 400 }
      );
    }

    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId
        }
      }
    });

    if (action === 'like') {
      if (existingLike) {
        return NextResponse.json({ success: true, message: "Sudah disukai" });
      }
      await prisma.$transaction([
        prisma.reviewLike.create({ data: { userId, reviewId } }),
        prisma.review.update({
          where: { id: reviewId },
          data: { helpfulCount: { increment: 1 } }
        })
      ]);
    } else {
      if (!existingLike) {
        return NextResponse.json({ success: true, message: "Belum disukai" });
      }
      await prisma.$transaction([
        prisma.reviewLike.delete({ where: { id: existingLike.id } }),
        prisma.review.update({
          where: { id: reviewId },
          data: { helpfulCount: { decrement: 1 } }
        })
      ]);
    }

    const updatedReview = await prisma.review.findUnique({ where: { id: reviewId } });

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyukai ulasan" },
      { status: 500 }
    );
  }
}
