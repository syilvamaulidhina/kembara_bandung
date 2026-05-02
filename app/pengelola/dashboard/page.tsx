export default function DashboardPengelolaPage() {
  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-10 py-8">
          <h1 className="text-3xl font-extrabold text-[#285260] mb-2">
            Selamat Datang, Pengelola!
          </h1>
          <p className="text-[#285260] font-semibold">
            Kelola Destinasi Wisata Anda Dari 1 Tempat.
          </p>
        </div>
      </header>

      <main className="py-10 px-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          You're logged in!
        </div>
      </main>
    </>
  );
}