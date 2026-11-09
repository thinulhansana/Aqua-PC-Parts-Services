import type { Metadata } from "next";
import ShopPage from "@/components/pages/ShopPage";

export const metadata: Metadata = {
  title: "Shop PC Parts & Components | Aqua PC Solutions",
  description:
    "Browse 328 quality-tested PC parts including monitors, VGA cards, processors, motherboards, storage, RAM, PSUs, cooling, and cables. Instant WhatsApp price inquiry.",
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

