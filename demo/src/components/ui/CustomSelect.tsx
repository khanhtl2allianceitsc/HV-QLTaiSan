"use client";

import { useState, useRef, useEffect } from "react";
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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
          "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-surface border rounded-lg transition-colors text-left",
          open
            ? "border-primary/40 ring-2 ring-primary/20"
            : "border-border-color hover:border-primary/30",
          selected ? "text-text-primary" : "text-text-secondary",
        ].join(" ")}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {selected?.icon && (
            <selected.icon size={14} className="text-text-secondary flex-shrink-0" />
          )}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={[
            "text-text-secondary flex-shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-surface border border-border-color rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-text-secondary">
              Không có tùy chọn
            </div>
          ) : (
            <ul>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={[
                        "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors text-left",
                        isSelected
                          ? "bg-primary-light text-primary"
                          : "text-text-primary hover:bg-page-bg",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        {Icon && (
                          <Icon
                            size={14}
                            className={isSelected ? "text-primary" : "text-text-secondary"}
                          />
                        )}
                        <span className="truncate">{opt.label}</span>
                      </span>
                      {isSelected && <Check size={13} className="text-primary flex-shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
