import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getUserFromCookie(req: NextRequest) {
  const userCookie = req.cookies.get("user");

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json(
        { message: "User belum login." },
        { status: 401 }
      );
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json(
        { message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        ownerId: Number(user.id),
        isDeleted: false,
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data event." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json(
        { message: "User belum login." },
        { status: 401 }
      );
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json(
        { message: "Akses ditolak." },
        { status: 403 }
      );
    }

    if (user.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { message: "Akun pengelola belum diverifikasi." },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (
      !body.name ||
      !body.description ||
      !body.bannerUrl ||
      !body.destinationId ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        {
          message:
            "Nama, banner event, destinasi, deskripsi, tanggal mulai, dan tanggal selesai wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (new Date(body.endDate) < new Date(body.startDate)) {
      return NextResponse.json(
        {
          message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.",
        },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.findFirst({
      where: {
        id: Number(body.destinationId),
        ownerId: Number(user.id),
        isDeleted: false,
      },
    });

    if (!destination) {
      return NextResponse.json(
        {
          message: "Destinasi tidak ditemukan atau bukan milik Anda.",
        },
        { status: 403 }
      );
    }

    const event = await prisma.event.create({
      data: {
        ownerId: Number(user.id),
        destinationId: Number(body.destinationId),

        name: body.name,
        description: body.description,
        bannerUrl: body.bannerUrl,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        contact: body.contact || null,
        registrationUrl: body.registrationUrl || null,

        status: "pending",
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan event." },
      { status: 500 }
    );
  }
}