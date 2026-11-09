import ServicesPage from "@/components/pages/ServicesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Diagnostics | Aqua PC Solutions",
  description:
    "Board-level PC diagnostics, custom gaming & workstation builds, liquid & thermal cooling optimization, BIOS tuning, and courier intake in Embilipitiya, Sri Lanka.",
};

export default function Page() {
  return <ServicesPage />;
}
