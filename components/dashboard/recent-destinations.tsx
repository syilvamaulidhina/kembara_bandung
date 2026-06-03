type Destination = {
	id: number;
	name: string;
	status: string;
	createdAt: string;
	imageUrl?: string | null;
};

type RecentDestinationsProps = {
	destinations: Destination[];
};

function getStatusStyle(status: string) {
	if (status === "aktif") {
		return "bg-green-100 text-green-700";
	}

	if (status === "pending") {
		return "bg-orange-100 text-orange-700";
	}

	if (status === "butuh_perbaikan") {
		return "bg-red-100 text-red-700";
	}

	return "bg-gray-100 text-gray-600";
}

function getStatusLabel(status: string) {
	if (status === "aktif") return "Aktif";
	if (status === "pending") return "Pending";
	if (status === "butuh_perbaikan") return "Butuh Perbaikan";
	if (status === "canceled") return "Dibatalkan";

	return status;
}

export default function RecentDestinations({
	destinations,
}: RecentDestinationsProps) {
	return (
		<div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-[#1F2937]">
						Destinasi Terbaru
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Data wisata terakhir yang ditambahkan pengelola.
					</p>
				</div>
			</div>

			<div className="mt-6 space-y-4">
				{destinations.length > 0 ? (
					destinations.map((destination) => (
						<div
							key={destination.id}
							className="flex items-center gap-4 rounded-[20px] border border-gray-100 bg-[#F8FAFC] p-4"
						>
							<img
								src={
									destination.imageUrl ||
									"/images/placeholder.png"
								}
								alt={destination.name}
								className="h-20 w-28 rounded-2xl object-cover"
							/>

							<div className="min-w-0 flex-1">
								<h3 className="truncate text-base font-bold text-[#1F2937]">
									{destination.name}
								</h3>

								<div className="mt-2 flex flex-wrap items-center gap-2">
									<span
										className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
											destination.status
										)}`}
									>
										{getStatusLabel(destination.status)}
									</span>

									<span className="text-xs text-gray-400">
										{new Date(
											destination.createdAt
										).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="rounded-[20px] border border-dashed border-gray-200 bg-[#F8FAFC] py-12 text-center">
						<p className="text-sm text-gray-500">
							Belum ada destinasi.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}