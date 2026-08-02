type StatCardProps = {
	title: string;
	value: number;
	description: string;
	variant?: "default" | "active" | "pending" | "revision";
};

export default function StatCard({
	title,
	value,
	description,
	variant = "default",
}: StatCardProps) {
	const variantStyle = {
		default: "bg-[#285260]",
		active: "bg-green-600",
		pending: "bg-[#F29B4B]",
		revision: "bg-red-500",
	};

	return (
		<div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
			<div
				className={`mb-5 h-11 w-11 rounded-2xl ${variantStyle[variant]}`}
			/>

			<p className="text-sm font-semibold text-gray-500">
				{title}
			</p>

			<h2 className="mt-2 text-4xl font-bold text-[#1F2937]">
				{value}
			</h2>

			<p className="mt-2 text-sm leading-6 text-gray-500">
				{description}
			</p>
		</div>
	);
}