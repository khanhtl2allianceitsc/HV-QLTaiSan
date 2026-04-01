"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Store,
  ClipboardList,
  TrendingUp,
  Wrench,
  BarChart3,
  ArrowRight,
  Activity,
  ShieldAlert,
  Kanban,
} from "lucide-react";
import { getRoleLabel, timeAgo } from "@/lib/utils";
import type { UserRole } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVietnameseDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Enhanced Stat Card ───────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accentColor: string;        // CSS color for left bar + icon bg tint
  iconBg: string;             // Tailwind class
  valueColor?: string;        // Tailwind class
  change?: { value: string; positive: boolean };
  onClick?: () => void;
}

function StatCard({
  icon,
  label,
  value,
  accentColor,
  iconBg,
  valueColor = "text-text-primary",
  change,
  onClick,
}: StatCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      className={[
        "bg-surface rounded-xl border border-border-color flex overflow-hidden transition-all duration-200",
        onClick
          ? "cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
          : "",
        "shadow-[0_1px_4px_rgba(0,0,0,0.05)]",
      ].join(" ")}
    >
      {/* Left accent bar */}
      <div
        className="w-1 flex-shrink-0 rounded-l-xl"
        style={{ background: accentColor }}
      />
      <div className="flex items-center gap-4 p-5 flex-1 min-w-0">
        <div
          className={["w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg].join(" ")}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-secondary leading-tight truncate">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={["text-3xl font-bold leading-none", valueColor].join(" ")}>{value}</p>
            {change && (
              <span
                className={["text-xs font-semibold", change.positive ? "text-success" : "text-danger"].join(" ")}
              >
                {change.positive ? "+" : ""}{change.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {action}
    </div>
  );
}

// ─── Welcome Section ──────────────────────────────────────────────────────────

interface WelcomeProps {
  name: string;
  subtitle: string;
  role: string;
}

function WelcomeSection({ name, subtitle, role }: WelcomeProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1
          className="text-2xl font-extrabold text-text-primary"
          style={{ letterSpacing: "-0.02em" }}
        >
          Xin chào, {name}
        </h1>
        <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
      </div>
      <span
        className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 mt-0.5"
        style={{ background: "rgba(37,99,235,0.08)", color: "var(--primary)" }}
      >
        {getRoleLabel(role)}
      </span>
    </div>
  );
}

// ─── SLA Progress Bar ─────────────────────────────────────────────────────────

interface SlaBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

function SlaBar({ label, count, total, color, bgColor, textColor }: SlaBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <p className="text-sm font-medium text-text-secondary w-20 flex-shrink-0">{label}</p>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: bgColor }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex items-center gap-1.5 w-16 flex-shrink-0 justify-end">
        <span className={["text-sm font-bold", textColor].join(" ")}>{count}</span>
        <span className="text-xs text-text-secondary">({pct}%)</span>
      </div>
    </div>
  );
}

// ─── Counter Staff Dashboard ──────────────────────────────────────────────────

function CounterStaffDashboard() {
  const router = useRouter();
  const { currentUser, assets, incidents, tasks, pharmacies } = useStore();

  const myPharmacyIds = currentUser?.pharmacyIds ?? [];
  const myPharmacy = pharmacies.find((p) => myPharmacyIds.includes(p.id));

  const myAssets = useMemo(
    () => assets.filter((a) => myPharmacyIds.includes(a.pharmacyId)),
    [assets, myPharmacyIds]
  );
  const myIncidents = useMemo(
    () => incidents.filter((i) => myPharmacyIds.includes(i.pharmacyId)),
    [incidents, myPharmacyIds]
  );
  const pendingIncidents = myIncidents.filter((i) => i.status === "open" || i.status === "processing");
  const myTasks = useMemo(
    () => tasks.filter((t) => myPharmacyIds.includes(t.pharmacyId)),
    [tasks, myPharmacyIds]
  );
  const inProgressTasks = myTasks.filter((t) => t.status === "in_progress" || t.status === "accepted");
  const completedTasks = myTasks.filter((t) => t.status === "completed");
  const confirmationTasks = myTasks.filter((t) => t.status === "waiting_confirmation");

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={currentUser?.name ?? ""}
        subtitle={`${myPharmacy?.name ?? "Nhà thuốc của bạn"} — ${formatVietnameseDate(new Date())}`}
        role={currentUser?.role ?? ""}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Package className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Tài sản tại quầy"
          value={myAssets.length}
          accentColor="var(--primary)"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Đang báo hỏng"
          value={pendingIncidents.length}
          accentColor="var(--danger)"
          valueColor={pendingIncidents.length > 0 ? "text-danger" : "text-text-primary"}
          onClick={() => router.push("/incidents")}
        />
        <StatCard
          icon={<Wrench className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          label="Đang xử lý"
          value={inProgressTasks.length}
          accentColor="var(--warning)"
          valueColor="text-warning"
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Hoàn tất"
          value={completedTasks.length}
          accentColor="var(--success)"
          valueColor="text-success"
        />
      </div>

      {/* Recent incidents */}
      <div>
        <SectionHeader
          title="Sự cố gần đây"
          action={
            <Button size="sm" variant="ghost" onClick={() => router.push("/incidents")}>
              Xem tất cả <ArrowRight size={13} />
            </Button>
          }
        />
        <Card>
          {myIncidents.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-10">Không có sự cố nào</p>
          ) : (
            <div className="divide-y divide-border-color">
              {myIncidents.slice(0, 6).map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/incidents/${inc.id}`)}
                >
                  {/* Severity indicator */}
                  <div
                    className="w-0.5 self-stretch rounded-full flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        inc.level === 1
                          ? "var(--danger)"
                          : inc.level === 2
                          ? "var(--warning)"
                          : "var(--info)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{inc.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {inc.code} &middot; {timeAgo(inc.createdAt)}
                    </p>
                  </div>
                  <Badge status={inc.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Tasks awaiting confirmation */}
      {confirmationTasks.length > 0 && (
        <div>
          <SectionHeader
            title={`Chờ xác nhận hoàn tất (${confirmationTasks.length})`}
            action={
              <Button size="sm" variant="ghost" onClick={() => router.push("/tasks")}>
                Xem tất cả <ArrowRight size={13} />
              </Button>
            }
          />
          <div className="space-y-3">
            {confirmationTasks.map((task) => (
              <div
                key={task.id}
                className="bg-surface rounded-xl border overflow-hidden cursor-pointer hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150"
                style={{ borderColor: "rgba(168,85,247,0.25)", borderLeft: "4px solid #a855f7" }}
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                <div className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-text-secondary">{task.code}</span>
                      <Badge status="waiting_confirmation" size="sm" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mt-1 truncate">{task.title}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tasks/${task.id}`);
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Operations Dashboard ─────────────────────────────────────────────────────

function OperationsDashboard() {
  const router = useRouter();
  const { currentUser, tasks } = useStore();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter((t) => t.slaStatus === "overdue" && t.status !== "completed");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress" || t.status === "accepted");
  const completedThisMonth = tasks.filter(
    (t) => t.status === "completed" && t.completedAt && t.completedAt >= startOfMonth
  );

  const slaOnTime = tasks.filter((t) => t.slaStatus === "on_time" && t.status !== "completed").length;
  const slaAtRisk = tasks.filter((t) => t.slaStatus === "at_risk").length;
  const slaOverdue = tasks.filter((t) => t.slaStatus === "overdue" && t.status !== "completed").length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const isManager = currentUser?.role === "ops_manager";

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={currentUser?.name ?? ""}
        subtitle={`${isManager ? "Dashboard Quản lý Vận hành" : "Dashboard Vận hành"} — ${formatVietnameseDate(new Date())}`}
        role={currentUser?.role ?? ""}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Tổng task"
          value={totalTasks}
          accentColor="var(--primary)"
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<ShieldAlert className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Quá hạn"
          value={overdueTasks.length}
          accentColor="var(--danger)"
          valueColor={overdueTasks.length > 0 ? "text-danger" : "text-text-primary"}
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<Wrench className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          label="Đang xử lý"
          value={inProgressTasks.length}
          accentColor="var(--warning)"
          valueColor="text-warning"
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Hoàn tất tháng"
          value={completedThisMonth.length}
          accentColor="var(--success)"
          valueColor="text-success"
        />
      </div>

      {/* SLA Overview */}
      <div>
        <SectionHeader title="Tổng quan SLA" />
        <Card className="px-6 py-5">
          <div className="space-y-4">
            <SlaBar
              label="Trong hạn"
              count={slaOnTime}
              total={totalTasks}
              color="var(--success)"
              bgColor="rgba(16,185,129,0.12)"
              textColor="text-success"
            />
            <SlaBar
              label="Sắp trễ"
              count={slaAtRisk}
              total={totalTasks}
              color="var(--warning)"
              bgColor="rgba(245,158,11,0.12)"
              textColor="text-warning"
            />
            <SlaBar
              label="Quá hạn"
              count={slaOverdue}
              total={totalTasks}
              color="var(--danger)"
              bgColor="rgba(239,68,68,0.12)"
              textColor="text-danger"
            />
          </div>
        </Card>
      </div>

      {/* Recent tasks */}
      <div>
        <SectionHeader
          title="Task gần đây"
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => router.push("/tasks/kanban")}>
                <Kanban size={13} /> Kanban
              </Button>
              <Button size="sm" variant="ghost" onClick={() => router.push("/tasks")}>
                Tất cả <ArrowRight size={13} />
              </Button>
            </div>
          }
        />
        <Card>
          <div className="divide-y divide-border-color">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                {/* SLA level dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background:
                      task.level === 1
                        ? "var(--danger)"
                        : task.level === 2
                        ? "var(--warning)"
                        : "var(--info)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {task.code} &middot; {timeAgo(task.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge status={task.slaStatus} size="sm" />
                  <Badge status={task.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const router = useRouter();
  const { pharmacies, assets, users, incidents, activities } = useStore();

  const activePharmacies = pharmacies.filter((p) => p.status === "active").length;
  const activeIncidents = incidents.filter((i) => i.status === "open" || i.status === "processing").length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  const statusGroups = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of assets) {
      map[a.status] = (map[a.status] ?? 0) + 1;
    }
    return map;
  }, [assets]);

  const assetStatusList = [
    { key: "active", label: "Hoạt động", accentColor: "var(--success)", iconBg: "bg-success/10", valueColor: "text-success", icon: <CheckCircle className="w-5 h-5 text-success" /> },
    { key: "needs_repair", label: "Cần sửa", accentColor: "#f97316", iconBg: "bg-orange-100", valueColor: "text-orange-600", icon: <Wrench className="w-5 h-5 text-orange-500" /> },
    { key: "broken", label: "Hư hỏng", accentColor: "var(--danger)", iconBg: "bg-danger/10", valueColor: "text-danger", icon: <AlertTriangle className="w-5 h-5 text-danger" /> },
    { key: "inactive", label: "Ngừng HĐ", accentColor: "#94a3b8", iconBg: "bg-slate-100", valueColor: "text-text-secondary", icon: <Activity className="w-5 h-5 text-text-secondary" /> },
  ];

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <WelcomeSection
        name="Admin"
        subtitle={`Tổng quan hệ thống — ${formatVietnameseDate(new Date())}`}
        role="admin"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Store className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Quầy thuốc"
          value={activePharmacies}
          accentColor="var(--primary)"
          onClick={() => router.push("/pharmacies")}
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Tài sản"
          value={assets.length}
          accentColor="var(--success)"
          onClick={() => router.push("/assets")}
        />
        <StatCard
          icon={<Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />}
          iconBg="bg-purple-50"
          label="Người dùng"
          value={activeUsers}
          accentColor="#8b5cf6"
          onClick={() => router.push("/admin/users")}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Sự cố"
          value={activeIncidents}
          accentColor="var(--danger)"
          valueColor={activeIncidents > 0 ? "text-danger" : "text-text-primary"}
          onClick={() => router.push("/incidents")}
        />
      </div>

      {/* Asset status distribution */}
      <div>
        <SectionHeader
          title="Phân bổ trạng thái tài sản"
          action={
            <Button size="sm" variant="ghost" onClick={() => router.push("/assets")}>
              Xem tất cả <ArrowRight size={13} />
            </Button>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {assetStatusList.map((s) => (
            <StatCard
              key={s.key}
              icon={s.icon}
              iconBg={s.iconBg}
              label={s.label}
              value={statusGroups[s.key] ?? 0}
              accentColor={s.accentColor}
              valueColor={s.valueColor}
              onClick={() => router.push("/assets")}
            />
          ))}
        </div>
      </div>

      {/* Recent activities — timeline style */}
      <div>
        <SectionHeader title="Hoạt động gần đây" />
        <Card>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-10">Chưa có hoạt động nào</p>
          ) : (
            <div className="px-5 py-2">
              {recentActivities.map((act, idx) => {
                const actUser = users.find((u) => u.id === act.userId);
                const isLast = idx === recentActivities.length - 1;
                return (
                  <div key={act.id} className="flex gap-3.5 py-3">
                    {/* Timeline track */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-8 h-8 mt-0.5">
                        {actUser ? (
                          <UserAvatar user={actUser} size="sm" />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "var(--page-bg)" }}
                          >
                            <Activity size={13} className="text-text-secondary" />
                          </div>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-px flex-1 mt-2"
                          style={{ background: "var(--border-color)" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className="text-sm text-text-primary">
                        <span className="font-semibold">{actUser?.name ?? "Hệ thống"}</span>{" "}
                        <span className="text-text-secondary">{act.action}</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">{timeAgo(act.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Inventory Staff Dashboard ────────────────────────────────────────────────

function InventoryStaffDashboard() {
  const router = useRouter();
  const { currentUser, inventoryCycles, inventoryItems } = useStore();

  const myUserId = currentUser?.id;

  const myCycles = useMemo(
    () => inventoryCycles.filter((c) => myUserId && c.assigneeIds.includes(myUserId)),
    [inventoryCycles, myUserId]
  );

  const completedCycles = myCycles.filter((c) => c.status === "completed").length;
  const activeCycle = myCycles.find((c) => c.status === "in_progress");

  const activeCycleItems = useMemo(
    () => (activeCycle ? inventoryItems.filter((i) => i.cycleId === activeCycle.id) : []),
    [inventoryItems, activeCycle]
  );

  const checkedItems = activeCycleItems.filter((i) => i.checkStatus !== "not_checked").length;
  const anomalyItems = activeCycleItems.filter(
    (i) => i.checkStatus === "present_damaged" || i.checkStatus === "not_found"
  );

  const allMyCycleIds = new Set(myCycles.map((c) => c.id));
  const allMyItems = inventoryItems.filter((i) => allMyCycleIds.has(i.cycleId));
  const totalAnomalies = allMyItems.filter(
    (i) => i.checkStatus === "present_damaged" || i.checkStatus === "not_found"
  ).length;

  const progressPct =
    activeCycleItems.length > 0
      ? Math.round((checkedItems / activeCycleItems.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={currentUser?.name ?? ""}
        subtitle={`Dashboard Kiểm kê — ${formatVietnameseDate(new Date())}`}
        role={currentUser?.role ?? ""}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Kỳ được giao"
          value={myCycles.length}
          accentColor="var(--primary)"
          onClick={() => router.push("/inventory")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Kỳ hoàn thành"
          value={completedCycles}
          accentColor="var(--success)"
          valueColor="text-success"
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-info" />}
          iconBg="bg-info/10"
          label="Tài sản đã kiểm"
          value={checkedItems}
          accentColor="var(--info)"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          label="Bất thường"
          value={totalAnomalies}
          accentColor="var(--warning)"
          valueColor={totalAnomalies > 0 ? "text-warning" : "text-text-primary"}
        />
      </div>

      {/* Active cycle */}
      {activeCycle ? (
        <div>
          <SectionHeader
            title="Kỳ kiểm kê đang hoạt động"
            action={
              <Button size="sm" variant="ghost" onClick={() => router.push(`/inventory/${activeCycle.id}`)}>
                Xem chi tiết <ArrowRight size={13} />
              </Button>
            }
          />
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-text-secondary">{activeCycle.code}</span>
                  <Badge status="in_progress" size="sm" />
                </div>
                <h3 className="text-base font-bold text-text-primary">{activeCycle.name}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {new Date(activeCycle.startDate).toLocaleDateString("vi-VN")} &ndash;{" "}
                  {new Date(activeCycle.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary mb-0.5">Tiến độ</p>
                <p
                  className="text-3xl font-extrabold"
                  style={{ color: "var(--primary)", letterSpacing: "-0.02em" }}
                >
                  {progressPct}%
                </p>
                <p className="text-xs text-text-secondary">
                  {checkedItems} / {activeCycleItems.length} tài sản
                </p>
              </div>
            </div>

            {/* Animated progress bar */}
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: "rgba(37,99,235,0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, var(--primary) 0%, #60a5fa 100%)",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-2">
              <span>{checkedItems} đã kiểm</span>
              <span>{activeCycleItems.length - checkedItems} chưa kiểm</span>
            </div>

            {/* Anomalies in active cycle */}
            {anomalyItems.length > 0 && (
              <div
                className="mt-5 pt-4 rounded-xl px-4 py-3"
                style={{
                  border: "1px solid rgba(245,158,11,0.25)",
                  background: "rgba(245,158,11,0.05)",
                }}
              >
                <p className="text-sm font-semibold text-warning mb-2.5">
                  Bất thường trong kỳ này ({anomalyItems.length})
                </p>
                <div className="space-y-2">
                  {anomalyItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background:
                            item.checkStatus === "not_found" ? "var(--danger)" : "var(--warning)",
                        }}
                      />
                      <Badge status={item.checkStatus} size="sm" />
                      {item.notes && (
                        <span className="text-text-secondary truncate">{item.notes}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div>
          <SectionHeader title="Kỳ kiểm kê đang hoạt động" />
          <Card className="py-12 text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(100,116,139,0.3)" }} />
            <p className="text-sm text-text-secondary">Không có kỳ kiểm kê nào đang hoạt động</p>
          </Card>
        </div>
      )}

      {/* All cycles */}
      <div>
        <SectionHeader
          title={`Tất cả kỳ kiểm kê (${myCycles.length})`}
          action={
            <Button size="sm" variant="ghost" onClick={() => router.push("/inventory")}>
              Xem tất cả <ArrowRight size={13} />
            </Button>
          }
        />
        <Card>
          {myCycles.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-10">Chưa được giao kỳ kiểm kê nào</p>
          ) : (
            <div className="divide-y divide-border-color">
              {myCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/inventory/${cycle.id}`)}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.08)" }}
                  >
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{cycle.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {cycle.code} &middot;{" "}
                      {new Date(cycle.startDate).toLocaleDateString("vi-VN")} &ndash;{" "}
                      {new Date(cycle.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <Badge status={cycle.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Not authenticated ────────────────────────────────────────────────────────

function NotAuthenticatedState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(37,99,235,0.08)" }}
      >
        <Store className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-text-primary mb-2">HV QL Tài Sản</h1>
      <p className="text-text-secondary text-sm mb-6 max-w-xs">
        Vui lòng đăng nhập để truy cập hệ thống quản lý tài sản
      </p>
      <Button variant="primary" onClick={() => router.push("/login")}>
        Đăng nhập ngay
      </Button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <NotAuthenticatedState />;
  }

  const role: UserRole = currentUser.role;

  if (role === "counter_staff") return <CounterStaffDashboard />;
  if (role === "operations" || role === "ops_manager") return <OperationsDashboard />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "inventory_staff") return <InventoryStaffDashboard />;

  return <OperationsDashboard />;
}
