export default function DestinasiPage() {
  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-10 py-8">
          <h1 className="text-3xl font-extrabold text-[#285260]">
            Kelola Wisata
          </h1>
          <p className="mt-2 text-[#285260] font-semibold">
            Kelola Destinasi Wisata Anda Dari 1 Tempat.
          </p>
        </div>
      </header>

      <main className="bg-[#F5F7FB] py-8">
        <div className="w-full px-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="h-[330px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                Map akan ditampilkan di sini
              </div>
            </div>

            {/* Destination card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="grid grid-cols-1 xl:grid-cols-[180px_1fr_240px] gap-6">
                <div className="h-[150px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  Gambar Wisata
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#285260] mb-2">
                    Alun-alun Bandung
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Alun-Alun Bandung merupakan ruang publik ikonik di pusat Kota
                    Bandung yang menjadi tempat rekreasi dan berkumpul
                    masyarakat.
                  </p>

                  <p className="text-sm text-gray-800">
                    <span className="font-bold">Address:</span> Alun-Alun
                    Bandung, Balonggede, Regol, Bandung City, West Java,
                    Indonesia
                  </p>

                  <p className="text-sm text-gray-800 mt-2">
                    <span className="font-bold">Contact:</span> 0879798080
                  </p>
                </div>

                <div className="bg-[#285260] text-white rounded-lg p-4">
                  <h3 className="font-bold mb-3">Analisis Sistem</h3>

                  <div className="space-y-2 text-sm">
                    <p>✓ Nama Wisata</p>
                    <p>✓ Deskripsi</p>
                    <p>✓ Kategori</p>
                  </div>

                  <div className="mt-4 bg-white text-[#285260] rounded-md px-3 py-2 text-sm">
                    Semua Data Konsisten
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm">
                      Edit
                    </button>
                    <button className="bg-white text-[#285260] px-3 py-2 rounded-md text-sm">
                      Detail
                    </button>
                    <button className="bg-red-500 text-white px-3 py-2 rounded-md text-sm">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-[#285260] mb-3">Filter</h3>

              <input
                type="text"
                placeholder="Cari wisata..."
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20"
              />

              <select className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#285260]/20">
                <option>Semua Kategori</option>
                <option>Wisata Alam</option>
                <option>Wisata Budaya</option>
                <option>Wisata Kuliner</option>
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-[#285260] mb-4">Ringkasan</h3>

                <div className="grid grid-cols-2 gap-3">
                    
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Total Wisata</p>
                    <p className="text-lg font-bold text-[#285260]">1</p>
                    </div>

                    <div className="bg-green-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Data Konsisten</p>
                    <p className="text-lg font-bold text-green-600">1</p>
                    </div>

                    <div className="bg-red-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Butuh Perbaikan</p>
                    <p className="text-lg font-bold text-red-500">0</p>
                    </div>

                    <div className="bg-blue-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Wisata Aktif</p>
                    <p className="text-lg font-bold text-blue-600">1</p>
                    </div>

                </div>
                </div>

            <div className="bg-[#285260] text-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold mb-2">Tips Pengelolaan</h3>
              <p className="text-sm text-white/80">
                Pastikan nama, deskripsi, kategori, alamat, kontak, dan
                koordinat wisata sudah lengkap sebelum dipublikasikan.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}