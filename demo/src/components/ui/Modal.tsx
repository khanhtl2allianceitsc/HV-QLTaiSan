"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Track mount state for animations
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Slight delay so CSS transition triggers after mount
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const modal = (
    <div
      ref={overlayRef}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-opacity duration-200 ease-out",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          "relative w-full bg-surface rounded-xl",
          "border border-border-color",
          "shadow-[var(--shadow-xl)]",
          "flex flex-col max-h-[90vh]",
          "transition-all duration-200 ease-out",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          sizeMap[size],
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color flex-shrink-0">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-text-primary leading-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={[
              "w-8 h-8 flex items-center justify-center rounded-lg",
              "text-text-secondary",
              "hover:bg-surface-hover hover:text-text-primary",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
            ].join(" ")}
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer (optional) */}
        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-border-color">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
