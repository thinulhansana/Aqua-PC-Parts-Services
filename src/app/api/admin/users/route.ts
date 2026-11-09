import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { listAllUsers } from "@/lib/auth-users";
import { getRuntimeSecret } from "@/lib/cf-env";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const adminEmailsEnv = await getRuntimeSecret("ADMIN_EMAILS");
  if (!isAdminEmail(session.user.email, adminEmailsEnv)) {
    return NextResponse.json(
      { error: "Forbidden: Founder access required." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  const { users, storage } = await listAllUsers();

  return NextResponse.json(
    {
      users,
      storage,
      adminEmail: session.user.email,
      fetchedAt: new Date().toISOString(),
    },
    { headers: NO_STORE_HEADERS }
  );
}

