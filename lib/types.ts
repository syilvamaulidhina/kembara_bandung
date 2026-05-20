// lib/types.ts
// Tipe data yang digunakan di seluruh aplikasi wisatawan

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
  categories: {
    category: {
      id: number;
      name: string;
    };
  }[];
  // Computed fields
  distance?: number;       // jarak dalam km dari lokasi user
  isOpen?: boolean;        // apakah sedang buka
  averageRating?: number;  // rata-rata rating dari ulasan
  reviewCount?: number;    // jumlah ulasan
  isSaved?: boolean;       // apakah sudah disimpan user
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
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
  user: {
    id: number;
    name: string;
    photo: string | null;
  };
  destination: {
    id: number;
    name: string;
    imageUrl: string | null;
    address: string;
  };
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export type CategorySlug = "alam" | "budaya" | "kuliner" | "fashion" | "hotel" | "populer";

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  bgImage: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "alam",
    name: "Alam",
    description: "Pegunungan, Kawah, & Kebun Teh",
    icon: "🌿",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kawah_Putih.jpg/1280px-Kawah_Putih.jpg",
    color: "#16a34a",
  },
  {
    slug: "budaya",
    name: "Budaya",
    description: "Seni, Sejarah, & Arsitektur",
    icon: "🏛️",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Gedung_Sate.jpg/1280px-Gedung_Sate.jpg",
    color: "#d97706",
  },
  {
    slug: "kuliner",
    name: "Kuliner",
    description: "Lezatnya Masakan Khas Sunda",
    icon: "🍜",
    bgImage: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d6/70/8e/sate-kardjan.jpg?w=1200",
    color: "#dc2626",
  },
  {
    slug: "fashion",
    name: "Fashion",
    description: "Factory Outlet & Pasar Lokal",
    icon: "👗",
    bgImage: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/7a/54/8e/paris-van-java.jpg?w=1200",
    color: "#7c3aed",
  },
  {
    slug: "hotel",
    name: "Hotel",
    description: "Vila, Hotel, & Penginapan",
    icon: "🏨",
    bgImage: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/54/8e/trans-luxury.jpg?w=1200",
    color: "#0891b2",
  },
  {
    slug: "populer",
    name: "Populer",
    description: "Disukai Banyak Orang",
    icon: "❤️",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tangkuban_Parahu.jpg/1280px-Tangkuban_Parahu.jpg",
    color: "#e11d48",
  },
];

// Bandung area bounds untuk membatasi peta
export const BANDUNG_BOUNDS = {
  center: { lat: -6.9175, lng: 107.6191 } as const,
  zoom: 12,
  maxBounds: [
    [-7.35, 107.3],   // southwest
    [-6.55, 108.0],   // northeast
  ] as [[number, number], [number, number]],
};
