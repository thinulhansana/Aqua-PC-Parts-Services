import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-primary text-on-primary font-semibold",
    "shadow-cyan-glow hover:shadow-cyan-glow-lg",
    "hover:-translate-y-0.5 active:translate-y-0",
    "border-0",
  ].join(" "),
  secondary: [
    "bg-surface-container-high/60 text-on-surface",
    "border border-outline-variant/50",
    "hover:border-primary/50 hover:bg-surface-container-high/80",
  ].join(" "),
  ghost: [
    "text-primary bg-transparent",
    "hover:bg-primary/10",
    "border border-transparent",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-body-sm rounded-md gap-1.5",
  md: "px-5 py-2.5 text-body-md rounded-lg gap-2",
  lg: "px-7 py-3.5 text-body-lg rounded-xl gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  href,
  ...props
}: ButtonProps) {
  const baseStyles = [
    "inline-flex items-center justify-center",
    "font-jakarta font-semibold",
    "transition-all duration-200 ease-out",
    "cursor-pointer select-none",
    "whitespace-nowrap",
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(" ");

  const content = (
    <>
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseStyles} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
