import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // PUBLIC ROUTES
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") || // TAMBAHAN BARU
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/select-role" ||
    pathname === "/unauthorized" ||

    // TAMBAHAN BARU:
    // semua halaman pengunjung bisa diakses tanpa login
    pathname.startsWith("/pengunjung")
  ) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get("user");

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TAMBAHAN BARU:
  // supaya aman kalau cookie rusak / bukan JSON
  let user;

  try {
    user = JSON.parse(userCookie.value);
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { role } = user;

  if (!role || role === null) {
    return NextResponse.redirect(new URL("/select-role", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/pengelola")) {
    if (role !== "PENGELOLA") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // BAGIAN LAMA TETAP ADA
  // tapi sekarang /pengunjung sudah publik,
  // jadi blok ini sebenarnya tidak akan terpanggil
  if (pathname.startsWith("/pengunjung")) {
    if (role !== "WISATAWAN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};