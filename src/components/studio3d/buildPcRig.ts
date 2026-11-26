import * as THREE from "three";
import type { CaseFinish, CoolingMode } from "@/lib/firebase";

export type SelectablePartId =
  | "chassis"
  | "glass"
  | "motherboard"
  | "gpu"
  | "cpu-cooler"
  | "ram"
  | "radiator"
  | "psu";

export interface PcRigConfig {
  cpu: string;
  gpu: string;
  coolingMode: CoolingMode;
  caseFinish: CaseFinish;
  rgbColor: string;
}

export interface ExplodableEntry {
  object: THREE.Object3D;
  assembled: THREE.Vector3;
  offset: THREE.Vector3;
}

export interface PcRigAssembly {
  root: THREE.Group;
  animatedFans: THREE.Object3D[];
  explodables: ExplodableEntry[];
  updateAppearance: (config: Pick<PcRigConfig, "caseFinish" | "rgbColor">) => void;
  setExploded: (level: number) => void;
  dispose: () => void;
}

const FINISH_PALETTE: Record<
  CaseFinish,
  { body: number; accent: number; mesh: number; roughness: number; metalness: number }
> = {
  obsidian: {
    body: 0x161b24,
    accent: 0x262f3e,
    mesh: 0x12161f,
    roughness: 0.44,
    metalness: 0.72,
  },
  titanium: {
    body: 0x4b5563,
    accent: 0x64748b,
    mesh: 0x2b323d,
    roughness: 0.34,
    metalness: 0.84,
  },
  frost: {
    body: 0xd8e0ea,
    accent: 0xb7c4d6,
    mesh: 0x9aa8bc,
    roughness: 0.36,
    metalness: 0.38,
  },
};

function createMotherboardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#11161f";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle matte PCB fiberglass weave
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Copper/cyan diagnostic routing traces
    ctx.strokeStyle = "#263c52";
    ctx.lineWidth = 2;
    for (let i = 0; i < 28; i++) {
      const y = 36 + i * 16;
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(140 + (i % 5) * 28, y);
      ctx.lineTo(180 + (i % 5) * 28, y + 18);
      ctx.lineTo(480, y + 18);
      ctx.stroke();
    }

    // Gold contact vias & pads
    ctx.fillStyle = "#c8a962";
    for (let x = 44; x < 480; x += 48) {
      for (let y = 44; y < 480; y += 52) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Silkscreen branding
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("AQUA Z890 LAB", 280, 468);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "600 13px monospace";
    ctx.fillText("GRADE-A BENCH VERIFIED", 280, 488);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return texture;
}

function createBrushedMetalTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const v = 115 + ((y * 37) % 28);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, 256, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
    grad.addColorStop(0, "rgba(0,0,0,0.58)");
    grad.addColorStop(0.55, "rgba(0,0,0,0.26)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function tagPart(
  obj: THREE.Object3D,
  partId: SelectablePartId,
  partLabel: string
): void {
  obj.userData.partId = partId;
  obj.userData.partLabel = partLabel;
  obj.traverse((child) => {
    child.userData.partId = partId;
    child.userData.partLabel = partLabel;
  });
}

function createFanAssembly(
  radius: number,
  depth: number,
  frameMat: THREE.Material,
  bladeMat: THREE.Material,
  rgbMat: THREE.Material,
  animatedFans: THREE.Object3D[]
): THREE.Group {
  const group = new THREE.Group();

  // Outer fan frame ring
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius, depth * 0.34, 10, 24),
    frameMat
  );
  outerRing.castShadow = true;
  group.add(outerRing);

  // Subtle glowing RGB inner halo
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.92, depth * 0.12, 8, 24),
    rgbMat
  );
  group.add(halo);

  // Rotating hub + 7 swept impeller blades
  const rotor = new THREE.Group();
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, depth * 0.72, 16),
    frameMat
  );
  hub.rotation.x = Math.PI / 2;
  rotor.add(hub);

  const bladeGeo = new THREE.BoxGeometry(radius * 0.64, radius * 0.16, depth * 0.12);
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const bladePivot = new THREE.Group();
    bladePivot.rotation.z = angle;
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.x = radius * 0.52;
    blade.rotation.x = 0.42;
    bladePivot.add(blade);
    rotor.add(bladePivot);
  }

  group.add(rotor);
  animatedFans.push(rotor);
  return group;
}

