import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ pastiin categoryIds array
    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map((id: unknown) => Number(id))
      : [];

    console.log("BODY:", body);
    console.log("CATEGORY IDS:", categoryIds);

    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        contact: body.contact,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        status: "pending",

        categories: {
          create: categoryIds.map((id: number) => ({
            categoryId: id,
          })),
        },
      },
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "error" },
      { status: 500 }
    );
  }
}