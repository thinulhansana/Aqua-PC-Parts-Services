import AboutPage from "@/components/pages/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Craftsmanship | Aqua PC Parts & Services",
  description:
    "Engineered by enthusiasts, built for uncompromising performance. Meet our hardware architects and inspect our ISO-certified cleanroom assembly facility.",
};

export default function Page() {
  return <AboutPage />;
}
