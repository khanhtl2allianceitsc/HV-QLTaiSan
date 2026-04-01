"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Check,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { Notification } from "@/types";

/* ─── Page titles ────────────────────────────────────────────── */

const PAGE_TITLES: Record<string, string> = {
  "/":              "Tổng quan",
  "/pharmacies":    "Quầy thuốc",
  "/assets":        "Tài sản",
  "/inventory":     "Kiểm kê",
  "/incidents":     "Báo hỏng",
  "/tasks":         "Công việc",
  "/reports":       "Báo cáo",
  "/settings":      "Cấu hình",
  "/notifications": "Thông báo",
  "/profile":       "Hồ sơ cá nhân",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = "/" + pathname.split("/")[1];
  return PAGE_TITLES[base] ?? "Quản Lý Tài Sản";
}

/* ─── Role labels ────────────────────────────────────────────── */

const ROLE_LABELS: Record<string, string> = {
  counter_staff:   "Nhân viên quầy",
  inventory_staff: "Kiểm kê",
  operations:      "Vận hành",
  ops_manager:     "Quản lý vận hành",
  admin:           "Quản trị viên",
};

/* ─── Notification helpers ───────────────────────────────────── */

type NotifMeta = {
  icon: React.ElementType;
  iconColor: string;
  borderColor: string;
  bgUnread: string;
};

function getNotifMeta(type: Notification["type"]): NotifMeta {
  switch (type) {
    case "request_completed":
    case "status_change":
      return {
        icon: CheckCircle,
        iconColor: "text-success",
        borderColor: "border-l-success",
        bgUnread: "bg-success-light/40",
      };
    case "sla_breach":
    case "task_assigned":
      return {
        icon: AlertTriangle,
        iconColor: "text-warning",
        borderColor: "border-l-warning",
        bgUnread: "bg-warning-light/40",
      };
    default:
      return {
        icon: Clock,
        iconColor: "text-info",
        borderColor: "border-l-info",
        bgUnread: "bg-info-light/40",
      };
  }
}

