"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  Users,
  MapPin,
  Star,
  RefreshCw,
  CheckCircle2,
  ImageOff,
  Filter,
  X,
} from "lucide-react";

type Insight = {
  id: number;
  type: "opportunity" | "warning" | "trend" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type Category = {
  id: string;
  name: string;
};

type RealData = {
  totalWisata: number;
  totalPengguna: number;
  wisataAktif: number;
  wisataNonAktif: number;
  tanpaKoordinat: number;
  tanpaFoto: number;
  totalTerfilter: number;
  kategoriSummary: {
    kategori: string;
    jumlah: number;
    persentase: number;
    avgRating: number;
  }[];
  topRated: {
    nama: string;
    kategori: string;
    rating: number;
    lokasi: string;
  }[];
};

type Periode = "all" | "7d" | "30d" | "90d" | "365d";

const PERIODE_OPTIONS: { value: Periode; label: string }[] = [
  { value: "all", label: "Semua Waktu" },
  { value: "7d", label: "7 Hari Terakhir" },
  { value: "30d", label: "30 Hari Terakhir" },
  { value: "90d", label: "3 Bulan Terakhir" },
  { value: "365d", label: "1 Tahun Terakhir" },
];

export default function AIInsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState<RealData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [kategoriId, setKategoriId] = useState<string>("ALL");
  const [periode, setPeriode] = useState<Periode>("all");

  const fetchInsights = async (opts?: { initial?: boolean }) => {
    if (opts?.initial) setLoading(true);
    else setAnalyzing(true);

    try {
      const res = await fetch("/api/admin/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_insights",
          filters: { kategoriId, periode },
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setInsights(result.insights || []);
        setData(result.data || null);
        if (result.categories) setCategories(result.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchInsights({ initial: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilter = () => {
    fetchInsights();
  };

  const handleResetFilter = () => {
    setKategoriId("ALL");
    setPeriode("all");
    setTimeout(() => fetchInsights(), 0);
  };

  const isFilterActive = kategoriId !== "ALL" || periode !== "all";

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "opportunity":
        return {
          bg: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
          icon: <CheckCircle2 size={20} className="text-emerald-600" />,
          label: "Peluang",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
          icon: <AlertCircle size={20} className="text-red-600" />,
          label: "Peringatan",
        };
      case "trend":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
          icon: <TrendingUp size={20} className="text-blue-600" />,
          label: "Tren",
        };
      case "recommendation":
        return {
          bg: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200",
          icon: <Lightbulb size={20} className="text-amber-600" />,
          label: "Rekomendasi",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          icon: <Sparkles size={20} className="text-gray-600" />,
          label: "Insight",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={22} className="text-primary" />
              AI Insight
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Analisis cerdas dari data wisata Kembara Bandung
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Menganalisis data real dari database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-primary" />
            AI Insight
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Analisis cerdas dari data wisata Kembara Bandung
          </p>
        </div>
        <button
          onClick={() => fetchInsights()}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={analyzing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary" />
          <h3 className="font-semibold text-gray-700 text-sm">Filter Analisis</h3>
          {isFilterActive && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Aktif
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Kategori Wisata</label>
            <select
              value={kategoriId}
              onChange={(e) => setKategoriId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Periode Waktu</label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value as Periode)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {PERIODE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilter}
              disabled={analyzing}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
            >
              Terapkan Filter
            </button>
            {isFilterActive && (
              <button
                onClick={handleResetFilter}
                disabled={analyzing}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition flex items-center gap-1"
                title="Reset filter"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {analyzing ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Menganalisis data sesuai filter...</p>
          </div>
        </div>
      ) : (
        <>
          {data && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <MapPin size={14} />
                  {isFilterActive ? "Wisata Sesuai Filter" : "Wisata Terdaftar"}
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {isFilterActive ? data.totalTerfilter : data.totalWisata}
                </p>
                <p className="text-xs text-green-500 mt-1">{data.wisataAktif} aktif (total)</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <Users size={14} />
                  Total Pengguna
                </div>
                <p className="text-2xl font-bold text-gray-800">{data.totalPengguna}</p>
                <p className="text-xs text-gray-400 mt-1">Wisatawan terdaftar</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <MapPin size={14} className="text-red-400" />
                  Belum Ada Koordinat
                </div>
                <p className="text-2xl font-bold text-gray-800">{data.tanpaKoordinat}</p>
                <p className="text-xs text-red-400 mt-1">Tidak muncul di peta</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <ImageOff size={14} className="text-yellow-500" />
                  Belum Ada Foto
                </div>
                <p className="text-2xl font-bold text-gray-800">{data.tanpaFoto}</p>
                <p className="text-xs text-yellow-500 mt-1">Perlu dilengkapi</p>
              </div>
            </div>
          )}

          {data && (data.kategoriSummary?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star size={16} className="text-primary" />
                Distribusi Kategori Wisata
                {isFilterActive && (
                  <span className="text-xs font-normal text-gray-400">(sesuai filter)</span>
                )}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.kategoriSummary.map((k) => (
                  <div key={k.kategori} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{k.kategori}</p>
                    <p className="text-xl font-bold text-gray-800">{k.jumlah}</p>
                    <p className="text-xs text-gray-400">{k.persentase}% · ⭐ {k.avgRating}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data && (data.topRated?.length ?? 0) > 0 ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                Top Wisata Rating Tertinggi
                {isFilterActive && (
                  <span className="text-xs font-normal text-gray-400">(sesuai filter)</span>
                )}
              </h3>
              <div className="space-y-3">
                {data.topRated.map((w, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{w.nama}</p>
                        <p className="text-xs text-gray-400">{w.kategori} · {w.lokasi}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-yellow-500">⭐ {w.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            isFilterActive && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center text-sm text-gray-400">
                Tidak ada wisata dengan review pada hasil filter ini.
              </div>
            )
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const config = getTypeConfig(insight.type);
              return (
                <div
                  key={insight.id}
                  className={`rounded-2xl p-5 border-2 ${config.bg} transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {config.label}
                        </span>
                        <h3 className="font-bold text-gray-800 mt-0.5">{insight.title}</h3>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                      {impactLabel(insight.impact)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                </div>
              );
            })}
          </div>

          {insights.some((i) => i.type === "recommendation") && (
            <div className="bg-gradient-to-br from-primary/5 to-indigo-50 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Target size={20} className="text-primary" />
                Langkah Aksi yang Disarankan
              </h3>
              <div className="space-y-3">
                {insights
                  .filter((i) => i.type === "recommendation")
                  .map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{rec.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function impactLabel(impact: string) {
  switch (impact) {
    case "high": return "Dampak Tinggi";
    case "medium": return "Dampak Sedang";
    case "low": return "Dampak Rendah";
    default: return impact;
  }
}