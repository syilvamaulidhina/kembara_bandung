// lib/utils.ts
// Fungsi-fungsi helper yang digunakan di seluruh aplikasi

/**
 * Hitung jarak antara dua koordinat menggunakan formula Haversine
 * @returns Jarak dalam kilometer
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Format harga dalam Rupiah
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Tidak diketahui";
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format range harga
 */
export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined
): string {
  if ((min === null || min === undefined) && (max === null || max === undefined))
    return "Harga tidak tersedia";
  if (min === 0 && (max === 0 || max === null)) return "Gratis";
  if (min === max || max === null || max === undefined)
    return `Mulai ${formatRupiah(min)}`;
  return `${formatRupiah(min)} – ${formatRupiah(max)}`;
}

/**
 * Format jarak
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined) return "";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Cek apakah destinasi sedang buka berdasarkan jam sekarang (WIB)
 */
export function isOpenNow(openTime: string | null, closeTime: string | null): boolean {
  if (!openTime || !closeTime) return true; // Anggap buka jika tidak ada info
  
  const now = new Date();
  // Konversi ke WIB (UTC+7)
  const wibOffset = 7 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
  
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  
  // Handle 24 jam
  if (openMinutes === 0 && closeMinutes === 0) return true;
  if (openTime === "00:00" && closeTime === "23:59") return true;
  
  return wibMinutes >= openMinutes && wibMinutes <= closeMinutes;
}

/**
 * Format jam buka/tutup
 */
export function formatOperationalHours(
  openTime: string | null,
  closeTime: string | null
): string {
  if (!openTime || !closeTime) return "Buka Setiap Hari";
  if (openTime === "00:00" && closeTime === "23:59") return "Buka 24 Jam";
  return `${openTime} – ${closeTime} WIB`;
}

/**
 * Nearest Neighbor Algorithm untuk optimasi rute itinerary
 * Mengurutkan destinasi berdasarkan jarak terdekat secara greedy
 * dari titik awal (lokasi user)
 */
export function optimizeRoute(
  startLat: number,
  startLng: number,
  destinations: Array<{
    id: number;
    latitude: number;
    longitude: number;
    openTime?: string | null;
    closeTime?: string | null;
  }>
): Array<{ id: number; visitTime: string; distanceFromPrev: number }> {
  if (destinations.length === 0) return [];

  const unvisited = [...destinations];
  const result: Array<{ id: number; visitTime: string; distanceFromPrev: number }> = [];

  let currentLat = startLat;
  let currentLng = startLng;
  let currentMinutes = 8 * 60; // Mulai jam 08:00 WIB

  while (unvisited.length > 0) {
    // Cari destinasi terdekat dari posisi sekarang
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(
        currentLat,
        currentLng,
        unvisited[i].latitude,
        unvisited[i].longitude
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const nearest = unvisited.splice(nearestIdx, 1)[0];
    
    // Estimasi waktu perjalanan (asumsi rata-rata 40 km/jam di kota)
    const travelTimeMin = Math.round((nearestDist / 40) * 60);
    currentMinutes += travelTimeMin + 5; // +5 menit buffer

    // Sesuaikan jam kunjungan dengan jam buka
    if (nearest.openTime) {
      const [openH, openM] = nearest.openTime.split(":").map(Number);
      const openMinutes = openH * 60 + openM;
      if (currentMinutes < openMinutes) {
        currentMinutes = openMinutes;
      }
    }

    const visitHour = Math.floor(currentMinutes / 60);
    const visitMin = currentMinutes % 60;
    const visitTime = `${String(visitHour).padStart(2, "0")}:${String(visitMin).padStart(2, "0")}`;

    result.push({
      id: nearest.id,
      visitTime,
      distanceFromPrev: nearestDist,
    });

    currentLat = nearest.latitude;
    currentLng = nearest.longitude;
    currentMinutes += 90; // Estimasi 90 menit per destinasi
  }

  return result;
}

/**
 * Hitung total jarak rute
 */
export function calculateTotalDistance(
  startLat: number,
  startLng: number,
  destinations: Array<{ latitude: number; longitude: number }>
): number {
  if (destinations.length === 0) return 0;

  let total = 0;
  let prevLat = startLat;
  let prevLng = startLng;

  for (const dest of destinations) {
  total += calculateDistance(prevLat, prevLng, dest.latitude, dest.longitude);
    prevLat = dest.latitude;
    prevLng = dest.longitude;
  }

  return total;
}

/**
 * Format durasi dalam menit ke jam dan menit
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} jam`;
  return `${hours} jam ${mins} menit`;
}

/**
 * Buat URL gambar placeholder jika imageUrl null
 */
export function getImageUrl(imageUrl: string | null | undefined, name: string): string {
  if (imageUrl) return imageUrl;
  // Placeholder dengan nama destinasi
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=1a4731&color=ffffff&bold=true`;
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * BARU: format tanggal trip ke format Indonesia singkat
 * Contoh: 2026-07-12 -> "Sabtu, 12 Jul 2026"
 */
export function formatTripDate(date: string | Date | null | undefined): string {
  if (!date) return "Tanggal belum ditentukan";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * BARU: cek apakah dua koordinat berbeda cukup jauh (dalam km) untuk
 * dianggap "lokasi baru". Dipakai saat user menekan "Mulai Navigasi" untuk
 * menentukan apakah perlu menawarkan re-optimize rute pakai GPS terbaru.
 */
export function isLocationSignificantlyDifferent(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  thresholdKm: number = 1
): boolean {
  return calculateDistance(lat1, lng1, lat2, lng2) > thresholdKm;
}
