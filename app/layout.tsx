import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
      <head>
        {/* Maze snippet untuk UAT tracking */}
        <Script
          id="maze-snippet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function (m, a, z, e) {
  var s, t, u, v;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}
  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }
  u = document.currentScript || (function () {
    var w = document.getElementsByTagName('script');
    return w[w.length - 1];
  })();
  v = u && u.nonce;
  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', '0379f5cf-938e-4307-b1a3-df60fad894c6');`,
          }}
        />
      </head>
      <body
        className={`${poppins.className} ${jakarta.variable} font-sans min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
