"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  function logout() {
    document.cookie =
      "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200">
      <div className="w-full px-10 py-4 flex items-center justify-between">
        <Link
          href="/pengelola/dashboard"
          className="flex items-center gap-2"
        >
          <Image
            src="/images/logo.svg"
            alt="Kembara Bandung"
            width={0}
            height={0}
            sizes="100vw"
            className="w-36 h-12"
          />
        </Link>

        <div className="flex items-center gap-6 text-[16px] font-medium">
          <Link
            href="/pengelola/dashboard"
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/pengelola/destinasi"
            className="text-gray-700 hover:text-blue-600"
          >
            Kelola Wisata
          </Link>

          <Link
            href="/pengelola/event"
            className="text-gray-700 hover:text-blue-600"
          >
            Kelola Event
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 hover:text-blue-600"
            >
              Profile ▼
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <Link
                  href="/pengelola/profile"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profil Saya
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}