import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isDeleted: false },
      include: {
        owner: { select: { name: true } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const requests = destinations.map((d: any) => ({
      id: d.id,
      nama: d.name,
      kategori: d.categories[0]?.category?.name || "Lainnya",
      lokasi: d.address,
      deskripsi: d.description,
      pengaju: d.owner?.name || "Tidak diketahui",
      tanggalPengajuan: d.createdAt.toISOString(),
      imageUrl: d.imageUrl || null,
      status:
        d.status === "aktif"
          ? "Disetujui"
          : d.status === "canceled"
          ? "Ditolak"
          : "Pending",
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();

    await prisma.destination.update({
      where: { id },
      data: {
        status: action === "approve" ? "aktif" : "canceled",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal update status" }, { status: 500 });
  }
}