"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, FileText, Eye } from "lucide-react";

type Pengelola = {
  id: number;
  name: string;
  email: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  verificationDocument: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

export default function VerifikasiPengelolaPage() {
  const [tab, setTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [data, setData] = useState<Pengelola[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Pengelola | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async (status: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/verifikasi-pengelola?status=${status}`);
    const json = await res.json();
    setData(json.users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  const handleApprove = async (user: Pengelola) => {
    setActionLoading(true);
    await fetch("/api/admin/verifikasi-pengelola", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, action: "approve" }),
    });
    setActionLoading(false);
    fetchData(tab);
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    await fetch("/api/admin/verifikasi-pengelola", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected.id, action: "reject", rejectionReason: rejectReason }),
    });
    setActionLoading(false);
    setShowRejectModal(false);
    setSelected(null);
    setRejectReason("");
    fetchData(tab);
  };

  const tabConfig = [
    { key: "PENDING", label: "Menunggu", icon: Clock },
    { key: "APPROVED", label: "Disetujui", icon: CheckCircle },
    { key: "REJECTED", label: "Ditolak", icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={22} className="text-primary" />
          Verifikasi Pengelola
        </h1>
        <p className="text-gray-500 text-sm mt-1">Kelola verifikasi akun pengelola wisata</p>
      </div>

      <div className="flex gap-2">
        {tabConfig.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "PENDING" | "APPROVED" | "REJECTED")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === t.key ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 animate-pulse">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Tidak ada data</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Nama</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Tanggal Daftar</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Dokumen</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  {tab === "PENDING" && (
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {u.verificationDocument ? (
                        
                          <a href={u.verificationDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium"
                        >
                          <Eye size={13} /> Lihat Dokumen
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.verificationStatus === "PENDING" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Menunggu</span>
                      )}
                      {u.verificationStatus === "APPROVED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Disetujui</span>
                      )}
                      {u.verificationStatus === "REJECTED" && (
                        <div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Ditolak</span>
                          {u.rejectionReason && (
                            <p className="text-xs text-gray-400 mt-1">{u.rejectionReason}</p>
                          )}
                        </div>
                      )}
                    </td>
                    {tab === "PENDING" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(u)}
                            disabled={actionLoading}
                            className="flex items-center gap-1 text-green-500 hover:text-green-700 text-xs font-medium"
                          >
                            <CheckCircle size={13} /> Setujui
                          </button>
                          <button
                            onClick={() => { setSelected(u); setShowRejectModal(true); }}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            <XCircle size={13} /> Tolak
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRejectModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Tolak Pengajuan</h3>
            <p className="text-sm text-gray-500 mb-4">
              Berikan alasan penolakan untuk <strong>{selected.name}</strong>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Dokumen tidak valid atau tidak terbaca"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-28 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || actionLoading}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-600 disabled:opacity-50"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
