"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary text-white",
    "shadow-[var(--shadow-sm)]",
    "hover:bg-primary-hover hover:shadow-[var(--shadow-md)] hover:-translate-y-px",
    "active:translate-y-0 active:shadow-[var(--shadow-sm)]",
    "focus-visible:ring-primary/30",
  ].join(" "),

  secondary: [
    "bg-surface text-text-primary border border-border-color",
    "hover:bg-surface-hover hover:border-border-hover",
    "active:bg-surface",
    "focus-visible:ring-primary/20",
  ].join(" "),

  danger: [
    "bg-danger text-white",
    "shadow-[var(--shadow-sm)]",
    "hover:bg-red-700 hover:shadow-[var(--shadow-md)] hover:-translate-y-px",
    "active:translate-y-0 active:shadow-[var(--shadow-sm)]",
    "focus-visible:ring-danger/30",
  ].join(" "),

  ghost: [
    "bg-transparent text-text-secondary",
    "hover:bg-surface-hover hover:text-text-primary",
    "active:bg-surface",
    "focus-visible:ring-primary/20",
  ].join(" "),
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

const spinnerSize: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 17,
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  onClick,
  type = "button",
  icon,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantMap[variant],
        sizeMap[size],
        isDisabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading ? (
        <Loader2
          size={spinnerSize[size]}
          className="animate-spin flex-shrink-0"
          style={{ animationTimingFunction: "ease-in-out" }}
        />
      ) : (
        icon && (
          <span className="flex-shrink-0 flex items-center">{icon}</span>
        )
      )}
      {children}
    </button>
  );
}
