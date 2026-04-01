"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Wrench, ClipboardList, Package, CheckCheck,
  AlertTriangle, ArrowRightLeft, MessageSquare, Clock, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { timeAgo, cn } from "@/lib/utils";
import type { Notification } from "@/types";

type FilterTab = "all" | "unread" | "task" | "inventory" | "asset";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
  { value: "task", label: "Công việc" },
  { value: "inventory", label: "Kiểm kê" },
  { value: "asset", label: "Tài sản" },
];

const TYPE_ICON_MAP: Record<Notification["type"], React.ElementType> = {
  new_task: Wrench,
  task_assigned: Wrench,
  comment_update: MessageSquare,
  status_change: Clock,
  awaiting_confirmation: CheckCheck,
  sla_breach: AlertTriangle,
  new_inventory: ClipboardList,
  asset_transfer: ArrowRightLeft,
  request_completed: ThumbsUp,
  request_rejected: ThumbsDown,
};

const TYPE_COLOR_MAP: Record<Notification["type"], string> = {
  new_task: "bg-info/10 text-info",
  task_assigned: "bg-primary/10 text-primary",
  comment_update: "bg-text-secondary/10 text-text-secondary",
  status_change: "bg-text-secondary/10 text-text-secondary",
  awaiting_confirmation: "bg-warning/10 text-warning",
  sla_breach: "bg-danger/10 text-danger",
  new_inventory: "bg-success/10 text-success",
  asset_transfer: "bg-purple-100 text-purple-600",
  request_completed: "bg-success/10 text-success",
  request_rejected: "bg-danger/10 text-danger",
};

function getEntityUrl(n: Notification): string {
  if (n.relatedEntityType === "task") return `/tasks/${n.relatedEntityId}`;
  if (n.relatedEntityType === "asset") return `/assets/${n.relatedEntityId}`;
  if (n.relatedEntityType === "inventory") return `/inventory/${n.relatedEntityId}`;
  if (n.relatedEntityType === "incident") return `/incidents/${n.relatedEntityId}`;
  return "#";
}

function matchesFilter(n: Notification, tab: FilterTab): boolean {
  if (tab === "all") return true;
  if (tab === "unread") return !n.isRead;
  if (tab === "task") return n.relatedEntityType === "task";
  if (tab === "inventory") return n.relatedEntityType === "inventory";
  if (tab === "asset") return n.relatedEntityType === "asset";
  return true;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = notifications.filter((n) => matchesFilter(n, activeTab));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleClick(n: Notification) {
    if (!n.isRead) markNotificationRead(n.id);
    router.push(getEntityUrl(n));
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Thông báo</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-text-secondary mt-1">{unreadCount} thông báo chưa đọc</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck size={14} />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border-color mb-4 overflow-x-auto">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "unread" ? unreadCount : undefined;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={[
                "flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
                activeTab === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
              ].join(" ")}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span
                  className={[
                    "text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold",
                    activeTab === tab.value ? "bg-white/20 text-white" : "bg-danger/10 text-danger",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Không có thông báo"
          description="Không tìm thấy thông báo nào phù hợp."
        />
      ) : (
        <div className="bg-surface rounded-xl border border-border-color overflow-hidden divide-y divide-border-color">
          {filtered.map((n) => {
            const Icon = TYPE_ICON_MAP[n.type] ?? Bell;
            const iconColor = TYPE_COLOR_MAP[n.type] ?? "bg-text-secondary/10 text-text-secondary";

            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-page-bg/60",
                  !n.isRead && "bg-primary-light/40"
                )}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !n.isRead ? "font-semibold text-text-primary" : "font-medium text-text-primary")}>
                      {n.title}
                    </p>
                    <span className="text-xs text-text-secondary whitespace-nowrap flex-shrink-0">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className={cn("text-sm mt-0.5", !n.isRead ? "text-text-primary" : "text-text-secondary")}>
                    {n.message}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
