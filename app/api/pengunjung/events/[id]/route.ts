import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID Event tidak valid" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findFirst({
      where: {
        id,
        isDeleted: false,
        status: "aktif",
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("GET EVENT DETAIL ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat event" },
      { status: 500 }
    );
  }
}
