// app/pengunjung/layout.tsx
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kembara Bandung – Jelajahi Wisata Bandung",
  description: "Temukan destinasi wisata terbaik di Bandung dengan peta interaktif, rencana perjalanan AI, dan ulasan wisatawan.",
};

export default function PengunjungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