/* ─── Header ─────────────────────────────────────────────────── */

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { currentUser, notifications, markAllNotificationsRead, logout } = useStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  const pageTitle    = getPageTitle(pathname);
  const unreadNotifs = notifications?.filter((n) => !n.isRead) ?? [];
  const latestNotifs = notifications?.slice(0, 6) ?? [];

  /* Close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead?.();
  }, [markAllNotificationsRead]);

  return (
    <header
      className="flex-shrink-0 h-16 bg-surface flex items-center gap-4 px-6"
      style={{ boxShadow: "var(--shadow-sm)", borderBottom: "1px solid var(--border-color)" }}
    >
      {/* Page title */}
      <h1 className="text-xl font-bold text-text-primary whitespace-nowrap min-w-0 shrink-0 truncate">
        {pageTitle}
      </h1>

      {/* Search bar */}
      <div className="flex-1 max-w-sm mx-auto">
        <div className="relative group">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors duration-200 group-focus-within:text-primary"
          />
          <input
            type="text"
            placeholder="Tìm kiếm tài sản, quầy thuốc…"
            readOnly
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-hover border border-border-color rounded-radius-sm text-text-secondary placeholder:text-text-tertiary cursor-pointer hover:border-border-hover focus:bg-surface focus:border-primary focus:ring-0 transition-all duration-200"
            style={{ boxShadow: "none" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">

        {/* ── Notification bell ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            aria-label="Thông báo"
            className={[
              "relative w-9 h-9 flex items-center justify-center rounded-radius-sm transition-all duration-200",
              notifOpen
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
            ].join(" ")}
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none"
              >
                {unreadNotifs.length > 9 ? "9+" : unreadNotifs.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-11 w-[340px] bg-surface rounded-radius-lg border border-border-color z-50 overflow-hidden animate-fade-in-up"
              style={{ boxShadow: "var(--shadow-xl)" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Thông báo</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-bold bg-danger-light text-danger px-1.5 py-0.5 rounded-full leading-none">
                      {unreadNotifs.length} mới
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] text-primary hover:text-primary-hover font-medium transition-colors duration-200"
                  >
                    <Check size={12} />
                    Đọc tất cả
                  </button>
                )}
              </div>

              {/* List */}
              {latestNotifs.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} className="mx-auto text-text-tertiary mb-2 opacity-40" />
                  <p className="text-sm text-text-tertiary">Không có thông báo</p>
                </div>
              ) : (
                <ul className="max-h-[340px] overflow-y-auto">
                  {latestNotifs.map((notif) => {
                    const meta = getNotifMeta(notif.type);
                    const IconComponent = meta.icon;
                    return (
                      <li key={notif.id}>
                        <Link
                          href={`/${notif.relatedEntityType}s/${notif.relatedEntityId}`}
                          onClick={() => setNotifOpen(false)}
                          className={[
                            "flex gap-3 px-4 py-3 border-b border-border-color border-l-[3px] last:border-b-0 hover:bg-surface-hover transition-colors duration-150",
                            notif.isRead
                              ? "border-l-transparent"
                              : `${meta.borderColor} ${meta.bgUnread}`,
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
                              notif.isRead ? "bg-surface-hover" : "bg-surface",
                            ].join(" ")}
                            style={{ boxShadow: "var(--shadow-sm)" }}
                          >
                            <IconComponent size={13} className={meta.iconColor} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={[
                                "text-xs line-clamp-2 leading-relaxed",
                                notif.isRead ? "text-text-secondary font-normal" : "text-text-primary font-medium",
                              ].join(" ")}
                            >
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-text-tertiary mt-1 font-medium">
                              {new Date(notif.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border-color bg-surface-hover/50">
                <Link
                  href="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors duration-200"
                >
                  Xem tất cả thông báo →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── User dropdown ── */}
        {currentUser && (
          <div ref={userRef} className="relative">
            <button
              onClick={() => {
                setUserOpen((v) => !v);
                setNotifOpen(false);
              }}
              className={[
                "flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-radius-sm transition-all duration-200",
                userOpen
                  ? "bg-primary-light"
                  : "hover:bg-surface-hover",
              ].join(" ")}
            >
              <UserAvatar user={currentUser} size="sm" />
              <span className="text-sm font-semibold text-text-primary max-w-[120px] truncate hidden sm:block">
                {currentUser.name}
              </span>
              <ChevronDown
                size={13}
                className={[
                  "text-text-tertiary transition-transform duration-200 flex-shrink-0",
                  userOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {userOpen && (
              <div
                className="absolute right-0 top-11 w-56 bg-surface rounded-radius-lg border border-border-color z-50 overflow-hidden animate-fade-in-up"
                style={{ boxShadow: "var(--shadow-xl)" }}
              >
                {/* User info section */}
                <div className="px-4 pt-3.5 pb-3 border-b border-border-color bg-surface-hover/40">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={currentUser} size="md" />
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-text-primary truncate leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-text-tertiary truncate mt-0.5 leading-tight">
                        {currentUser.email}
                      </p>
                      <span
                        className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-lighter text-primary leading-none"
                      >
                        {ROLE_LABELS[currentUser.role] ?? currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-hover transition-colors duration-150 font-medium"
                  >
                    <User size={15} className="text-text-tertiary flex-shrink-0" />
                    Hồ sơ cá nhân
                  </Link>

                  {currentUser.role === "admin" && (
                    <Link
                      href="/settings"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-hover transition-colors duration-150 font-medium"
                    >
                      <Settings size={15} className="text-text-tertiary flex-shrink-0" />
                      Cấu hình hệ thống
                    </Link>
                  )}
                </div>

                <div className="h-px bg-border-color" />

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light/60 transition-colors duration-150 font-medium"
                  >
                    <LogOut size={15} className="flex-shrink-0" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
