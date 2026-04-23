"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MapPin, LayoutGrid, Users, TrendingUp } from "lucide-react";

const visitData = [
  { bulan: "Jan", kunjungan: 3000 },
  { bulan: "Feb", kunjungan: 4000 },
  { bulan: "Mar", kunjungan: 5200 },
  { bulan: "Apr", kunjungan: 2400 },
  { bulan: "Mei", kunjungan: 3600 },
  { bulan: "Jun", kunjungan: 4100 },
];

const kategoriData = [
  { name: "Wisata Alam", value: 40, color: "#F59E0B" },
  { name: "Wisata Kuliner", value: 20, color: "#10B981" },
  { name: "Wisata Edukasi", value: 20, color: "#EF4444" },
  { name: "Wisata Hiburan", value: 20, color: "#8B5CF6" },
];

const topWisata = [
  { nama: "Kawah Putih", pengunjung: "3.000", image: "/images/kawah_putih.png" },
  { nama: "Farm House Lembang", pengunjung: "2.000", image: "/images/farmhouse.png" },
  { nama: "Orchid Forest", pengunjung: "1.500", image: "/images/orchid.png" },
];

const stats = [
  { label: "Wisata Terdaftar", value: "9,812", icon: MapPin, color: "text-red-500", bg: "bg-red-50", trend: "+50 kali lebih banyak minggu ini" },
  { label: "Total Kategori Wisata", value: "12", icon: LayoutGrid, color: "text-orange-500", bg: "bg-orange-50", trend: null },
  { label: "Pengguna", value: "5,760", icon: Users, color: "text-green-500", bg: "bg-green-50", trend: "+50 kali lebih banyak minggu ini" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [period, setPeriod] = useState("6 Bulan Terakhir");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutGrid size={22} className="text-primary" />
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hai {user?.name || "Admin"}, Lihat statistik Kembara Bandung!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0] || "A"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              {stat.trend && (
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.trend}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Statistik Kunjungan</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none"
            >
              <option>6 Bulan Terakhir</option>
              <option>3 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={visitData} barSize={32}>
              <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                cursor={{ fill: "#F4F6FB" }}
              />
              <Bar dataKey="kunjungan" fill="#3B4FD8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Kategori Wisata</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={kategoriData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {kategoriData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {kategoriData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.value}% {item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Wisata */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">Tempat Paling Banyak Dikunjungi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topWisata.map((w) => (
            <div key={w.nama} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={w.image}
                  alt={w.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/56";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{w.nama}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Users size={11} />
                  {w.pengunjung} Pengunjung harian
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}