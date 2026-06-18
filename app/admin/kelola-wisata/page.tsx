"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Edit2, Trash2, X, Save, ClipboardCheck } from "lucide-react";

type Wisata = {
  id: number;
  nama: string;
  kategori: string;
  lokasi: string;
  status: string;
};

const KATEGORI = ["Wisata Alam", "Wisata Kuliner", "Wisata Edukasi", "Wisata Hiburan"];

export default function KelolaWisataPage() {
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editWisata, setEditWisata] = useState<Wisata | null>(null);
  const [deleteWisata, setDeleteWisata] = useState<Wisata | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchWisata = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/wisata");
      const data = await res.json();
      setWisataList(data.wisata || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWisata();
  }, []);

  const filtered = wisataList.filter(
    (w) =>
      w.nama.toLowerCase().includes(search.toLowerCase()) ||
      w.kategori.toLowerCase().includes(search.toLowerCase()) ||
      w.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = async () => {
    if (!editWisata) return;
    setSaving(true);
    try {
      await fetch("/api/admin/wisata", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editWisata.id,
          nama: editWisata.nama,
          lokasi: editWisata.lokasi,
          status: editWisata.status,
        }),
      });
      await fetchWisata();
      setEditWisata(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteWisata) return;
    try {
      await fetch("/api/admin/wisata", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteWisata.id }),
      });
      await fetchWisata();
      setDeleteWisata(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={22} className="text-primary" />
            Manajemen Wisata
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data wisata Kembara Bandung</p>
        </div>
        <a href="/admin/approval-wisata" style={{ backgroundColor: "#130F6A" }} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition shrink-0"><ClipboardCheck size={16} /> Approval Wisata</a>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">
            Daftar Wisata{" "}
            <span className="text-sm font-normal text-gray-400">({wisataList.length})</span>
          </h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari wisata..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">ID</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nama Wisata</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Kategori</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Lokasi</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    {search ? "Tidak ada wisata ditemukan" : "Belum ada data wisata"}
                  </td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-mono">{String(w.id).padStart(5, "0")}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{w.nama}</td>
                    <td className="px-6 py-4 text-gray-500">{w.kategori}</td>
                    <td className="px-6 py-4 text-gray-500">{w.lokasi}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${w.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEditWisata(w)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium">
                          <Edit2 size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteWisata(w)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      {editWisata && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Edit Wisata</h3>
              <button onClick={() => setEditWisata(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Wisata</label>
                <input type="text" value={editWisata.nama} onChange={(e) => setEditWisata({ ...editWisata, nama: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
                <select value={editWisata.kategori} onChange={(e) => setEditWisata({ ...editWisata, kategori: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Lokasi</label>
                <input type="text" value={editWisata.lokasi} onChange={(e) => setEditWisata({ ...editWisata, lokasi: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <select value={editWisata.status} onChange={(e) => setEditWisata({ ...editWisata, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditWisata(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleEdit} disabled={saving} style={{ backgroundColor: "#130F6A" }} className="flex-1 text-white rounded-xl py-2.5 text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteWisata && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Hapus Wisata?</h3>
            <p className="text-gray-500 text-sm">
              Yakin ingin menghapus <strong>{deleteWisata.nama}</strong>?
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteWisata(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}