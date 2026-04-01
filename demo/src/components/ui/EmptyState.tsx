"use client";

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
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      ].join(" ")}
    >
      {/* Icon container */}
      <div className="w-16 h-16 rounded-2xl bg-page-bg flex items-center justify-center mb-4">
        <Icon size={28} className="text-text-secondary/40" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs">{description}</p>
      )}

      {/* CTA */}
      {action && (
        <div className="mt-5">
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
