import type { Metadata } from "next";
import "./globals.css";

import { Poppins, Plus_Jakarta_Sans } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kembara Bandung",
  description: "Platform Wisata Terbaik di Bandung",
  icons: {
    icon: "/images/taskbar_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.className} ${jakarta.variable} font-sans min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}