export function buildPcRig(
  config: PcRigConfig,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): PcRigAssembly {
  const root = new THREE.Group();
  root.name = "AquaPcRigRoot";

  const animatedFans: THREE.Object3D[] = [];
  const explodables: ExplodableEntry[] = [];
  const disposables: { dispose: () => void }[] = [];

  const registerExplodable = (
    object: THREE.Object3D,
    offset: THREE.Vector3
  ) => {
    explodables.push({
      object,
      assembled: object.position.clone(),
      offset,
    });
  };

  // Textures
  const pcbTex = createMotherboardTexture(maxAnisotropy);
  const brushedTex = createBrushedMetalTexture(maxAnisotropy);
  const contactShadowTex = createContactShadowTexture();
  disposables.push(pcbTex, brushedTex, contactShadowTex);

  // Shared materials
  const palette = FINISH_PALETTE[config.caseFinish];
  const rgbColorObj = new THREE.Color(config.rgbColor);

  const chassisBodyMat = new THREE.MeshStandardMaterial({
    color: palette.body,
    roughness: palette.roughness,
    metalness: palette.metalness,
    roughnessMap: brushedTex,
  });
  const chassisAccentMat = new THREE.MeshStandardMaterial({
    color: palette.accent,
    roughness: 0.38,
    metalness: 0.78,
  });
  const meshGrilleMat = new THREE.MeshStandardMaterial({
    color: palette.mesh,
    roughness: 0.65,
    metalness: 0.45,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1b212c,
    roughness: 0.42,
    metalness: 0.8,
  });
  const brushedSteelMat = new THREE.MeshStandardMaterial({
    color: 0xa4b0c0,
    roughness: 0.28,
    metalness: 0.9,
    roughnessMap: brushedTex,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xc87442,
    roughness: 0.26,
    metalness: 0.92,
  });
  const rubberMat = new THREE.MeshStandardMaterial({
    color: 0x0d1015,
    roughness: 0.9,
    metalness: 0.05,
  });
  const pcbMat = new THREE.MeshStandardMaterial({
    map: pcbTex,
    roughness: 0.56,
    metalness: 0.25,
  });
  const fanBladeMat = new THREE.MeshStandardMaterial({
    color: 0x2a3444,
    roughness: 0.45,
    metalness: 0.35,
  });
  const rgbEmissiveMat = new THREE.MeshStandardMaterial({
    color: rgbColorObj.clone(),
    emissive: rgbColorObj.clone(),
    emissiveIntensity: 1.8,
    roughness: 0.22,
    metalness: 0.1,
  });
  const coolantMat = new THREE.MeshPhysicalMaterial({
    color: rgbColorObj.clone(),
    emissive: rgbColorObj.clone(),
    emissiveIntensity: 0.7,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbcd4eb,
    roughness: 0.08,
    metalness: 0.05,
    ior: 1.5,
    transmission: isSoftwareGl ? 0 : 0.84,
    transparent: true,
    opacity: isSoftwareGl ? 0.22 : 0.95,
    depthWrite: false,
  });

  disposables.push(
    chassisBodyMat,
    chassisAccentMat,
    meshGrilleMat,
    darkMetalMat,
    brushedSteelMat,
    copperMat,
    rubberMat,
    pcbMat,
    fanBladeMat,
    rgbEmissiveMat,
    coolantMat,
    glassMat
  );

  // Dimensions (meters): W=0.24 (X), H=0.47 (Y), D=0.46 (Z)
  // Front = +Z, Rear = -Z, Tempered Glass Side = +X, Motherboard Tray Side = -X
  const footH = 0.022;
  const caseY0 = footH;

  // Radial contact shadow plane anchored right above floor (y = 0.004)
  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.72),
    new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
    })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.004;
  root.add(contactShadow);

  // ── 1. CHASSIS & FEET ──────────────────────────────────────────────────────
  const chassisGroup = new THREE.Group();
  chassisGroup.name = "Chassis";

  // 4 CNC isolation feet resting flush at y=0
  const footGeo = new THREE.CylinderGeometry(0.02, 0.024, footH, 20);
  const footRingGeo = new THREE.TorusGeometry(0.021, 0.0025, 8, 20);
  const footCoords: [number, number][] = [
    [-0.085, -0.185],
    [0.085, -0.185],
    [-0.085, 0.185],
    [0.085, 0.185],
  ];
  for (const [fx, fz] of footCoords) {
    const foot = new THREE.Mesh(footGeo, rubberMat);
    foot.position.set(fx, footH / 2, fz);
    foot.castShadow = true;
    foot.receiveShadow = true;
    chassisGroup.add(foot);

    const ring = new THREE.Mesh(footRingGeo, brushedSteelMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(fx, footH * 0.65, fz);
    chassisGroup.add(ring);
  }

  // Bottom floor pan
  const bottomPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.016, 0.46),
    chassisBodyMat
  );
  bottomPlate.position.set(0, caseY0 + 0.008, 0);
  bottomPlate.castShadow = true;
  bottomPlate.receiveShadow = true;
  chassisGroup.add(bottomPlate);

  // Top roof frame with recessed dust filter
  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.02, 0.46),
    chassisBodyMat
  );
  topFrame.position.set(0, caseY0 + 0.46, 0);
  topFrame.castShadow = true;
  topFrame.receiveShadow = true;
  chassisGroup.add(topFrame);

  const topFilter = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.004, 0.36),
    meshGrilleMat
  );
  topFilter.position.set(0.01, caseY0 + 0.471, 0.01);
  chassisGroup.add(topFilter);

  // Back wall (-X, solid cable-management side panel)
  const rightSidePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.456, 0.454),
    chassisBodyMat
  );
  rightSidePanel.position.set(-0.113, caseY0 + 0.236, 0);
  rightSidePanel.castShadow = true;
  rightSidePanel.receiveShadow = true;
  chassisGroup.add(rightSidePanel);

  // Internal motherboard tray (-X + 0.035)
  const moboTray = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.35, 0.42),
    chassisAccentMat
  );
  moboTray.position.set(-0.082, caseY0 + 0.28, 0);
  moboTray.receiveShadow = true;
  chassisGroup.add(moboTray);

  // Rear exhaust wall (-Z)
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.456, 0.014),
    chassisBodyMat
  );
  rearWall.position.set(0, caseY0 + 0.236, -0.223);
  rearWall.castShadow = true;
  rearWall.receiveShadow = true;
  chassisGroup.add(rearWall);

  // Rear 120mm exhaust fan
  const rearFan = createFanAssembly(
    0.052,
    0.016,
    darkMetalMat,
    fanBladeMat,
    rgbEmissiveMat,
    animatedFans
  );
  rearFan.position.set(0.015, caseY0 + 0.34, -0.205);
  chassisGroup.add(rearFan);

  // Front beveled fascia (+Z) using ExtrudeGeometry + slatted airflow louvers
  const fasciaShape = new THREE.Shape();
  fasciaShape.moveTo(-0.12, -0.225);
  fasciaShape.lineTo(0.12, -0.225);
  fasciaShape.lineTo(0.12, 0.225);
  fasciaShape.lineTo(-0.12, 0.225);
  fasciaShape.closePath();

  const fasciaHole = new THREE.Path();
  fasciaHole.moveTo(-0.088, -0.185);
  fasciaHole.lineTo(0.088, -0.185);
  fasciaHole.lineTo(0.088, 0.185);
  fasciaHole.lineTo(-0.088, 0.185);
  fasciaHole.closePath();
  fasciaShape.holes.push(fasciaHole);

  const fasciaGeo = new THREE.ExtrudeGeometry(fasciaShape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2,
  });
  const frontFascia = new THREE.Mesh(fasciaGeo, chassisBodyMat);
  frontFascia.position.set(0, caseY0 + 0.238, 0.214);
  frontFascia.castShadow = true;
  chassisGroup.add(frontFascia);

  // Front angled airflow louvers (InstancedMesh)
  const louverGeo = new THREE.BoxGeometry(0.172, 0.006, 0.014);
  const louverCount = 20;
  const louverInst = new THREE.InstancedMesh(louverGeo, meshGrilleMat, louverCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < louverCount; i++) {
    dummy.position.set(0, caseY0 + 0.072 + i * 0.0175, 0.222);
    dummy.rotation.set(0.32, 0, 0);
    dummy.updateMatrix();
    louverInst.setMatrixAt(i, dummy.matrix);
  }
  louverInst.instanceMatrix.needsUpdate = true;
  louverInst.computeBoundingSphere();
  chassisGroup.add(louverInst);

  // 3 Front 120mm intake fans behind fascia
  for (let i = 0; i < 3; i++) {
    const fFan = createFanAssembly(
      0.052,
      0.016,
      darkMetalMat,
      fanBladeMat,
      rgbEmissiveMat,
      animatedFans
    );
    fFan.position.set(0.005, caseY0 + 0.115 + i * 0.118, 0.194);
    chassisGroup.add(fFan);
  }

  // Front RGB vertical accent edge bar
  const frontAccentBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.006, 0.41, 0.006),
    rgbEmissiveMat
  );
  frontAccentBar.position.set(0.112, caseY0 + 0.236, 0.233);
  chassisGroup.add(frontAccentBar);

  // PSU basement shroud
  const shroudTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.222, 0.008, 0.35),
    chassisAccentMat
  );
  shroudTop.position.set(0, caseY0 + 0.105, -0.045);
  shroudTop.receiveShadow = true;
  chassisGroup.add(shroudTop);

  const shroudSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.095, 0.35),
    chassisAccentMat
  );
  shroudSide.position.set(0.105, caseY0 + 0.058, -0.045);
  chassisGroup.add(shroudSide);

  tagPart(chassisGroup, "chassis", "Mid-Tower Aluminum Chassis");
  root.add(chassisGroup);

  // ── 2. TEMPERED GLASS SIDE PANEL (+X) ──────────────────────────────────────
  const glassGroup = new THREE.Group();
  glassGroup.position.set(0.117, caseY0 + 0.238, 0);

  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(0.006, 0.425, 0.425),
    glassMat
  );
  glassPane.renderOrder = 10;
  glassGroup.add(glassPane);

  // Black ceramic perimeter bezel on glass
  const bezelH = new THREE.BoxGeometry(0.008, 0.016, 0.432);
  const bezelV = new THREE.BoxGeometry(0.008, 0.432, 0.016);
  const topBezel = new THREE.Mesh(bezelH, rubberMat);
  topBezel.position.y = 0.21;
  const botBezel = new THREE.Mesh(bezelH, rubberMat);
  botBezel.position.y = -0.21;
  const frontBezel = new THREE.Mesh(bezelV, rubberMat);
  frontBezel.position.z = 0.21;
  const rearBezel = new THREE.Mesh(bezelV, rubberMat);
  rearBezel.position.z = -0.21;
  glassGroup.add(topBezel, botBezel, frontBezel, rearBezel);

  // 4 Machined thumbscrews
  const screwGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.012, 12);
  const screwOffsets: [number, number][] = [
    [-0.19, -0.19],
    [0.19, -0.19],
    [-0.19, 0.19],
    [0.19, 0.19],
  ];
  for (const [sy, sz] of screwOffsets) {
    const screw = new THREE.Mesh(screwGeo, brushedSteelMat);
    screw.rotation.z = Math.PI / 2;
    screw.position.set(0.005, sy, sz);
    glassGroup.add(screw);
  }

  tagPart(glassGroup, "glass", "Smoked Tempered Glass Panel");
  registerExplodable(glassGroup, new THREE.Vector3(0.22, 0, 0));
  root.add(glassGroup);

  // ── 3. MOTHERBOARD ─────────────────────────────────────────────────────────
  const moboGroup = new THREE.Group();
  moboGroup.position.set(-0.072, caseY0 + 0.278, -0.045);

  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.29, 0.245), pcbMat);
  pcb.receiveShadow = true;
  moboGroup.add(pcb);

  // VRM heatsinks (top & rear I/O)
  const vrmLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.026, 0.115, 0.036),
    darkMetalMat
  );
  vrmLeft.position.set(0.016, 0.075, -0.095);
  vrmLeft.castShadow = true;
  moboGroup.add(vrmLeft);

  const vrmTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.024, 0.028, 0.11),
    darkMetalMat
  );
  vrmTop.position.set(0.015, 0.122, -0.018);
  vrmTop.castShadow = true;
  moboGroup.add(vrmTop);

  // VRM RGB accent strip
  const vrmAccent = new THREE.Mesh(
    new THREE.BoxGeometry(0.005, 0.085, 0.006),
    rgbEmissiveMat
  );
  vrmAccent.position.set(0.029, 0.075, -0.095);
  moboGroup.add(vrmAccent);

  // M.2 NVMe armored heatsink
  const m2Shield = new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.024, 0.095),
    brushedSteelMat
  );
  m2Shield.position.set(0.009, -0.02, -0.01);
  moboGroup.add(m2Shield);

  // Chipset heatsink
  const chipsetBlock = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.068, 0.074),
    darkMetalMat
  );
  chipsetBlock.position.set(0.01, -0.085, 0.065);
  moboGroup.add(chipsetBlock);

  // Armored PCIe x16 slot
  const pcieSlot = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.012, 0.092),
    brushedSteelMat
  );
  pcieSlot.position.set(0.009, -0.052, -0.035);
  moboGroup.add(pcieSlot);

  tagPart(moboGroup, "motherboard", "Aqua Z890 Pro Motherboard");
  registerExplodable(moboGroup, new THREE.Vector3(-0.04, 0, -0.04));
  root.add(moboGroup);

  // ── 4. 4x RGB DDR5 RAM MODULES ─────────────────────────────────────────────
  const ramGroup = new THREE.Group();
  ramGroup.position.set(-0.052, caseY0 + 0.34, 0.024);

  for (let i = 0; i < 4; i++) {
    const zOff = i * 0.012 - 0.018;
    const stick = new THREE.Group();
    stick.position.z = zOff;

    const heatspreader = new THREE.Mesh(
      new THREE.BoxGeometry(0.036, 0.112, 0.0065),
      darkMetalMat
    );
    heatspreader.castShadow = true;
    stick.add(heatspreader);

    const diffuser = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.11, 0.0062),
      rgbEmissiveMat
    );
    diffuser.position.x = 0.021;
    stick.add(diffuser);

    ramGroup.add(stick);
  }

  tagPart(ramGroup, "ram", "64GB DDR5-6400 RGB Memory Kit");
  registerExplodable(ramGroup, new THREE.Vector3(0.08, 0.04, 0.04));
  root.add(ramGroup);

  // ── 5. FLAGSHIP TRIPLE-FAN GPU ─────────────────────────────────────────────
  const gpuGroup = new THREE.Group();
  gpuGroup.position.set(0.006, caseY0 + 0.222, -0.042);

  // Brushed aluminum backplate
  const backplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.132, 0.005, 0.305),
    brushedSteelMat
  );
  backplate.position.y = 0.024;
  backplate.castShadow = true;
  backplate.receiveShadow = true;
  gpuGroup.add(backplate);

  // Fin-stack core heatsink
  const gpuCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.124, 0.038, 0.292),
    darkMetalMat
  );
  gpuCore.castShadow = true;
  gpuCore.receiveShadow = true;
  gpuGroup.add(gpuCore);

  // Outer sculpted shroud frame
  const gpuShroud = new THREE.Mesh(
    new THREE.BoxGeometry(0.134, 0.044, 0.308),
    chassisAccentMat
  );
  gpuShroud.position.y = -0.003;
  gpuShroud.castShadow = true;
  gpuGroup.add(gpuShroud);

  // Glowing side RGB telemetry lightbar facing tempered glass
  const gpuLightBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.006, 0.008, 0.24),
    rgbEmissiveMat
  );
  gpuLightBar.position.set(0.068, 0.008, 0.01);
  gpuGroup.add(gpuLightBar);

  // 3 Underside spinning GPU fans
  for (let i = 0; i < 3; i++) {
    const gFan = createFanAssembly(
      0.04,
      0.01,
      darkMetalMat,
      fanBladeMat,
      rgbEmissiveMat,
      animatedFans
    );
    gFan.rotation.x = Math.PI / 2;
    gFan.position.set(0, -0.026, -0.092 + i * 0.092);
    gpuGroup.add(gFan);
  }

  // Sleeved 12VHPWR power cable curving down into shroud
  const gpuCableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.048, 0.0, 0.065),
    new THREE.Vector3(0.072, -0.03, 0.078),
    new THREE.Vector3(0.055, -0.085, 0.068),
    new THREE.Vector3(0.02, -0.115, 0.048),
  ]);
  const gpuCable = new THREE.Mesh(
    new THREE.TubeGeometry(gpuCableCurve, 18, 0.0065, 8, false),
    rubberMat
  );
  gpuGroup.add(gpuCable);

  tagPart(gpuGroup, "gpu", config.gpu);
  registerExplodable(gpuGroup, new THREE.Vector3(0.14, -0.03, 0.03));
  root.add(gpuGroup);

  // ── 6. 360mm TOP RADIATOR + INSTANCED FINS & 3x FANS ──────────────────────
  const radGroup = new THREE.Group();
  radGroup.position.set(0.008, caseY0 + 0.422, 0.01);

  const radHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.122, 0.026, 0.365),
    darkMetalMat
  );
  radHousing.castShadow = true;
  radGroup.add(radHousing);

  // Instanced louvered radiator fins
  const finCount = 34;
  const finGeo = new THREE.BoxGeometry(0.112, 0.02, 0.0025);
  const finInst = new THREE.InstancedMesh(finGeo, brushedSteelMat, finCount);
  for (let i = 0; i < finCount; i++) {
    dummy.position.set(0, 0, -0.155 + (i / (finCount - 1)) * 0.31);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    finInst.setMatrixAt(i, dummy.matrix);
  }
  finInst.instanceMatrix.needsUpdate = true;
  finInst.computeBoundingSphere();
  radGroup.add(finInst);

  // 3x 120mm exhaust fans mounted below radiator
  for (let i = 0; i < 3; i++) {
    const tFan = createFanAssembly(
      0.05,
      0.015,
      darkMetalMat,
      fanBladeMat,
      rgbEmissiveMat,
      animatedFans
    );
    tFan.rotation.x = Math.PI / 2;
    tFan.position.set(0, -0.022, -0.112 + i * 0.112);
    radGroup.add(tFan);
  }

  tagPart(radGroup, "radiator", "360mm Copper Radiator & Triple Fans");
  registerExplodable(radGroup, new THREE.Vector3(0, 0.14, 0));
  root.add(radGroup);

  // ── 7. CPU COOLING ARCHITECTURE (Liquid / Air / Hybrid) ────────────────────
  const coolingGroup = new THREE.Group();

  if (config.coolingMode === "air") {
    // Dual-tower nickel-plated air cooler with 6 copper heatpipes
    const towerBase = new THREE.Group();
    towerBase.position.set(-0.015, caseY0 + 0.335, -0.068);

    const coldPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.048, 0.048),
      copperMat
    );
    coldPlate.position.x = -0.045;
    towerBase.add(coldPlate);

    // 28 Instanced heatsink fins across dual towers
    const airFinGeo = new THREE.BoxGeometry(0.092, 0.125, 0.0022);
    const airFins = new THREE.InstancedMesh(airFinGeo, brushedSteelMat, 28);
    for (let i = 0; i < 28; i++) {
      const towerOffset = i < 14 ? -0.045 : 0.012;
      const idx = i % 14;
      dummy.position.set(0.008, 0, towerOffset + idx * 0.0038);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      airFins.setMatrixAt(i, dummy.matrix);
    }
    airFins.instanceMatrix.needsUpdate = true;
    airFins.computeBoundingSphere();
    airFins.castShadow = true;
    towerBase.add(airFins);

    // 6 Copper U-heatpipe tips protruding at top
    const pipeGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.11, 10);
    for (let i = 0; i < 6; i++) {
      const pipe = new THREE.Mesh(pipeGeo, copperMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0.01, -0.045 + i * 0.018, -0.025);
      towerBase.add(pipe);
    }

    // Dual PWM tower fans
    const frontTowerFan = createFanAssembly(
      0.048,
      0.014,
      darkMetalMat,
      fanBladeMat,
      rgbEmissiveMat,
      animatedFans
    );
    frontTowerFan.position.set(0.012, 0, 0.072);
    towerBase.add(frontTowerFan);

    coolingGroup.add(towerBase);
    tagPart(coolingGroup, "cpu-cooler", `Dual-Tower Air Cooler (${config.cpu})`);
  } else {
    // Custom Liquid / Hybrid CPU Waterblock + Lathe Reservoir + Hardline TubeGeometry Loop
    const blockGroup = new THREE.Group();
    blockGroup.position.set(-0.048, caseY0 + 0.34, -0.068);

    const copperBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.068, 0.068),
      copperMat
    );
    copperBase.position.x = -0.01;
    blockGroup.add(copperBase);

    const acrylicTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 0.062, 0.062),
      darkMetalMat
    );
    acrylicTop.position.x = 0.006;
    acrylicTop.castShadow = true;
    blockGroup.add(acrylicTop);

    const infinityRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.022, 0.004, 10, 28),
      rgbEmissiveMat
    );
    infinityRing.rotation.y = Math.PI / 2;
    infinityRing.position.x = 0.019;
    blockGroup.add(infinityRing);

    coolingGroup.add(blockGroup);

    // Cylindrical D5 Pump & Reservoir via LatheGeometry
    const resPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.032, 0.0),
      new THREE.Vector2(0.032, 0.036),
      new THREE.Vector2(0.028, 0.04),
      new THREE.Vector2(0.028, 0.165),
      new THREE.Vector2(0.032, 0.17),
      new THREE.Vector2(0.032, 0.185),
      new THREE.Vector2(0.0, 0.185),
    ];
    const reservoirGeo = new THREE.LatheGeometry(resPoints, 28);
    const reservoirShell = new THREE.Mesh(reservoirGeo, glassMat);
    reservoirShell.position.set(-0.01, caseY0 + 0.125, 0.122);
    reservoirShell.renderOrder = 8;
    coolingGroup.add(reservoirShell);

    const coolantColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.023, 0.023, 0.115, 24),
      coolantMat
    );
    coolantColumn.position.set(-0.01, caseY0 + 0.222, 0.122);
    coolingGroup.add(coolantColumn);

    const pumpBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.042, 24),
      darkMetalMat
    );
    pumpBase.position.set(-0.01, caseY0 + 0.146, 0.122);
    pumpBase.castShadow = true;
    coolingGroup.add(pumpBase);

    const pumpCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.033, 0.033, 0.018, 24),
      darkMetalMat
    );
    pumpCap.position.set(-0.01, caseY0 + 0.305, 0.122);
    coolingGroup.add(pumpCap);

    // Hardline coolant tubes using CatmullRomCurve3 + TubeGeometry
    const tube1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.03, caseY0 + 0.355, -0.058),
      new THREE.Vector3(0.025, caseY0 + 0.36, -0.045),
      new THREE.Vector3(0.035, caseY0 + 0.395, 0.025),
      new THREE.Vector3(0.02, caseY0 + 0.41, 0.115),
    ]);
    const tube1 = new THREE.Mesh(
      new THREE.TubeGeometry(tube1Curve, 28, 0.0068, 12, false),
      coolantMat
    );
    coolingGroup.add(tube1);

    const tube2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.03, caseY0 + 0.325, -0.058),
      new THREE.Vector3(0.018, caseY0 + 0.322, 0.025),
      new THREE.Vector3(0.005, caseY0 + 0.312, 0.102),
      new THREE.Vector3(-0.01, caseY0 + 0.305, 0.122),
    ]);
    const tube2 = new THREE.Mesh(
      new THREE.TubeGeometry(tube2Curve, 28, 0.0068, 12, false),
      coolantMat
    );
    coolingGroup.add(tube2);

    if (config.coolingMode === "hybrid") {
      // Extra GPU-to-reservoir return line for Hybrid Dual-Loop mode
      const tube3Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.012, caseY0 + 0.245, 0.045),
        new THREE.Vector3(0.028, caseY0 + 0.22, 0.095),
        new THREE.Vector3(0.015, caseY0 + 0.165, 0.122),
      ]);
      const tube3 = new THREE.Mesh(
        new THREE.TubeGeometry(tube3Curve, 20, 0.0062, 10, false),
        coolantMat
      );
      coolingGroup.add(tube3);
    }

    tagPart(
      coolingGroup,
      "cpu-cooler",
      config.coolingMode === "hybrid"
        ? `Hybrid Dual-Loop Liquid Cooling (${config.cpu})`
        : `Custom Hardline Liquid Loop (${config.cpu})`
    );
  }

  registerExplodable(coolingGroup, new THREE.Vector3(0.11, 0.06, 0.06));
  root.add(coolingGroup);

  // ── 8. MODULAR 1000W PSU ───────────────────────────────────────────────────
  const psuGroup = new THREE.Group();
  psuGroup.position.set(-0.015, caseY0 + 0.054, -0.135);

  const psuBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.086, 0.16),
    darkMetalMat
  );
  psuBox.castShadow = true;
  psuGroup.add(psuBox);

  const psuBadge = new THREE.Mesh(
    new THREE.BoxGeometry(0.004, 0.022, 0.09),
    rgbEmissiveMat
  );
  psuBadge.position.set(0.076, 0, 0);
  psuGroup.add(psuBadge);

  tagPart(psuGroup, "psu", "1000W 80+ Titanium Modular PSU");
  registerExplodable(psuGroup, new THREE.Vector3(0, -0.06, -0.12));
  root.add(psuGroup);

  // Dynamic appearance updates (zero scene rebuild)
  const updateAppearance = (
    next: Pick<PcRigConfig, "caseFinish" | "rgbColor">
  ) => {
    const p = FINISH_PALETTE[next.caseFinish];
    chassisBodyMat.color.setHex(p.body);
    chassisBodyMat.roughness = p.roughness;
    chassisBodyMat.metalness = p.metalness;
    chassisAccentMat.color.setHex(p.accent);
    meshGrilleMat.color.setHex(p.mesh);

    const c = new THREE.Color(next.rgbColor);
    rgbEmissiveMat.color.copy(c);
    rgbEmissiveMat.emissive.copy(c);
    coolantMat.color.copy(c);
    coolantMat.emissive.copy(c);
  };

  const setExploded = (level: number) => {
    const clamped = Math.min(1, Math.max(0, level));
    for (const entry of explodables) {
      entry.object.position.set(
        entry.assembled.x + entry.offset.x * clamped,
        entry.assembled.y + entry.offset.y * clamped,
        entry.assembled.z + entry.offset.z * clamped
      );
    }
  };

  const dispose = () => {
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
    for (const item of disposables) {
      item.dispose();
    }
  };

  return {
    root,
    animatedFans,
    explodables,
    updateAppearance,
    setExploded,
    dispose,
  };
}
