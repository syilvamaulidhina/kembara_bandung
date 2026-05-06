import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // cek user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    // handle admin khusus
    let role = user.role;

    if (email === "admin@kembara.com") {
      role = "ADMIN";
    }

    // buat response
    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });

    // 🔥 simpan cookie (dipakai middleware)
    response.cookies.set(
      "user",
      JSON.stringify({
        id: user.id,
        role,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 hari
      }
    );

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}