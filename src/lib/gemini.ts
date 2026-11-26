import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;
let cachedKey: string | undefined;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiConfigError(
      "GEMINI_API_KEY is not configured on the server. Add it in Settings > Secrets to enable AI features."
    );
  }
  if (cachedClient && cachedKey === apiKey) {
    return cachedClient;
  }
  cachedKey = apiKey;
  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return cachedClient;
}

export class GeminiConfigError extends Error {
  status = 503;
  constructor(message: string) {
    super(message);
    this.name = "GeminiConfigError";
  }
}

export function normalizeGeminiError(err: unknown): {
  status: number;
  message: string;
  requiresPaidKey: boolean;
} {
  if (err instanceof GeminiConfigError) {
    return { status: err.status, message: err.message, requiresPaidKey: false };
  }

  const rawStatus =
    typeof err === "object" && err !== null && "status" in err
      ? Number((err as { status?: unknown }).status)
      : NaN;
  const rawMessage =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Upstream AI request failed.";

  const lower = rawMessage.toLowerCase();
  const isBillingOrQuota =
    rawStatus === 403 ||
    rawStatus === 429 ||
    lower.includes("quota") ||
    lower.includes("billing") ||
    lower.includes("permission_denied") ||
    lower.includes("resource_exhausted") ||
    lower.includes("paid") ||
    lower.includes("not enabled");

  if (isBillingOrQuota) {
    return {
      status: rawStatus === 429 ? 429 : 403,
      message:
        "This model requires a billing-enabled Gemini API key or available quota. Switch to Gemini 4 Hydrogen / Flash Lite for free-tier chat, or add a billing-enabled GEMINI_API_KEY in Settings > Secrets.",
      requiresPaidKey: true,
    };
  }

  if (rawStatus >= 400 && rawStatus < 600) {
    return {
      status: rawStatus,
      message: rawMessage.slice(0, 320),
      requiresPaidKey: false,
    };
  }

  return {
    status: 500,
    message: rawMessage.slice(0, 320),
    requiresPaidKey: false,
  };
}
