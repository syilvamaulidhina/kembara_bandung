// lib/hooks/useCategories.ts
// Hook untuk fetch kategori dari DB (dibuat admin)
// UPDATE: support langsung ke destinasi

import { useState, useEffect } from "react";

export interface DbCategory {
  id: number;
  name: string;
  _count: { destinations: number };
}

// Mapping nama kategori → warna & icon (fallback kalau tidak ada di DB config)
// Tambahkan entri baru di sini kalau admin buat kategori dengan nama baru
const CATEGORY_STYLE_MAP: Record<
  string,
  { color: string; icon: string; bgImage: string }
> = {
  "Wisata Alam": {
    color: "#16a34a",
    icon: "🌿",
    bgImage: "/images/categories/alam.jpg",
  },
  "Wisata Budaya": {
    color: "#7c3aed",
    icon: "🏛️",
    bgImage: "/images/categories/budaya.jpg",
  },
  "Wisata Kuliner": {
    color: "#ea580c",
    icon: "🍜",
    bgImage: "/images/categories/kuliner.jpg",
  },
  "Wisata Belanja": {
    color: "#0284c7",
    icon: "🛍️",
    bgImage: "/images/categories/belanja.jpg",
  },
  "Wisata Religi": {
    color: "#ca8a04",
    icon: "🕌",
    bgImage: "/images/categories/religi.jpg",
  },
  "Wisata Edukasi": {
    color: "#0891b2",
    icon: "📚",
    bgImage: "/images/categories/edukasi.jpg",
  },
  "Wisata Petualangan": {
    color: "#dc2626",
    icon: "🧗",
    bgImage: "/images/categories/petualangan.jpg",
  },
  "Wisata Hiburan": {
    color: "#ec4899",
    icon: "🎢",
    bgImage: "/images/categories/hiburan.jpg",
  },
  "Hiburan": {
    color: "#ec4899",
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
  return CATEGORY_STYLE_MAP[name] ?? CATEGORY_STYLE_MAP["default"];
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
