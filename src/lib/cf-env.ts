import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCloudflareEnv(): Promise<CloudflareEnv | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env;
  } catch {
    return undefined;
  }
}

export async function getRuntimeSecret(key: string): Promise<string | undefined> {
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

