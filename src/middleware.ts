import NextAuth from "next-auth";
import {
  NextRequest,
  NextResponse,
  type NextFetchEvent,
} from "next/server";
import { authConfig } from "@/auth.config";
import { getRuntimeSecret } from "@/lib/cf-env";

type NextAuthRawMiddleware = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<Response | undefined>;

const { auth: authMiddleware } = NextAuth(async () => {
  const secret =
    (await getRuntimeSecret("AUTH_SECRET")) ??
    (await getRuntimeSecret("NEXTAUTH_SECRET"));

  return {
    ...authConfig,
    ...(secret ? { secret } : {}),
  };
});

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const configuredSecret =
    (await getRuntimeSecret("AUTH_SECRET")) ??
    (await getRuntimeSecret("NEXTAUTH_SECRET"));

  // When AUTH_SECRET is unset in dev/preview, Node.js routes use a per-process
  // in-memory signing key. Delegate route protection to the Server Components
  // (/account, /admin) and API handlers so Edge and Node never mismatch keys.
  if (!configuredSecret) {
    return NextResponse.next();
  }

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
  matcher: ["/account/:path*", "/admin/:path*"],
};
