import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export function isGoogleOAuthConfigured(): boolean {
  const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  return Boolean(clientId?.trim() && clientSecret?.trim());
}

const useSecureCrossSiteCookies =
  Boolean(process.env.APP_URL?.startsWith("https://")) ||
  Boolean(process.env.AUTH_URL?.startsWith("https://")) ||
  Boolean(process.env.NEXTAUTH_URL?.startsWith("https://")) ||
  process.env.NODE_ENV === "production";

const crossSiteCookieOptions = {
  httpOnly: true,
  sameSite: "none" as const,
  path: "/",
  secure: true,
};

/**
 * Edge-safe Auth.js configuration shared between middleware and server routes.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  useSecureCookies: useSecureCrossSiteCookies,
  ...(useSecureCrossSiteCookies
    ? {
        cookies: {
          sessionToken: {
            name: "__Secure-authjs.session-token",
            options: crossSiteCookieOptions,
          },
          callbackUrl: {
            name: "__Secure-authjs.callback-url",
            options: crossSiteCookieOptions,
          },
          csrfToken: {
            name: "__Host-authjs.csrf-token",
            options: crossSiteCookieOptions,
          },
          pkceCodeVerifier: {
            name: "__Secure-authjs.pkce.code_verifier",
            options: { ...crossSiteCookieOptions, maxAge: 900 },
          },
          state: {
            name: "__Secure-authjs.state",
            options: { ...crossSiteCookieOptions, maxAge: 900 },
          },
          nonce: {
            name: "__Secure-authjs.nonce",
            options: { ...crossSiteCookieOptions, maxAge: 900 },
          },
        },
      }
    : {}),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isProtectedRoute =
        nextUrl.pathname === "/account" ||
        nextUrl.pathname.startsWith("/account/") ||
        nextUrl.pathname === "/admin" ||
        nextUrl.pathname.startsWith("/admin/");

      if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set(
          "callbackUrl",
          `${nextUrl.pathname}${nextUrl.search}`
        );
        return NextResponse.redirect(loginUrl);
      }

      return true;
    },
    jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id ?? token.sub;
        token.provider = account?.provider ?? user.provider ?? "credentials";
      }
      if (trigger === "update" && session && typeof session === "object") {
        const updatedName = (session as { name?: unknown }).name;
        if (typeof updatedName === "string" && updatedName.trim()) {
          token.name = updatedName.trim();
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || token.sub || "";
        session.user.provider = (token.provider as string) || "credentials";
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
};
