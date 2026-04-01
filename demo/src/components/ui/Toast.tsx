"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

const TOAST_DURATION = 3000;

const typeConfig: Record<
  ToastType,
  { icon: React.ElementType; bg: string; text: string; border: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-surface",
    text: "text-text-primary",
    border: "border-success/30",
    iconColor: "text-success",
  },
  error: {
    icon: XCircle,
    bg: "bg-surface",
    text: "text-text-primary",
    border: "border-danger/30",
    iconColor: "text-danger",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-surface",
    text: "text-text-primary",
    border: "border-warning/30",
    iconColor: "text-warning",
  },
  info: {
    icon: Info,
    bg: "bg-surface",
    text: "text-text-primary",
    border: "border-info/30",
    iconColor: "text-info",
  },
};

interface ToastItemComponentProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastItemComponent({ toast, onDismiss }: ToastItemComponentProps) {
  const { icon: Icon, bg, text, border, iconColor } = typeConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={[
        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-[0_4px_16px_rgba(0,0,0,0.1)] min-w-[280px] max-w-sm",
        bg,
        text,
        border,
        "animate-in slide-in-from-right-5 fade-in duration-200",
      ].join(" ")}
      role="alert"
    >
      <Icon size={16} className={["flex-shrink-0 mt-0.5", iconColor].join(" ")} />
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Đóng"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  const handleDismiss = useCallback(
    (id: string) => {
      dismissToast(id);
    },
    [dismissToast]
  );

  if (!toasts || toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>,
    document.body
  );
}
