"use client";
// lib/hooks/useGeolocation.ts
// Hook untuk mendapatkan lokasi GPS pengguna

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

export function useGeolocation(autoRequest = true) {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: autoRequest,
    permissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Browser Anda tidak mendukung GPS",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        let errorMsg = "Gagal mendapatkan lokasi";
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Akses lokasi ditolak. Aktifkan GPS untuk fitur lengkap.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = "Lokasi tidak tersedia saat ini";
        } else if (err.code === err.TIMEOUT) {
          errorMsg = "Waktu mendapatkan lokasi habis, coba lagi";
        }

        setState({
          location: null,
          error: errorMsg,
          loading: false,
          permissionDenied: err.code === err.PERMISSION_DENIED,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache 1 menit
      }
    );
  }, []);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return { ...state, requestLocation };
}
