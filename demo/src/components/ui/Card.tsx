"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  const base =
    "bg-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-border-color";
  const interactive = onClick
    ? "cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150"
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
