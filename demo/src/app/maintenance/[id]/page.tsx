"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Wrench, Building2, Calendar, User, DollarSign, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatCurrency } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  scheduled: "Định kỳ",
  preventive: "Phòng ngừa",
  corrective: "Khắc phục",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Đã lên lịch",
  in_progress: "Đang thực hiện",
  completed: "Hoàn tất",
  overdue: "Quá hạn",
};

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
        {value}
      </div>
    </div>
  );
}

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { maintenance, assets, pharmacies, users, updateMaintenance } = useStore();

  const record = (maintenance ?? []).find((m) => m.id === id);
  const asset = record ? assets.find((a) => a.id === record.assetId) : undefined;
  const pharmacy = record ? pharmacies.find((p) => p.id === record.pharmacyId) : undefined;
  const performer = record?.performedById ? users.find((u) => u.id === record.performedById) : undefined;

  if (!record) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/maintenance")} className="self-start">
          <ArrowLeft size={14} />
          Quay lại
        </Button>
        <EmptyState
          icon={Wrench}
          title="Không tìm thấy lịch bảo trì"
          description="Bản ghi bảo trì không tồn tại"
          action={{ label: "Về danh sách", onClick: () => router.push("/maintenance") }}
        />
      </div>
    );
  }

  const handleStart = () => {
    updateMaintenance(id, { status: "in_progress" });
  };

  const handleComplete = () => {
    updateMaintenance(id, {
      status: "completed",
      completedDate: new Date().toISOString().split("T")[0],
    });
  };

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
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Wrench size={20} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-lg">
              {record.code}
            </span>
            <Badge status={record.type} label={TYPE_LABELS[record.type]} />
            <Badge status={record.status} label={STATUS_LABELS[record.status]} />
          </div>
          <p className="text-text-secondary text-sm mt-1 line-clamp-1">{record.description}</p>
        </div>
      </div>

      {/* Info card */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Thông tin bảo trì</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow
            icon={<Wrench size={14} className="text-text-secondary/60" />}
            label="Tài sản"
            value={
              asset ? (
                <Link
                  href={`/assets/${asset.id}`}
                  className="text-primary hover:underline font-medium flex items-center gap-1"
                >
                  {asset.code} — {asset.name}
                  <ExternalLink size={11} />
                </Link>
              ) : "—"
            }
          />
          <InfoRow
            icon={<Building2 size={14} className="text-text-secondary/60" />}
            label="Quầy thuốc"
            value={pharmacy?.name ?? "—"}
          />
          <InfoRow
            icon={<Calendar size={14} className="text-text-secondary/60" />}
            label="Ngày lên lịch"
            value={formatDate(record.scheduledDate)}
          />
          {record.completedDate && (
            <InfoRow
              icon={<Calendar size={14} className="text-text-secondary/60" />}
              label="Ngày hoàn tất"
              value={
                <span className="text-success font-medium">{formatDate(record.completedDate)}</span>
              }
            />
          )}
          <InfoRow
            icon={<User size={14} className="text-text-secondary/60" />}
            label="Người thực hiện"
            value={performer?.name ?? <span className="text-text-tertiary">Chưa phân công</span>}
          />
          <InfoRow
            icon={<DollarSign size={14} className="text-text-secondary/60" />}
            label="Chi phí"
            value={
              record.cost > 0 ? (
                <span className="text-warning font-semibold">{formatCurrency(record.cost)}</span>
              ) : (
                <span className="text-text-tertiary">Chưa có</span>
              )
            }
          />
          {record.taskId && (
            <InfoRow
              icon={<ExternalLink size={14} className="text-text-secondary/60" />}
              label="Task liên kết"
              value={
                <Link
                  href={`/tasks/${record.taskId}`}
                  className="text-primary hover:underline font-medium flex items-center gap-1"
                >
                  Xem task
                  <ExternalLink size={11} />
                </Link>
              }
            />
          )}
          {record.notes && (
            <div className="sm:col-span-2">
              <InfoRow
                icon={<FileText size={14} className="text-text-secondary/60" />}
                label="Ghi chú"
                value={record.notes}
              />
            </div>
          )}
          <div className="sm:col-span-2">
            <InfoRow
              icon={<FileText size={14} className="text-text-secondary/60" />}
              label="Mô tả công việc"
              value={<span className="whitespace-pre-wrap leading-relaxed">{record.description}</span>}
            />
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      {record.status === "scheduled" && (
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleStart} icon={<Wrench size={14} />}>
            Bắt đầu thực hiện
          </Button>
        </div>
      )}

      {record.status === "in_progress" && (
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleComplete}>
            Hoàn tất bảo trì
          </Button>
        </div>
      )}

      {record.status === "completed" && (
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#059669" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <p className="text-sm font-medium text-success">Đã hoàn tất bảo trì</p>
            {record.completedDate && (
              <span className="text-xs text-text-secondary ml-1">
                vào ngày {formatDate(record.completedDate)}
              </span>
            )}
          </div>
        </div>
      )}

      {record.status === "overdue" && (
        <div className="rounded-xl border border-border-color bg-surface shadow-[var(--shadow-sm)] p-4 border-l-4" style={{ borderLeftColor: "#DC2626" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-danger" />
            <p className="text-sm font-medium text-danger">Quá hạn bảo trì</p>
          </div>
          <p className="text-xs text-text-secondary">
            Lịch bảo trì này đã quá hạn. Vui lòng thực hiện ngay hoặc lên lịch lại.
          </p>
          <div className="mt-3">
            <Button variant="primary" size="sm" onClick={handleStart} icon={<Wrench size={13} />}>
              Bắt đầu thực hiện
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
