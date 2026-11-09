import NextAuth from "next-auth";
import { NextRequest, type NextFetchEvent } from "next/server";
import { authConfig } from "@/auth.config";
import { getRuntimeSecret } from "@/lib/cf-env";

const { auth: authMiddleware } = NextAuth(async () => {
  const secret =
    (await getRuntimeSecret("AUTH_SECRET")) ??
    (await getRuntimeSecret("NEXTAUTH_SECRET"));

  return {
    ...authConfig,
    ...(secret ? { secret } : {}),
  };
});

type NextAuthRawMiddleware = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<Response | undefined>;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const runAuth = authMiddleware as unknown as NextAuthRawMiddleware;

  if (!request.headers.get("x-forwarded-proto")) {
    const headers = new Headers(request.headers);
    const proto = request.nextUrl.protocol.replace(":", "") || "https";
    headers.set("x-forwarded-proto", proto);
    const normalizedRequest = new NextRequest(request.url, { headers });
    return runAuth(normalizedRequest, event);
  }

  return runAuth(request, event);
}

export const config = {
  matcher: ["/account/:path*"],
};
