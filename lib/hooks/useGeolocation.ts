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

export function useGeolocation(autoRequest = true, watch = false) {
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

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        loading: false,
        permissionDenied: false,
      });
    };

    const handleError = (err: GeolocationPositionError) => {
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
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: watch ? 0 : 60000, // No cache if watching
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
      return () => {};
    }
  }, [watch]);

  useEffect(() => {
    let cleanup = () => {};
    if (autoRequest) {
      cleanup = requestLocation() || (() => {});
    }
    return cleanup;
  }, [autoRequest, requestLocation]);

  return { ...state, requestLocation };
}
