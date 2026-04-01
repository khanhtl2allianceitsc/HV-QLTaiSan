"use client";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  status: string;
  label?: string;
  size?: BadgeSize;
}

interface StatusConfig {
  dot: string;
  bg: string;
  text: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Green - good/active
  active: { dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  completed: { dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  on_time: { dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  present_good: { dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  good: { dot: "bg-success", bg: "bg-success/10", text: "text-success" },

  // Yellow/Amber - pending/warning
  pending: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning" },
  planned: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning" },
  at_risk: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning" },
  scheduled: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning" },

  // Red - broken/overdue/danger
  broken: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  overdue: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  rejected: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  danger: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  damaged: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  lost: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },

  // Gray - inactive/not found
  inactive: { dot: "bg-text-secondary", bg: "bg-text-secondary/10", text: "text-text-secondary" },
  not_found: { dot: "bg-text-secondary", bg: "bg-text-secondary/10", text: "text-text-secondary" },
  disposed: { dot: "bg-text-secondary", bg: "bg-text-secondary/10", text: "text-text-secondary" },

  // Blue - in progress
  in_progress: { dot: "bg-info", bg: "bg-info/10", text: "text-info" },
  accepted: { dot: "bg-info", bg: "bg-info/10", text: "text-info" },
  processing: { dot: "bg-info", bg: "bg-info/10", text: "text-info" },

  // Purple - waiting confirmation
  waiting_confirmation: {
    dot: "bg-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },

  // Orange - needs repair/open
  needs_repair: {
    dot: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  open: {
    dot: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
};

const DEFAULT_CONFIG: StatusConfig = {
  dot: "bg-text-secondary",
  bg: "bg-text-secondary/10",
  text: "text-text-secondary",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  completed: "Hoàn thành",
  on_time: "Đúng hạn",
  present_good: "Tốt",
  good: "Tốt",
  pending: "Chờ xử lý",
  planned: "Kế hoạch",
  at_risk: "Có rủi ro",
  scheduled: "Đã lên lịch",
  broken: "Hư hỏng",
  overdue: "Quá hạn",
  rejected: "Từ chối",
  danger: "Nguy hiểm",
  damaged: "Hư hỏng",
  lost: "Thất lạc",
  inactive: "Không hoạt động",
  not_found: "Không tìm thấy",
  disposed: "Thanh lý",
  in_progress: "Đang xử lý",
  accepted: "Đã chấp nhận",
  processing: "Đang xử lý",
  waiting_confirmation: "Chờ xác nhận",
  needs_repair: "Cần sửa chữa",
  open: "Đang mở",
};

export function Badge({ status, label, size = "md" }: BadgeProps) {
  const config = STATUS_MAP[status] ?? DEFAULT_CONFIG;
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;

  const sizeClass = size === "sm"
    ? "text-xs px-2 py-0.5 gap-1"
    : "text-xs px-2.5 py-1 gap-1.5";

  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium",
        sizeClass,
        config.bg,
        config.text,
      ].join(" ")}
    >
      <span className={["rounded-full flex-shrink-0", dotSize, config.dot].join(" ")} />
      {displayLabel}
    </span>
  );
}
