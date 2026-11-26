import type { Metadata } from "next";
import WebDevelopmentPage from "@/components/pages/WebDevelopmentPage";
import { SITE_NAME, SITE_LOCATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Web Development for Businesses & Personal Needs | ${SITE_NAME}`,
  description: `Custom-engineered websites for Sri Lankan businesses, e-commerce stores, portfolios, resumes, and personal brands by ${SITE_NAME} in ${SITE_LOCATION}. Mobile-first, SEO-ready, and transparent LKR pricing.`,
};

export default function WebDevelopmentRoute() {
  return <WebDevelopmentPage />;
}
