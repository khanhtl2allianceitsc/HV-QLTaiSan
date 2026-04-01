"use client";

import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-sm active:bg-primary/80",
  secondary:
    "bg-surface text-text-primary border border-border-color hover:bg-page-bg active:bg-page-bg/80 shadow-sm",
  danger:
    "bg-danger text-white hover:bg-danger/90 shadow-sm active:bg-danger/80",
  ghost:
    "bg-transparent text-text-secondary hover:bg-page-bg hover:text-text-primary active:bg-page-bg/80",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 h-8",
  md: "px-4 py-2 text-sm rounded-lg gap-2 h-9",
  lg: "px-5 py-2.5 text-sm rounded-xl gap-2 h-10",
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
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
        variantMap[variant],
        sizeMap[size],
        isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading && (
        <Loader2 size={size === "sm" ? 12 : 14} className="animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
