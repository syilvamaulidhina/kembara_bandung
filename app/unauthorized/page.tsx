export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Akses Ditolak</h1>
      <p className="text-gray-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <a href="/login" className="text-blue-500 hover:underline">Kembali ke Login</a>
    </div>
  );
}