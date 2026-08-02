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
} from "lucide-react";

type Insight = {
  id: number;
  type: "opportunity" | "warning" | "trend" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
};

type RealData = {
  totalWisata: number;
  totalPengguna: number;
  wisataAktif: number;
  wisataNonAktif: number;
  tanpaKoordinat: number;
  tanpaFoto: number;
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

export default function AIInsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<RealData | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_insights" }),
      });
      const result = await res.json();
      if (res.ok) {
        setInsights(result.insights || []);
        setData(result.data || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  };

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
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
              <MapPin size={14} />
              Wisata Terdaftar
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.totalWisata}</p>
            <p className="text-xs text-green-500 mt-1">{data.wisataAktif} aktif</p>
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

      {data && (data.topRated?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            Top 3 Wisata Rating Tertinggi
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