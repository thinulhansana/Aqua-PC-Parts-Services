"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";

export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.07,
      ease: EASE_PREMIUM,
    },
  }),
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: EASE_PREMIUM,
    },
  }),
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.07,
      ease: EASE_PREMIUM,
    },
  }),
};

/**
 * Scroll-triggered section wrapper that animates children variants when visible.
 */
export function RevealSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/**
 * Scroll-triggered container for staggered item reveals inside or outside a RevealSection.
 */
export function RevealBlock({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "scaleIn" | "fadeIn";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const chosen =
    variant === "scaleIn"
      ? scaleInVariants
      : variant === "fadeIn"
      ? fadeInVariants
      : fadeUpVariants;

  return (
    <motion.div
      ref={ref}
      variants={chosen}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cursor-tracking spotlight card with zero-rerender CSS variable glow.
 */
export function SpotlightCard({
  children,
  className = "",
  glowColor = "rgb(var(--color-primary) / 0.14)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] z-0"
        style={{
          background: `radial-gradient(420px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${glowColor}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/**
 * Premium 3D perspective spring-tilt card with cursor spotlight, optional
 * rotating conic liquid-light border beam, and specular metallic sheen.
 */
export function TiltSpotlightCard({
  children,
  className = "",
  innerClassName = "",
  glowColor = "rgb(var(--color-primary) / 0.16)",
  maxTilt = 4.5,
  conicBorder = false,
  sheen = false,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: string;
  maxTilt?: number;
  conicBorder?: boolean;
  sheen?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 240,
    damping: 26,
    mass: 0.5,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 240,
    damping: 26,
    mass: 0.5,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${px}px`);
    el.style.setProperty("--spotlight-y", `${py}px`);

    if (!prefersReducedMotion) {
      rawX.set(px / rect.width - 0.5);
      rawY.set(py / rect.height - 0.5);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  if (conicBorder) {
    return (
      <div style={{ perspective: 1100 }} className="h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`group relative overflow-hidden p-[1.5px] bg-outline-variant/25 h-full ${className}`}
        >
          {/* Rotating Conic Liquid-Light Border Layer */}
          <div
            className="pointer-events-none absolute -inset-[120%] animate-spin-beam conic-beam opacity-55 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden="true"
          />

          {/* Inner Card Surface */}
          <div
            className={`relative h-full w-full rounded-[inherit] overflow-hidden ${sheen ? "sheen-hover" : ""} ${innerClassName}`}
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] z-0"
              style={{
                background: `radial-gradient(460px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${glowColor}, transparent 65%)`,
              }}
            />
            {children}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative overflow-hidden h-full ${sheen ? "sheen-hover" : ""} ${className}`}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] z-0"
          style={{
            background: `radial-gradient(420px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${glowColor}, transparent 65%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Tactile magnetic spring pull on hover for hero buttons & primary CTAs.
 */
export function MagneticWrap({
  children,
  className = "",
  strength = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Editorial masked typography reveal sliding smoothly upward out of clip mask.
 */
export function MaskedReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "105%", opacity: 0.2 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.65, delay, ease: EASE_PREMIUM }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Animated SVG circular telemetry gauge with luminous gradient ring.
 */
export function CircularGauge({
  value,
  label,
  displayText,
  size = 96,
  strokeWidth = 7,
  accent = "primary",
}: {
  value: number;
  label: string;
  displayText: string;
  size?: number;
  strokeWidth?: number;
  accent?: "primary" | "secondary" | "tertiary";
}) {
  const rawId = useId();
  const gradId = `gauge-${rawId.replace(/:/g, "")}`;
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const stopStart =
    accent === "secondary"
      ? "rgb(var(--color-secondary))"
      : accent === "tertiary"
      ? "rgb(var(--color-tertiary))"
      : "rgb(var(--color-primary))";
  const stopEnd =
    accent === "secondary"
      ? "rgb(var(--color-primary))"
      : accent === "tertiary"
      ? "rgb(var(--color-secondary))"
      : "rgb(var(--color-secondary))";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stopStart} />
              <stop offset="100%" stopColor={stopEnd} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(var(--color-outline-variant) / 0.25)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
            style={{
              filter: "drop-shadow(0 0 6px rgb(var(--color-primary) / 0.45))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-body-md font-bold text-on-surface leading-none">
            {displayText}
          </span>
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-center">
        {label}
      </span>
    </div>
  );
}

/**
 * Precision PCB & Hydro-Coolant SVG background schematic with animated photon pulses.
 */
export function CircuitFlowBackdrop({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  const traces = [
    "M 40 90 H 240 L 290 140 H 520 L 560 100 H 780",
    "M 1180 120 H 980 L 930 170 H 700",
    "M 90 420 H 310 L 355 375 H 600",
    "M 1340 380 H 1120 L 1060 320 H 820 L 780 360 H 620",
    "M 220 0 V 140 L 260 180 V 320",
    "M 1160 0 V 95 L 1115 140 V 290",
  ];

  return (
    <svg
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none select-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {traces.map((d, i) => (
        <g key={i}>
          <path
            d={d}
            stroke={i % 2 === 0 ? "rgb(var(--color-primary) / 0.16)" : "rgb(var(--color-secondary) / 0.14)"}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {!prefersReducedMotion && (
            <motion.path
              d={d}
              stroke={i % 2 === 0 ? "rgb(var(--color-primary) / 0.75)" : "rgb(var(--color-secondary) / 0.7)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="36 220"
              initial={{ strokeDashoffset: 256 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: 4.5 + i * 0.7,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.45,
              }}
            />
          )}
        </g>
      ))}
      {/* Precision Solder Node Pads */}
      {[
        [240, 90],
        [520, 140],
        [980, 120],
        [310, 420],
        [1060, 320],
        [260, 180],
        [1115, 140],
      ].map(([cx, cy], idx) => (
        <g key={idx}>
          <circle
            cx={cx}
            cy={cy}
            r="4.5"
            fill="rgb(var(--color-surface-container-lowest))"
            stroke={idx % 2 === 0 ? "rgb(var(--color-primary) / 0.55)" : "rgb(var(--color-secondary) / 0.55)"}
            strokeWidth="1.5"
          />
          <circle
            cx={cx}
            cy={cy}
            r="1.8"
            fill={idx % 2 === 0 ? "rgb(var(--color-primary))" : "rgb(var(--color-secondary))"}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Dual-harmonic SVG oscilloscope signal waveform for telemetry cards & lab HUDs.
 */
export function LiveOscilloscope({
  mode = "primary",
  className = "",
}: {
  mode?: "primary" | "secondary";
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const strokeColor =
    mode === "secondary"
      ? "rgb(var(--color-secondary))"
      : "rgb(var(--color-primary))";

  return (
    <div className={`relative w-full h-10 overflow-hidden rounded-lg bg-surface-container-lowest/80 border border-outline-variant/15 ${className}`}>
      {/* Subtle Horizontal Reference Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--color-outline-variant) / 0.3) 1px, transparent 1px)",
          backgroundSize: "24px 100%",
        }}
      />
      <svg
        viewBox="0 0 320 40"
        preserveAspectRatio="none"
        className="w-full h-full relative z-10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 0 20 C 16 6, 32 34, 48 20 C 64 6, 80 34, 96 20 C 112 6, 128 34, 144 20 C 160 6, 176 34, 192 20 C 208 6, 224 34, 240 20 C 256 6, 272 34, 288 20 C 304 6, 312 34, 320 20"
          stroke={strokeColor}
          strokeOpacity="0.24"
          strokeWidth="1.25"
        />
        <path
          d="M 0 20 C 16 6, 32 34, 48 20 C 64 6, 80 34, 96 20 C 112 6, 128 34, 144 20 C 160 6, 176 34, 192 20 C 208 6, 224 34, 240 20 C 256 6, 272 34, 288 20 C 304 6, 312 34, 320 20"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="64 176"
          className={prefersReducedMotion ? "" : "animate-wave-dash"}
        />
      </svg>
    </div>
  );
}

/**
 * Smooth count-up animation preserving prefix, leading zeros, decimals, and suffix.
 * Examples: "300+", "06 Mo.", "100%", "99.4%", "Island-wide"
 */
export function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2] : "";
  const suffix = match ? match[3] : "";
  const target = numStr ? parseFloat(numStr) : NaN;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const padLength = !numStr.includes(".") && numStr.startsWith("0") ? numStr.length : 0;

  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || isNaN(target)) return;

    const duration = 1400;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted: string;
      if (decimals > 0) {
        formatted = current.toFixed(decimals);
      } else {
        const rounded = Math.round(current);
        formatted = padLength > 0 ? String(rounded).padStart(padLength, "0") : String(rounded);
      }

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, decimals, padLength, prefix, suffix, value]);

  return <span ref={ref}>{display}</span>;
}
