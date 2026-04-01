"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime, getLevelLabel } from "@/lib/utils";
import type { IncidentLevel } from "@/types";

function LevelBadge({ level }: { level: IncidentLevel }) {
  const colorMap: Record<IncidentLevel, string> = {
    1: "bg-red-50 text-red-700",
    2: "bg-amber-50 text-amber-700",
    3: "bg-blue-50 text-blue-700",
  };
  const dotMap: Record<IncidentLevel, string> = {
    1: "bg-red-500",
    2: "bg-amber-500",
    3: "bg-blue-500",
  };
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
        colorMap[level],
      ].join(" ")}
    >
      <span className={["w-2 h-2 rounded-full flex-shrink-0", dotMap[level]].join(" ")} />
      {getLevelLabel(level)}
    </span>
  );
}

type IncidentStatus = "open" | "processing" | "resolved" | "closed";

interface TimelineStep {
  status: IncidentStatus;
  label: string;
  description: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: "open", label: "Mở phiếu", description: "Phiếu báo hỏng được tạo" },
  { status: "processing", label: "Đang xử lý", description: "Công việc đang được thực hiện" },
  { status: "resolved", label: "Đã xử lý", description: "Sự cố đã được xử lý" },
  { status: "closed", label: "Đã đóng", description: "Phiếu đã được đóng" },
];

const STATUS_ORDER: Record<IncidentStatus, number> = {
  open: 0,
  processing: 1,
  resolved: 2,
  closed: 3,
};

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { incidents, tasks, assets, pharmacies, users } = useStore();

  const incident = incidents.find((i) => i.id === params.id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={40} className="text-text-secondary/40" />
        <p className="text-text-secondary">Không tìm thấy phiếu báo hỏng.</p>
        <Button variant="secondary" onClick={() => router.push("/incidents")}>
          <ArrowLeft size={14} />
          Quay lại
        </Button>
      </div>
    );
  }

  const linkedTask = incident.taskId ? tasks.find((t) => t.id === incident.taskId) ?? null : null;
  const asset = assets.find((a) => a.id === incident.assetId);
  const pharmacy = pharmacies.find((p) => p.id === incident.pharmacyId);
  const reporter = users.find((u) => u.id === incident.reporterId);

  const currentStatusOrder = STATUS_ORDER[incident.status];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/incidents")}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary bg-primary-light px-2.5 py-1 rounded">
                {incident.code}
              </span>
              <Badge status={incident.status} />
              <LevelBadge level={incident.level} />
            </div>
            <h1 className="text-xl font-bold text-text-primary mt-1">{incident.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Info */}
        <div className="md:col-span-2 flex flex-col gap-5">
          {/* Info card */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">Thông tin chi tiết</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Người báo" value={reporter?.name ?? incident.reporterId} />
              <InfoRow label="Ngày tạo" value={formatDateTime(incident.createdAt)} />
              <InfoRow
                label="Nhà thuốc"
                value={pharmacy?.name ?? incident.pharmacyId}
                fullWidth
              />
              <InfoRow
                label="Tài sản"
                value={asset ? `${asset.code} - ${asset.name}` : incident.assetId}
                fullWidth
              />
              {incident.description && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-text-secondary mb-1.5">Mô tả</p>
                  <p className="text-sm text-text-primary leading-relaxed bg-page-bg rounded-lg p-3">
                    {incident.description}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">Tiến trình xử lý</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const stepOrder = STATUS_ORDER[step.status];
                  const isDone = stepOrder < currentStatusOrder;
                  const isCurrent = step.status === incident.status;
                  const isFuture = stepOrder > currentStatusOrder;

                  return (
                    <div key={step.status} className="flex gap-3">
                      {/* Icon + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={[
                            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                            isDone
                              ? "bg-success/10"
                              : isCurrent
                              ? "bg-primary/10"
                              : "bg-page-bg",
                          ].join(" ")}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} className="text-success" />
                          ) : isCurrent ? (
                            <Circle size={16} className="text-primary fill-primary" />
                          ) : (
                            <Circle size={16} className="text-border-color" />
                          )}
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={[
                              "w-0.5 h-8 mt-1",
                              isDone ? "bg-success/30" : "bg-border-color",
                            ].join(" ")}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pb-6">
                        <p
                          className={[
                            "text-sm font-medium leading-7",
                            isFuture ? "text-text-secondary" : "text-text-primary",
                          ].join(" ")}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs text-primary font-normal">← Hiện tại</span>
                          )}
                        </p>
                        <p className="text-xs text-text-secondary">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Linked task */}
        <div className="flex flex-col gap-5">
          {linkedTask ? (
            <Card>
              <div className="px-5 py-4 border-b border-border-color">
                <h2 className="text-sm font-semibold text-text-primary">Công việc liên kết</h2>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                    {linkedTask.code}
                  </span>
                  <Badge status={linkedTask.status} />
                </div>
                <p className="text-sm font-medium text-text-primary">{linkedTask.title}</p>
                <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>Tạo: {formatDate(linkedTask.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>SLA hoàn thành: {formatDate(linkedTask.completionSla)}</span>
                  </div>
                </div>
                <Badge status={linkedTask.slaStatus} size="sm" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-1"
                  onClick={() => router.push(`/tasks/${linkedTask.id}`)}
                >
                  <ExternalLink size={13} />
                  Xem công việc
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-5 flex flex-col items-center gap-2 text-center">
                <Clock size={28} className="text-text-secondary/30" strokeWidth={1.5} />
                <p className="text-sm font-medium text-text-primary">Chưa có công việc</p>
                <p className="text-xs text-text-secondary">
                  Phiếu này chưa được liên kết với công việc nào.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-xs font-medium text-text-secondary mb-0.5">{label}</p>
      <p className="text-sm text-text-primary">{value}</p>
    </div>
  );
}
