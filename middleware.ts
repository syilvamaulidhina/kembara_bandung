import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/images") ||
		pathname === "/favicon.ico" ||
		pathname === "/login" ||
		pathname === "/register" ||
		pathname === "/select-role" ||
		pathname === "/unauthorized"
	) {
		return NextResponse.next();
	}

	const userCookie = request.cookies.get("user");

	if (!userCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	let user;

	try {
		user = JSON.parse(userCookie.value);
	} catch {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("user");
		return response;
	}

	const { role, verificationStatus } = user;

	if (!role) {
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

		const isVerificationPage = pathname.startsWith("/pengelola/verifikasi");

		if (verificationStatus !== "APPROVED" && !isVerificationPage) {
			return NextResponse.redirect(
				new URL("/pengelola/verifikasi", request.url)
			);
		}

		if (verificationStatus === "APPROVED" && isVerificationPage) {
			return NextResponse.redirect(new URL("/pengelola", request.url));
		}
	}

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