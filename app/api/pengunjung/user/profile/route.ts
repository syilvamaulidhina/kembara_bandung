// app/api/pengunjung/user/profile/route.ts
// Endpoint: PATCH /api/pengunjung/user/profile
// UPDATE: support edit nama dari halaman profil

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name } = body;

    if (!userId || typeof userId !== "number") {
      return NextResponse.json(
        { success: false, message: "userId tidak valid" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Nama tidak boleh kosong" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/pengunjung/user/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
