import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const events = await prisma.event.findMany({
      where: {
        isDeleted: false,
        status: status as "pending" | "aktif" | "ditolak" | "selesai",
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        destination: { select: { id: true, name: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("GET VERIFIKASI EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data event" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json(
        { message: "ID dan action wajib diisi" },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "aktif" : "ditolak";

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Event berhasil disetujui"
          : "Event berhasil ditolak",
      data: event,
    });
  } catch (error) {
    console.error("PATCH VERIFIKASI EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status event" },
      { status: 500 }
    );
  }
}
