import type { Metadata } from "next";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Studio3DPage from "@/components/pages/Studio3DPage";

export const metadata: Metadata = {
  title: "3D PC Rig Studio | Aqua PC Solutions",
  description:
    "Inspect, customize, explode, and cloud-save interactive 3D custom liquid-cooled and air-cooled PC rigs in real-time WebGL.",
};

export default function Studio3DRoute() {
  return (
    <ErrorBoundary title="3D PC Rig Studio Error">
      <Studio3DPage />
    </ErrorBoundary>
  );
}
