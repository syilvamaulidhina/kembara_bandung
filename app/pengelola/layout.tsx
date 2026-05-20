import Navbar from "@/components/navbar";

export default function PengelolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
}