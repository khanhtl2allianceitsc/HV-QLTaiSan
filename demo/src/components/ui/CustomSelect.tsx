"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleSelect(optValue: string) {
    onChange(optValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={["relative", className].join(" ")}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-surface",
          "border rounded-lg transition-all duration-200 ease-out text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          open
            ? "border-primary ring-2 ring-primary/20 focus-visible:ring-primary/20"
            : "border-border-color hover:border-border-hover focus-visible:ring-primary/20",
          selected ? "text-text-primary" : "text-text-secondary",
        ].join(" ")}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {selected?.icon && (
            <selected.icon
              size={14}
              className="text-text-secondary flex-shrink-0"
            />
          )}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={[
            "text-text-secondary flex-shrink-0 transition-transform duration-200 ease-out",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* Dropdown */}
      <div
        className={[
          "absolute left-0 right-0 top-[calc(100%+6px)] z-40",
          "bg-surface border border-border-color rounded-xl",
          "shadow-[var(--shadow-xl)] overflow-hidden max-h-60 overflow-y-auto",
          "transition-all duration-200 ease-out origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        {options.length === 0 ? (
          <div className="px-3 py-3 text-sm text-text-secondary">
            Không có tùy chọn
          </div>
        ) : (
          <ul className="py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const Icon = opt.icon;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={[
                      "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm",
                      "transition-colors duration-150 text-left",
                      isSelected
                        ? "bg-primary-light text-primary font-medium"
                        : "text-text-primary hover:bg-primary-light hover:text-primary",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {Icon && (
                        <Icon
                          size={14}
                          className={
                            isSelected ? "text-primary" : "text-text-secondary"
                          }
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && (
                      <Check size={13} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
