"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Bell, Search, ChevronDown, User, LogOut, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { Notification } from "@/types";

const PAGE_TITLES: Record<string, string> = {
  "/": "Tổng quan",
  "/pharmacies": "Quầy thuốc",
  "/assets": "Tài sản",
  "/inventory": "Kiểm kê",
  "/incidents": "Báo hỏng",
  "/tasks": "Công việc",
  "/reports": "Báo cáo",
  "/settings": "Cấu hình",
  "/notifications": "Thông báo",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = "/" + pathname.split("/")[1];
  return PAGE_TITLES[base] ?? "Quản Lý Tài Sản";
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  if (type === "request_completed" || type === "status_change")
    return <CheckCircle size={14} className="text-success" />;
  if (type === "sla_breach" || type === "task_assigned")
    return <AlertTriangle size={14} className="text-warning" />;
  return <Clock size={14} className="text-info" />;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, notifications, logout } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);
  const unreadNotifs = notifications?.filter((n) => !n.isRead) ?? [];
  const latestNotifs = notifications?.slice(0, 5) ?? [];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="flex-shrink-0 h-16 bg-surface border-b border-border-color flex items-center gap-4 px-6">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-text-primary whitespace-nowrap min-w-0 truncate">
        {pageTitle}
      </h1>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Tìm kiếm tài sản, quầy thuốc..."
            readOnly
            className="w-full pl-9 pr-4 py-2 text-sm bg-page-bg border border-border-color rounded-lg text-text-secondary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 cursor-pointer transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-page-bg hover:text-text-primary transition-colors"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadNotifs.length > 9 ? "9+" : unreadNotifs.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-surface rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-color z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
                <span className="text-sm font-semibold text-text-primary">Thông báo</span>
                {unreadNotifs.length > 0 && (
                  <span className="text-xs text-primary font-medium">
                    {unreadNotifs.length} chưa đọc
                  </span>
                )}
              </div>

              {latestNotifs.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-secondary">
                  Không có thông báo
                </div>
              ) : (
                <ul>
                  {latestNotifs.map((notif) => (
                    <li key={notif.id}>
                      <Link
                        href={`/${notif.relatedEntityType}s/${notif.relatedEntityId}`}
                        onClick={() => setNotifOpen(false)}
                        className={[
                          "flex gap-3 px-4 py-3 hover:bg-page-bg transition-colors border-b border-border-color last:border-b-0",
                          !notif.isRead ? "bg-primary-light/40" : "",
                        ].join(" ")}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <NotificationIcon type={notif.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text-primary line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {new Date(notif.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="px-4 py-2.5 border-t border-border-color">
                <Link
                  href="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Xem tất cả thông báo
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        {currentUser && (
          <div ref={userRef} className="relative">
            <button
              onClick={() => {
                setUserOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-page-bg transition-colors"
            >
              <UserAvatar user={currentUser} size="sm" />
              <span className="text-sm font-medium text-text-primary max-w-[120px] truncate hidden sm:block">
                {currentUser.name}
              </span>
              <ChevronDown
                size={14}
                className={[
                  "text-text-secondary transition-transform duration-200",
                  userOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-11 w-48 bg-surface rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-color z-50 overflow-hidden py-1">
                <Link
                  href="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-page-bg transition-colors"
                >
                  <User size={15} className="text-text-secondary" />
                  Hồ sơ cá nhân
                </Link>
                <div className="my-1 border-t border-border-color" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
