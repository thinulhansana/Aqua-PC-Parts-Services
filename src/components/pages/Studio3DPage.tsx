"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Cloud,
  Cpu,
  FolderOpen,
  Layers,
  LogIn,
  RotateCw,
  Save,
  Trash2,
  X,
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
import Studio3DCanvas, {
  type CameraPreset,
} from "@/components/studio3d/Studio3DCanvas";
import type {
  PcRigConfig,
  SelectablePartId,
} from "@/components/studio3d/buildPcRig";
import { useFirebaseAuth } from "@/components/firebase/FirebaseContext";
import {
  db,
  OperationType,
  handleFirestoreError,
  clampNumber,
  clampString,
  sanitizeHexColor,
  type CaseFinish,
  type CoolingMode,
} from "@/lib/firebase";

interface SavedRigBuildDoc {
  id: string;
  ownerId: string;
  name: string;
  cpu: string;
  gpu: string;
  coolingMode: CoolingMode;
  caseFinish: CaseFinish;
  rgbColor: string;
  explodedLevel: number;
  notes?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

const CPU_OPTIONS = [
  "Intel Core Ultra 9 285K",
  "AMD Ryzen 9 9950X3D",
  "Intel Core i7-14700K",
  "AMD Ryzen 7 9800X3D",
] as const;

const GPU_OPTIONS = [
  "RTX 5090 32GB Founders Lab",
  "RTX 5080 16GB Triple-Fan OC",
  "RTX 4070 Ti Super 16GB",
  "RX 7900 XTX 24GB Nitro",
] as const;

const RGB_SWATCHES = [
  { label: "Aqua Cyan", hex: "#00f0ff" },
  { label: "Emerald", hex: "#00e5a0" },
  { label: "Amber", hex: "#ff9f1c" },
  { label: "Violet", hex: "#a855f7" },
  { label: "Crimson", hex: "#ff3b5c" },
  { label: "Ice White", hex: "#e2f1ff" },
] as const;

const CAMERA_BUTTONS: { id: CameraPreset; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "interior", label: "Interior" },
  { id: "cooling", label: "Cooling" },
  { id: "gpu", label: "GPU" },
  { id: "rear", label: "Rear" },
];

