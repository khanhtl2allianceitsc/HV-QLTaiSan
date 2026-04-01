"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { TransferRecord } from "@/types";

/* ─── Type badge ─────────────────────────────────────────────── */

function TypeBadge({ type }: { type: TransferRecord["type"] }) {
  if (type === "pharmacy_transfer") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
        Điều chuyển quầy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
      Bàn giao phụ trách
    </span>
  );
}

/* ─── Info row ───────────────────────────────────────────────── */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5 border-b border-border-color last:border-0">
      <dt className="text-sm text-text-secondary w-full sm:w-40 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-text-primary font-medium flex-1">{value}</dd>
    </div>
  );
}

/* ─── Timeline step ──────────────────────────────────────────── */

type TimelineStepStatus = "done" | "active" | "pending" | "skipped";

function TimelineStep({
  label,
  date,
  byName,
  status,
  isLast,
}: {
  label: string;
  date?: string;
  byName?: string;
  status: TimelineStepStatus;
  isLast?: boolean;
}) {
  const iconMap: Record<TimelineStepStatus, React.ReactNode> = {
    done: <CheckCircle2 size={18} className="text-success" />,
    active: <Clock size={18} className="text-primary animate-pulse" />,
    pending: <Circle size={18} className="text-text-tertiary" />,
    skipped: <XCircle size={18} className="text-danger" />,
  };

  return (
    <div className="flex gap-3">
      {/* icon + connector */}
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0">{iconMap[status]}</div>
        {!isLast && (
          <div
            className={[
              "w-px flex-1 mt-1 min-h-[32px]",
              status === "done" ? "bg-success/30" : "bg-border-color",
            ].join(" ")}
          />
        )}
      </div>

      {/* content */}
      <div className="pb-5 min-w-0 flex-1">
        <p
          className={[
            "text-sm font-semibold",
            status === "pending" || status === "skipped"
              ? "text-text-secondary"
              : "text-text-primary",
          ].join(" ")}
        >
          {label}
        </p>
        {date && (
          <p className="text-xs text-text-secondary mt-0.5">{formatDateTime(date)}</p>
        )}
        {byName && (
          <p className="text-xs text-text-tertiary mt-0.5">bởi {byName}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function TransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { transfers, assets, pharmacies, users, currentUser, updateTransfer, addToast, logActivity } =
    useStore();

  const transfer = transfers.find((t) => t.id === id);

  if (!transfer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ArrowRightLeft size={40} className="text-text-tertiary opacity-40" />
        <p className="text-text-secondary">Không tìm thấy phiếu này.</p>
        <Button variant="secondary" onClick={() => router.push("/transfers")}>
          <ArrowLeft size={15} />
          Quay lại
        </Button>
      </div>
    );
  }

  // Non-nullable alias for use inside closures
  const tr = transfer;

  /* ── Lookups ── */
  const asset = assets.find((a) => a.id === tr.assetId);
  const fromPharmacy = pharmacies.find((p) => p.id === tr.fromPharmacyId);
  const toPharmacy = pharmacies.find((p) => p.id === tr.toPharmacyId);
  const fromUser = users.find((u) => u.id === tr.fromUserId);
  const toUser = users.find((u) => u.id === tr.toUserId);
  const performer = users.find((u) => u.id === tr.performedById);
  const approver = users.find((u) => u.id === tr.approvedById);
  const assetPharmacy = pharmacies.find((p) => p.id === asset?.pharmacyId);

  /* ── Actions ── */
  function handleApprove() {
    const now = new Date().toISOString();
    updateTransfer(tr.id, {
      status: "approved",
      approvedById: currentUser?.id,
      approvedAt: now,
    });
    if (currentUser) {
      logActivity(currentUser.id, `Phê duyệt phiếu ${tr.code}`, "transfer", tr.id);
    }
    addToast("success", `Đã phê duyệt phiếu ${tr.code}.`);
  }

  function handleCancel() {
    updateTransfer(tr.id, { status: "cancelled" });
    if (currentUser) {
      logActivity(currentUser.id, `Hủy phiếu ${tr.code}`, "transfer", tr.id);
    }
    addToast("info", `Đã hủy phiếu ${tr.code}.`);
  }

  function handleComplete() {
    updateTransfer(tr.id, { status: "completed" });
    if (currentUser) {
      logActivity(currentUser.id, `Hoàn tất phiếu ${tr.code}`, "transfer", tr.id);
    }
    addToast("success", `Đã hoàn tất phiếu ${tr.code}.`);
  }

  /* ── Timeline ── */
  type Step = { label: string; date?: string; byName?: string; status: TimelineStepStatus };
  const timelineSteps: Step[] = (() => {
    const created: Step = {
      label: "Đã tạo phiếu",
      date: tr.transferDate
        ? `${tr.transferDate}T00:00:00Z`
        : undefined,
      byName: performer?.name,
      status: "done",
    };

    const approvedStep: Step = {
      label: "Đã phê duyệt",
      date: tr.approvedAt,
      byName: approver?.name,
      status:
        tr.status === "cancelled"
          ? "skipped"
          : tr.approvedAt
          ? "done"
          : tr.status === "draft"
          ? "pending"
          : "active",
    };

    const completedStep: Step = {
      label: "Đã hoàn tất",
      status:
        tr.status === "cancelled"
          ? "skipped"
          : tr.status === "completed"
          ? "done"
          : tr.status === "approved"
          ? "active"
          : "pending",
    };

    if (tr.status === "cancelled") {
      return [
        created,
        { label: "Đã hủy", status: "skipped" as TimelineStepStatus },
      ];
    }

    return [created, approvedStep, completedStep];
  })();

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/transfers")}
          className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary font-mono">
              {tr.code}
            </h1>
            <TypeBadge type={tr.type} />
            <Badge status={tr.status} />
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            Ngày tạo: {formatDate(tr.transferDate)}
          </p>
        </div>
      </div>

      {/* Info card */}
      <Card>
        <div className="px-6 py-4 border-b border-border-color">
          <h2 className="text-base font-semibold text-text-primary">Thông tin phiếu</h2>
        </div>
        <dl className="px-6 py-2">
          {/* Asset */}
          <InfoRow
            label="Tài sản"
            value={
              asset ? (
                <button
                  onClick={() => router.push(`/assets/${asset.id}`)}
                  className="text-primary hover:underline font-medium"
                >
                  {asset.code} — {asset.name}
                </button>
              ) : (
                tr.assetId
              )
            }
          />

          {asset && (
            <InfoRow
              label="Vị trí hiện tại"
              value={`${assetPharmacy?.name ?? "—"} / ${asset.location}`}
            />
          )}

          <InfoRow
            label="Loại phiếu"
            value={
              tr.type === "pharmacy_transfer"
                ? "Điều chuyển quầy"
                : "Bàn giao phụ trách"
            }
          />

          {tr.type === "pharmacy_transfer" ? (
            <InfoRow
              label="Từ → Đến"
              value={
                <span className="flex items-center gap-2">
                  <span>{fromPharmacy?.name ?? tr.fromPharmacyId ?? "—"}</span>
                  <ArrowRightLeft size={14} className="text-text-tertiary flex-shrink-0" />
                  <span>{toPharmacy?.name ?? tr.toPharmacyId ?? "—"}</span>
                </span>
              }
            />
          ) : (
            <InfoRow
              label="Từ → Đến"
              value={
                <span className="flex items-center gap-2">
                  <span>{fromUser?.name ?? tr.fromUserId ?? "—"}</span>
                  <ArrowRightLeft size={14} className="text-text-tertiary flex-shrink-0" />
                  <span>{toUser?.name ?? tr.toUserId ?? "—"}</span>
                </span>
              }
            />
          )}

          <InfoRow
            label="Lý do"
            value={<span className="whitespace-pre-wrap">{tr.reason}</span>}
          />

          {tr.notes && (
            <InfoRow
              label="Ghi chú"
              value={<span className="whitespace-pre-wrap">{tr.notes}</span>}
            />
          )}

          <InfoRow label="Người thực hiện" value={performer?.name ?? tr.performedById} />

          {tr.approvedById && (
            <InfoRow
              label="Người phê duyệt"
              value={
                <>
                  {approver?.name ?? tr.approvedById}
                  {tr.approvedAt && (
                    <span className="text-text-secondary font-normal ml-1.5">
                      ({formatDateTime(tr.approvedAt)})
                    </span>
                  )}
                </>
              }
            />
          )}
        </dl>
      </Card>

      {/* Timeline */}
      <Card>
        <div className="px-6 py-4 border-b border-border-color">
          <h2 className="text-base font-semibold text-text-primary">Tiến trình</h2>
        </div>
        <div className="px-6 py-4">
          {timelineSteps.map((step, i) => (
            <TimelineStep
              key={step.label}
              label={step.label}
              date={step.date}
              byName={step.byName}
              status={step.status}
              isLast={i === timelineSteps.length - 1}
            />
          ))}
        </div>
      </Card>

      {/* Action buttons */}
      {(tr.status === "draft" || tr.status === "approved") && (
        <Card>
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold text-text-primary mb-3">Hành động</h2>
            <div className="flex gap-2 flex-wrap">
              {tr.status === "draft" && (
                <>
                  <Button onClick={handleApprove}>
                    <CheckCircle2 size={16} />
                    Phê duyệt
                  </Button>
                  <Button variant="danger" onClick={handleCancel}>
                    <XCircle size={16} />
                    Hủy phiếu
                  </Button>
                </>
              )}
              {tr.status === "approved" && (
                <Button onClick={handleComplete}>
                  <CheckCircle2 size={16} />
                  Hoàn tất
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
