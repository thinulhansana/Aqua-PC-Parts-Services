import HomePage from "@/components/pages/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aqua PC Parts & Services | Precision Liquid Engineering",
  description:
    "Liquid-cooled precision, elite PC hardware, custom loops, and certified diagnostic & repair services.",
};

export default function Page() {
  return <HomePage />;
}
