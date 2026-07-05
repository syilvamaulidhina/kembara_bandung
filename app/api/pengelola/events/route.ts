import { prisma } from "@/lib/prisma";
import { EventStatus, Prisma } from "@/lib/generated/prisma";
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

function isValidUrl(value?: string | null) {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

  if (now >= startDate && now <= endDate) {
    return "Sedang berlangsung";
  }

  const diffDays = Math.ceil(
    (startDate.getTime() - now.getTime()) / oneDay
  );

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

    const { searchParams } = new URL(req.url);

    const search = cleanText(searchParams.get("search"));
    const status = cleanText(searchParams.get("status"));
    const destinationId = Number(searchParams.get("destinationId"));
    const sort = searchParams.get("sort") || "latest";

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 8, 1),
      50
    );
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      ownerId: Number(user.id),
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          destination: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (status && status !== "semua") {
      where.status = status as EventStatus;
    }

    if (!Number.isNaN(destinationId) && destinationId > 0) {
      where.destinationId = destinationId;
    }

    let orderBy: Prisma.EventOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "name_asc") orderBy = { name: "asc" };
    if (sort === "name_desc") orderBy = { name: "desc" };
    if (sort === "start_asc") orderBy = { startDate: "asc" };
    if (sort === "start_desc") orderBy = { startDate: "desc" };

    const baseWhere: Prisma.EventWhereInput = {
      ownerId: Number(user.id),
      isDeleted: false,
    };

    const [
      events,
      totalFiltered,
      total,
      pending,
      aktif,
      ditolak,
      selesai,
      destinations,
    ] = await Promise.all([
      prisma.event.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),

      prisma.event.count({ where }),

      prisma.event.count({ where: baseWhere }),

      prisma.event.count({
        where: {
          ...baseWhere,
          status: "pending",
        },
      }),

      prisma.event.count({
        where: {
          ...baseWhere,
          status: "aktif",
        },
      }),

      prisma.event.count({
        where: {
          ...baseWhere,
          status: "ditolak",
        },
      }),

      prisma.event.count({
        where: {
          ...baseWhere,
          status: "selesai",
        },
      }),

      prisma.destination.findMany({
        where: {
          ownerId: Number(user.id),
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      summary: {
        total,
        pending,
        aktif,
        ditolak,
        selesai,
      },
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      destinations,
      events: events.map(serializeEvent),
    });
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
      return NextResponse.json(
        { message: "Destinasi tidak valid." },
        { status: 400 }
      );
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
        { message: "Event hanya dapat dibuat untuk destinasi yang sudah aktif." },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        ownerId: Number(user.id),
        destinationId,
        name,
        description,
        bannerUrl,
        startDate,
        endDate,
        contact: contact || null,
        registrationUrl: registrationUrl || null,
        status: "pending",
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

    return NextResponse.json(
      {
        message: "Event berhasil ditambahkan dan menunggu verifikasi admin.",
        event: serializeEvent(event),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan event." },
      { status: 500 }
    );
  }
}