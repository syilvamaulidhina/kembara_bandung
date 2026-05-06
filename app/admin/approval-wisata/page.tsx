"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Check, X, MapPin, Star, Calendar, User } from "lucide-react";

type RequestWisata = {
  id: number;
  nama: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  rating: number;
  pengaju: string;
  tanggalPengajuan: string;
  status: "Pending" | "Disetujui" | "Ditolak";
};

const initialRequests: RequestWisata[] = [
  {
    id: 1,
    nama: "Guru Bumi Lembang",
    kategori: "Wisata Edukasi",
    lokasi: "Lembang, Bandung Barat",
    deskripsi: "Wisata edukasi pertanian dan alam dengan berbagai aktivitas seperti petik strawberry, menanam sayuran organik, dan belajar tentang ekosistem alam.",
    rating: 0,
    pengaju: "Budi Santoso",
    tanggalPengajuan: "2026-04-20",
    status: "Pending",
  },
  {
    id: 2,
    nama: "Ranca Upas Ciwidey",
    kategori: "Wisata Alam",
    lokasi: "Ciwidey, Bandung",
    deskripsi: "Kawasan camping ground dengan pemandangan danau dan hutan pinus. Cocok untuk aktivitas outdoor dan fotografi.",
    rating: 0,
    pengaju: "Siti Aminah",
    tanggalPengajuan: "2026-04-19",
    status: "Pending",
  },
  {
    id: 3,
    nama: "Paris Van Java",
    kategori: "Wisata Hiburan",
    lokasi: "Cihampelas, Bandung",
    deskripsi: "Pusat perbelanjaan dengan konsep outdoor shopping mall pertama di Bandung. Menyajikan pengalaman belanja yang unik dengan suasana terbuka.",
    rating: 0,
    pengaju: "Ahmad Rizki",
    tanggalPengajuan: "2026-04-18",
    status: "Pending",
  },
  {
    id: 4,
    nama: "Curug Malela",
    kategori: "Wisata Alam",
    lokasi: "Cikalongwetan, Bandung Barat",
    deskripsi: "Air terjun setinggi 70 meter dengan pemandangan spektakuler. Dijuluki sebagai Niagara van Bandung.",
    rating: 0,
    pengaju: "Dewi Lestari",
    tanggalPengajuan: "2026-04-15",
    status: "Ditolak",
  },
  {
    id: 5,
    nama: "Kampung Gajah Wonderland",
    kategori: "Wisata Hiburan",
    lokasi: "Sariwangi, Bandung Barat",
    deskripsi: "Taman hiburan keluarga dengan berbagai wahana permainan dan spot foto instagramable.",
    rating: 4.5,
    pengaju: "Eko Prasetyo",
    tanggalPengajuan: "2026-04-10",
    status: "Disetujui",
  },
];

const KATEGORI = ["Wisata Alam", "Wisata Kuliner", "Wisata Edukasi", "Wisata Hiburan"];

export default function ApprovalWisataPage() {
  const [requests, setRequests] = useState<RequestWisata[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestWisata | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    setRequests(initialRequests);
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === "pending") return r.status === "Pending";
    if (filter === "approved") return r.status === "Disetujui";
    if (filter === "rejected") return r.status === "Ditolak";
    return true;
  });

  const handleApprove = (id: number) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "Disetujui", rating: 4.5 } : r)));
    setSelectedRequest(null);
  };

  const handleReject = (id: number) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "Ditolak" } : r)));
    setSelectedRequest(null);
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardCheck size={22} className="text-primary" />
            Approval Wisata
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola permintaan penambahan tempat wisata baru</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            filter === "pending"
              ? "bg-primary text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Pending ({requests.filter((r) => r.status === "Pending").length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            filter === "approved"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Disetujui ({requests.filter((r) => r.status === "Disetujui").length})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            filter === "rejected"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Ditolak ({requests.filter((r) => r.status === "Ditolak").length})
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
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
              <div
                key={r.id}
                className="p-5 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedRequest(r)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-800">{r.nama}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status === "Disetujui"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {r.lokasi}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {r.pengaju}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(r.tanggalPengajuan).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Klik untuk detail</span>
                  </div>
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
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

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
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequest.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedRequest.status === "Disetujui"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Lokasi</label>
                <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {selectedRequest.lokasi}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Deskripsi</label>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{selectedRequest.deskripsi}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Pengaju</label>
                  <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {selectedRequest.pengaju}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Tanggal Pengajuan</label>
                  <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {new Date(selectedRequest.tanggalPengajuan).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {selectedRequest.rating > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Rating</label>
                  <p className="text-gray-800 font-medium mt-1 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    {selectedRequest.rating}
                  </p>
                </div>
              )}
            </div>

            {selectedRequest.status === "Pending" && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="flex-1 border border-red-200 text-red-600 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <X size={16} /> Tolak Request
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Setujui & Tambahkan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
