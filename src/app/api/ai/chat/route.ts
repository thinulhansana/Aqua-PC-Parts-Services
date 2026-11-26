import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, normalizeGeminiError } from "@/lib/gemini";

const ALLOWED_MODELS = new Set([
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
  "gemini-4-neon",
  "gemini-4-carbon",
]);

const ALLOWED_MODES = new Set(["standard", "search", "maps"]);

const SYSTEM_INSTRUCTION = `You are the Aqua PC Solutions Senior Hardware Engineer in Embilipitiya, Sri Lanka.
Help customers design custom gaming & workstation PCs, check CPU/GPU/PSU/RAM/motherboard compatibility, compare Sri Lanka LKR value-per-performance, troubleshoot thermal/BIOS/VRM issues, and plan liquid cooling loops.
Keep responses clear, practical, structured with concise Markdown headings or bullet lists, and mention Aqua PC Solutions lab services (bench testing, 06-month testing warranty, 24-hour stability stress testing) when genuinely helpful.`;

interface IncomingMessage {
  role: "user" | "model";
  text: string;
}

interface WebSource {
  title: string;
  uri: string;
}

interface MapSource {
  title: string;
  uri: string;
  placeId?: string;
  reviewSnippets: { text: string; uri?: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      messages?: unknown;
      model?: unknown;
      mode?: unknown;
      userLocation?: unknown;
    } | null;

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one chat message." },
        { status: 400 }
      );
    }

    const sanitizedMessages: IncomingMessage[] = body.messages
      .slice(-24)
      .filter(
        (m): m is { role: unknown; text: unknown } =>
          typeof m === "object" && m !== null
      )
      .map((m): IncomingMessage => ({
        role: m.role === "model" ? "model" : "user",
        text: typeof m.text === "string" ? m.text.trim().slice(0, 6000) : "",
      }))
      .filter((m) => m.text.length > 0);

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Message text cannot be empty." },
        { status: 400 }
      );
    }

    const requestedMode =
      typeof body.mode === "string" && ALLOWED_MODES.has(body.mode)
        ? (body.mode as "standard" | "search" | "maps")
        : "standard";

    const requestedModel =
      typeof body.model === "string" && ALLOWED_MODELS.has(body.model)
        ? body.model
        : "gemini-4-hydrogen";

    // Grounded search and maps modes use gemini-4-hydrogen
    const effectiveModel =
      requestedMode === "search" || requestedMode === "maps"
        ? "gemini-4-hydrogen"
        : requestedModel;

    // Default coordinates: Embilipitiya, Sri Lanka (Aqua PC Solutions lab)
    let latLng = { latitude: 6.3372, longitude: 80.8548 };
    if (
      body.userLocation &&
      typeof body.userLocation === "object" &&
      "latitude" in body.userLocation &&
      "longitude" in body.userLocation
    ) {
      const lat = Number((body.userLocation as { latitude: unknown }).latitude);
      const lng = Number((body.userLocation as { longitude: unknown }).longitude);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        latLng = { latitude: lat, longitude: lng };
      }
    }

    const ai = getGeminiClient();

    const contents = sanitizedMessages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Build config strictly per Gemini API rules:
    // - No deprecated temperature/topP/topK/candidateCount/thinkingBudget on gemini-4-*
    // - Never combine googleMaps with googleSearch, and never pass responseMimeType/responseSchema with googleMaps
    const config: Record<string, unknown> = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (requestedMode === "search") {
      config.tools = [{ googleSearch: {} }];
    } else if (requestedMode === "maps") {
      config.tools = [{ googleMaps: {} }];
      config.toolConfig = {
        retrievalConfig: {
          latLng,
        },
      };
    }

    const response = await ai.models.generateContent({
      model: effectiveModel,
      contents,
      config,
    });

    const text =
      response.text?.trim() ||
      "I received an empty response. Please try rephrasing your hardware question.";

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const rawChunks = groundingMetadata?.groundingChunks || [];

    const webSources: WebSource[] = [];
    const mapSources: MapSource[] = [];
    const seenWeb = new Set<string>();
    const seenMaps = new Set<string>();

    for (const chunk of rawChunks) {
      const c = chunk as {
        web?: { uri?: string; title?: string };
        maps?: {
          uri?: string;
          title?: string;
          placeId?: string;
          placeAnswerSources?: {
            reviewSnippets?: { content?: string; text?: string; uri?: string }[];
          };
        };
      };

      if (c.web?.uri && !seenWeb.has(c.web.uri)) {
        seenWeb.add(c.web.uri);
        webSources.push({
          title: c.web.title?.trim() || c.web.uri,
          uri: c.web.uri,
        });
      }

      if (c.maps?.uri && !seenMaps.has(c.maps.uri)) {
        seenMaps.add(c.maps.uri);
        const snippets = (c.maps.placeAnswerSources?.reviewSnippets || [])
          .map((s) => ({
            text: (s.text || s.content || "").trim(),
            uri: s.uri,
          }))
          .filter((s) => s.text.length > 0);
        mapSources.push({
          title: c.maps.title?.trim() || "View on Google Maps",
          uri: c.maps.uri,
          placeId: c.maps.placeId,
          reviewSnippets: snippets,
        });
      }
    }

    const searchQueries: string[] = Array.isArray(groundingMetadata?.webSearchQueries)
      ? groundingMetadata.webSearchQueries.filter(
          (q): q is string => typeof q === "string" && q.trim().length > 0
        )
      : [];

    return NextResponse.json({
      text,
      model: effectiveModel,
      mode: requestedMode,
      webSources,
      mapSources,
      searchQueries,
    });
  } catch (err) {
    const normalized = normalizeGeminiError(err);
    return NextResponse.json(
      {
        error: normalized.message,
        requiresPaidKey: normalized.requiresPaidKey,
      },
      { status: normalized.status }
    );
  }
}
