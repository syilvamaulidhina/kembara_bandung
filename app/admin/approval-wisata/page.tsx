"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Check, X, MapPin, Calendar, User, ArrowLeft, MessageSquareWarning } from "lucide-react";

type AiReasoning = {
  explanation: string;
  potentialIssue: string;
  suggestion: string;
};

type AiCategoryAnalysis = {
  categoryId: number;
  categoryName: string;
  isSelected: boolean;
  matchedKeywords: string[];
  matchCount: number;
};

type AiAnalysis = {
  score: number;
  status: string;
  message: string;
  createdAt?: string;
  strongestCategory?: AiCategoryAnalysis | null;
  selectedCategories?: AiCategoryAnalysis[];
  reasoning?: AiReasoning;
};

type RequestWisata = {
  id: number;
  nama: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  pengaju: string;
  tanggalPengajuan: string;
  status: "Pending" | "Disetujui" | "Butuh Perbaikan" | "Ditolak";
  imageUrl: string | null;
  adminFeedback: string | null;
  aiAnalysis: AiAnalysis | null;
};

export default function ApprovalWisataPage() {
  const [requests, setRequests] = useState<RequestWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestWisata | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "revision" | "rejected">("pending");
  const [processing, setProcessing] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approval-wisata");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === "pending") return r.status === "Pending";
    if (filter === "approved") return r.status === "Disetujui";
    if (filter === "revision") return r.status === "Butuh Perbaikan";
    if (filter === "rejected") return r.status === "Ditolak";
    return true;
  });

  const handleApprove = async (id: number) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/approval-wisata", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      await fetchRequests();
      setSelectedRequest(null);
      setRevisionMessage("");
      setErrorMessage("");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id: number) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/approval-wisata", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      });
      await fetchRequests();
      setSelectedRequest(null);
      setRevisionMessage("");
      setErrorMessage("");
    } finally {
      setProcessing(false);
    }
  };

  const handleRevision = async (id: number) => {
    if (!revisionMessage.trim()) {
      setErrorMessage("Pesan perbaikan wajib diisi.");
      return;
    }

    setProcessing(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/approval-wisata", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: "revision",
          feedback: revisionMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Gagal mengirim permintaan perbaikan.");
        return;
      }

      await fetchRequests();
      setSelectedRequest(null);
      setRevisionMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengirim permintaan perbaikan.");
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const tabs = [
    { key: "pending", label: "Pending", count: requests.filter((r) => r.status === "Pending").length, activeStyle: { backgroundColor: "#130F6A" }, activeClass: "text-white" },
    { key: "approved", label: "Disetujui", count: requests.filter((r) => r.status === "Disetujui").length, activeStyle: { backgroundColor: "#22c55e" }, activeClass: "text-white" },
    { key: "revision", label: "Butuh Perbaikan", count: requests.filter((r) => r.status === "Butuh Perbaikan").length, activeStyle: { backgroundColor: "#f97316" }, activeClass: "text-white" },
    { key: "rejected", label: "Ditolak", count: requests.filter((r) => r.status === "Ditolak").length, activeStyle: { backgroundColor: "#ef4444" }, activeClass: "text-white" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin/kelola-wisata" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={18} />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardCheck size={22} className="text-primary" />
              Approval Wisata
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola permintaan penambahan tempat wisata baru
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          {pendingCount} Pending
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            style={filter === tab.key ? tab.activeStyle : {}}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === tab.key
                ? tab.activeClass
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Tidak ada request wisata</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === "pending"
                  ? "Semua request sudah diproses"
                  : `Belum ada request dengan status ${filter === "approved" ? "disetujui" : "ditolak"}`}
              </p>
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="p-5 hover:bg-gray-50 transition cursor-pointer" onClick={() => { setSelectedRequest(r); setRevisionMessage(""); setErrorMessage(""); }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-800">{r.nama}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                        : r.status === "Disetujui" ? "bg-green-100 text-green-700"
                        : r.status === "Butuh Perbaikan" ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {r.lokasi}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {r.pengaju}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(r.tanggalPengajuan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Klik untuk detail</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Detail Request Wisata</h3>
              <button onClick={() => { setSelectedRequest(null); setRevisionMessage(""); setErrorMessage(""); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {selectedRequest.imageUrl && (
              <img src={selectedRequest.imageUrl} alt={selectedRequest.nama} className="w-full h-48 object-cover rounded-xl mb-5" />
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Nama Wisata</label>
                <p className="text-gray-800 font-medium mt-1">{selectedRequest.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Kategori</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedRequest.kategori}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                  <p className="mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRequest.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                      : selectedRequest.status === "Disetujui" ? "bg-green-100 text-green-700"
                      : selectedRequest.status === "Butuh Perbaikan" ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Lokasi</label>
                <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" /> {selectedRequest.lokasi}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Deskripsi</label>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{selectedRequest.deskripsi}</p>
              </div>
              {selectedRequest.aiAnalysis && (
                <div className="border-t border-gray-100 pt-5">
                  <label className="text-xs font-medium uppercase text-gray-500">
                    Hasil Evaluasi Data
                  </label>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-[#130F6A] p-4 text-white">
                      <p className="text-xs font-medium text-white/70">
                        Skor Domain Knowledge
                      </p>
                      <p className="mt-1 text-3xl font-bold text-orange-300">
                        {selectedRequest.aiAnalysis.score}/100
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Status Analisis
                      </p>
                      <p className="mt-1 font-bold text-gray-800">
                        {selectedRequest.aiAnalysis.status === "konsisten"
                          ? "Data Cukup Selaras"
                          : "Perlu Perbaikan"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Kategori Terkuat
                      </p>
                      <p className="mt-1 font-bold text-gray-800">
                        {selectedRequest.aiAnalysis.strongestCategory
                          ?.categoryName || "Tidak terdeteksi"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-800">
                      Kesimpulan Sistem
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {selectedRequest.aiAnalysis.message}
                    </p>
                  </div>

                  {selectedRequest.aiAnalysis.reasoning ? (
                    <div className="mt-3 space-y-3">
                      <div className="rounded-xl border border-gray-100 bg-white p-4">
                        <p className="text-sm font-bold text-gray-800">
                          Penalaran AI
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {
                            selectedRequest.aiAnalysis.reasoning
                              .explanation
                          }
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-orange-50 p-4">
                          <p className="text-sm font-bold text-orange-700">
                            Catatan Potensial
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            {
                              selectedRequest.aiAnalysis.reasoning
                                .potentialIssue
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-4">
                          <p className="text-sm font-bold text-green-700">
                            Saran Perbaikan
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            {
                              selectedRequest.aiAnalysis.reasoning
                                .suggestion
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      Reasoning AI belum tersedia untuk analisis ini.
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Pengaju</label>
                  <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                    <User size={16} className="text-gray-400" /> {selectedRequest.pengaju}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Tanggal Pengajuan</label>
                  <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {new Date(selectedRequest.tanggalPengajuan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            {selectedRequest.adminFeedback && (
              <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-orange-700">
                  <MessageSquareWarning size={16} /> Pesan Perbaikan
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {selectedRequest.adminFeedback}
                </p>
              </div>
            )}

            {selectedRequest.status === "Pending" && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <label className="text-xs font-medium uppercase text-gray-500">
                  Pesan Perbaikan
                </label>
                <textarea
                  value={revisionMessage}
                  onChange={(event) => {
                    setRevisionMessage(event.target.value);
                    setErrorMessage("");
                  }}
                  rows={4}
                  placeholder="Jelaskan data yang perlu diperbaiki oleh pengelola..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                {errorMessage && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button onClick={() => handleReject(selectedRequest.id)} disabled={processing} className="border border-red-200 text-red-600 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-60">
                    <X size={16} /> Tolak
                  </button>
                  <button onClick={() => handleRevision(selectedRequest.id)} disabled={processing} className="border border-orange-200 bg-orange-50 text-orange-700 rounded-xl py-2.5 text-sm font-medium hover:bg-orange-100 flex items-center justify-center gap-2 disabled:opacity-60">
                    <MessageSquareWarning size={16} /> Butuh Perbaikan
                  </button>
                  <button onClick={() => handleApprove(selectedRequest.id)} disabled={processing} style={{ backgroundColor: "#130F6A" }} className="text-white rounded-xl py-2.5 text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60">
                    {processing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                    Setujui
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}