"use client";

import React, { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

const TOAST_DURATION = 3500;
// Buffer before removal to allow exit animation
const EXIT_DURATION = 300;

const typeConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    bar: string;
    iconBg: string;
    iconColor: string;
    border: string;
    progressBar: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bar: "bg-[#059669]",
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#059669]",
    border: "border-[#059669]/20",
    progressBar: "bg-[#059669]",
  },
  error: {
    icon: XCircle,
    bar: "bg-[#DC2626]",
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    border: "border-[#DC2626]/20",
    progressBar: "bg-[#DC2626]",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-[#D97706]",
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#D97706]",
    border: "border-[#D97706]/20",
    progressBar: "bg-[#D97706]",
  },
  info: {
    icon: Info,
    bar: "bg-[#2563EB]",
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#2563EB]",
    border: "border-[#2563EB]/20",
    progressBar: "bg-[#2563EB]",
  },
};

interface ToastItemComponentProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastItemComponent({ toast, onDismiss }: ToastItemComponentProps) {
  const { icon: Icon, bar, iconBg, iconColor, border, progressBar } =
    typeConfig[toast.type];

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Slide-in on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Progress bar countdown
  useEffect(() => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      if (elapsed < TOAST_DURATION) {
        requestAnimationFrame(tick);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), EXIT_DURATION);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), EXIT_DURATION);
  }

  return (
    <div
      className={[
        "relative flex items-start overflow-hidden",
        "min-w-[300px] max-w-sm w-full",
        "bg-surface border rounded-xl",
        "shadow-[var(--shadow-xl)]",
        "transition-all duration-300 ease-out",
        border,
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none",
      ].join(" ")}
      role="alert"
    >
      {/* Left colored accent bar */}
      <div className={["w-1 self-stretch flex-shrink-0 rounded-l-xl", bar].join(" ")} />

      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3 flex-1 min-w-0">
        {/* Icon with colored circle background */}
        <div
          className={[
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
            iconBg,
          ].join(" ")}
        >
          <Icon size={15} className={iconColor} />
        </div>

        {/* Message */}
        <p className="flex-1 text-sm text-text-primary leading-snug pt-1 min-w-0 break-words">
          {toast.message}
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={[
            "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mt-0.5",
            "text-text-secondary hover:text-text-primary",
            "hover:bg-surface-hover",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          ].join(" ")}
          aria-label="Đóng"
        >
          <X size={13} />
        </button>
      </div>

      {/* Progress bar at bottom */}
      <div
        className="absolute bottom-0 left-1 right-0 h-[2px] rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={["h-full transition-none", progressBar].join(" ")}
          style={{ width: `${progress}%` }}
        />
      </div>
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
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5"
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
