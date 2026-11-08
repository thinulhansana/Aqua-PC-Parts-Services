import ServicesPage from "@/components/pages/ServicesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Diagnostics | Aqua PC Parts & Services",
  description:
    "Emergency diagnostics, custom hardline liquid cooling, delidding, memory sub-timing tuning, and enterprise AI workstation architecture.",
};

export default function Page() {
  return <ServicesPage />;
}
