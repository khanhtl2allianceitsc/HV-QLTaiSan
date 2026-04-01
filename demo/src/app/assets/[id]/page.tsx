"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, Building2, MapPin, Calendar,
  User, Wrench, ClipboardList, QrCode, DollarSign, Clock,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatCurrency, getStatusLabel } from "@/lib/utils";

type TabKey = "repair" | "inventory";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "repair", label: "Lịch sử sửa chữa", icon: Wrench },
  { key: "inventory", label: "Lịch sử kiểm kê", icon: ClipboardList },
];

const TASK_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ tiếp nhận",
  accepted: "Đã tiếp nhận",
  in_progress: "Đang xử lý",
  waiting_confirmation: "Chờ xác nhận",
  completed: "Hoàn tất",
  rejected: "Từ chối",
};

const INVENTORY_STATUS_LABEL: Record<string, string> = {
  present_good: "Tốt",
  present_damaged: "Hư hỏng",
  not_found: "Không tìm thấy",
  not_checked: "Chưa kiểm",
};

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { assets, pharmacies, users, tasks, inventoryItems, inventoryCycles } = useStore();

  const asset = assets.find((a) => a.id === id);
  const pharmacy = asset ? pharmacies.find((p) => p.id === asset.pharmacyId) : undefined;
  const responsible = asset ? users.find((u) => u.id === asset.responsibleUserId) : undefined;

  const assetTasks = tasks.filter((t) => t.assetId === id);
  const assetInventoryItems = inventoryItems.filter((i) => i.assetId === id);

  const [activeTab, setActiveTab] = useState<TabKey>("repair");

  if (!asset) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/assets")} className="self-start">
          <ArrowLeft size={14} />
          Quay lại
        </Button>
        <EmptyState
          icon={Package}
          title="Không tìm thấy tài sản"
          description="Tài sản không tồn tại hoặc đã bị xóa"
          action={{ label: "Về danh sách", onClick: () => router.push("/assets") }}
        />
      </div>
    );
  }

  const getTaskAssignee = (assigneeId: string | null) =>
    assigneeId ? users.find((u) => u.id === assigneeId)?.name ?? "—" : "Chưa phân công";

  const getCycleName = (cycleId: string) =>
    inventoryCycles.find((c) => c.id === cycleId)?.name ?? cycleId;

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/assets")}
        className="self-start"
      >
        <ArrowLeft size={14} />
        Quay lại
      </Button>

      {/* Asset header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-lg">
                {asset.code}
              </span>
              <h1 className="text-lg font-semibold text-text-primary">{asset.name}</h1>
            </div>
          </div>
        </div>
        <Badge status={asset.status} />
      </div>

      {/* Main content: info + QR side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset info */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Thông tin tài sản</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<Package size={14} className="text-text-secondary/60" />}
              label="Danh mục"
              value={asset.category}
            />
            <InfoRow
              icon={<Package size={14} className="text-text-secondary/60" />}
              label="Loại tài sản"
              value={asset.type || "—"}
            />
            <InfoRow
              icon={<Building2 size={14} className="text-text-secondary/60" />}
              label="Quầy thuốc"
              value={pharmacy?.name ?? "—"}
            />
            <InfoRow
              icon={<MapPin size={14} className="text-text-secondary/60" />}
              label="Vị trí"
              value={asset.location || "—"}
            />
            <InfoRow
              icon={<Calendar size={14} className="text-text-secondary/60" />}
              label="Ngày lắp đặt"
              value={formatDate(asset.installDate)}
            />
            <InfoRow
              icon={<User size={14} className="text-text-secondary/60" />}
              label="Người phụ trách"
              value={responsible?.name ?? "—"}
            />
            <InfoRow
              icon={<DollarSign size={14} className="text-text-secondary/60" />}
              label="Đơn giá ban đầu"
              value={
                <span className="text-text-primary font-semibold">
                  {formatCurrency(asset.originalCost)}
                </span>
              }
            />
            <InfoRow
              icon={<Clock size={14} className="text-text-secondary/60" />}
              label="Khấu hao"
              value={`${asset.depreciationMonths} tháng`}
            />
            <InfoRow
              icon={<DollarSign size={14} className="text-text-secondary/60" />}
              label="Tổng chi phí sửa chữa"
              value={
                <span className={asset.totalRepairCost > 0 ? "text-warning font-semibold" : "text-success font-semibold"}>
                  {formatCurrency(asset.totalRepairCost)}
                </span>
              }
            />
            {asset.notes && (
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<Package size={14} className="text-text-secondary/60" />}
                  label="Ghi chú"
                  value={asset.notes}
                />
              </div>
            )}
          </div>
        </Card>

        {/* QR Code placeholder */}
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <h2 className="text-sm font-semibold text-text-primary self-start w-full">Mã QR</h2>
          <div className="w-40 h-40 border-2 border-border-color rounded-xl flex flex-col items-center justify-center gap-3 bg-page-bg relative overflow-hidden">
            {/* QR grid decoration */}
            <div className="absolute inset-2 grid grid-cols-7 grid-rows-7 gap-px opacity-20">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-[1px]",
                    Math.random() > 0.5 ? "bg-text-primary" : "bg-transparent",
                  ].join(" ")}
                />
              ))}
            </div>
            {/* Corner markers */}
            <div className="absolute top-2 left-2 w-7 h-7 border-3 border-text-primary rounded-sm" style={{ borderWidth: 3 }} />
            <div className="absolute top-2 right-2 w-7 h-7 border-3 border-text-primary rounded-sm" style={{ borderWidth: 3 }} />
            <div className="absolute bottom-2 left-2 w-7 h-7 border-3 border-text-primary rounded-sm" style={{ borderWidth: 3 }} />
            <QrCode size={28} className="text-text-primary relative z-10" />
          </div>
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-text-primary">{asset.code}</p>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed max-w-[140px] text-center">{asset.name}</p>
          </div>
          <p className="text-xs text-text-secondary/60 text-center">Quét mã để xem chi tiết tài sản</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border-color rounded-xl p-1 self-start">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === key
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
            ].join(" ")}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Repair history tab */}
      {activeTab === "repair" && (
        <>
          {assetTasks.length === 0 ? (
            <Card>
              <EmptyState
                icon={Wrench}
                title="Chưa có lịch sử sửa chữa"
                description="Tài sản này chưa có yêu cầu sửa chữa nào"
              />
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Mã task</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Tiêu đề</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden sm:table-cell">Người xử lý</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Trạng thái</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden md:table-cell">Chi phí thực tế</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden lg:table-cell">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-border-color last:border-0 hover:bg-page-bg transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-text-secondary">
                            {task.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-primary font-medium max-w-[200px] truncate">
                          {task.title}
                        </td>
                        <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                          {getTaskAssignee(task.assigneeId)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge status={task.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                          {task.actualCost > 0 ? (
                            <span className="font-medium text-warning">{formatCurrency(task.actualCost)}</span>
                          ) : (
                            <span className="text-text-secondary/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                          {formatDate(task.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Inventory history tab */}
      {activeTab === "inventory" && (
        <>
          {assetInventoryItems.length === 0 ? (
            <Card>
              <EmptyState
                icon={ClipboardList}
                title="Chưa có lịch sử kiểm kê"
                description="Tài sản này chưa được kiểm kê trong kỳ nào"
              />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {assetInventoryItems.map((item) => {
                const cycleName = getCycleName(item.cycleId);
                const checker = item.checkedById ? users.find((u) => u.id === item.checkedById) : undefined;
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary mb-1">{cycleName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-text-secondary mt-1">
                          {checker && (
                            <span className="flex items-center gap-1">
                              <User size={11} />
                              {checker.name}
                            </span>
                          )}
                          {item.checkedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(item.checkedAt)}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-text-secondary/70 italic">{item.notes}</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        status={item.checkStatus}
                        label={INVENTORY_STATUS_LABEL[item.checkStatus]}
                        size="sm"
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper component
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-text-primary pl-5">
        {typeof value === "string" ? value : value}
      </div>
    </div>
  );
}
