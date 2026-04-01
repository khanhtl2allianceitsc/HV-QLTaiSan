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

// Precise hex values for crisp, accessible rendering
const STATUS_MAP: Record<string, StatusConfig> = {
  // Green group
  active:               { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  completed:            { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  on_time:              { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  present_good:         { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  good:                 { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  resolved:             { dot: "#059669", bg: "#D1FAE5", text: "#059669" },
  closed:               { dot: "#059669", bg: "#D1FAE5", text: "#059669" },

  // Red group
  broken:               { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  overdue:              { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  rejected:             { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  danger:               { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  damaged:              { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  lost:                 { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  cancelled:            { dot: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },

  // Amber group
  needs_repair:         { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  at_risk:              { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  warning:              { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  open:                 { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  awaiting_recipient:   { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  corrective:           { dot: "#D97706", bg: "#FEF3C7", text: "#D97706" },

  // Blue group
  in_progress:          { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  accepted:             { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  processing:           { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  info:                 { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  approved:             { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  scheduled:            { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },
  preventive:           { dot: "#2563EB", bg: "#DBEAFE", text: "#2563EB" },

  // Purple group
  waiting_confirmation: { dot: "#7C3AED", bg: "#EDE9FE", text: "#7C3AED" },

  // Gray group
  inactive:             { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  not_found:            { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  not_checked:          { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  pending:              { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  planned:              { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  disposed:             { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
  draft:                { dot: "#475569", bg: "#F1F5F9", text: "#475569" },
};

const DEFAULT_CONFIG: StatusConfig = {
  dot: "#475569",
  bg: "#F1F5F9",
  text: "#475569",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  completed: "Hoàn thành",
  on_time: "Đúng hạn",
  present_good: "Tốt",
  good: "Tốt",
  resolved: "Đã giải quyết",
  closed: "Đã đóng",
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
  not_checked: "Chưa kiểm tra",
  disposed: "Thanh lý",
  in_progress: "Đang xử lý",
  accepted: "Đã chấp nhận",
  processing: "Đang xử lý",
  waiting_confirmation: "Chờ xác nhận",
  needs_repair: "Cần sửa chữa",
  open: "Đang mở",
  warning: "Cảnh báo",
  info: "Thông tin",
  draft: "Nháp",
  approved: "Đã duyệt",
  cancelled: "Đã hủy",
  awaiting_recipient: "Chờ xác nhận",
  preventive: "Phòng ngừa",
  corrective: "Khắc phục",
};

export function Badge({ status, label, size = "md" }: BadgeProps) {
  const config = STATUS_MAP[status] ?? DEFAULT_CONFIG;
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;

  const sizeClass =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1.5"
      : "text-xs px-2.5 py-1 gap-1.5";

  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-[7px] h-[7px]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium leading-none",
        sizeClass,
      ].join(" ")}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span
        className={["rounded-full flex-shrink-0", dotSize].join(" ")}
        style={{ backgroundColor: config.dot }}
      />
      {displayLabel}
    </span>
  );
}
