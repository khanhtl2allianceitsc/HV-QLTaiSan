"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  /** Override the icon background color; defaults to primary-light */
  iconBg?: string;
  /** Override the icon color; defaults to text-primary */
  iconColor?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  iconBg,
  iconColor,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center py-16 px-8",
        className,
      ].join(" ")}
    >
      {/* Icon in soft circle */}
      <div
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: iconBg ?? "var(--primary-light)" }}
      >
        <Icon
          size={32}
          strokeWidth={1.5}
          className={iconColor ?? "text-primary"}
          style={{ color: iconColor ? undefined : "var(--primary)" }}
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2 leading-snug">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* CTA */}
      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant ?? "primary"}
            size="md"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
