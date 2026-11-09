import PricingPage from "@/components/pages/PricingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Rate Card | Aqua PC Solutions",
  description:
    "Transparent LKR pricing for PC diagnostics, hardware repairs, custom build assembly, thermal service, and searchable PC parts inquiries at Aqua PC Solutions.",
};

export default function Page() {
  return <PricingPage />;
}
