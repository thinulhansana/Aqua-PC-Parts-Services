import React from "react";

type BadgeVariant = "status" | "tech";
type BadgeColor = "primary" | "secondary" | "tertiary";

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorMap: Record<BadgeColor, { dot: string; text: string; bg: string }> =
  {
    primary: {
      dot: "bg-primary",
      text: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    secondary: {
      dot: "bg-secondary",
      text: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
    tertiary: {
      dot: "bg-tertiary",
      text: "text-tertiary",
      bg: "bg-tertiary/10 border-tertiary/20",
    },
  };

export default function Badge({
  variant = "status",
  color = "primary",
  children,
  className = "",
}: BadgeProps) {
  const colors = colorMap[color];

  if (variant === "tech") {
    return (
      <span
        className={[
          "inline-flex items-center",
          "font-mono text-label-tech uppercase",
          "px-2.5 py-1 rounded-md",
          "bg-surface-container-high/80 text-on-surface-variant",
          "border border-outline-variant/30",
          className,
        ].join(" ")}
      >
        {children}
      </span>
    );
  }

  // status variant
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "text-label-badge uppercase font-jakarta font-bold tracking-widest",
        "px-3 py-1 rounded-full border",
        colors.bg,
        colors.text,
        className,
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          colors.dot,
          "shadow-[0_0_6px_currentColor]",
        ].join(" ")}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
