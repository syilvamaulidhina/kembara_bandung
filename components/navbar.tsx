import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="w-full px-10 py-4 flex items-center justify-between">
        
        {/* Logo + Text */}
        <Link href="/pengelola/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Kembara Bandung"
            width={0}
            height={0}
            sizes="100vw"
            className="w-36 h-12"
          />
        </Link>

        {/* Menu */}
        <div className="flex gap-6 items-center text-[16px] font-medium">
          <Link href="/pengelola/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/pengelola/destinasi" className="text-gray-700 hover:text-blue-600">
            Kelola Wisata
          </Link>
          <Link href="/pengelola/destinasi/tambah" className="text-gray-700 hover:text-blue-600">
            Tambah Wisata
          </Link>

          <button className="text-gray-700">Profile ▼</button>
        </div>
      </div>
    </nav>
  );
}