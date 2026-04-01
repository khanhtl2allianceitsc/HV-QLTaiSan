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
import { formatDateTime, getStatusLabel, getRoleLabel, timeAgo } from "@/lib/utils";
import type { UserRole } from "@/types";

// ─── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  iconBg: string;
  valueColor?: string;
  onClick?: () => void;
}

function StatCard({ icon, label, value, iconBg, valueColor = "text-text-primary", onClick }: StatCardProps) {
  return (
    <Card className="p-5" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className={["w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg].join(" ")}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary leading-tight">{label}</p>
          <p className={["text-4xl font-bold mt-1 leading-none", valueColor].join(" ")}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      {action}
    </div>
  );
}

// ─── Role Dashboards ─────────────────────────────────────────────────────────

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
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Xin chào, {currentUser?.name} 👋
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {myPharmacy?.name ?? "Nhà thuốc của bạn"} &mdash; {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Tài sản tại quầy"
          value={myAssets.length}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Sự cố đang xử lý"
          value={pendingIncidents.length}
          valueColor={pendingIncidents.length > 0 ? "text-danger" : "text-text-primary"}
          onClick={() => router.push("/incidents")}
        />
        <StatCard
          icon={<Wrench className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          label="Task đang tiến hành"
          value={inProgressTasks.length}
          valueColor="text-warning"
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Task đã hoàn thành"
          value={completedTasks.length}
          valueColor="text-success"
        />
      </div>

      {/* Recent incidents */}
      <div>
        <SectionHeader
          title="Sự cố gần đây"
          action={
            <Button size="sm" variant="ghost" onClick={() => router.push("/incidents")}>
              Xem tất cả <ArrowRight size={14} />
            </Button>
          }
        />
        <Card>
          {myIncidents.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">Không có sự cố nào</p>
          ) : (
            <div className="divide-y divide-border-color">
              {myIncidents.slice(0, 6).map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/incidents/${inc.id}`)}
                >
                  <div
                    className={[
                      "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                      inc.level === 1 ? "bg-danger" : inc.level === 2 ? "bg-warning" : "bg-info",
                    ].join(" ")}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{inc.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{inc.code} &middot; {timeAgo(inc.createdAt)}</p>
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
                Xem tất cả <ArrowRight size={14} />
              </Button>
            }
          />
          <div className="space-y-3">
            {confirmationTasks.map((task) => (
              <Card
                key={task.id}
                className="p-4"
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-text-secondary">{task.code}</span>
                      <Badge status="waiting_confirmation" size="sm" />
                    </div>
                    <p className="text-sm font-medium text-text-primary mt-1 truncate">{task.title}</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${task.id}`); }}>
                    Xác nhận
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          {isManager ? "Dashboard Quản lý" : "Dashboard Vận hành"}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Xin chào, {currentUser?.name} &mdash; {getRoleLabel(currentUser?.role ?? "")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Tổng số task"
          value={totalTasks}
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<ShieldAlert className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Task quá hạn SLA"
          value={overdueTasks.length}
          valueColor={overdueTasks.length > 0 ? "text-danger" : "text-text-primary"}
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<Wrench className="w-5 h-5 text-info" />}
          iconBg="bg-info/10"
          label="Đang tiến hành"
          value={inProgressTasks.length}
          valueColor="text-info"
          onClick={() => router.push("/tasks")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Hoàn thành tháng này"
          value={completedThisMonth.length}
          valueColor="text-success"
        />
      </div>

      {/* SLA overview */}
      <div>
        <SectionHeader title="Tổng quan SLA" />
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{slaOnTime}</div>
            <div className="text-xs text-text-secondary mt-1 font-medium">Trong hạn</div>
            <div className="mt-2 h-1.5 rounded-full bg-success/20 overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: totalTasks ? `${(slaOnTime / totalTasks) * 100}%` : "0%" }}
              />
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-warning">{slaAtRisk}</div>
            <div className="text-xs text-text-secondary mt-1 font-medium">Sắp trễ</div>
            <div className="mt-2 h-1.5 rounded-full bg-warning/20 overflow-hidden">
              <div
                className="h-full bg-warning rounded-full"
                style={{ width: totalTasks ? `${(slaAtRisk / totalTasks) * 100}%` : "0%" }}
              />
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-danger">{slaOverdue}</div>
            <div className="text-xs text-text-secondary mt-1 font-medium">Quá hạn</div>
            <div className="mt-2 h-1.5 rounded-full bg-danger/20 overflow-hidden">
              <div
                className="h-full bg-danger rounded-full"
                style={{ width: totalTasks ? `${(slaOverdue / totalTasks) * 100}%` : "0%" }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent tasks + Kanban link */}
      <div>
        <SectionHeader
          title="Task gần đây"
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => router.push("/tasks/kanban")}>
                <Kanban size={14} /> Kanban
              </Button>
              <Button size="sm" variant="ghost" onClick={() => router.push("/tasks")}>
                Tất cả <ArrowRight size={14} />
              </Button>
            </div>
          }
        />
        <Card>
          <div className="divide-y divide-border-color">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                <div
                  className={[
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    task.level === 1 ? "bg-danger" : task.level === 2 ? "bg-warning" : "bg-info",
                  ].join(" ")}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{task.code} &middot; {timeAgo(task.updatedAt)}</p>
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
    { key: "active", label: "Hoạt động", color: "text-success", bg: "bg-success/10" },
    { key: "needs_repair", label: "Cần sửa", color: "text-orange-600", bg: "bg-orange-50" },
    { key: "broken", label: "Hư hỏng", color: "text-danger", bg: "bg-danger/10" },
    { key: "inactive", label: "Ngừng HĐ", color: "text-text-secondary", bg: "bg-text-secondary/10" },
  ];

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Dashboard Admin</h1>
        <p className="text-sm text-text-secondary mt-0.5">Tổng quan hệ thống quản lý tài sản</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Store className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Nhà thuốc đang hoạt động"
          value={activePharmacies}
          onClick={() => router.push("/pharmacies")}
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-info" />}
          iconBg="bg-info/10"
          label="Tổng tài sản"
          value={assets.length}
          onClick={() => router.push("/assets")}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Người dùng đang hoạt động"
          value={activeUsers}
          onClick={() => router.push("/admin/users")}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Sự cố đang mở"
          value={activeIncidents}
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
              Xem tất cả <ArrowRight size={14} />
            </Button>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {assetStatusList.map((s) => (
            <Card key={s.key} className="p-4 text-center" onClick={() => router.push("/assets")}>
              <div className={["text-3xl font-bold", s.color].join(" ")}>
                {statusGroups[s.key] ?? 0}
              </div>
              <div className={["text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block", s.bg, s.color].join(" ")}>
                {s.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent activities */}
      <div>
        <SectionHeader title="Hoạt động gần đây" />
        <Card>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">Chưa có hoạt động nào</p>
          ) : (
            <div className="divide-y divide-border-color">
              {recentActivities.map((act) => {
                const actUser = users.find((u) => u.id === act.userId);
                return (
                  <div key={act.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 flex-shrink-0 mt-0.5">
                      {actUser ? (
                        <UserAvatar user={actUser} size="sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-page-bg flex items-center justify-center">
                          <Activity size={14} className="text-text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{actUser?.name ?? "Hệ thống"}</span>{" "}
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

  // Global anomalies across all my cycles
  const allMyCycleIds = new Set(myCycles.map((c) => c.id));
  const allMyItems = inventoryItems.filter((i) => allMyCycleIds.has(i.cycleId));
  const totalAnomalies = allMyItems.filter(
    (i) => i.checkStatus === "present_damaged" || i.checkStatus === "not_found"
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Dashboard Kiểm kê
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Xin chào, {currentUser?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Kỳ kiểm kê được giao"
          value={myCycles.length}
          onClick={() => router.push("/inventory")}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
          label="Kỳ đã hoàn thành"
          value={completedCycles}
          valueColor="text-success"
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-info" />}
          iconBg="bg-info/10"
          label="Tài sản đã kiểm tra"
          value={checkedItems}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          label="Bất thường phát hiện"
          value={totalAnomalies}
          valueColor={totalAnomalies > 0 ? "text-warning" : "text-text-primary"}
        />
      </div>

      {/* Active cycle info */}
      {activeCycle ? (
        <div>
          <SectionHeader
            title="Kỳ kiểm kê đang hoạt động"
            action={
              <Button size="sm" variant="ghost" onClick={() => router.push(`/inventory/${activeCycle.id}`)}>
                Xem chi tiết <ArrowRight size={14} />
              </Button>
            }
          />
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-text-secondary">{activeCycle.code}</span>
                  <Badge status="in_progress" size="sm" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">{activeCycle.name}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {new Date(activeCycle.startDate).toLocaleDateString("vi-VN")} &ndash;{" "}
                  {new Date(activeCycle.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Tiến độ</p>
                <p className="text-2xl font-bold text-primary">
                  {checkedItems} / {activeCycleItems.length}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 rounded-full bg-page-bg overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: activeCycleItems.length > 0
                      ? `${(checkedItems / activeCycleItems.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-secondary mt-1.5">
                <span>{checkedItems} đã kiểm</span>
                <span>{activeCycleItems.length - checkedItems} chưa kiểm</span>
              </div>
            </div>

            {/* Anomalies in active cycle */}
            {anomalyItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-sm font-medium text-warning mb-2">
                  Bất thường trong kỳ này ({anomalyItems.length})
                </p>
                <div className="space-y-1.5">
                  {anomalyItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <span
                        className={[
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          item.checkStatus === "not_found" ? "bg-danger" : "bg-warning",
                        ].join(" ")}
                      />
                      <Badge status={item.checkStatus} size="sm" />
                      {item.notes && <span className="text-text-secondary truncate">{item.notes}</span>}
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
          <Card className="py-10 text-center">
            <TrendingUp className="w-10 h-10 text-text-secondary/30 mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Không có kỳ kiểm kê nào đang hoạt động</p>
          </Card>
        </div>
      )}

      {/* All my cycles */}
      <div>
        <SectionHeader
          title={`Tất cả kỳ kiểm kê (${myCycles.length})`}
          action={
            <Button size="sm" variant="ghost" onClick={() => router.push("/inventory")}>
              Xem tất cả <ArrowRight size={14} />
            </Button>
          }
        />
        <Card>
          {myCycles.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">Chưa được giao kỳ kiểm kê nào</p>
          ) : (
            <div className="divide-y divide-border-color">
              {myCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-page-bg/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/inventory/${cycle.id}`)}
                >
                  <BarChart3 className="w-4 h-4 text-text-secondary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{cycle.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {cycle.code} &middot; {new Date(cycle.startDate).toLocaleDateString("vi-VN")} &ndash; {new Date(cycle.endDate).toLocaleDateString("vi-VN")}
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

// ─── Redirect to login if not authenticated ──────────────────────────────────

function NotAuthenticatedState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
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

// ─── Main export ─────────────────────────────────────────────────────────────

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
