"use client";

import React from "react";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: CardVariant;
}

const variantBase: Record<CardVariant, string> = {
  default:
    "bg-surface rounded-xl border border-border-color shadow-[var(--shadow-sm)]",
  elevated:
    "bg-surface rounded-xl border border-border-color shadow-[var(--shadow-md)]",
  outlined:
    "bg-surface rounded-xl border border-border-color",
};

const variantHover: Record<CardVariant, string> = {
  default:
    "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] hover:border-border-hover active:translate-y-0 active:shadow-[var(--shadow-sm)]",
  elevated:
    "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:border-border-hover active:translate-y-0 active:shadow-[var(--shadow-md)]",
  outlined:
    "hover:-translate-y-0.5 hover:border-border-hover active:translate-y-0",
};

export function Card({
  children,
  className = "",
  onClick,
  variant = "default",
}: CardProps) {
  const base = variantBase[variant];
  const interactive = onClick
    ? [
        "cursor-pointer transition-all duration-200 ease-out",
        variantHover[variant],
      ].join(" ")
    : "";

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        className={[base, interactive, className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={[base, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
