import { randomBytes } from "node:crypto";
import { getRuntimeSecret } from "@/lib/cf-env";

const FALLBACK_SECRET_SYMBOL = Symbol.for("__aqua_auth_ephemeral_secret__");

function getOrCreateEphemeralSecret(): string {
  const globalScope = globalThis as unknown as Record<
    symbol,
    string | undefined
  >;
  if (!globalScope[FALLBACK_SECRET_SYMBOL]) {
    globalScope[FALLBACK_SECRET_SYMBOL] = randomBytes(32).toString("base64url");
  }
  return globalScope[FALLBACK_SECRET_SYMBOL];
}

/**
 * Resolves the Auth.js signing secret from environment variables or Cloudflare
 * bindings, falling back to a cryptographically strong per-process secret in
 * memory so development and preview environments never crash with MissingSecret.
 */
export async function resolveAuthSecret(): Promise<string> {
  const configured =
    (await getRuntimeSecret("AUTH_SECRET")) ??
    (await getRuntimeSecret("NEXTAUTH_SECRET"));

  return configured || getOrCreateEphemeralSecret();
}
