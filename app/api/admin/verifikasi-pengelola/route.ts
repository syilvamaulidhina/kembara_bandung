import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const users = await prisma.user.findMany({
    where: {
      role: "PENGELOLA",
      verificationStatus: status as any,
    },
    select: {
      id: true,
      name: true,
      email: true,
      verificationStatus: true,
      verificationDocument: true,
      rejectionReason: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const { userId, action, rejectionReason } = await req.json();

  if (!userId || !action) {
    return NextResponse.json({ error: "userId dan action wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: action === "approve" ? "APPROVED" : "REJECTED",
      ...(action === "reject" && { rejectionReason }),
    },
  });

  return NextResponse.json({ success: true, user });
}