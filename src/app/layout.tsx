import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Aqua PC Parts & Services | Precision Liquid Engineering",
  description:
    "Expert custom PC builds, precision liquid cooling solutions, micro-soldering repairs, and professional diagnostics. Aqua PC Parts & Services — where performance meets craftsmanship.",
  keywords: [
    "custom PC builds",
    "liquid cooling",
    "PC repair",
    "micro-soldering",
    "PC parts",
    "diagnostics",
    "water cooling",
    "gaming PC",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface font-jakarta min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
        <LocalBusinessSchema />
        <Header />
        <main className="flex-1 w-full pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
