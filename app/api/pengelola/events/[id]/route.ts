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

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value?: string | null) {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getEventProgress(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "upcoming";
  if (now >= startDate && now <= endDate) return "ongoing";
  return "finished";
}

function getCountdownLabel(startDate: Date, endDate: Date) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (now > endDate) return "Event telah selesai";
  if (now >= startDate && now <= endDate) return "Sedang berlangsung";

  const diffDays = Math.ceil((startDate.getTime() - now.getTime()) / oneDay);

  if (diffDays <= 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  return `${diffDays} hari lagi`;
}

function serializeEvent(event: any) {
  return {
    ...event,
    progress: getEventProgress(event.startDate, event.endDate),
    countdown: getCountdownLabel(event.startDate, event.endDate),
  };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json({ message: "User belum login." }, { status: 401 });
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
    }

    const { id } = await context.params;
    const eventId = Number(id);

    if (Number.isNaN(eventId)) {
      return NextResponse.json({ message: "ID event tidak valid." }, { status: 400 });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        ownerId: Number(user.id),
        isDeleted: false,
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
            addressCity: true,
            imageUrl: true,
            status: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    return NextResponse.json({ event: serializeEvent(event) });
  } catch (error) {
    console.error("GET EVENT DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail event." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json({ message: "User belum login." }, { status: 401 });
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
    }

    if (user.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { message: "Akun pengelola belum diverifikasi." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const eventId = Number(id);

    if (Number.isNaN(eventId)) {
      return NextResponse.json({ message: "ID event tidak valid." }, { status: 400 });
    }

    const body = await req.json();

    const name = cleanText(body.name);
    const description = cleanText(body.description);
    const bannerUrl = cleanText(body.bannerUrl);
    const contact = cleanText(body.contact);
    const registrationUrl = cleanText(body.registrationUrl);
    const destinationId = Number(body.destinationId);
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (
      !name ||
      !description ||
      !bannerUrl ||
      !destinationId ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        {
          message:
            "Nama, poster event, destinasi, deskripsi, tanggal mulai, dan tanggal selesai wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 100) {
      return NextResponse.json(
        { message: "Nama event harus terdiri dari 3 sampai 100 karakter." },
        { status: 400 }
      );
    }

    if (description.length < 30) {
      return NextResponse.json(
        { message: "Deskripsi event minimal 30 karakter." },
        { status: 400 }
      );
    }

    if (Number.isNaN(destinationId)) {
      return NextResponse.json({ message: "Destinasi tidak valid." }, { status: 400 });
    }

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json(
        { message: "Format tanggal event tidak valid." },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai." },
        { status: 400 }
      );
    }

    if (registrationUrl && !isValidUrl(registrationUrl)) {
      return NextResponse.json(
        { message: "Link pendaftaran atau informasi event tidak valid." },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        ownerId: Number(user.id),
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    const destination = await prisma.destination.findFirst({
      where: {
        id: destinationId,
        ownerId: Number(user.id),
        isDeleted: false,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!destination) {
      return NextResponse.json(
        { message: "Destinasi tidak ditemukan atau bukan milik Anda." },
        { status: 403 }
      );
    }

    if (destination.status !== "aktif") {
      return NextResponse.json(
        { message: "Event hanya dapat dikaitkan dengan destinasi yang sudah aktif." },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        description,
        bannerUrl,
        destinationId,
        startDate,
        endDate,
        contact: contact || null,
        registrationUrl: registrationUrl || null,
        status: "pending",
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            address: true,
            addressCity: true,
            imageUrl: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Event berhasil diperbarui dan menunggu verifikasi ulang admin.",
      event: serializeEvent(updatedEvent),
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui event." },
      { status: 500 }
    );
  }
}