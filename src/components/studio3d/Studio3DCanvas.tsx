"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import {
  buildPcRig,
  type PcRigAssembly,
  type PcRigConfig,
  type SelectablePartId,
} from "@/components/studio3d/buildPcRig";

export type CameraPreset = "hero" | "interior" | "cooling" | "gpu" | "rear";

interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<CameraPreset, CameraView> = {
  hero: { position: [0.88, 0.44, 0.78], target: [0.0, 0.25, 0.0] },
  interior: { position: [0.68, 0.3, 0.02], target: [-0.02, 0.27, -0.02] },
  cooling: { position: [0.54, 0.42, 0.34], target: [-0.01, 0.33, 0.02] },
  gpu: { position: [0.56, 0.23, 0.28], target: [0.0, 0.24, -0.03] },
  rear: { position: [-0.76, 0.38, -0.72], target: [0.0, 0.25, -0.04] },
};

// Module-scope scratch vectors to avoid per-frame allocations
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _ndc = new THREE.Vector2();

interface Studio3DCanvasProps {
  config: PcRigConfig;
  explodedLevel: number;
  cameraPreset: CameraPreset;
  presetVersion: number;
  autoRotate: boolean;
  onSelectPart?: (partId: SelectablePartId, label: string) => void;
}

export default function Studio3DCanvas({
  config,
  explodedLevel,
  cameraPreset,
  presetVersion,
  autoRotate,
  onSelectPart,
}: Studio3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Refs synced to animation loop so WebGL context stays alive across UI updates
  const explodedTargetRef = useRef(explodedLevel);
  const explodedCurrentRef = useRef(explodedLevel);
  const autoRotateRef = useRef(autoRotate);
  const onSelectPartRef = useRef(onSelectPart);
  const rigRef = useRef<PcRigAssembly | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isSoftwareGlRef = useRef(false);
  const maxAnisotropyRef = useRef(4);
  const configRef = useRef(config);

  // Camera transition state (canceled immediately on OrbitControls 'start')
  const transitionActiveRef = useRef(false);
  const presetGoalPosRef = useRef(new THREE.Vector3(...CAMERA_PRESETS.hero.position));
  const presetGoalTargetRef = useRef(new THREE.Vector3(...CAMERA_PRESETS.hero.target));

  useEffect(() => {
    explodedTargetRef.current = explodedLevel;
  }, [explodedLevel]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    onSelectPartRef.current = onSelectPart;
  }, [onSelectPart]);

  // Trigger smooth camera preset glide
  useEffect(() => {
    if (presetVersion === 0) return;
    const view = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.hero;
    presetGoalPosRef.current.set(...view.position);
    presetGoalTargetRef.current.set(...view.target);
    transitionActiveRef.current = true;
  }, [cameraPreset, presetVersion]);

  // Fast appearance updates (case finish / RGB color) without rebuilding geometry
  useEffect(() => {
    const prev = configRef.current;
    configRef.current = config;

    if (!rigRef.current || !sceneRef.current) return;

    if (
      prev.coolingMode !== config.coolingMode ||
      prev.cpu !== config.cpu ||
      prev.gpu !== config.gpu
    ) {
      // Rebuild composite PC rig cleanly when structural architecture changes
      sceneRef.current.remove(rigRef.current.root);
      rigRef.current.dispose();
      const nextRig = buildPcRig(
        config,
        isSoftwareGlRef.current,
        maxAnisotropyRef.current
      );
      nextRig.setExploded(explodedCurrentRef.current);
      sceneRef.current.add(nextRig.root);
      rigRef.current = nextRig;
    } else {
      rigRef.current.updateAppearance({
        caseFinish: config.caseFinish,
        rgbColor: config.rgbColor,
      });
    }
  }, [config]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL rasterizers (e.g., SwiftShader / llvmpipe)
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement("canvas");
      const gl =
        probeCanvas.getContext("webgl2") || probeCanvas.getContext("webgl");
      if (gl) {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (ext) {
          const rendererStr = String(
            gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ""
          );
          if (/SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(rendererStr)) {
            isSoftwareGl = true;
          }
        }
      }
    } catch {
      isSoftwareGl = false;
    }
    isSoftwareGlRef.current = isSoftwareGl;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    maxAnisotropyRef.current = renderer.capabilities.getMaxAnisotropy();

    // Scene, backdrop & horizon-matched fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090f1c);
    scene.fog = new THREE.FogExp2(0x090f1c, 0.24);
    sceneRef.current = scene;

    // Procedural Studio IBL via PMREMGenerator + RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.85;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.05, 25);
    camera.position.set(...CAMERA_PRESETS.hero.position);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(...CAMERA_PRESETS.hero.target);
    controls.minDistance = 0.42;
    controls.maxDistance = 2.2;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.minPolarAngle = 0.12;
    controls.autoRotateSpeed = 0.7;
    controls.update();

    // User pointer/wheel interaction always cancels scripted camera glide immediately
    const handleControlStart = () => {
      transitionActiveRef.current = false;
    };
    controls.addEventListener("start", handleControlStart);

    // ── Studio Lighting Rig ──────────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(0xbcd8ff, 0x151e2e, 0.75);
    scene.add(hemiLight);

    // Warm key directional light with tightly fitted shadow frustum
    const keyLight = new THREE.DirectionalLight(0xfff1df, 2.2);
    keyLight.position.set(1.6, 2.2, 1.4);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.near = 0.4;
      keyLight.shadow.camera.far = 6.5;
      keyLight.shadow.camera.left = -0.85;
      keyLight.shadow.camera.right = 0.85;
      keyLight.shadow.camera.top = 0.85;
      keyLight.shadow.camera.bottom = -0.85;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool rim light separating silhouette from dark cyclorama
    const rimLight = new THREE.DirectionalLight(0x52d8ff, 1.15);
    rimLight.position.set(-1.5, 1.3, -1.4);
    scene.add(rimLight);

    // Soft overhead studio softbox (skipped only on software GL)
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xd9eeff, 2.4, 1.4, 0.9);
      softbox.position.set(0.3, 1.55, 0.25);
      softbox.lookAt(0, 0.24, 0);
      scene.add(softbox);
    }

    // ── Grounded Studio Workbench Pedestal & Floor ───────────────────────────
    const floorGeo = new THREE.CircleGeometry(6.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d1526,
      roughness: 0.76,
      metalness: 0.22,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle precision bench ring around the tower
    const benchRingGeo = new THREE.RingGeometry(0.41, 0.422, 64);
    const benchRingMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const benchRing = new THREE.Mesh(benchRingGeo, benchRingMat);
    benchRing.rotation.x = -Math.PI / 2;
    benchRing.position.y = 0.002;
    scene.add(benchRing);

    // Build initial composite PC Rig
    const rig = buildPcRig(
      configRef.current,
      isSoftwareGl,
      maxAnisotropyRef.current
    );
    rig.setExploded(explodedCurrentRef.current);
    scene.add(rig.root);
    rigRef.current = rig;

    // Click-to-inspect raycaster (distinguishes click vs drag)
    const raycaster = new THREE.Raycaster();
    let downX = 0;
    let downY = 0;
    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      if (dx * dx + dy * dy > 25 || !rigRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      _ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_ndc, camera);
      const hits = raycaster.intersectObjects(rigRef.current.root.children, true);
      for (const hit of hits) {
        const partId = hit.object.userData?.partId as SelectablePartId | undefined;
        const partLabel = hit.object.userData?.partLabel as string | undefined;
        if (partId && partLabel) {
          onSelectPartRef.current?.(partId, partLabel);
          break;
        }
      }
    };
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextW = Math.max(1, Math.floor(entry.contentRect.width));
      const nextH = Math.max(1, Math.floor(entry.contentRect.height));
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
    });
    resizeObserver.observe(container);

    // Animation loop with fixed-safe delta & software-GL frame pacing
    let rafId = 0;
    let timerId: number | null = null;
    let disposed = false;
    let lastTime = performance.now();

    const animate = (now: number) => {
      if (disposed) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Spin all chassis, radiator, and GPU cooling fans
      const currentRig = rigRef.current;
      if (currentRig) {
        const fanSpin = dt * 5.2;
        for (const rotor of currentRig.animatedFans) {
          rotor.rotation.z -= fanSpin;
        }

        // Smoothly damp exploded view slider
        const targetExp = explodedTargetRef.current;
        if (Math.abs(explodedCurrentRef.current - targetExp) > 0.0005) {
          explodedCurrentRef.current = THREE.MathUtils.damp(
            explodedCurrentRef.current,
            targetExp,
            6.5,
            dt
          );
          currentRig.setExploded(explodedCurrentRef.current);
        }
      }

      // Smooth damped camera preset transition
      if (transitionActiveRef.current) {
        _desiredPos.copy(presetGoalPosRef.current);
        _desiredTarget.copy(presetGoalTargetRef.current);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, 5.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, 5.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, 5.5, dt);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _desiredTarget.x, 5.5, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _desiredTarget.y, 5.5, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _desiredTarget.z, 5.5, dt);

        if (
          camera.position.distanceToSquared(_desiredPos) < 0.0002 &&
          controls.target.distanceToSquared(_desiredTarget) < 0.0002
        ) {
          transitionActiveRef.current = false;
        }
      }

      controls.autoRotate = autoRotateRef.current && !transitionActiveRef.current;
      controls.update();

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          if (!disposed) {
            rafId = window.requestAnimationFrame(animate);
          }
        }, 48);
      } else {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      if (timerId !== null) window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.removeEventListener("start", handleControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);

      if (rigRef.current) {
        scene.remove(rigRef.current.root);
        rigRef.current.dispose();
        rigRef.current = null;
      }

      floorGeo.dispose();
      floorMat.dispose();
      benchRingGeo.dispose();
      benchRingMat.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D PC Rig Studio Canvas"
    />
  );
}
