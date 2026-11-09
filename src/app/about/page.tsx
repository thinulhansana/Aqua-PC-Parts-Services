import AboutPage from "@/components/pages/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Founder | Aqua PC Solutions",
  description:
    "Founded on November 6, 2026 by S.L.K Thinul Hansana in Embilipitiya, Sri Lanka. Aqua PC Solutions delivers certified Grade-A PC hardware, custom builds, and micro-precision diagnostics.",
};

export default function Page() {
  return <AboutPage />;
}
