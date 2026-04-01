"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import type { InventoryCycle, InventoryItem, Pharmacy } from "@/types";

type FilterStatus = "all" | "planned" | "in_progress" | "completed";

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "planned", label: "Kế hoạch" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
];

function cycleProgress(cycleId: string, inventoryItems: InventoryItem[]) {
  const items = inventoryItems.filter((i) => i.cycleId === cycleId);
  if (items.length === 0) return { total: 0, checked: 0, pct: 0 };
  const checked = items.filter((i) => i.checkStatus !== "not_checked").length;
  return { total: items.length, checked, pct: Math.round((checked / items.length) * 100) };
}

export default function InventoryPage() {
  const router = useRouter();
  const { inventoryCycles, inventoryItems, pharmacies } = useStore();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered = inventoryCycles.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Kiểm kê</h1>
        <p className="text-sm text-text-secondary mt-1">Quản lý các kỳ kiểm kê tài sản</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border-color mb-6 w-fit">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={[
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
              filter === opt.value
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Cycle list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Không có kỳ kiểm kê"
          description="Không tìm thấy kỳ kiểm kê nào phù hợp với bộ lọc đã chọn."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((cycle) => (
            <CycleCard
              key={cycle.id}
              cycle={cycle}
              inventoryItems={inventoryItems}
              pharmacies={pharmacies}
              onClick={() => router.push(`/inventory/${cycle.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CycleCardProps {
  cycle: InventoryCycle;
  inventoryItems: InventoryItem[];
  pharmacies: Pharmacy[];
  onClick: () => void;
}

function CycleCard({ cycle, inventoryItems, pharmacies, onClick }: CycleCardProps) {
  const { total, checked, pct } = cycleProgress(cycle.id, inventoryItems);
  const cyclePharmacies = pharmacies.filter((p) => cycle.pharmacyIds.includes(p.id));

  return (
    <Card onClick={onClick} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Code + status */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-text-secondary bg-page-bg px-2 py-0.5 rounded">
              {cycle.code}
            </span>
            <Badge status={cycle.status} />
          </div>

          {/* Name */}
          <h3 className="text-base font-semibold text-text-primary truncate">{cycle.name}</h3>

          {/* Date range */}
          <p className="text-sm text-text-secondary mt-1">
            {formatDate(cycle.startDate)} – {formatDate(cycle.endDate)}
          </p>

          {/* Pharmacies */}
          <p className="text-sm text-text-secondary mt-1">
            {cyclePharmacies.length} nhà thuốc:{" "}
            <span className="text-text-primary">
              {cyclePharmacies.map((p) => p.name.replace("Nhà thuốc Hoàng Việt - ", "")).join(", ")}
            </span>
          </p>
        </div>

        {/* Progress */}
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-bold text-primary">{pct}%</div>
          <div className="text-xs text-text-secondary">
            {checked}/{total} tài sản
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-page-bg rounded-full overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              cycle.status === "completed" ? "bg-success" : "bg-primary",
            ].join(" ")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