export default function Studio3DPage() {
  const { firebaseUser, profileSynced, authLoading, signInWithGoogle } =
    useFirebaseAuth();

  const [config, setConfig] = useState<PcRigConfig>({
    cpu: CPU_OPTIONS[0],
    gpu: GPU_OPTIONS[0],
    coolingMode: "liquid",
    caseFinish: "obsidian",
    rgbColor: "#00f0ff",
  });

  const [explodedLevel, setExplodedLevel] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("hero");
  const [presetVersion, setPresetVersion] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedPart, setSelectedPart] = useState<{
    id: SelectablePartId;
    label: string;
  } | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [cloudDrawerOpen, setCloudDrawerOpen] = useState(false);

  // Cloud builds state
  const [savedBuilds, setSavedBuilds] = useState<SavedRigBuildDoc[]>([]);
  const [buildName, setBuildName] = useState("Aqua Flagship Loop");
  const [savingBuild, setSavingBuild] = useState(false);
  const [cloudFeedback, setCloudFeedback] = useState<string | null>(null);

  // Keyboard shortcut 'H' toggles HUD dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "h" || e.key === "H") {
        setControlsVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Live Firestore builds subscription when signed in
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.emailVerified) {
      setSavedBuilds([]);
      return;
    }
    const buildsPath = `users/${firebaseUser.uid}/builds`;
    const buildsQuery = query(
      collection(db, "users", firebaseUser.uid, "builds"),
      where("ownerId", "==", firebaseUser.uid)
    );
    const unsub = onSnapshot(
      buildsQuery,
      (snap) => {
        const rows: SavedRigBuildDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SavedRigBuildDoc, "id">),
        }));
        rows.sort((a, b) => {
          const tA = a.updatedAt?.toMillis?.() ?? 0;
          const tB = b.updatedAt?.toMillis?.() ?? 0;
          return tB - tA;
        });
        setSavedBuilds(rows);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, buildsPath);
        } catch {
          setCloudFeedback("Unable to load saved builds from cloud.");
        }
      }
    );
    return () => unsub();
  }, [firebaseUser]);

  const handleSelectCamera = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    setPresetVersion((v) => v + 1);
  }, []);

  const handleSelectPart = useCallback(
    (partId: SelectablePartId, label: string) => {
      setSelectedPart({ id: partId, label });
    },
    []
  );

  const handleSaveBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloudFeedback(null);
    if (!firebaseUser) {
      await signInWithGoogle();
      return;
    }
    if (!profileSynced) {
      setCloudFeedback("Syncing your profile... please try again in a moment.");
      return;
    }

    const cleanName = clampString(buildName || "Custom Aqua Rig", 80);
    if (!cleanName) return;

    const buildsPath = `users/${firebaseUser.uid}/builds`;
    setSavingBuild(true);
    try {
      await addDoc(collection(db, "users", firebaseUser.uid, "builds"), {
        ownerId: firebaseUser.uid,
        name: cleanName,
        cpu: clampString(config.cpu, 80),
        gpu: clampString(config.gpu, 80),
        coolingMode: config.coolingMode,
        caseFinish: config.caseFinish,
        rgbColor: sanitizeHexColor(config.rgbColor),
        explodedLevel: clampNumber(explodedLevel, 0, 1),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCloudFeedback(`Saved "${cleanName}" to Firestore.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, buildsPath);
    } finally {
      setSavingBuild(false);
    }
  };

  const handleLoadBuild = (item: SavedRigBuildDoc) => {
    setConfig({
      cpu: item.cpu,
      gpu: item.gpu,
      coolingMode: item.coolingMode,
      caseFinish: item.caseFinish,
      rgbColor: sanitizeHexColor(item.rgbColor),
    });
    setExplodedLevel(clampNumber(item.explodedLevel, 0, 1));
    setBuildName(item.name);
    setCloudFeedback(`Loaded "${item.name}".`);
  };

  const handleDeleteBuild = async (buildId: string) => {
    if (!firebaseUser) return;
    const docPath = `users/${firebaseUser.uid}/builds/${buildId}`;
    try {
      await deleteDoc(doc(db, "users", firebaseUser.uid, "builds", buildId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  };

  return (
    <section className="relative h-[calc(100vh-5rem)] min-h-[600px] w-full overflow-hidden bg-[#090f1c]">
      {/* Full-bleed WebGL 3D Studio Viewport */}
      <Studio3DCanvas
        config={config}
        explodedLevel={explodedLevel}
        cameraPreset={cameraPreset}
        presetVersion={presetVersion}
        autoRotate={autoRotate}
        onSelectPart={handleSelectPart}
      />

      {/* Minimal Top-Left Title Badge (solid/semi-opaque, zero backdrop-filter) */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="pointer-events-auto rounded-xl border border-slate-700/80 bg-[#0b111e]/92 px-3.5 py-2.5 text-slate-100 shadow-lg">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <h1 className="font-syne text-sm font-bold tracking-tight">
              Aqua 3D PC Rig Studio
            </h1>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            Drag to orbit · Scroll to zoom · Click any part to inspect
          </p>
        </div>

        {selectedPart && (
          <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-cyan-500/50 bg-[#0b111e]/94 px-3.5 py-2 text-xs text-slate-100 shadow-lg">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                Inspected Component
              </span>
              <span className="font-jakarta font-semibold">
                {selectedPart.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPart(null)}
              aria-label="Clear selected component"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Top-Right Compact HUD Visibility Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-[#0b111e]/92 px-3 py-2 font-mono text-xs text-slate-200 shadow-lg transition hover:border-cyan-400/60 hover:text-cyan-300 cursor-pointer"
        >
          {controlsVisible ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>Hide Controls (H)</span>
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Show Controls (H)</span>
            </>
          )}
        </button>
      </div>

      {/* Single Collapsible Bottom Control Dock (no backdrop-filter over WebGL) */}
      {controlsVisible && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
          <div className="pointer-events-auto w-full max-w-[min(940px,94vw)] rounded-2xl border border-slate-700/80 bg-[#0b111e]/95 p-3.5 text-slate-100 shadow-2xl">
            {/* Expandable Cloud Builds Drawer (inside bottom dock) */}
            {cloudDrawerOpen && (
              <div className="mb-3 rounded-xl border border-slate-700/80 bg-[#10192b] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-cyan-400" />
                    <span className="font-syne text-xs font-bold uppercase tracking-wider text-slate-200">
                      Cloud Saved 3D Builds
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCloudDrawerOpen(false)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
                    aria-label="Close cloud builds drawer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {!firebaseUser ? (
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-300">
                      Sign in with Google to save custom 3D rig configurations and
                      sync them across your devices.
                    </p>
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => void signInWithGoogle()}
                      className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 cursor-pointer disabled:opacity-60"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>
                        {authLoading ? "Connecting..." : "Sign in with Google"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 space-y-2.5">
                    <form
                      onSubmit={handleSaveBuild}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="text"
                        value={buildName}
                        onChange={(e) => setBuildName(e.target.value)}
                        maxLength={80}
                        placeholder="Name this rig build..."
                        className="min-w-[180px] flex-1 rounded-lg border border-slate-700 bg-[#090f1c] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                      <select
                        value={config.cpu}
                        onChange={(e) =>
                          setConfig((c) => ({ ...c, cpu: e.target.value }))
                        }
                        aria-label="Select CPU"
                        className="rounded-lg border border-slate-700 bg-[#090f1c] px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                      >
                        {CPU_OPTIONS.map((cpu) => (
                          <option key={cpu} value={cpu}>
                            {cpu}
                          </option>
                        ))}
                      </select>
                      <select
                        value={config.gpu}
                        onChange={(e) =>
                          setConfig((c) => ({ ...c, gpu: e.target.value }))
                        }
                        aria-label="Select GPU"
                        className="rounded-lg border border-slate-700 bg-[#090f1c] px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                      >
                        {GPU_OPTIONS.map((gpu) => (
                          <option key={gpu} value={gpu}>
                            {gpu}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={savingBuild}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-300 cursor-pointer disabled:opacity-60"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>{savingBuild ? "Saving..." : "Save Build"}</span>
                      </button>
                    </form>

                    {cloudFeedback && (
                      <p className="font-mono text-[11px] text-cyan-300">
                        {cloudFeedback}
                      </p>
                    )}

                    {savedBuilds.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No saved builds yet. Save your current 3D configuration
                        above.
                      </p>
                    ) : (
                      <div className="grid max-h-32 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
                        {savedBuilds.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/70 bg-[#090f1c] px-2.5 py-1.5"
                          >
                            <button
                              type="button"
                              onClick={() => handleLoadBuild(item)}
                              className="flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
                            >
                              <span
                                className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                                style={{ backgroundColor: item.rgbColor }}
                              />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-100">
                                  {item.name}
                                </p>
                                <p className="truncate font-mono text-[10px] text-slate-400">
                                  {item.coolingMode} · {item.caseFinish} ·{" "}
                                  {item.gpu}
                                </p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteBuild(item.id)}
                              aria-label={`Delete ${item.name}`}
                              className="rounded p-1 text-slate-400 hover:bg-rose-950/60 hover:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Row 1: Camera Presets + Exploded Slider + Auto-Orbit */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  View
                </span>
                {CAMERA_BUTTONS.map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => handleSelectCamera(btn.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      cameraPreset === btn.id
                        ? "bg-cyan-400 text-slate-950 font-semibold"
                        : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-mono text-[11px]">Explode</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={explodedLevel}
                    onChange={(e) => setExplodedLevel(Number(e.target.value))}
                    className="h-1.5 w-24 accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-[11px] text-slate-400">
                    {Math.round(explodedLevel * 100)}%
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setAutoRotate((r) => !r)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    autoRotate
                      ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                      : "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white"
                  }`}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Orbit</span>
                </button>
              </div>
            </div>

            {/* Row 2: Cooling + Chassis Finish + RGB Swatches + Cloud Builds */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-2.5">
              <div className="flex flex-wrap items-center gap-3">
                {/* Cooling Mode */}
                <div className="flex items-center gap-1">
                  <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Cooling
                  </span>
                  {(["liquid", "air", "hybrid"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setConfig((c) => ({ ...c, coolingMode: mode }))
                      }
                      className={`rounded-md px-2 py-1 text-xs capitalize transition cursor-pointer ${
                        config.coolingMode === mode
                          ? "bg-slate-200 font-semibold text-slate-950"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Case Finish */}
                <div className="flex items-center gap-1">
                  <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Case
                  </span>
                  {(["obsidian", "titanium", "frost"] as const).map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() =>
                        setConfig((c) => ({ ...c, caseFinish: finish }))
                      }
                      className={`rounded-md px-2 py-1 text-xs capitalize transition cursor-pointer ${
                        config.caseFinish === finish
                          ? "bg-slate-200 font-semibold text-slate-950"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>

                {/* RGB / Coolant Color Swatches */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    RGB
                  </span>
                  {RGB_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      title={swatch.label}
                      aria-label={`Set RGB color to ${swatch.label}`}
                      onClick={() =>
                        setConfig((c) => ({ ...c, rgbColor: swatch.hex }))
                      }
                      className={`h-5 w-5 rounded-full border-2 transition cursor-pointer ${
                        config.rgbColor.toLowerCase() === swatch.hex
                          ? "scale-110 border-white"
                          : "border-slate-700 hover:scale-105"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Cloud Save / Load Button */}
              <button
                type="button"
                onClick={() => setCloudDrawerOpen((open) => !open)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  cloudDrawerOpen
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-cyan-400/50 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25"
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>
                  Cloud Builds{savedBuilds.length > 0 ? ` (${savedBuilds.length})` : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
