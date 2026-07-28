import type { LucideIcon } from "lucide-react";

type StatCardProps = {
	title: string;
	value: number;
	description: string;
	icon: LucideIcon;
	variant?: "default" | "active" | "pending" | "revision";
};

export default function StatCard({
	title,
	value,
	description,
	icon: Icon,
	variant = "default",
}: StatCardProps) {
	const styles = {
		default: "bg-[#EAF1F3] text-[#285260]",
		active: "bg-emerald-50 text-emerald-700",
		pending: "bg-amber-50 text-amber-700",
		revision: "bg-red-50 text-red-700",
	};

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-xs font-semibold text-gray-500">{title}</p>
					<p className="mt-1.5 text-3xl font-extrabold leading-none text-[#1F2937]">{value}</p>
					<p className="mt-2 truncate text-xs text-gray-400">{description}</p>
				</div>
				<div className={`rounded-xl p-2.5 ${styles[variant]}`}>
					<Icon className="h-5 w-5" />
				</div>
			</div>
		</div>
	);
}
