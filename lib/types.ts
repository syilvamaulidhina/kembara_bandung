// lib/types.ts — UPDATED: 7 kategori baru

export interface DestinationWithCategory {
  id: number;
  name: string;
  description: string;
  address: string;
  contact: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  ticketPrice: number | null;
  maxPrice: number | null;
  website: string | null;
  visitCount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  categories: { category: { id: number; name: string } }[];
  distance?: number;
  isOpen?: boolean;
  averageRating?: number;
  reviewCount?: number;
  isSaved?: boolean;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  isReal: boolean;
}

export interface ItineraryItemWithDestination {
  id: number;
  order: number;
  visitTime: string | null;
  destination: DestinationWithCategory;
}

export interface ItineraryWithItems {
  id: number;
  title: string;
  totalDistance: number | null;
  estimatedTime: number | null;
  estimatedCost: number | null;
  isAiGenerated: boolean;
  createdAt: Date;
  items: ItineraryItemWithDestination[];
}

export interface ReviewWithUser {
  id: number;
  rating: number;
  comment: string | null;
  photoUrl: string | null;
  helpfulCount: number;
  createdAt: Date;
  user: { id: number; name: string; photo: string | null };
  destination: { id: number; name: string; imageUrl: string | null; address: string };
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export type CategorySlug =
  | "wisata-alam"
  | "wisata-budaya"
  | "wisata-kuliner"
  | "wisata-edukasi"
  | "wisata-hiburan"
  | "wisata-belanja"
  | "wisata-religi"
  | "populer";

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;           // nama kategori di DB (untuk query)
  displayName: string;    // nama tampil ke user
  description: string;
  icon: string;
  bgImage: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "wisata-alam",
    name: "Wisata Alam",
    displayName: "Wisata Alam",
    description: "Gunung, kawah, kebun teh & danau",
    icon: "🌿",
    bgImage: "/images/categories/alam.jpg",
    color: "#16a34a",
  },
  {
    slug: "wisata-budaya",
    name: "Wisata Budaya",
    displayName: "Wisata Budaya",
    description: "Seni, sejarah & arsitektur kolonial",
    icon: "🏛️",
    bgImage: "/images/categories/budaya.jpg",
    color: "#d97706",
  },
  {
    slug: "wisata-kuliner",
    name: "Wisata Kuliner",
    displayName: "Wisata Kuliner",
    description: "Kuliner khas Sunda & jajanan lokal",
    icon: "🍜",
    bgImage: "/images/categories/kuliner.jpg",
    color: "#dc2626",
  },
  {
    slug: "wisata-edukasi",
    name: "Wisata Edukasi",
    displayName: "Wisata Edukasi",
    description: "Museum, sains & belajar sambil jalan",
    icon: "🎓",
    bgImage: "/images/categories/edukasi.jpg",
    color: "#0891b2",
  },
  {
    slug: "wisata-hiburan",
    name: "Wisata Hiburan",
    displayName: "Wisata Hiburan",
    description: "Taman bermain, wahana & pertunjukan",
    icon: "🎡",
    bgImage: "/images/categories/hiburan.jpg",
    color: "#7c3aed",
  },
  {
    slug: "wisata-belanja",
    name: "Wisata Belanja",
    displayName: "Wisata Belanja",
    description: "Factory outlet, pasar & pusat belanja",
    icon: "🛍️",
    bgImage: "/images/categories/belanja.jpg",
    color: "#e11d48",
  },
  {
    slug: "wisata-religi",
    name: "Wisata Religi",
    displayName: "Wisata Religi",
    description: "Masjid bersejarah, vihara & pura",
    icon: "🕌",
    bgImage: "/images/categories/religi.jpg",
    color: "#b45309",
  },
  {
    slug: "populer",
    name: "Populer",
    displayName: "Populer",
    description: "Destinasi paling banyak dikunjungi",
    icon: "🔥",
    bgImage: "/images/categories/populer.jpg",
    color: "#f97316",
  },
];

// Helper: cari kategori berdasarkan slug
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

// Helper: cari kategori berdasarkan nama DB
export function getCategoryByName(name: string): CategoryInfo | undefined {
  return CATEGORIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

// Bandung area bounds
export const BANDUNG_BOUNDS = {
  center: { lat: -6.9175, lng: 107.6191 } as const,
  zoom: 12,
  maxBounds: [
    [-7.35, 107.2],
    [-6.4, 108.0],
  ] as [[number, number], [number, number]],
};
