"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import {
  AlertCircle,
  Bot,
  Cloud,
  Download,
  ExternalLink,
  Film,
  Globe,
  ImagePlus,
  Loader2,
  LogIn,
  MapPin,
  Navigation,
  Send,
  Sparkles,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";
import { useFirebaseAuth } from "@/components/firebase/FirebaseContext";
import {
  db,
  OperationType,
  handleFirestoreError,
  clampString,
  type ChatMode,
} from "@/lib/firebase";

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

interface ChatTurn {
  id: string;
  role: "user" | "model";
  text: string;
  model: string;
  mode: ChatMode;
  webSources?: WebSource[];
  mapSources?: MapSource[];
  searchQueries?: string[];
  persisted?: boolean;
  createdAtMs?: number;
}

const MODELS = [
  {
    id: "gemini-4-hydrogen",
    label: "Gemini 4 Hydrogen",
    hint: "Default · Free tier",
  },
  {
    id: "gemini-3.1-flash-lite",
    label: "Gemini 3.1 Flash Lite",
    hint: "Ultra-fast · Free tier",
  },
  {
    id: "gemini-4-neon",
    label: "Gemini 4 Neon",
    hint: "Pro reasoning · Billing key",
  },
  {
    id: "gemini-4-carbon",
    label: "Gemini 4 Carbon",
    hint: "Frontier coding · Billing key",
  },
] as const;

const STARTER_PROMPTS: { label: string; mode: ChatMode; prompt: string }[] = [
  {
    label: "1440p Gaming Build (LKR)",
    mode: "standard",
    prompt:
      "Design a balanced 1440p gaming & editing PC build with a 1000W PSU upgrade path, thermal airflow plan, and compatibility check.",
  },
  {
    label: "Live GPU Benchmarks (Search)",
    mode: "search",
    prompt:
      "Compare current RTX 5070 Ti vs RX 9070 XT 1440p raster and ray-tracing benchmark averages and power draw.",
  },
  {
    label: "Nearby Couriers & Tech Shops (Maps)",
    mode: "maps",
    prompt:
      "Find well-rated computer hardware shops, courier drop-off points, or electronics repair centers near Embilipitiya, Sri Lanka.",
  },
];

const RIG_PRESETS = [
  {
    label: "Flagship Showcase Rig",
    src: "/aqua-pc-parts/assets/hero-rig.jpg",
    prompt:
      "Slow cinematic camera orbit around this glowing custom gaming PC rig, subtle RGB fan reflections and gentle coolant light shimmer.",
  },
  {
    label: "Liquid Cooling Loop",
    src: "/aqua-pc-parts/assets/cooling-loop.jpg",
    prompt:
      "Smooth macro dolly push-in along the custom liquid cooling tubing with shimmering cyan coolant flow and crisp studio reflections.",
  },
  {
    label: "RGB Memory Macro",
    src: "/aqua-pc-parts/assets/rgb-ram-macro.jpg",
    prompt:
      "Smooth dramatic macro pan across glowing DDR5 RGB memory modules with gentle pulsing light waves and shallow depth of field.",
  },
] as const;

