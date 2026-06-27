"use client";
// lib/hooks/useLocalUser.ts
// UPDATE: tambah fungsi logout, tambah field gender & domisili sesuai schema

import { useState, useEffect, useCallback } from "react";

interface LocalUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
  gender?: string | null;
  domisili?: string | null;
  photo?: string | null;
}

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(() => {
    fetch("/api/user/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Logout — panggil API logout yang sudah ada, lalu clear state
  const logout = useCallback(async () => {
    try {
      // Sesuaikan path ini dengan endpoint logout yang sudah ada di projectmu
      // Kemungkinan: /api/auth/logout atau /api/logout
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // Tetap lanjut logout client-side meski API gagal
      console.error("Logout API error:", e);
    } finally {
      setUser(null);
    }
  }, []);

  return { user, loading, isLoggedIn: !!user, logout };
}
