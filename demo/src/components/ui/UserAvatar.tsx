"use client";

import React from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarUser {
  name: string;
  avatarUrl?: string;
  themeColor?: string;
}

interface UserAvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
  showOnline?: boolean;
}

const sizeMap: Record<
  AvatarSize,
  { px: number; text: string; ring: string; dotSize: string }
> = {
  sm: { px: 32, text: "text-xs",   ring: "ring-2",      dotSize: "w-2 h-2" },
  md: { px: 40, text: "text-sm",   ring: "ring-2",      dotSize: "w-2.5 h-2.5" },
  lg: { px: 48, text: "text-base", ring: "ring-2",      dotSize: "w-3 h-3" },
  xl: { px: 64, text: "text-xl",   ring: "ring-[3px]",  dotSize: "w-3.5 h-3.5" },
};

// Richer, more saturated palette for better visual presence
const PALETTE = [
  "#2563EB", // blue
  "#059669", // emerald
  "#D97706", // amber
  "#DC2626", // red
  "#7C3AED", // violet
  "#DB2777", // pink
  "#0891B2", // cyan
  "#65A30D", // lime
  "#EA580C", // orange
  "#4F46E5", // indigo
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Lighten a hex color to 15% opacity for the background tint
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function UserAvatar({ user, size = "md", showOnline = false }: UserAvatarProps) {
  const { px, text, ring, dotSize } = sizeMap[size];
  const color = user.themeColor ?? colorFromName(user.name);
  const initials = getInitials(user.name);

  const containerStyle: React.CSSProperties = {
    width: px,
    height: px,
    minWidth: px,
    minHeight: px,
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
  };

  const avatarStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  const ringClass = [
    "rounded-full overflow-hidden flex items-center justify-center",
    "font-semibold tracking-wide",
    ring,
    "ring-surface", // white gap ring creates depth separation
    text,
  ].join(" ");

  const avatar = user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatarUrl}
      alt={user.name}
      style={{ ...avatarStyle, borderColor: "transparent" }}
      className={[ringClass, "object-cover"].join(" ")}
    />
  ) : (
    <div
      style={{
        ...avatarStyle,
        backgroundColor: hexToRgba(color, 0.14),
        color,
        borderColor: hexToRgba(color, 0.25),
        border: "1px solid",
      }}
      className={ringClass}
    >
      {initials}
    </div>
  );

  if (!showOnline) return <div style={containerStyle}>{avatar}</div>;

  return (
    <div style={containerStyle}>
      {avatar}
      {/* Online indicator — green dot at bottom-right */}
      <span
        className={[
          "absolute bottom-0 right-0 rounded-full bg-[#22C55E]",
          "ring-2 ring-surface",
          dotSize,
        ].join(" ")}
        aria-label="Đang trực tuyến"
      />
    </div>
  );
}
