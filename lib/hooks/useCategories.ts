// lib/hooks/useCategories.ts
// Hook untuk fetch kategori dari DB (dibuat admin)
// UPDATE: support langsung ke destinasi

import { useState, useEffect } from "react";

export interface DbCategory {
  id: number;
  name: string;
  _count: { destinations: number };
}

// Fungsi hash string untuk menghasilkan warna yang konsisten
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs(Math.sin(hash) * 16777215)).toString(16);
  return "#" + color.padStart(6, "0");
}

// Mapping nama kategori → warna & icon (fallback kalau tidak ada di DB config)
// Tambahkan entri baru di sini kalau admin buat kategori dengan nama baru
const CATEGORY_STYLE_MAP: Record<
  string,
  { color: string; icon: string; bgImage: string }
> = {
  "Wisata Alam": {
    color: "#16a34a", // Hijau
    icon: "🌿",
    bgImage: "/images/categories/alam.jpg",
  },
  "Wisata Budaya": {
    color: "#7c3aed", // Ungu
    icon: "🏛️",
    bgImage: "/images/categories/budaya.jpg",
  },
  "Wisata Kuliner": {
    color: "#ea580c", // Oranye
    icon: "🍜",
    bgImage: "/images/categories/kuliner.jpg",
  },
  "Wisata Belanja": {
    color: "#ec4899", // Pink
    icon: "🛍️",
    bgImage: "/images/categories/belanja.jpg",
  },
  "Wisata Religi": {
    color: "#0ea5e9", // Biru
    icon: "🕌",
    bgImage: "/images/categories/religi.jpg",
  },
  "Wisata Edukasi": {
    color: "#eab308", // Kuning
    icon: "📚",
    bgImage: "/images/categories/edukasi.jpg",
  },
  "Wisata Petualangan": {
    color: "#dc2626",
    icon: "🧗",
    bgImage: "/images/categories/petualangan.jpg",
  },
  "Wisata Hiburan": {
    color: "#ef4444", // Merah
    icon: "🎢",
    bgImage: "/images/categories/hiburan.jpg",
  },
  "Hiburan": {
    color: "#ef4444",
    icon: "🎢",
    bgImage: "/images/categories/hiburan.jpg",
  },
  // Fallback default
  default: {
    color: "#6b7280",
    icon: "📍",
    bgImage: "/images/categories/default.jpg",
  },
};

// Konversi nama kategori ke slug URL
export function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getCategoryStyle(name: string) {
  if (CATEGORY_STYLE_MAP[name]) {
    return CATEGORY_STYLE_MAP[name];
  }
  // Dinamis berdasar kategori baru
  return {
    ...CATEGORY_STYLE_MAP["default"],
    color: stringToColor(name),
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/pengunjung/categories");
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        } else {
          setError("Gagal memuat kategori");
        }
      } catch (e) {
        setError("Gagal memuat kategori");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
