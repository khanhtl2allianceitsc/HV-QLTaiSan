"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  LayoutDashboard,
  Store,
  Package,
  ClipboardCheck,
  AlertTriangle,
  ListTodo,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badgeKey?: "tasks" | "incidents" | "notifications";
}

/* ─── Nav config ─────────────────────────────────────────────── */

const navItems: NavItem[] = [
  { label: "Tổng quan",  href: "/",           icon: LayoutDashboard },
  { label: "Quầy thuốc", href: "/pharmacies",  icon: Store },
  { label: "Tài sản",    href: "/assets",      icon: Package },
  { label: "Kiểm kê",   href: "/inventory",   icon: ClipboardCheck },
  { label: "Báo hỏng",  href: "/incidents",   icon: AlertTriangle,  badgeKey: "incidents" },
  { label: "Công việc",  href: "/tasks",       icon: ListTodo,       badgeKey: "tasks" },
  { label: "Báo cáo",   href: "/reports",     icon: BarChart3 },
  { label: "Cấu hình",  href: "/settings",    icon: Settings, adminOnly: true },
];

/* ─── Role labels (Vietnamese) ───────────────────────────────── */

const ROLE_LABELS: Record<string, string> = {
  counter_staff:    "Nhân viên quầy",
  inventory_staff:  "Kiểm kê",
  operations:       "Vận hành",
  ops_manager:      "Quản lý vận hành",
  admin:            "Quản trị viên",
};

/* ─── Component ──────────────────────────────────────────────── */

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname  = usePathname();
  const { currentUser, tasks, incidents, notifications } = useStore();

  const isAdmin = currentUser?.role === "admin";

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  /* Badge counts */
  const badgeCounts: Record<string, number> = {
    tasks:         (tasks ?? []).filter((t) => t.status === "pending").length,
    incidents:     (incidents ?? []).filter((i) => i.status === "open").length,
    notifications: (notifications ?? []).filter((n) => !n.isRead).length,
  };

  const getBadge = (key?: string) => {
    if (!key) return 0;
    return badgeCounts[key] ?? 0;
  };

  return (
    <aside
      className="relative flex flex-col bg-surface border-r border-border-color flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "64px" : "240px" }}
    >
      {/* ── Logo area ── */}
      <div className="flex items-center gap-3 px-3 py-4 overflow-hidden">
        {/* Logo mark */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-radius-md bg-primary flex items-center justify-center"
          style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.30)" }}
        >
          <span className="text-white text-sm font-bold leading-none tracking-wide">HV</span>
        </div>

        {!collapsed && (
          <div className="overflow-hidden leading-tight">
            <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
              QL Tài Sản
            </p>
            <p className="text-[11px] text-text-tertiary whitespace-nowrap font-medium">
              Hoàng Việt
            </p>
          </div>
        )}
      </div>

      {/* Gradient accent line below logo */}
      <div
        className="h-px mx-3 mb-1 flex-shrink-0"
        style={{
          background:
            "linear-gradient(90deg, var(--primary) 0%, rgba(37,99,235,0.15) 60%, transparent 100%)",
        }}
      />

      {/* ── Navigation ── */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {visibleItems.map((item) => {
            const Icon   = item.icon;
            const active = isActive(item.href);
            const badge  = getBadge(item.badgeKey);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "relative flex items-center gap-3 py-2.5 rounded-radius-sm text-sm transition-all duration-200 overflow-hidden",
                    collapsed ? "px-0 justify-center" : "px-3",
                    active
                      ? "bg-primary-light text-primary font-semibold"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary font-medium",
                  ].join(" ")}
                >
                  {/* Left active bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary flex-shrink-0"
                    />
                  )}

                  <Icon
                    size={18}
                    className={[
                      "flex-shrink-0 transition-colors duration-200",
                      active ? "text-primary" : "text-text-tertiary",
                    ].join(" ")}
                  />

                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate whitespace-nowrap">
                        {item.label}
                      </span>

                      {badge > 0 && (
                        <span
                          className={[
                            "ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center leading-none",
                            active
                              ? "bg-primary text-white"
                              : "bg-danger-light text-danger",
                          ].join(" ")}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Collapsed badge dot */}
                  {collapsed && badge > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger flex-shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User mini-profile (expanded only) ── */}
      {!collapsed && currentUser && (
        <>
          <div className="mx-3 h-px bg-border-color flex-shrink-0" />
          <div className="p-3">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-radius-sm hover:bg-surface-hover transition-colors duration-200 cursor-default">
              <UserAvatar user={currentUser} size="sm" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-text-tertiary truncate leading-tight mt-0.5 font-medium">
                  {ROLE_LABELS[currentUser.role] ?? currentUser.role}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Collapse toggle ── */}
      <div
        className={[
          "flex-shrink-0 border-t border-border-color p-2",
          collapsed && currentUser ? "pb-3" : "",
        ].join(" ")}
      >
        {/* Collapsed: show avatar instead of spacer */}
        {collapsed && currentUser && (
          <div className="flex justify-center mb-2">
            <UserAvatar user={currentUser} size="sm" />
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-radius-sm text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-all duration-200 text-xs font-medium"
        >
          {collapsed ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span>Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
