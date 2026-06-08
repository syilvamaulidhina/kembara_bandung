import Link from "next/link";

export default function QuickActions() {
	return (
		<div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-md">
			<h2 className="text-xl font-bold text-gray-900">
				Aksi Cepat
			</h2>

			<p className="mt-1 text-sm text-gray-500">
				Kelola data utama dengan lebih cepat
			</p>

			<div className="mt-6 space-y-3">
				<Link
					href="/pengelola/destinasi/tambah"
					className="block rounded-2xl bg-[#F09A43] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#d9822f]"
				>
					+ Tambah Wisata
				</Link>

				<Link
					href="/pengelola/destinasi"
					className="block rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
				>
					Kelola Wisata
				</Link>

				<Link
					href="/pengelola/event"
					className="block rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
				>
					Kelola Event
				</Link>
			</div>
		</div>
	);
}