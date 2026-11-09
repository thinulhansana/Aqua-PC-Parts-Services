import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { listAllUsers } from "@/lib/auth-users";
import { getRuntimeSecret } from "@/lib/cf-env";
import AdminPage from "@/components/pages/AdminPage";
import AdminRestrictedView from "@/components/admin/AdminRestrictedView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console | Aqua PC Solutions",
  description:
    "Restricted founder administration dashboard for Aqua PC Solutions registered accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRoutePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  const adminEmailsEnv = await getRuntimeSecret("ADMIN_EMAILS");
  if (!isAdminEmail(session.user.email, adminEmailsEnv)) {
    return <AdminRestrictedView signedInEmail={session.user.email} />;
  }

  const { users, storage } = await listAllUsers();

  return (
    <AdminPage
      initialUsers={users}
      initialStorage={storage}
      adminEmail={session.user.email}
      initialFetchedAt={new Date().toISOString()}
    />
  );
}

