"use client";
// lib/hooks/useLocalUser.ts
// Hook untuk membaca sesi user dari localStorage (diteruskan dari sistem auth yang sudah ada)
// Menggunakan session/cookie yang sudah dibuat oleh modul auth

import { useState, useEffect } from "react";

interface LocalUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Coba ambil data user dari API /api/user/me yang sudah ada
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

  return { user, loading, isLoggedIn: !!user };
}
