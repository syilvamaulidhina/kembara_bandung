import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { destinationId, userId } = await req.json();

    await prisma.destinationView.create({
      data: {
        destinationId: Number(destinationId),
        userId: userId ? Number(userId) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mencatat kunjungan" }, { status: 500 });
  }
}