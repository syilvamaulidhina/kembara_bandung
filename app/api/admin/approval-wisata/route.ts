import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_ACTIONS = ["approve", "revision", "reject"] as const;
type ApprovalAction = (typeof VALID_ACTIONS)[number];

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        owner: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        aiAnalyses: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const requests = destinations.map((destination) => {
      const latestAnalysis = destination.aiAnalyses[0];

      const rawResult =
        latestAnalysis?.rawResult &&
        typeof latestAnalysis.rawResult === "object" &&
        !Array.isArray(latestAnalysis.rawResult)
          ? (latestAnalysis.rawResult as Record<string, unknown>)
          : {};

      return {
        id: destination.id,
        nama: destination.name,
        kategori:
          destination.categories
            .map((item) => item.category.name)
            .join(", ") || "Lainnya",
        lokasi: destination.address,
        deskripsi: destination.description,
        pengaju: destination.owner?.name || "Tidak diketahui",
        tanggalPengajuan: destination.updatedAt.toISOString(),
        imageUrl: destination.imageUrl || null,
        adminFeedback: destination.adminFeedback || null,

        aiAnalysis: latestAnalysis
          ? {
              ...rawResult,
              score: latestAnalysis.score,
              status: latestAnalysis.status,
              message: latestAnalysis.message,
              createdAt: latestAnalysis.createdAt.toISOString(),
            }
          : null,

        status:
          destination.status === "aktif"
            ? "Disetujui"
            : destination.status === "butuh_perbaikan"
              ? "Butuh Perbaikan"
              : destination.status === "canceled"
                ? "Ditolak"
                : "Pending",
      };
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET APPROVAL WISATA ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data approval wisata.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const id = Number(body.id);
    const action = body.action as ApprovalAction;
    const feedback =
      typeof body.feedback === "string" ? body.feedback.trim() : "";

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          message: "ID wisata tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          message: "Aksi approval tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (action === "revision" && !feedback) {
      return NextResponse.json(
        {
          message: "Pesan perbaikan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const existingDestination = await prisma.destination.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!existingDestination) {
      return NextResponse.json(
        {
          message: "Wisata tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const destination = await prisma.destination.update({
      where: {
        id,
      },
      data: {
        status:
          action === "approve"
            ? "aktif"
            : action === "revision"
              ? "butuh_perbaikan"
              : "canceled",

        adminFeedback: action === "revision" ? feedback : null,
      },
    });

    return NextResponse.json({
      success: true,
      status: destination.status,
      adminFeedback: destination.adminFeedback,
    });
  } catch (error) {
    console.error("PATCH APPROVAL WISATA ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal memperbarui status wisata.",
      },
      {
        status: 500,
      }
    );
  }
}