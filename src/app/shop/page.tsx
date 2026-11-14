import type { Metadata } from "next";
import ShopPage from "@/components/pages/ShopPage";

export const metadata: Metadata = {
  title: "Redirecting to Aqua PC Parts | Aqua PC Solutions",
  description:
    "Redirecting to Aqua PC Parts — our dedicated storefront for 390+ quality-tested Used & Brand New PC parts, monitors, VGA cards, processors, motherboards, RAM, SSDs, PSUs, cooling, cables, and peripherals.",
  keywords: [
    "Aqua PC Solutions",
    "PC parts",
    "monitors",
    "VGA cards",
    "processors",
    "motherboards",
    "RAM",
    "SSD",
    "PC components Sri Lanka",
  ],
};

export default function Page() {
  return <ShopPage />;
}

