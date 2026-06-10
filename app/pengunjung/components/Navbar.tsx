"use client";
// app/pengunjung/components/Navbar.tsx

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, User, Menu, X, MapPin, Loader2 } from "lucide-react";
import KembaraLogo from "./KembaraLogo";

const navLinks = [
  { href: "/pengunjung", label: "Beranda" },
  { href: "/pengunjung/kategori", label: "Kategori" },
  { href: "/pengunjung/tersimpan", label: "Tersimpan" },
  { href: "/pengunjung/rencana", label: "Rencana" },
  { href: "/pengunjung/ulasan", label: "Ulasan" },
];

interface SearchResult {
  id: number;
  name: string;
  address: string;
  categories: { category: { name: string } }[];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const isActive = (href: string) => {
    if (href === "/pengunjung") return pathname === "/pengunjung";
    return pathname.startsWith(href);
  };

  // Live search dengan debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `/api/pengunjung/destinations?search=${encodeURIComponent(searchQuery)}&limit=6`
        );
        const json = await res.json();
        if (json.success) {
          setSearchResults(json.data);
          setShowDropdown(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectResult = (id: number) => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchOpen(false);
    router.push(`/pengunjung/destinasi/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setSearchOpen(false);
      router.push(`/pengunjung/kategori?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/pengunjung" className="flex items-center shrink-0">
            <KembaraLogo height={36} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-[#f97316] font-semibold border-b-2 border-[#f97316]"
                    : "text-gray-600 hover:text-[#006837] hover:bg-gray-50 rounded-lg"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setShowDropdown(false); }}
              className="p-2 rounded-lg text-gray-500 hover:text-[#006837] hover:bg-gray-50 transition-colors"
            >
              <Search size={20} />
            </button>
            <Link href="/auth/login" className="p-2 rounded-lg text-gray-500 hover:text-[#006837] hover:bg-gray-50 transition-colors">
              <User size={20} />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar + Dropdown */}
        {searchOpen && (
          <div className="pb-3" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex gap-2">
              <div className="flex-1 relative">
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 focus-within:border-[#006837] focus-within:ring-2 focus-within:ring-[#006837]/10 bg-white">
                  {searchLoading ? (
                    <Loader2 size={16} className="text-gray-400 animate-spin shrink-0" />
                  ) : (
                    <Search size={16} className="text-gray-400 shrink-0" />
                  )}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari tempat wisata di Bandung..."
                    className="flex-1 py-2.5 text-sm focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(""); setShowDropdown(false); }}>
                      <X size={14} className="text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Dropdown hasil */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSelectResult(result.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#006837]/10 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-[#006837]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{result.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{result.address}</p>
                        </div>
                        <span className="ml-auto text-xs text-gray-300 shrink-0">
                          {result.categories[0]?.category?.name}
                        </span>
                      </button>
                    ))}
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 text-xs text-[#006837] font-medium hover:bg-[#006837]/5 transition-colors text-center border-t border-gray-100"
                    >
                      Lihat semua hasil untuk "{searchQuery}" →
                    </button>
                  </div>
                )}

                {showDropdown && searchResults.length === 0 && !searchLoading && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 px-4 py-4 text-center text-sm text-gray-400">
                    Tidak ada hasil untuk "{searchQuery}"
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#006837] text-white rounded-xl text-sm font-semibold hover:bg-[#005229] transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#f97316]/10 text-[#f97316]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#006837]"
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
