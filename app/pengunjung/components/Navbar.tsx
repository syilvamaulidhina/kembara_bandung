"use client";
// app/pengunjung/components/Navbar.tsx
// Navbar utama untuk halaman wisatawan

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/pengunjung", label: "Beranda" },
  { href: "/pengunjung/kategori", label: "Kategori" },
  { href: "/pengunjung/tersimpan", label: "Tersimpan" },
  { href: "/pengunjung/rencana", label: "Rencana" },
  { href: "/pengunjung/ulasan", label: "Ulasan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href === "/pengunjung") return pathname === "/pengunjung";
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/pengunjung/kategori?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/pengunjung" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a6b3c] to-[#f97316] flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-[#1a6b3c] text-lg leading-none block">Kembara</span>
              <span className="text-[#f97316] text-xs font-semibold leading-none">Bandung</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-[#f97316] font-semibold border-b-2 border-[#f97316] rounded-none"
                    : "text-gray-600 hover:text-[#1a6b3c] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-[#1a6b3c] hover:bg-gray-50 transition-colors"
              aria-label="Cari"
            >
              <Search size={20} />
            </button>

            {/* Profile button */}
            <Link
              href="/auth/login"
              className="p-2 rounded-lg text-gray-500 hover:text-[#1a6b3c] hover:bg-gray-50 transition-colors"
              aria-label="Profil"
            >
              <User size={20} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="pb-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari destinasi di Bandung..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1a6b3c] text-white rounded-xl text-sm font-medium hover:bg-[#155c33] transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#f97316]/10 text-[#f97316]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1a6b3c]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
