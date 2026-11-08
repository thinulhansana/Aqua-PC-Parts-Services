import PricingPage from "@/components/pages/PricingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Rate Card | Aqua PC Parts & Services",
  description:
    "Transparent tiered pricing for PC parts, repair packages, consultations, and component lab installation add-ons.",
};

export default function Page() {
  return <PricingPage />;
}
