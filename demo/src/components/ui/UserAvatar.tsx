"use client";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarUser {
  name: string;
  avatarUrl?: string;
  themeColor?: string;
}

interface UserAvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, { px: number; text: string; ring: string }> = {
  sm: { px: 32, text: "text-xs", ring: "ring-2" },
  md: { px: 40, text: "text-sm", ring: "ring-2" },
  lg: { px: 48, text: "text-base", ring: "ring-2" },
  xl: { px: 64, text: "text-xl", ring: "ring-[3px]" },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Deterministic color from name when no themeColor provided
const PALETTE = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const { px, text, ring } = sizeMap[size];
  const color = user.themeColor ?? colorFromName(user.name);
  const initials = getInitials(user.name);

  const style: React.CSSProperties = {
    width: px,
    height: px,
    minWidth: px,
    minHeight: px,
    borderColor: color,
  };

  const baseClass = [
    "rounded-full overflow-hidden flex items-center justify-center font-semibold",
    ring,
    text,
  ].join(" ");

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.name}
        style={style}
        className={[baseClass, "object-cover"].join(" ")}
      />
    );
  }

  return (
    <div
      style={{ ...style, backgroundColor: color + "20", color }}
      className={baseClass}
    >
      {initials}
    </div>
  );
}
