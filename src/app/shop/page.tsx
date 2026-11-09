import type { Metadata } from "next";
import ShopPage from "@/components/pages/ShopPage";

export const metadata: Metadata = {
  title: "Shop PC Parts & Components | Aqua PC Parts & Services",
  description:
    "Browse quality-tested PC parts including monitors, VGA cards, processors, motherboards, storage, RAM and more. Contact via WhatsApp for availability and pricing.",
  keywords: [
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

