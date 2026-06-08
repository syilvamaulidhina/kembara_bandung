
// app/api/pengunjung/navigasi-langsung/route.ts
// API untuk menyimpan destinasi tujuan navigasi langsung (tanpa itinerary)
// Digunakan saat klik "Rute ke Sini" dari halaman detail destinasi

import { NextRequest, NextResponse } from "next/server";

// GET – ambil destinasi tujuan navigasi langsung dari session/query
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destId = searchParams.get("destId");
  const destName = searchParams.get("destName");
  const destLat = searchParams.get("destLat");
  const destLng = searchParams.get("destLng");

  if (!destId || !destLat || !destLng) {
    return NextResponse.json({ success: false, error: "Parameter kurang" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: parseInt(destId),
      name: destName || "Destinasi",
      latitude: parseFloat(destLat),
      longitude: parseFloat(destLng),
    },
  });
}
