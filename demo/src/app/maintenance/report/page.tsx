"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

/* ─── Helpers ───────────────────────────────────────────────── */

function daysSince(dateStr: string): number {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

type FreshnessCategory = "green" | "yellow" | "red";

function getFreshness(days: number | null): FreshnessCategory {
  if (days === null) return "red";
  if (days <= 30) return "green";
  if (days <= 90) return "yellow";
  return "red";
}

const FRESHNESS_COLORS: Record<FreshnessCategory, { bg: string; border: string; dot: string; label: string }> = {
  green:  { bg: "#D1FAE5", border: "#059669", dot: "#059669", label: "Đã bảo trì gần đây (≤30 ngày)" },
  yellow: { bg: "#FEF3C7", border: "#D97706", dot: "#D97706", label: "Cần lưu ý (31-90 ngày)" },
  red:    { bg: "#FEE2E2", border: "#DC2626", dot: "#DC2626", label: "Quá hạn bảo trì (>90 ngày hoặc chưa bảo trì)" },
};

/* ─── Component ─────────────────────────────────────────────── */

export default function MaintenanceReportPage() {
  const router = useRouter();
  const { maintenance, assets, pharmacies } = useStore();

  const activePharmacies = pharmacies.filter((p) => p.status === "active");

  // Build asset maintenance map
  const assetMaintenanceMap = useMemo(() => {
    const map: Record<string, {
      lastCompletedDate: string | null;
      daysSinceLast: number | null;
      nextScheduled: string | null;
    }> = {};

    const activeAssetIds = assets
      .filter((a) => a.status !== "inactive")
      .map((a) => a.id);

    for (const assetId of activeAssetIds) {
      const records = (maintenance ?? []).filter((m) => m.assetId === assetId);

      const completed = records
        .filter((m) => m.status === "completed" && m.completedDate)
        .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime());

      const nextSched = records
        .filter((m) => m.status === "scheduled" && m.scheduledDate >= new Date().toISOString().split("T")[0])
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

      const lastDate = completed[0]?.completedDate ?? null;
      map[assetId] = {
        lastCompletedDate: lastDate,
        daysSinceLast: lastDate ? daysSince(lastDate) : null,
        nextScheduled: nextSched[0]?.scheduledDate ?? null,
      };
    }

    return map;
  }, [maintenance, assets]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const activeAssets = assets.filter((a) => a.status !== "inactive" && activePharmacies.some((p) => p.id === a.pharmacyId));
    let green = 0, yellow = 0, red = 0;
    for (const a of activeAssets) {
      const info = assetMaintenanceMap[a.id];
      const cat = getFreshness(info?.daysSinceLast ?? null);
      if (cat === "green") green++;
      else if (cat === "yellow") yellow++;
      else red++;
    }
    return { total: activeAssets.length, green, yellow, red };
  }, [assets, activePharmacies, assetMaintenanceMap]);

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/maintenance")}
        className="self-start"
      >
        <ArrowLeft size={14} />
        Quay lại
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Báo cáo trạng thái bảo trì</h1>
        <p className="text-sm text-text-secondary mt-0.5">Theo dõi tình trạng bảo trì của tài sản theo quầy thuốc</p>
      </div>

      {/* Color legend */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">Chú thích màu sắc</p>
        <div className="flex flex-wrap gap-4">
          {(["green", "yellow", "red"] as FreshnessCategory[]).map((cat) => {
            const c = FRESHNESS_COLORS[cat];
            return (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.dot }}
                />
                <span className="text-xs text-text-secondary">{c.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#475569" }}>
          <p className="text-xs text-text-secondary mb-1">Tổng tài sản</p>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.total}</p>
        </div>
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#059669" }}>
          <p className="text-xs text-text-secondary mb-1">Bảo trì gần đây</p>
          <p className="text-2xl font-bold" style={{ color: "#059669" }}>{summaryStats.green}</p>
          <p className="text-[11px] text-text-tertiary">≤30 ngày</p>
        </div>
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#D97706" }}>
          <p className="text-xs text-text-secondary mb-1">Cần lưu ý</p>
          <p className="text-2xl font-bold" style={{ color: "#D97706" }}>{summaryStats.yellow}</p>
          <p className="text-[11px] text-text-tertiary">31-90 ngày</p>
        </div>
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#DC2626" }}>
          <p className="text-xs text-text-secondary mb-1">Quá hạn</p>
          <p className="text-2xl font-bold" style={{ color: "#DC2626" }}>{summaryStats.red}</p>
          <p className="text-[11px] text-text-tertiary">&gt;90 ngày / chưa bảo trì</p>
        </div>
      </div>

      {/* Per-pharmacy breakdown */}
      {activePharmacies.map((pharmacy) => {
        const pharmacyAssets = assets.filter(
          (a) => a.pharmacyId === pharmacy.id && a.status !== "inactive"
        );

        if (pharmacyAssets.length === 0) return null;

        return (
          <div key={pharmacy.id}>
            {/* Pharmacy header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-primary" />
              <h2 className="text-base font-semibold text-text-primary">{pharmacy.name}</h2>
              <span className="text-xs text-text-tertiary">({pharmacyAssets.length} tài sản)</span>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Tài sản</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Loại</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Lần bảo trì cuối</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Thời gian</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap hidden md:table-cell">Lịch bảo trì tiếp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyAssets.map((asset) => {
                      const info = assetMaintenanceMap[asset.id];
                      const days = info?.daysSinceLast ?? null;
                      const cat = getFreshness(days);
                      const colors = FRESHNESS_COLORS[cat];

                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-border-color last:border-0 hover:bg-page-bg transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[11px] text-primary">{asset.code}</span>
                              <span className="text-text-primary font-medium text-xs leading-tight">
                                {asset.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-text-secondary">
                            {asset.category}
                          </td>
                          <td className="px-4 py-3 text-xs text-text-secondary">
                            {info?.lastCompletedDate ? formatDate(info.lastCompletedDate) : (
                              <span className="text-text-tertiary italic">Chưa bảo trì</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors.dot }}
                              />
                              <span
                                className="text-xs font-medium"
                                style={{ color: colors.dot }}
                              >
                                {days === null
                                  ? "Chưa bảo trì"
                                  : `${days} ngày trước`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell">
                            {info?.nextScheduled ? (
                              <span className="text-info font-medium">{formatDate(info.nextScheduled)}</span>
                            ) : (
                              <span className="text-text-tertiary">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
