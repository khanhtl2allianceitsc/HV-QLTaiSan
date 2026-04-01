"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Circle, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { InventoryItem } from "@/types";

type CheckStatus = InventoryItem["checkStatus"];

const CHECK_ICON_MAP: Record<CheckStatus, { icon: React.ElementType; color: string; label: string }> = {
  present_good: { icon: CheckCircle, color: "text-success", label: "Tốt" },
  present_damaged: { icon: AlertTriangle, color: "text-warning", label: "Hư hỏng" },
  not_found: { icon: XCircle, color: "text-danger", label: "Không tìm thấy" },
  not_checked: { icon: Circle, color: "text-text-secondary", label: "Chưa kiểm" },
};

export default function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { inventoryCycles, inventoryItems, assets, pharmacies, users } = useStore();

  const cycle = inventoryCycles.find((c) => c.id === id);

  if (!cycle) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Không tìm thấy kỳ kiểm kê
      </div>
    );
  }

  const cycleItems = inventoryItems.filter((i) => i.cycleId === id);
  const total = cycleItems.length;
  const checked = cycleItems.filter((i) => i.checkStatus !== "not_checked").length;
  const good = cycleItems.filter((i) => i.checkStatus === "present_good").length;
  const damaged = cycleItems.filter((i) => i.checkStatus === "present_damaged").length;
  const missing = cycleItems.filter((i) => i.checkStatus === "not_found").length;

  const assignees = users.filter((u) => cycle.assigneeIds.includes(u.id));
  const cyclePharmacies = pharmacies.filter((p) => cycle.pharmacyIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back + Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-text-secondary bg-surface border border-border-color px-2 py-0.5 rounded">
                {cycle.code}
              </span>
              <Badge status={cycle.status} />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{cycle.name}</h1>
            <p className="text-sm text-text-secondary mt-1">
              {formatDate(cycle.startDate)} – {formatDate(cycle.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Tổng tài sản" value={total} color="text-text-primary" />
        <StatCard label="Đã kiểm" value={checked} color="text-primary" />
        <StatCard label="Tốt" value={good} color="text-success" />
        <StatCard label="Hư hỏng" value={damaged} color="text-warning" />
        {missing > 0 && <StatCard label="Không tìm thấy" value={missing} color="text-danger" />}
      </div>

      {/* Progress bar */}
      <Card className="p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary">Tiến độ kiểm kê</span>
          <span className="font-semibold text-text-primary">
            {total > 0 ? Math.round((checked / total) * 100) : 0}%
          </span>
        </div>
        <div className="h-3 bg-page-bg rounded-full overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all",
              cycle.status === "completed" ? "bg-success" : "bg-primary",
            ].join(" ")}
            style={{ width: `${total > 0 ? Math.round((checked / total) * 100) : 0}%` }}
          />
        </div>
      </Card>

      {/* Assigned staff */}
      <Card className="p-4 mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Nhân viên phụ trách</h2>
        <div className="flex flex-wrap gap-2">
          {assignees.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 bg-page-bg rounded-lg px-3 py-1.5 text-sm"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: u.themeColor }}
              >
                {u.name.charAt(0)}
              </div>
              <span className="text-text-primary">{u.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Pharmacy sections */}
      <div className="space-y-6">
        {cyclePharmacies.map((pharmacy) => {
          const pharmacyItems = cycleItems.filter((i) => i.pharmacyId === pharmacy.id);

          return (
            <Card key={pharmacy.id} className="overflow-hidden">
              {/* Pharmacy header */}
              <div className="px-5 py-4 border-b border-border-color bg-page-bg/50">
                <h3 className="font-semibold text-text-primary">{pharmacy.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {pharmacyItems.filter((i) => i.checkStatus !== "not_checked").length}/{pharmacyItems.length} đã kiểm
                </p>
              </div>

              {/* Asset rows */}
              {pharmacyItems.length === 0 ? (
                <div className="px-5 py-6 text-sm text-text-secondary text-center">
                  Chưa có tài sản nào trong kỳ kiểm kê này
                </div>
              ) : (
                <div className="divide-y divide-border-color">
                  {pharmacyItems.map((item) => {
                    const asset = assets.find((a) => a.id === item.assetId);
                    const checkedBy = item.checkedById ? users.find((u) => u.id === item.checkedById) : null;
                    const iconInfo = CHECK_ICON_MAP[item.checkStatus];
                    const Icon = iconInfo.icon;

                    return (
                      <div key={item.id} className="px-5 py-4 flex items-start gap-3">
                        {/* Status icon */}
                        <Icon size={20} className={`${iconInfo.color} flex-shrink-0 mt-0.5`} />

                        {/* Asset info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-text-secondary">
                              {asset?.code ?? item.assetId}
                            </span>
                            <span className="text-sm font-medium text-text-primary">
                              {asset?.name ?? "Tài sản không xác định"}
                            </span>
                            <Badge status={item.checkStatus} label={iconInfo.label} size="sm" />
                          </div>

                          {item.notes && (
                            <p className="text-xs text-text-secondary mt-1">{item.notes}</p>
                          )}

                          {checkedBy && item.checkedAt && (
                            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                              <User size={11} />
                              {checkedBy.name} · {formatDateTime(item.checkedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </Card>
  );
}
