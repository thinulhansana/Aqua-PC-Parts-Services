const CLOUDFLARE_CONTEXT_SYMBOL = Symbol.for("__cloudflare-context__");

interface CloudflareContextShape {
  env?: CloudflareEnv;
}

/**
 * Returns Cloudflare Worker bindings ONLY when executing inside an active
 * Cloudflare Worker runtime where OpenNext has initialized the global context.
 * In standard Node.js environments (dev, preview, Node hosting), this returns
 * undefined immediately without spawning wrangler/workerd Miniflare SQLite
 * instances that can trigger SQLITE_BUSY lock crashes.
 */
export async function getCloudflareEnv(): Promise<CloudflareEnv | undefined> {
  try {
    const globalScope = globalThis as unknown as Record<
      symbol,
      CloudflareContextShape | undefined
    >;
    return globalScope[CLOUDFLARE_CONTEXT_SYMBOL]?.env;
  } catch {
    return undefined;
  }
}

export async function getRuntimeSecret(
  key: string
): Promise<string | undefined> {
  const fromProcess = process.env[key];
  if (typeof fromProcess === "string" && fromProcess.trim()) {
    return fromProcess.trim();
  }

  const env = await getCloudflareEnv();
  if (env) {
    const val = (env as unknown as Record<string, unknown>)[key];
    if (typeof val === "string" && val.trim()) {
      return val.trim();
    }
  }

  return undefined;
}

export async function getD1Database(): Promise<D1Database | null> {
  const env = await getCloudflareEnv();
  return env?.DB ?? null;
}
