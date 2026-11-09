import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileByEmail, type PublicUserProfile } from "@/lib/auth-users";
import AccountPage from "@/components/pages/AccountPage";

export const metadata: Metadata = {
  title: "Customer Account Portal | Aqua PC Parts & Services",
  description:
    "Manage your Aqua PC Parts & Services account, saved rig blueprint, and diagnostic consultations.",
};

export default async function AccountRoutePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account");
  }

  const stored = await getUserProfileByEmail(session.user.email);

  const initialProfile: PublicUserProfile = stored ?? {
    id: session.user.id || "",
    name: session.user.name || session.user.email.split("@")[0],
    email: session.user.email,
    provider: session.user.provider === "google" ? "google" : "credentials",
    image: session.user.image || undefined,
    phone: "",
    rigSpecs: "",
    createdAt: new Date().toISOString(),
  };

  return <AccountPage initialProfile={initialProfile} />;
}

