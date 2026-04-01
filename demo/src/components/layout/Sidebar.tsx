"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
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

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Tổng quan", href: "/", icon: LayoutDashboard },
  { label: "Quầy thuốc", href: "/pharmacies", icon: Store },
  { label: "Tài sản", href: "/assets", icon: Package },
  { label: "Kiểm kê", href: "/inventory", icon: ClipboardCheck },
  { label: "Báo hỏng", href: "/incidents", icon: AlertTriangle },
  { label: "Công việc", href: "/tasks", icon: ListTodo },
  { label: "Báo cáo", href: "/reports", icon: BarChart3 },
  { label: "Cấu hình", href: "/settings", icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useStore();

  const isAdmin = currentUser?.role === "admin";

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="relative flex flex-col bg-surface border-r border-border-color flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "64px" : "256px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border-color overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white text-sm font-bold leading-none">HV</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
              QL Tài Sản
            </p>
            <p className="text-xs text-text-secondary whitespace-nowrap">
              Hoàng Việt
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-page-bg hover:text-text-primary",
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    className={[
                      "flex-shrink-0",
                      active ? "text-primary" : "text-text-secondary",
                    ].join(" ")}
                  />
                  {!collapsed && (
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  )}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border-color">
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:bg-page-bg hover:text-text-primary transition-colors text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Thu gọn</span>}
        </button>
      </div>
    </aside>
  );
}
