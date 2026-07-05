import { Gender } from "@/lib/generated/prisma";
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

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json({ message: "User belum login." }, { status: 401 });
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: Number(user.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        domisili: true,
        photo: true,
        verificationStatus: true,
        verificationDocument: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            destinations: true,
            events: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profil tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data profil." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user) {
      return NextResponse.json({ message: "User belum login." }, { status: 401 });
    }

    if (user.role !== "PENGELOLA") {
      return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
    }

    const body = await req.json();

    const name = cleanText(body.name);
    const gender = cleanText(body.gender);
    const domisili = cleanText(body.domisili);
    const photo = cleanText(body.photo);

    if (!name) {
      return NextResponse.json(
        { message: "Nama wajib diisi." },
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 100) {
      return NextResponse.json(
        { message: "Nama harus terdiri dari 3 sampai 100 karakter." },
        { status: 400 }
      );
    }

    let genderValue: Gender | null = null;

        if (gender === "LAKI_LAKI" || gender === "Laki-laki") {
        genderValue = Gender.LAKI_LAKI;
        }

        if (gender === "PEREMPUAN" || gender === "Perempuan") {
        genderValue = Gender.PEREMPUAN;
        }

    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        name,
        gender: genderValue,
        domisili: domisili || null,
        photo: photo || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        domisili: true,
        photo: true,
        verificationStatus: true,
      },
    });

    const response = NextResponse.json({
      message: "Profil berhasil diperbarui.",
      profile: updatedUser,
    });

    response.cookies.set(
      "user",
      JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        verificationStatus: updatedUser.verificationStatus,
        photo: updatedUser.photo,
      }),
      {
        path: "/",
        sameSite: "lax",
      }
    );

    return response;
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui profil." },
      { status: 500 }
    );
  }
}