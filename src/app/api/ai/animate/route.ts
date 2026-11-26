import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, normalizeGeminiError } from "@/lib/gemini";

export const maxDuration = 300;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_ASPECT_RATIOS = new Set(["16:9", "9:16"]);
const MAX_BASE64_LENGTH = 11 * 1024 * 1024; // ~8 MB binary image

interface InteractionOutputPart {
  type?: string;
  mime_type?: string;
  data?: string;
  uri?: string;
  url?: string;
}

interface VideoInteractionResult {
  output_video?: {
    mime_type?: string;
    data?: string;
    uri?: string;
    url?: string;
  };
  outputs?: InteractionOutputPart[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      imageBase64?: unknown;
      mimeType?: unknown;
      prompt?: unknown;
      aspectRatio?: unknown;
    } | null;

    if (!body || typeof body.imageBase64 !== "string") {
      return NextResponse.json(
        { error: "Please upload an image to animate." },
        { status: 400 }
      );
    }

    const mimeType =
      typeof body.mimeType === "string" && ALLOWED_MIME_TYPES.has(body.mimeType)
        ? body.mimeType
        : "";
    if (!mimeType) {
      return NextResponse.json(
        { error: "Unsupported image format. Please use JPG, PNG, or WebP." },
        { status: 400 }
      );
    }

    // Strip optional data URL prefix if client sent one
    const rawBase64 = body.imageBase64.replace(/^data:[^;]+;base64,/, "").trim();
    if (!rawBase64 || rawBase64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Image is empty or exceeds the 8 MB upload limit." },
        { status: 400 }
      );
    }

    const aspectRatio =
      typeof body.aspectRatio === "string" &&
      ALLOWED_ASPECT_RATIOS.has(body.aspectRatio)
        ? (body.aspectRatio as "16:9" | "9:16")
        : "16:9";

    const cleanPrompt =
      typeof body.prompt === "string" && body.prompt.trim().length > 0
        ? body.prompt.trim().slice(0, 600)
        : "Smooth slow cinematic camera push-in around this custom PC hardware setup with subtle RGB illumination reflections and gentle fan spin.";

    const ai = getGeminiClient();

    // Interactions API call for gemini-omni-1.2-flash image-to-video generation
    const interaction = (await (
      ai as unknown as {
        interactions: {
          create: (
            params: Record<string, unknown>,
            options?: { timeout?: number }
          ) => Promise<VideoInteractionResult>;
        };
      }
    ).interactions.create(
      {
        model: "gemini-omni-1.2-flash",
        input: [
          { type: "image", mime_type: mimeType, data: rawBase64 },
          { type: "text", text: cleanPrompt },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: "video",
          aspect_ratio: aspectRatio,
        },
      },
      { timeout: 300000 }
    )) as VideoInteractionResult;

    const directVideo = interaction?.output_video;
    const outputBlock = interaction?.outputs?.find(
      (part) =>
        part.type === "video" ||
        (typeof part.mime_type === "string" && part.mime_type.startsWith("video/"))
    );

    const videoMime = directVideo?.mime_type || outputBlock?.mime_type || "video/mp4";
    const videoBase64 = directVideo?.data || outputBlock?.data;
    const videoUri =
      directVideo?.uri || directVideo?.url || outputBlock?.uri || outputBlock?.url;

    if (videoBase64) {
      return NextResponse.json({
        videoDataUrl: `data:${videoMime};base64,${videoBase64}`,
        mimeType: videoMime,
        aspectRatio,
      });
    }

    if (videoUri) {
      return NextResponse.json({
        videoUri,
        mimeType: videoMime,
        aspectRatio,
      });
    }

    return NextResponse.json(
      {
        error:
          "The model completed the interaction but did not return a video payload. Please try a different photo or prompt.",
      },
      { status: 502 }
    );
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
