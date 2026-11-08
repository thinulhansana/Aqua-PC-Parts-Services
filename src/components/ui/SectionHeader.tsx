import React from "react";

interface SectionHeaderProps {
  icon?: string;
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  icon,
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {(icon || label) && (
        <div className="flex items-center gap-2">
          {icon && (
            <span className="material-symbols-outlined text-primary text-[20px]">
              {icon}
            </span>
          )}
          {label && (
            <span className="font-mono text-label-tech uppercase text-primary tracking-widest">
              {label}
            </span>
          )}
        </div>
      )}
      <h2 className="font-syne text-headline-lg-mobile md:text-headline-lg text-on-surface">
        {title}
      </h2>
      {description && (
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