export default function AiLabPage() {
  const { firebaseUser, profileSynced, authLoading, signInWithGoogle } =
    useFirebaseAuth();

  const [activeTab, setActiveTab] = useState<"chat" | "animate">("chat");

  // ── Chat + Search + Maps Grounding state ───────────────────────────────────
  const [selectedModel, setSelectedModel] = useState<string>("gemini-4-hydrogen");
  const [chatMode, setChatMode] = useState<ChatMode>("standard");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    label: string;
  } | null>(null);
  const [locating, setLocating] = useState(false);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // ── Image-to-Video Animator state ──────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [videoPrompt, setVideoPrompt] = useState<string>(
    "Smooth slow cinematic camera push-in around this custom PC rig with gentle fan spin and glowing RGB reflections."
  );
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [animating, setAnimating] = useState(false);
  const [animateError, setAnimateError] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<{
    src: string;
    mimeType: string;
    aspectRatio: string;
  } | null>(null);

  // Auto-scroll chat thread on new messages
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Live Firestore chat history sync when signed in with Firebase Google Auth
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.emailVerified) {
      return;
    }
    const chatPath = `users/${firebaseUser.uid}/chatMessages`;
    const chatQuery = query(
      collection(db, "users", firebaseUser.uid, "chatMessages"),
      where("ownerId", "==", firebaseUser.uid)
    );

    const unsub = onSnapshot(
      chatQuery,
      (snap) => {
        const persistedRows: ChatTurn[] = snap.docs.map((d) => {
          const data = d.data() as {
            role: "user" | "model";
            text: string;
            model: string;
            mode: ChatMode;
            createdAt?: Timestamp | null;
          };
          return {
            id: d.id,
            role: data.role,
            text: data.text,
            model: data.model,
            mode: data.mode,
            persisted: true,
            createdAtMs: data.createdAt?.toMillis?.() ?? Date.now(),
          };
        });
        persistedRows.sort((a, b) => (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0));

        // Merge with any in-memory grounding metadata attached during this session
        setMessages((prev) => {
          const metaByText = new Map<
            string,
            Pick<ChatTurn, "webSources" | "mapSources" | "searchQueries">
          >();
          for (const item of prev) {
            if (item.webSources?.length || item.mapSources?.length) {
              metaByText.set(`${item.role}:${item.text.slice(0, 120)}`, {
                webSources: item.webSources,
                mapSources: item.mapSources,
                searchQueries: item.searchQueries,
              });
            }
          }
          return persistedRows.map((row) => {
            const extra = metaByText.get(`${row.role}:${row.text.slice(0, 120)}`);
            return extra ? { ...row, ...extra } : row;
          });
        });
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, chatPath);
        } catch {
          setChatError("Unable to sync saved chat history from cloud.");
        }
      }
    );

    return () => unsub();
  }, [firebaseUser]);

  const handleRequestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setChatError(
        "Geolocation is not supported in this browser. Maps mode will default to Embilipitiya, Sri Lanka."
      );
      return;
    }
    setLocating(true);
    setChatError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          label: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setChatError(
          "Location access was declined. Maps grounding will use Aqua PC Solutions Lab (Embilipitiya, Sri Lanka)."
        );
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const persistMessageToFirestore = async (
    role: "user" | "model",
    text: string,
    model: string,
    mode: ChatMode
  ) => {
    if (!firebaseUser || !firebaseUser.emailVerified || !profileSynced) return;
    const chatPath = `users/${firebaseUser.uid}/chatMessages`;
    try {
      await addDoc(collection(db, "users", firebaseUser.uid, "chatMessages"), {
        ownerId: firebaseUser.uid,
        role,
        text: clampString(text, 8000),
        model: clampString(model, 64),
        mode,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, chatPath);
    }
  };

  const sendMessage = async (overrideText?: string, overrideMode?: ChatMode) => {
    const text = (overrideText ?? inputText).trim();
    const activeMode = overrideMode ?? chatMode;
    if (!text || sending) return;

    setChatError(null);
    if (!overrideText) setInputText("");

    const effectiveModel =
      activeMode === "search" || activeMode === "maps"
        ? "gemini-4-hydrogen"
        : selectedModel;

    const userTurn: ChatTurn = {
      id: `local-user-${Date.now()}`,
      role: "user",
      text,
      model: effectiveModel,
      mode: activeMode,
      createdAtMs: Date.now(),
    };

    const nextHistory = [...messages, userTurn];
    if (!firebaseUser) {
      setMessages(nextHistory);
    } else {
      await persistMessageToFirestore("user", text, effectiveModel, activeMode);
    }

    setSending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.slice(-16).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          model: effectiveModel,
          mode: activeMode,
          userLocation: userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }
            : undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        text?: string;
        model?: string;
        mode?: ChatMode;
        webSources?: WebSource[];
        mapSources?: MapSource[];
        searchQueries?: string[];
        error?: string;
      };

      if (!res.ok || !data.text) {
        setChatError(
          data.error || "Unable to complete request. Please try again."
        );
        return;
      }

      const modelTurn: ChatTurn = {
        id: `local-model-${Date.now()}`,
        role: "model",
        text: data.text,
        model: data.model || effectiveModel,
        mode: data.mode || activeMode,
        webSources: data.webSources || [],
        mapSources: data.mapSources || [],
        searchQueries: data.searchQueries || [],
        createdAtMs: Date.now(),
      };

      setMessages((prev) => [...prev, modelTurn]);

      if (firebaseUser && profileSynced) {
        await persistMessageToFirestore(
          "model",
          modelTurn.text,
          modelTurn.model,
          modelTurn.mode
        );
      }
    } catch {
      setChatError("Network error contacting Aqua AI Lab. Please retry.");
    } finally {
      setSending(false);
    }
  };

  const handleClearChat = async () => {
    setChatError(null);
    if (!firebaseUser) {
      setMessages([]);
      return;
    }
    const persisted = messages.filter((m) => m.persisted);
    for (const msg of persisted) {
      const path = `users/${firebaseUser.uid}/chatMessages/${msg.id}`;
      try {
        await deleteDoc(doc(db, "users", firebaseUser.uid, "chatMessages", msg.id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
    setMessages([]);
  };

  // ── Image-to-Video Handlers ────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnimateError(null);
    setVideoResult(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAnimateError("Please upload a JPG, PNG, or WebP photo.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setAnimateError("Image exceeds the 8 MB limit. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setImagePreview(result);
      setImageMime(file.type);
      setImageBase64(result.replace(/^data:[^;]+;base64,/, ""));
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPresetImage = async (preset: (typeof RIG_PRESETS)[number]) => {
    setAnimateError(null);
    setVideoResult(null);
    setVideoPrompt(preset.prompt);
    try {
      const resp = await fetch(preset.src);
      const blob = await resp.blob();
      const mime = blob.type || "image/jpeg";
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        if (!result) return;
        setImagePreview(result);
        setImageMime(mime);
        setImageBase64(result.replace(/^data:[^;]+;base64,/, ""));
      };
      reader.readAsDataURL(blob);
    } catch {
      setAnimateError("Could not load preset showroom image.");
    }
  };

  const handleAnimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64 || animating) return;
    setAnimateError(null);
    setVideoResult(null);
    setAnimating(true);

    try {
      const res = await fetch("/api/ai/animate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: imageMime,
          prompt: videoPrompt,
          aspectRatio,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        videoDataUrl?: string;
        videoUri?: string;
        mimeType?: string;
        aspectRatio?: string;
        error?: string;
      };
      if (!res.ok) {
        setAnimateError(
          data.error || "Video animation failed. Please try again."
        );
        return;
      }
      const src = data.videoDataUrl || data.videoUri;
      if (!src) {
        setAnimateError("No video data was returned by the model.");
        return;
      }
      setVideoResult({
        src,
        mimeType: data.mimeType || "video/mp4",
        aspectRatio: data.aspectRatio || aspectRatio,
      });
    } catch {
      setAnimateError("Network timeout while animating your rig photo.");
    } finally {
      setAnimating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Aqua PC Solutions · AI Engineering Suite
          </span>
          <h1 className="mt-1 font-syne text-3xl font-extrabold text-on-surface sm:text-4xl">
            Aqua AI Hardware Lab
          </h1>
          <p className="mt-1.5 max-w-2xl text-body-md text-on-surface-variant">
            Ask our Gemini hardware engineer about custom builds, query live
            Google Search benchmarks, find nearby places via Google Maps, or
            animate PC rig photos into cinema reels.
          </p>
        </div>

        {/* Cloud Sync Status / Google Sign-In */}
        <div className="flex items-center gap-2">
          {firebaseUser ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-secondary/35 bg-surface-container px-3.5 py-2 text-xs text-on-surface">
              <Cloud className="h-4 w-4 text-secondary" />
              <span className="font-medium">
                Synced as {firebaseUser.displayName?.split(" ")[0] || firebaseUser.email}
              </span>
            </div>
          ) : (
            <button
              type="button"
              disabled={authLoading}
              onClick={() => void signInWithGoogle()}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-surface-container px-3.5 py-2 text-xs font-semibold text-on-surface transition hover:border-primary hover:text-primary cursor-pointer disabled:opacity-60"
            >
              <LogIn className="h-4 w-4 text-primary" />
              <span>
                {authLoading ? "Connecting..." : "Sign in with Google to Sync"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Tabs: Hardware Chatbot vs Image-to-Video */}
      <div className="mb-6 inline-flex rounded-xl border border-outline-variant/30 bg-surface-container p-1">
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer ${
            activeTab === "chat"
              ? "bg-gradient-primary text-on-primary shadow-cyan-glow"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>Gemini Chat · Search &amp; Maps</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("animate")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer ${
            activeTab === "animate"
              ? "bg-gradient-primary text-on-primary shadow-cyan-glow"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Film className="h-4 w-4" />
          <span>Rig Photo-to-Video</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: MULTI-TURN GEMINI CHAT + GOOGLE SEARCH + GOOGLE MAPS           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "chat" && (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-glass overflow-hidden">
          {/* Toolbar: Grounding Mode + Model Selector + Location + Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/25 bg-surface-container px-4 py-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "standard", label: "Hardware Chat", icon: Sparkles },
                  { id: "search", label: "Google Search", icon: Globe },
                  { id: "maps", label: "Google Maps", icon: MapPin },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = chatMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChatMode(m.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? "bg-primary/15 text-primary border border-primary/40"
                        : "bg-surface-container-high/60 text-on-surface-variant border border-transparent hover:text-on-surface"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {chatMode === "maps" && (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-high px-2.5 py-1.5 text-xs font-medium text-on-surface transition hover:border-primary/50 hover:text-primary cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {locating
                      ? "Locating..."
                      : userLocation
                      ? `GPS: ${userLocation.label}`
                      : "Use My Location"}
                  </span>
                </button>
              )}

              <select
                value={
                  chatMode === "standard" ? selectedModel : "gemini-4-hydrogen"
                }
                disabled={chatMode !== "standard"}
                onChange={(e) => setSelectedModel(e.target.value)}
                aria-label="Select Gemini model"
                className="rounded-lg border border-outline-variant/40 bg-surface-container-high px-2.5 py-1.5 text-xs font-medium text-on-surface focus:border-primary focus:outline-none disabled:opacity-70"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.hint})
                  </option>
                ))}
              </select>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => void handleClearChat()}
                  className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 px-2.5 py-1.5 text-xs text-on-surface-variant transition hover:border-error/40 hover:text-error cursor-pointer"
                  title="Clear conversation history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="h-[480px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/25">
                  <Bot className="h-6 w-6" />
                </div>
                <h2 className="mt-3 font-syne text-xl font-bold text-on-surface">
                  Ask the Aqua Hardware Engineer
                </h2>
                <p className="mt-1 max-w-md text-body-sm text-on-surface-variant">
                  Switch between standard engineering chat, live Google Search
                  grounding, and Google Maps place search.
                </p>
                <div className="mt-5 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {STARTER_PROMPTS.map((starter) => (
                    <button
                      key={starter.label}
                      type="button"
                      onClick={() => {
                        setChatMode(starter.mode);
                        void sendMessage(starter.prompt, starter.mode);
                      }}
                      className="rounded-xl border border-outline-variant/30 bg-surface-container p-3 text-left transition hover:border-primary/50 hover:bg-surface-container-high cursor-pointer"
                    >
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-primary">
                        {starter.mode}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-on-surface">
                        {starter.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        isUser
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-secondary/40 bg-secondary/15 text-secondary"
                      }`}
                    >
                      {isUser ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
                        isUser
                          ? "border-primary/30 bg-primary/10 text-on-surface"
                          : "border-outline-variant/30 bg-surface-container text-on-surface"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                        <span>{isUser ? "You" : msg.model}</span>
                        <span>·</span>
                        <span>{msg.mode}</span>
                      </div>

                      <div className="space-y-2 text-body-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:font-syne [&_h3]:font-bold [&_strong]:text-on-surface [&_a]:text-primary [&_a]:underline">
                        <Markdown>{msg.text}</Markdown>
                      </div>

                      {/* Google Search Web Grounding Citations */}
                      {msg.webSources && msg.webSources.length > 0 && (
                        <div className="mt-3 border-t border-outline-variant/25 pt-2.5">
                          <span className="mb-1.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                            <Globe className="h-3 w-3" />
                            <span>Google Search Sources</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.webSources.map((src) => (
                              <a
                                key={src.uri}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/35 bg-surface-container-low px-2.5 py-1 text-xs text-on-surface transition hover:border-primary/60 hover:text-primary"
                              >
                                <span className="max-w-[200px] truncate">
                                  {src.title}
                                </span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Google Maps Grounding Place Cards & Review Snippets */}
                      {msg.mapSources && msg.mapSources.length > 0 && (
                        <div className="mt-3 border-t border-outline-variant/25 pt-2.5">
                          <span className="mb-1.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-secondary">
                            <MapPin className="h-3 w-3" />
                            <span>Google Maps Places</span>
                          </span>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {msg.mapSources.map((place) => (
                              <div
                                key={place.uri}
                                className="rounded-xl border border-outline-variant/35 bg-surface-container-low p-2.5"
                              >
                                <a
                                  href={place.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                >
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span>{place.title}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                                {place.reviewSnippets.length > 0 && (
                                  <div className="mt-1.5 space-y-1">
                                    {place.reviewSnippets
                                      .slice(0, 2)
                                      .map((snippet, idx) => (
                                        <p
                                          key={idx}
                                          className="text-[11px] italic text-on-surface-variant"
                                        >
                                          &ldquo;{snippet.text}&rdquo;
                                          {snippet.uri && (
                                            <a
                                              href={snippet.uri}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="ml-1 text-primary underline"
                                            >
                                              Review
                                            </a>
                                          )}
                                        </p>
                                      ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex items-center gap-2.5 text-xs text-on-surface-variant">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>
                  {chatMode === "search"
                    ? "Searching live web benchmarks..."
                    : chatMode === "maps"
                    ? "Querying Google Maps places..."
                    : "Engineering hardware response..."}
                </span>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Error Banner */}
          {chatError && (
            <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-error/45 bg-error-container/25 px-3.5 py-2.5 text-xs text-on-error-container">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
              <span>{chatError}</span>
            </div>
          )}

          {/* Chat Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
            className="flex items-center gap-2 border-t border-outline-variant/25 bg-surface-container p-3 sm:p-4"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sending}
              maxLength={4000}
              placeholder={
                chatMode === "search"
                  ? "Ask for live hardware prices, drivers, or benchmarks..."
                  : chatMode === "maps"
                  ? "Search nearby PC shops, couriers, or tech labs..."
                  : "Ask about custom PC builds, GPU pairing, thermal paste, or BIOS tuning..."
              }
              className="flex-1 rounded-xl border border-outline-variant/35 bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 font-syne text-sm font-bold text-on-primary shadow-cyan-glow transition hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: RIG PHOTO-TO-VIDEO ANIMATOR (gemini-omni-1.2-flash)            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "animate" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Upload & Controls */}
          <form
            onSubmit={handleAnimate}
            className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-glass"
          >
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">
                Animate PC Rig Photo
              </h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Upload a photo of your PC build or pick a showroom rig below to
                generate a short showcase clip with Gemini Omni 1.2 Flash.
              </p>
            </div>

            {/* File Dropzone */}
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container p-5 text-center transition hover:border-primary/60 cursor-pointer">
              <ImagePlus className="h-7 w-7 text-primary" />
              <span className="text-sm font-semibold text-on-surface">
                Click to upload a rig photo (JPG, PNG, WebP · max 8 MB)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Quick Showroom Presets */}
            <div>
              <span className="block font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Or load an Aqua Showroom Rig
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {RIG_PRESETS.map((preset) => (
                  <button
                    key={preset.src}
                    type="button"
                    onClick={() => void handleLoadPresetImage(preset)}
                    className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container text-left transition hover:border-primary/60 cursor-pointer"
                  >
                    <div className="relative h-16 w-full overflow-hidden">
                      <Image
                        src={preset.src}
                        alt={preset.label}
                        fill
                        sizes="180px"
                        referrerPolicy="no-referrer"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <span className="block truncate px-2 py-1.5 text-[11px] font-medium text-on-surface">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <span className="block font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Video Aspect Ratio
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "16:9", label: "16:9 Landscape (YouTube / Hero)" },
                    { id: "9:16", label: "9:16 Portrait (Reels / Shorts)" },
                  ] as const
                ).map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                      aspectRatio === ratio.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-outline-variant/35 bg-surface-container text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Prompt */}
            <div>
              <label
                htmlFor="video-motion-prompt"
                className="block font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
              >
                Camera &amp; Motion Prompt
              </label>
              <textarea
                id="video-motion-prompt"
                rows={3}
                maxLength={600}
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-outline-variant/35 bg-surface-container px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>

            {animateError && (
              <div className="flex items-start gap-2 rounded-xl border border-error/45 bg-error-container/25 p-3 text-xs text-on-error-container">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                <span>{animateError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!imageBase64 || animating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-syne text-sm font-bold text-on-primary shadow-cyan-glow transition hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {animating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Video (may take 30–90s)...</span>
                </>
              ) : (
                <>
                  <Film className="h-4 w-4" />
                  <span>Animate Rig Photo</span>
                </>
              )}
            </button>
          </form>

          {/* Right: Source Preview & Generated Video Stage */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                {videoResult ? "Generated Video Output" : "Source Frame Preview"}
              </span>
              {videoResult && (
                <a
                  href={videoResult.src}
                  download={`aqua-rig-${videoResult.aspectRatio.replace(":", "x")}.mp4`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download MP4</span>
                </a>
              )}
            </div>

            <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-outline-variant/25 bg-[#090f1c]">
              {videoResult ? (
                <video
                  src={videoResult.src}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[440px] w-full object-contain"
                />
              ) : imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Selected PC rig source frame"
                  className="max-h-[440px] w-full object-contain"
                />
              ) : (
                <div className="px-6 text-center">
                  <Film className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-2 text-sm text-slate-400">
                    Upload a PC build photo or pick a showroom rig preset on the
                    left to preview and animate it.
                  </p>
                </div>
              )}
            </div>

            <p className="font-mono text-[11px] text-on-surface-variant">
              Powered server-side by{" "}
              <span className="text-primary">gemini-omni-1.2-flash</span> via the
              Gemini Interactions API. Note: video synthesis requires a
              billing-enabled Gemini API key in Settings &gt; Secrets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
