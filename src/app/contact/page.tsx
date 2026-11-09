import ContactPage from "@/components/pages/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Repair Intake | Aqua PC Solutions",
  description:
    "Contact Aqua PC Solutions in Embilipitiya, Sri Lanka. Submit a repair or custom build requisition, call +94 78 819 4535, or message us directly on WhatsApp.",
};

export default function Contact() {
  return <ContactPage />;
}

