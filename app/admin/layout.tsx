"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Tags,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kelola-wisata", label: "Manajemen Wisata", icon: MapPin },
  { href: "/admin/kelola-pengguna", label: "Kelola Pengguna", icon: Users },
  { href: "/admin/kategori", label: "Kelola Kategori", icon: Tags },
  { href: "/admin/verifikasi-pengelola", label: "Verifikasi Pengelola", icon: ShieldCheck },
  { href: "/admin/verifikasi-event", label: "Verifikasi Event", icon: CalendarCheck },
  { href: "/admin/ai-insight", label: "AI Insight", icon: Sparkles },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role !== "ADMIN") {
        window.location.href = "/unauthorized";
        return;
      }
      setUser(u);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutDialog(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-[fadeScaleIn_0.2s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut size={26} className="text-red-500" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">Keluar dari Akun?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Kamu akan keluar dari sesi ini. Pastikan semua perubahan sudah tersimpan.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <img src="/images/logo.svg" alt="logo" className="w-32 h-auto" />
          <button
            className="ml-auto md:hidden text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 mb-2">
            {/* ← fix: pakai style inline supaya warna muncul */}
            <div
              style={{ backgroundColor: "#130F6A" }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
              {user ? getInitials(user.name) : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <header className="md:hidden flex items-center gap-3 bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <img src="/images/logo.svg" alt="logo" className="w-6 h-6" />
          <span className="font-bold text-gray-800 text-sm">Kembara Bandung</span>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
