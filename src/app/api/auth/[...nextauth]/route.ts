import { NextRequest } from "next/server";
import { handlers } from "@/auth";

async function withCanonicalOrigin(req: NextRequest): Promise<NextRequest> {
  const configuredOrigin =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.APP_URL?.trim();

  if (!configuredOrigin) return req;

  try {
    const target = new URL(configuredOrigin);
    const current = new URL(req.url);
    if (current.origin === target.origin) return req;

    current.protocol = target.protocol;
    current.hostname = target.hostname;
    current.port = target.port;

    const headers = new Headers(req.headers);
    headers.set("x-forwarded-host", target.host);
    headers.set("x-forwarded-proto", target.protocol.replace(":", ""));
    headers.set(
      "x-forwarded-port",
      target.port || (target.protocol === "https:" ? "443" : "80")
    );
    headers.set("host", target.host);

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? await req.arrayBuffer() : undefined;

    return new NextRequest(current, {
      method: req.method,
      headers,
      body,
    });
  } catch {
    return req;
  }
}

export async function GET(req: NextRequest) {
  return handlers.GET(await withCanonicalOrigin(req));
}

export async function POST(req: NextRequest) {
  return handlers.POST(await withCanonicalOrigin(req));
}
