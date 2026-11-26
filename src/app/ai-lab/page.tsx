import type { Metadata } from "next";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import AiLabPage from "@/components/pages/AiLabPage";

export const metadata: Metadata = {
  title: "Aqua AI Hardware Lab | Aqua PC Solutions",
  description:
    "Multi-turn Gemini hardware engineer chatbot with Google Search benchmarks, Google Maps local discovery, and PC rig photo-to-video animation.",
};

export default function AiLabRoute() {
  return (
    <ErrorBoundary title="Aqua AI Hardware Lab Error">
      <AiLabPage />
    </ErrorBoundary>
  );
}
