"use client";

import { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { MapPin, LayoutGrid, Users, TrendingUp, CheckCircle } from "lucide-react";

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

// Data wisata dummy — nanti diganti real setelah merge role pengelola
const wisataDataDummy = [
  { id: 1, nama: "Kawah Putih", kategori: "Wisata Alam", lokasi: "Ciwidey, Bandung", lat: -7.1664, lng: 107.4024 },
  { id: 2, nama: "Farm House Lembang", kategori: "Wisata Hiburan", lokasi: "Lembang, Bandung", lat: -6.8145, lng: 107.6095 },
  { id: 3, nama: "Orchid Forest Cikole", kategori: "Wisata Alam", lokasi: "Lembang, Bandung", lat: -6.8003, lng: 107.6256 },
  { id: 4, nama: "Tebing Keraton", kategori: "Wisata Alam", lokasi: "Bandung", lat: -6.8523, lng: 107.6612 },
  { id: 5, nama: "Museum Geologi", kategori: "Wisata Edukasi", lokasi: "Bandung", lat: -6.9022, lng: 107.6188 },
  { id: 6, nama: "Dusun Bambu", kategori: "Wisata Alam", lokasi: "Lembang, Bandung", lat: -6.8272, lng: 107.5797 },
];

function SIGMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (window as any).L;
      const map = L.map(mapRef.current, {
        center: [-6.9175, 107.6191],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.attribution({ prefix: false }).addTo(map);

      if (!document.getElementById("sig-pulse-style")) {
        const style = document.createElement("style");
        style.id = "sig-pulse-style";
        style.textContent = `
          @keyframes pulse-red {
            0%, 100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.25), 0 2px 8px rgba(0,0,0,0.2); }
            50% { box-shadow: 0 0 0 7px rgba(239,68,68,0.08), 0 2px 8px rgba(0,0,0,0.2); }
          }
        `;
        document.head.appendChild(style);
      }

      if (!document.getElementById("sig-tooltip-style")) {
        const ts = document.createElement("style");
        ts.id = "sig-tooltip-style";
        ts.textContent = `
          .sig-tooltip {
            background: #fff !important;
            border: none !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
            padding: 6px 10px !important;
          }
          .sig-tooltip::before { display: none !important; }
          .leaflet-tooltip-top.sig-tooltip::before { display: none !important; }
        `;
        document.head.appendChild(ts);
      }

      const redDotIcon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:#EF4444;border:2.5px solid #fff;border-radius:50%;box-shadow:0 0 0 3px rgba(239,68,68,0.25),0 2px 8px rgba(0,0,0,0.25);animation:pulse-red 1.8s ease-in-out infinite;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      wisataDataDummy.forEach((w) => {
        const marker = L.marker([w.lat, w.lng], { icon: redDotIcon }).addTo(map);
        marker.on("click", () => setSelected(w));
        marker.bindTooltip(
          `<div style="font-size:12px;font-weight:600;color:#1F2937;">${w.nama}</div>
           <div style="font-size:11px;color:#6B7280;">${w.kategori}</div>`,
          { direction: "top", offset: [0, -8], className: "sig-tooltip" }
        );
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={16} className="text-red-500" />
              Peta SIG Wisata Bandung
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Titik merah = lokasi wisata yang sudah terdaftar di sistem
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm" />
            Terdaftar ({wisataDataDummy.length})
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="relative rounded-xl overflow-hidden border border-gray-100" style={{ height: "380px" }}>
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-sm text-gray-400 animate-pulse">Memuat peta...</div>
            </div>
          )}
          {selected && (
            <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 w-64" style={{ zIndex: 999 }}>
              <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{selected.nama}</p>
                  <p className="text-xs text-gray-400">{selected.kategori}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p><span className="text-gray-400">Lokasi:</span> <span className="font-medium text-gray-700">{selected.lokasi}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Wisata Terdaftar di Peta
        </p>
        <div className="space-y-2">
          {wisataDataDummy.slice(0, 4).map((w) => (
            <div key={w.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{w.nama}</span>
                <span className="text-gray-400 text-xs hidden sm:inline">· {w.lokasi}</span>
              </div>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Terdaftar</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [period, setPeriod] = useState("6 Bulan Terakhir");

  // ✅ Total pengguna dari DB (yang bisa real sekarang)
  const [totalPengguna, setTotalPengguna] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setTotalPengguna(data.totalPengguna || 0))
      .catch(() => setTotalPengguna(0))
      .finally(() => setLoadingStats(false));
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
        {/* Wisata Terdaftar - dummy dulu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <MapPin size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">–</p>
          <p className="text-sm text-gray-500 mt-1">Wisata Terdaftar</p>
          <p className="text-xs text-gray-400 mt-2">Tersedia setelah merge pengelola</p>
        </div>

        {/* Total Kategori - dummy dulu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
            <LayoutGrid size={20} className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">4</p>
          <p className="text-sm text-gray-500 mt-1">Total Kategori Wisata</p>
        </div>

        {/* Total Pengguna - real dari DB */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <Users size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {loadingStats ? "..." : totalPengguna?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Pengguna Wisatawan</p>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            Data real dari database
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Statistik Kunjungan</h2>
              <p className="text-xs text-gray-400 mt-0.5">Data dummy</p>
            </div>
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

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Kategori Wisata</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={kategoriData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
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

      {/* Peta SIG */}
      <SIGMap />
    </div>
  );
}