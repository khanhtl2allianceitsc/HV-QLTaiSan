"use client";

import Link from "next/link";
import {
  Package,
  AlertTriangle,
  ListTodo,
  ClipboardCheck,
  Clock,
  BarChart3,
  Bell,
  Store,
  Users,
  Monitor,
  QrCode,
  CheckCircle2,
  UserCircle,
  Wrench,
  Shield,
  Settings,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BulletProps {
  children: React.ReactNode;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface RoleCardProps {
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  iconBg: string;
  name: string;
  capabilities: string[];
}

// ─── Small reusables ──────────────────────────────────────────────────────────

function Bullet({ children }: BulletProps) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2
        className="w-4 h-4 flex-shrink-0 mt-0.5"
        style={{ color: "var(--success)" }}
      />
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {children}
      </span>
    </li>
  );
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-5 px-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
        style={{ background: "var(--primary-light)", color: "var(--primary)" }}
      >
        {icon}
      </div>
      <span
        className="text-2xl font-extrabold leading-none"
        style={{ color: "var(--secondary)", letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-center" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}

function RoleCard({ icon, color, borderColor, iconBg, name, capabilities }: RoleCardProps) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-md)",
        borderTopWidth: "4px",
        borderTopColor: borderColor,
      }}
    >
      <div className="p-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: iconBg, color }}
        >
          {icon}
        </div>
        <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          {name}
        </p>
        <ul className="space-y-2">
          {capabilities.map((c) => (
            <Bullet key={c}>{c}</Bullet>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Preview card components ──────────────────────────────────────────────────

function AssetPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--primary-light)" }}
        >
          <Package className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Chi tiết tài sản
        </span>
      </div>
      <div className="p-5 space-y-4">
        {/* Asset code + status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>
              Mã tài sản
            </p>
            <p
              className="text-lg font-bold font-mono"
              style={{ color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              HV-MH-0042
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "var(--success-light)", color: "var(--success)" }}
          >
            Hoạt động
          </span>
        </div>
        {/* Name */}
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>
            Tên tài sản
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Máy tính để bàn Dell OptiPlex
          </p>
        </div>
        {/* Info row */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{ background: "var(--page-bg)", border: "1px solid var(--border-color)" }}
          >
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>
              Nhóm
            </p>
            <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
              Thiết bị IT
            </p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "var(--page-bg)", border: "1px solid var(--border-color)" }}
          >
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>
              Quầy
            </p>
            <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
              NT Hồng Vân Q1
            </p>
          </div>
        </div>
        {/* QR placeholder */}
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ background: "var(--primary-lighter)", border: "1px dashed #93C5FD" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary-light)" }}
          >
            <QrCode className="w-5 h-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              QR Code đính kèm
            </p>
            <p className="text-xs" style={{ color: "#3B82F6" }}>
              Quét để truy cập nhanh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#FEE2E2" }}
        >
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--danger)" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Báo hỏng tài sản
        </span>
      </div>
      <div className="p-5 space-y-4">
        {/* Severity pills */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            Mức độ nghiêm trọng
          </p>
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full border-2"
              style={{ borderColor: "var(--danger)", color: "var(--danger)", background: "#FEE2E2" }}
            >
              Cấp 1 — Khẩn cấp
            </span>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
                background: "var(--page-bg)",
              }}
            >
              Cấp 2 — Bình thường
            </span>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
                background: "var(--page-bg)",
              }}
            >
              Cấp 3 — Nhỏ
            </span>
          </div>
        </div>
        {/* Mock title input */}
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Tiêu đề sự cố
          </p>
          <div
            className="rounded-xl px-3.5 py-2.5 text-sm"
            style={{
              border: "1.5px solid var(--primary)",
              background: "var(--surface)",
              color: "var(--text-primary)",
              boxShadow: "0 0 0 3px rgba(37,99,235,0.1)",
            }}
          >
            Màn hình bị sọc, không hiển thị
          </div>
        </div>
        {/* Photo attach */}
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Ảnh đính kèm
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl flex items-center justify-center"
                style={{
                  background: i < 2 ? "var(--primary-lighter)" : "var(--page-bg)",
                  border: i < 2 ? "1px solid #BFDBFE" : "1.5px dashed var(--border-hover)",
                }}
              >
                {i < 2 ? (
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: "#93C5FD", opacity: 0.7 }}
                  />
                ) : (
                  <span className="text-lg font-light" style={{ color: "var(--text-tertiary)" }}>
                    +
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanPreview() {
  const columns = [
    { label: "Chờ xử lý", color: "#F59E0B", bg: "#FEF3C7", cards: ["Màn hình Q1 hỏng", "Điều hòa không lạnh"] },
    { label: "Đang xử lý", color: "#2563EB", bg: "#DBEAFE", cards: ["Camera lối vào"] },
    { label: "Hoàn thành", color: "#059669", bg: "#D1FAE5", cards: ["Bàn phím quầy 2"] },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#FEF3C7" }}
        >
          <ListTodo className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Bảng Kanban
        </span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {columns.map((col) => (
            <div key={col.label} className="flex flex-col gap-2">
              <div
                className="rounded-lg px-2.5 py-1.5 text-center"
                style={{ background: col.bg }}
              >
                <span className="text-xs font-bold" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="rounded-xl p-2.5"
                  style={{
                    background: "var(--page-bg)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    className="w-4 h-1 rounded-full mb-1.5"
                    style={{ background: col.color, opacity: 0.6 }}
                  />
                  <p className="text-xs leading-snug" style={{ color: "var(--text-primary)" }}>
                    {card}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryPreview() {
  const items = [
    { name: "Máy tính HP EliteBook", status: "ok" },
    { name: "Camera hành lang", status: "warn" },
    { name: "Máy in Brother", status: "ok" },
    { name: "Điều hòa Daikin", status: "error" },
    { name: "Bàn làm việc nhân viên", status: "ok" },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#D1FAE5" }}
          >
            <ClipboardCheck className="w-3.5 h-3.5" style={{ color: "#059669" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Kiểm kê Q1/2026
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "var(--primary-light)", color: "var(--primary)" }}
        >
          18/23 tài sản
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-5 py-3"
          >
            <p className="text-xs" style={{ color: "var(--text-primary)" }}>
              {item.name}
            </p>
            {item.status === "ok" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#D1FAE5" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#059669" }} />
              </div>
            )}
            {item.status === "warn" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#FEF3C7" }}
              >
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
              </div>
            )}
            {item.status === "error" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#FEE2E2" }}
              >
                <span className="text-xs font-bold" style={{ color: "#DC2626" }}>
                  ✕
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SLAPreview() {
  const tiers = [
    {
      level: "Cấp 1",
      label: "Khẩn cấp",
      response: "1 giờ",
      resolve: "8 giờ",
      color: "#DC2626",
      bg: "#FEE2E2",
      progress: 85,
    },
    {
      level: "Cấp 2",
      label: "Bình thường",
      response: "4 giờ",
      resolve: "48 giờ",
      color: "#D97706",
      bg: "#FEF3C7",
      progress: 55,
    },
    {
      level: "Cấp 3",
      label: "Nâng cấp",
      response: "4 giờ",
      resolve: "48 giờ",
      color: "#2563EB",
      bg: "#DBEAFE",
      progress: 30,
    },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#EDE9FE" }}
        >
          <Clock className="w-3.5 h-3.5" style={{ color: "#7C3AED" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          SLA Dashboard
        </span>
      </div>
      <div className="p-5 space-y-4">
        {tiers.map((tier) => (
          <div key={tier.level} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {tier.level}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {tier.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <span>
                  PH:{" "}
                  <span className="font-semibold" style={{ color: tier.color }}>
                    {tier.response}
                  </span>
                </span>
                <span>·</span>
                <span>
                  HT:{" "}
                  <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {tier.resolve}
                  </span>
                </span>
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: tier.bg }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${tier.progress}%`, background: tier.color, opacity: 0.8 }}
              />
            </div>
          </div>
        ))}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 mt-2"
          style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
        >
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#DC2626" }} />
          <p className="text-xs font-semibold" style={{ color: "#DC2626" }}>
            2 sự cố sắp vi phạm SLA — cần xử lý ngay
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const bars = [65, 42, 88, 55, 73, 38, 90];
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#E0E7FF" }}
        >
          <BarChart3 className="w-3.5 h-3.5" style={{ color: "#4338CA" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Dashboard vận hành
        </span>
      </div>
      <div className="p-5 space-y-4">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Sự cố mở", value: "12", color: "#DC2626", bg: "#FEE2E2" },
            { label: "Đúng SLA", value: "94%", color: "#059669", bg: "#D1FAE5" },
            { label: "Tổng chi phí", value: "8.2M", color: "#2563EB", bg: "#DBEAFE" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl p-2.5 text-center"
              style={{ background: kpi.bg }}
            >
              <p
                className="text-base font-extrabold leading-none mb-1"
                style={{ color: kpi.color }}
              >
                {kpi.value}
              </p>
              <p className="text-xs leading-tight" style={{ color: kpi.color, opacity: 0.75 }}>
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
        {/* Bar chart */}
        <div>
          <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--text-secondary)" }}>
            Sự cố theo ngày trong tuần
          </p>
          <div className="flex items-end gap-1.5 h-16">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${h}%`,
                    background:
                      h > 80
                        ? "var(--primary)"
                        : h > 60
                        ? "#60A5FA"
                        : "var(--primary-lighter)",
                  }}
                />
                <span className="text-xs" style={{ color: "var(--text-tertiary)", fontSize: "10px" }}>
                  {days[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Pie chart mockup */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D1FAE5" strokeWidth="3.8" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#059669"
                strokeWidth="3.8"
                strokeDasharray="60 40"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.8"
                strokeDasharray="25 75"
                strokeDashoffset="-60"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#DC2626"
                strokeWidth="3.8"
                strokeDasharray="15 85"
                strokeDashoffset="-85"
              />
            </svg>
          </div>
          <div className="space-y-1.5">
            {[
              { label: "Hoàn thành", color: "#059669" },
              { label: "Đang xử lý", color: "#2563EB" },
              { label: "Vi phạm SLA", color: "#DC2626" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationPreview() {
  const notifications = [
    {
      type: "Sự cố mới",
      msg: "Điều hòa quầy Q3 không hoạt động",
      time: "5 phút trước",
      color: "#DC2626",
      bg: "#FEE2E2",
      dot: "#EF4444",
    },
    {
      type: "Vi phạm SLA",
      msg: "Task #045 đã quá thời hạn hoàn thành",
      time: "32 phút trước",
      color: "#D97706",
      bg: "#FEF3C7",
      dot: "#F59E0B",
    },
    {
      type: "Hoàn tất xử lý",
      msg: "Máy in Q1 đã sửa xong — chờ xác nhận",
      time: "1 giờ trước",
      color: "#059669",
      bg: "#D1FAE5",
      dot: "#10B981",
    },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#CFFAFE" }}
          >
            <Bell className="w-3.5 h-3.5" style={{ color: "#0891B2" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Trung tâm thông báo
          </span>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#FEE2E2", color: "#DC2626" }}
        >
          3 mới
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-0 relative"
            style={{ borderLeft: `3px solid ${n.dot}` }}
          >
            <div className="flex-1 px-4 py-3">
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className="text-xs font-bold"
                  style={{ color: n.color }}
                >
                  {n.type}
                </span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {n.time}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                {n.msg}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PharmacyPreview() {
  const pharmacies = [
    { name: "NT Hồng Vân Quận 1", address: "123 Nguyễn Huệ, Q.1, TP.HCM", assets: 24, status: "active" },
    { name: "NT Hồng Vân Quận 3", address: "88 Điện Biên Phủ, Q.3, TP.HCM", assets: 18, status: "active" },
  ];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-3"
        style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#CCFBF1" }}
        >
          <Store className="w-3.5 h-3.5" style={{ color: "#0D9488" }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Quản lý quầy thuốc
        </span>
      </div>
      <div className="p-4 space-y-3">
        {pharmacies.map((p) => (
          <div
            key={p.name}
            className="rounded-xl p-4"
            style={{
              border: "1px solid var(--border-color)",
              background: "var(--page-bg)",
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                {p.name}
              </p>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "#D1FAE5", color: "#059669" }}
              >
                Hoạt động
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
              {p.address}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Package className="w-3 h-3" style={{ color: "var(--primary)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                  {p.assets} tài sản
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" style={{ color: "#D97706" }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  1 sự cố
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature section data ─────────────────────────────────────────────────────

const FEATURES = [
  {
    id: "assets",
    icon: Package,
    iconColor: "#2563EB",
    iconBg: "#DBEAFE",
    title: "Quản lý tài sản",
    description:
      "Quản lý toàn bộ tài sản theo từng đơn vị riêng lẻ với mã định danh duy nhất, phân loại theo nhóm và tra cứu tức thì qua mã QR.",
    bullets: [
      "Mỗi tài sản có mã QR riêng",
      "Phân loại theo nhóm & loại",
      "Theo dõi lịch sử sửa chữa",
      "Tra cứu nhanh bằng quét QR",
    ],
    preview: <AssetPreview />,
  },
  {
    id: "incidents",
    icon: AlertTriangle,
    iconColor: "#DC2626",
    iconBg: "#FEE2E2",
    title: "Báo hỏng & Sự cố",
    description:
      "Nhân viên quầy báo hỏng trực tiếp, đính kèm ảnh và phân loại mức độ nghiêm trọng để đội vận hành xử lý kịp thời.",
    bullets: [
      "3 cấp độ sự cố rõ ràng",
      "Đính kèm ảnh minh chứng",
      "Tự động tạo task xử lý",
      "Thông báo realtime",
    ],
    preview: <IncidentPreview />,
  },
  {
    id: "tasks",
    icon: ListTodo,
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    title: "Quản lý công việc",
    description:
      "Theo dõi tiến độ xử lý sự cố qua bảng Kanban hoặc danh sách, với SLA tự động và theo dõi chi phí chi tiết.",
    bullets: [
      "Xem dạng bảng & Kanban",
      "Kéo thả chuyển trạng thái",
      "Theo dõi chi phí sửa chữa",
      "Quầy xác nhận hoàn tất",
    ],
    preview: <KanbanPreview />,
  },
  {
    id: "inventory",
    icon: ClipboardCheck,
    iconColor: "#059669",
    iconBg: "#D1FAE5",
    title: "Kiểm kê định kỳ",
    description:
      "Tổ chức kiểm kê tài sản theo kỳ, quét QR xác nhận từng tài sản và ghi nhận bất thường ngay tại chỗ.",
    bullets: [
      "Tạo kỳ kiểm kê theo quầy",
      "Quét QR khi kiểm",
      "Ghi nhận tình trạng tài sản",
      "Biên bản kiểm kê tự động",
    ],
    preview: <InventoryPreview />,
  },
  {
    id: "sla",
    icon: Clock,
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
    title: "SLA & Cảnh báo",
    description:
      "Hệ thống SLA 3 cấp tự động theo dõi thời hạn phản hồi và hoàn thành, cảnh báo trước khi vi phạm và tự động escalate.",
    bullets: [
      "Cấp 1: phản hồi 1h, hoàn thành 8h",
      "Cấp 2: phản hồi 4h, hoàn thành 48h",
      "Cảnh báo tự động khi sắp trễ",
      "Escalation khi quá hạn",
    ],
    preview: <SLAPreview />,
  },
  {
    id: "dashboard",
    icon: BarChart3,
    iconColor: "#4338CA",
    iconBg: "#E0E7FF",
    title: "Dashboard & Báo cáo",
    description:
      "Dashboard theo vai trò với biểu đồ trực quan — giám sát SLA, chi phí, tài sản và xu hướng sự cố theo thời gian thực.",
    bullets: [
      "4 dashboard theo vai trò",
      "Biểu đồ SLA & chi phí",
      "Phân tích xu hướng sự cố",
      "Xuất báo cáo tổng hợp",
    ],
    preview: <DashboardPreview />,
  },
  {
    id: "notifications",
    icon: Bell,
    iconColor: "#0891B2",
    iconBg: "#CFFAFE",
    title: "Thông báo thông minh",
    description:
      "10 loại thông báo tự động với deep link đến màn hình liên quan, đảm bảo mọi người liên quan luôn được cập nhật.",
    bullets: [
      "Task mới & phân công",
      "Cập nhật trạng thái",
      "Vi phạm SLA",
      "Chờ xác nhận từ quầy",
    ],
    preview: <NotificationPreview />,
  },
  {
    id: "pharmacies",
    icon: Store,
    iconColor: "#0D9488",
    iconBg: "#CCFBF1",
    title: "Quản lý quầy thuốc",
    description:
      "Quản lý thông tin chi tiết từng quầy, tài sản thuộc quầy, lịch sử sự cố và kiểm kê theo từng địa điểm.",
    bullets: [
      "Danh sách quầy thuốc",
      "Tài sản theo từng quầy",
      "Lịch sử sự cố & kiểm kê",
      "Thông tin liên hệ",
    ],
    preview: <PharmacyPreview />,
  },
];

// ─── Role data ────────────────────────────────────────────────────────────────

const ROLES = [
  {
    icon: <UserCircle className="w-5 h-5" />,
    color: "#2563EB",
    borderColor: "#2563EB",
    iconBg: "#DBEAFE",
    name: "Nhân viên quầy",
    capabilities: ["Báo hỏng tài sản", "Theo dõi tiến độ sửa chữa", "Xác nhận hoàn tất", "Nhận thông báo"],
  },
  {
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: "#059669",
    borderColor: "#059669",
    iconBg: "#D1FAE5",
    name: "Nhân viên kiểm kê",
    capabilities: ["Kiểm kê theo quầy", "Quét QR xác nhận", "Ghi nhận bất thường", "Lập biên bản kiểm kê"],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    color: "#D97706",
    borderColor: "#D97706",
    iconBg: "#FEF3C7",
    name: "Bộ phận vận hành",
    capabilities: ["Tiếp nhận task xử lý", "Cập nhật tiến độ", "Báo cáo chi phí", "Đính kèm ảnh kết quả"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: "#7C3AED",
    borderColor: "#7C3AED",
    iconBg: "#EDE9FE",
    name: "Quản lý vận hành",
    capabilities: ["Giám sát SLA toàn hệ thống", "Escalation khi trễ hạn", "Dashboard tổng quan", "Phê duyệt chi phí"],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    color: "#475569",
    borderColor: "#475569",
    iconBg: "#F1F5F9",
    name: "Admin",
    capabilities: ["Quản lý user & role", "Cấu hình SLA", "Danh mục tài sản", "Cấu hình hệ thống"],
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--page-bg)" }}>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 40%, #1D4ED8 100%)",
        }}
      >
        {/* Decorative floating circles */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-8 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm"
              style={{ background: "rgba(255,255,255,0.95)", color: "#1D4ED8", letterSpacing: "-0.02em" }}
            >
              HV
            </div>
            <span className="text-white font-bold text-base">Hồng Vân</span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5"
              style={{ letterSpacing: "-0.025em" }}
            >
              Hệ thống Quản Lý<br className="hidden sm:block" /> Tài Sản & Vận Hành Sự Cố
            </h1>
            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Giải pháp toàn diện cho chuỗi nhà thuốc — quản lý tài sản, báo hỏng, kiểm kê, và vận hành sự cố với SLA tự động.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "rgba(255,255,255,0.97)",
                color: "#1D4ED8",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              Trải nghiệm Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--shadow-xl)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x"
            style={{ borderColor: "var(--border-color)" }}
          >
            <StatItem icon={<Users className="w-5 h-5" />} value="5" label="Vai trò người dùng" />
            <StatItem icon={<Monitor className="w-5 h-5" />} value="45+" label="Màn hình chức năng" />
            <StatItem icon={<Clock className="w-5 h-5" />} value="3 cấp" label="SLA tự động" />
            <StatItem icon={<QrCode className="w-5 h-5" />} value="QR Code" label="Tra cứu tức thì" />
          </div>
        </div>
      </div>

      {/* ── Features sections ── */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          const isReversed = idx % 2 === 1;

          return (
            <div
              key={feature.id}
              id={feature.id}
              className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center py-16 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              {/* Text block */}
              <div className={isReversed ? "md:order-2" : ""}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: feature.iconBg }}
                >
                  <Icon className="w-8 h-8" style={{ color: feature.iconColor }} />
                </div>
                <h2
                  className="text-2xl font-bold mb-4 leading-tight"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                >
                  {feature.title}
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((b) => (
                    <Bullet key={b}>{b}</Bullet>
                  ))}
                </ul>
              </div>

              {/* Preview block */}
              <div className={isReversed ? "md:order-1" : ""}>
                {feature.preview}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── User roles ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            5 vai trò người dùng
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Mỗi vai trò có quyền truy cập và chức năng được thiết kế phù hợp với công việc thực tế
          </p>
        </div>

        {/* First 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {ROLES.slice(0, 3).map((role) => (
            <RoleCard key={role.name} {...role} />
          ))}
        </div>
        {/* Last 2 centered */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {ROLES.slice(3).map((role) => (
            <div key={role.name} className="sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <RoleCard {...role} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 40%, #1D4ED8 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sẵn sàng trải nghiệm?
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Đăng nhập ngay để khám phá toàn bộ tính năng
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "rgba(255,255,255,0.97)",
              color: "#1D4ED8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            Bắt đầu ngay →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-6 text-center"
        style={{ borderTop: "1px solid var(--border-color)", background: "var(--surface)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          © 2026 Nhà Thuốc Hồng Vân. Hệ thống quản lý tài sản.
        </p>
      </footer>
    </div>
  );
}
