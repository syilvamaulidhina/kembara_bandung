 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalPengguna = await prisma.user.count({
      where: { role: "WISATAWAN" },
    });

    return NextResponse.json({ totalPengguna });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil statistik" }, { status: 500 });
  }
}
