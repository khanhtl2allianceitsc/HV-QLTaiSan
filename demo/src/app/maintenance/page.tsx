"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Plus, BarChart3 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { MaintenanceRecord, Task } from "@/types";

/* ─── Labels ──────────────────────────────────────────────── */

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

type TabKey = "all" | "scheduled" | "in_progress" | "completed" | "overdue";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",         label: "Tất cả" },
  { key: "scheduled",   label: "Đã lên lịch" },
  { key: "in_progress", label: "Đang thực hiện" },
  { key: "completed",   label: "Hoàn tất" },
  { key: "overdue",     label: "Quá hạn" },
];

/* ─── Create Maintenance Modal ──────────────────────────────── */

function CreateMaintenanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const store = useStore();
  const { assets, maintenance, currentUser } = store;

  const [assetId, setAssetId] = useState("");
  const [type, setType] = useState<"scheduled" | "preventive" | "corrective">("scheduled");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [createTaskChecked, setCreateTaskChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedAsset = assets.find((a) => a.id === assetId);
  const pharmacyId = selectedAsset?.pharmacyId ?? "";

  const assetOptions = assets
    .filter((a) => a.status !== "inactive")
    .map((a) => ({ value: a.id, label: `${a.code} — ${a.name}` }));

  const handleSubmit = () => {
    if (!assetId || !description || !scheduledDate) return;
    setSaving(true);

    const nextNum = (maintenance ?? []).length + 1;
    const code = `BT-${String(nextNum).padStart(3, "0")}`;
    const id = `mt-${Date.now()}`;
    const now = new Date().toISOString();

    let taskId: string | undefined;

    if (createTaskChecked) {
      const taskNum = (store.tasks?.length ?? 0) + 1;
      const newTask: Task = {
        id: `task-maint-${Date.now()}`,
        code: `TASK-${String(taskNum).padStart(3, "0")}`,
        assetId,
        pharmacyId,
        title: `Bảo trì ${selectedAsset?.name ?? assetId}`,
        description,
        status: "pending",
        level: 3,
        assigneeId: null,
        creatorId: currentUser?.id ?? "u1",
        solution: null,
        estimatedCost: 0,
        actualCost: 0,
        laborCost: 0,
        materialCost: 0,
        supervisionCost: 0,
        responseSla: scheduledDate,
        completionSla: scheduledDate,
        slaStatus: "on_time",
        createdAt: now,
        updatedAt: now,
        beforeImages: [],
        duringImages: [],
        afterImages: [],
      };
      taskId = newTask.id;
      useStore.setState((s) => ({ tasks: [...s.tasks, newTask] }));
    }

    const record: MaintenanceRecord = {
      id,
      code,
      assetId,
      pharmacyId,
      type,
      description,
      scheduledDate,
      status: "scheduled",
      cost: 0,
      notes: notes || undefined,
      taskId,
      createdAt: now,
    };

    store.addMaintenance(record);
    setSaving(false);
    onClose();
    setAssetId("");
    setType("scheduled");
    setDescription("");
    setScheduledDate("");
    setNotes("");
    setCreateTaskChecked(false);
  };

  const isValid = Boolean(assetId && description.trim() && scheduledDate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo lịch bảo trì"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button variant="primary" disabled={!isValid} isLoading={saving} onClick={handleSubmit}>
            Tạo lịch bảo trì
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Asset */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Tài sản <span className="text-danger">*</span>
          </label>
          <CustomSelect
            options={assetOptions}
            value={assetId}
            onChange={setAssetId}
            placeholder="Chọn tài sản..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Loại bảo trì <span className="text-danger">*</span>
          </label>
          <div className="flex gap-2">
            {(["scheduled", "preventive", "corrective"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={[
                  "flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-150",
                  type === t
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-secondary border-border-color hover:bg-surface-hover",
                ].join(" ")}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Mô tả công việc <span className="text-danger">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Mô tả chi tiết công việc bảo trì..."
            className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Scheduled date */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Ngày lên lịch <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Ghi chú (tùy chọn)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú thêm..."
            className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Create linked task */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={createTaskChecked}
            onChange={(e) => setCreateTaskChecked(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm text-text-primary">Tạo task kèm theo</span>
        </label>
      </div>
    </Modal>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function MaintenancePage() {
  const router = useRouter();
  const { maintenance, assets, pharmacies, users } = useStore();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [pharmacyFilter, setPharmacyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const activePharmacies = pharmacies.filter((p) => p.status === "active");

  const pharmacyOptions = [
    { value: "", label: "Tất cả quầy thuốc" },
    ...activePharmacies.map((p) => ({ value: p.id, label: p.name })),
  ];

  const typeOptions = [
    { value: "", label: "Tất cả loại" },
    { value: "scheduled", label: "Định kỳ" },
    { value: "preventive", label: "Phòng ngừa" },
    { value: "corrective", label: "Khắc phục" },
  ];

  const filtered = useMemo(() => {
    return (maintenance ?? []).filter((m) => {
      if (activeTab !== "all" && m.status !== activeTab) return false;
      if (pharmacyFilter && m.pharmacyId !== pharmacyFilter) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      return true;
    });
  }, [maintenance, activeTab, pharmacyFilter, typeFilter]);

  const getAsset = (id: string) => assets.find((a) => a.id === id);
  const getPharmacy = (id: string) => pharmacies.find((p) => p.id === id);
  const getUser = (id?: string) => id ? users.find((u) => u.id === id) : undefined;

  // Tab counts
  const tabCounts = useMemo(() => {
    const all = maintenance ?? [];
    return {
      all: all.length,
      scheduled: all.filter((m) => m.status === "scheduled").length,
      in_progress: all.filter((m) => m.status === "in_progress").length,
      completed: all.filter((m) => m.status === "completed").length,
      overdue: all.filter((m) => m.status === "overdue").length,
    };
  }, [maintenance]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Bảo trì thiết bị</h1>
          <p className="text-sm text-text-secondary mt-0.5">Quản lý lịch bảo trì định kỳ và lịch sử bảo trì tài sản</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/maintenance/report")}
            icon={<BarChart3 size={14} />}
          >
            Báo cáo bảo trì
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreate(true)}
            icon={<Plus size={14} />}
          >
            Tạo lịch bảo trì
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border-color rounded-xl p-1 self-start flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === key
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
            ].join(" ")}
          >
            {label}
            <span
              className={[
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                activeTab === key ? "bg-white/20 text-white" : "bg-page-bg text-text-tertiary",
              ].join(" ")}
            >
              {tabCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="w-60">
          <CustomSelect
            options={pharmacyOptions}
            value={pharmacyFilter}
            onChange={setPharmacyFilter}
            placeholder="Tất cả quầy thuốc"
          />
        </div>
        <div className="w-48">
          <CustomSelect
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Tất cả loại"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wrench}
            title="Không có lịch bảo trì"
            description="Chưa có lịch bảo trì nào phù hợp với bộ lọc đã chọn"
            action={{ label: "Tạo lịch bảo trì", onClick: () => setShowCreate(true) }}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Mã</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Tài sản</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap hidden md:table-cell">Quầy thuốc</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Loại</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Ngày lên lịch</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap">Trạng thái</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap hidden lg:table-cell">Người thực hiện</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 whitespace-nowrap hidden lg:table-cell">Chi phí</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const asset = getAsset(m.assetId);
                  const pharmacy = getPharmacy(m.pharmacyId);
                  const performer = getUser(m.performedById);
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-border-color last:border-0 hover:bg-page-bg transition-colors cursor-pointer"
                      onClick={() => router.push(`/maintenance/${m.id}`)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-text-secondary">{m.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[11px] text-primary">{asset?.code ?? "—"}</span>
                          <span className="text-text-primary font-medium text-xs leading-tight max-w-[160px] truncate">
                            {asset?.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs hidden md:table-cell max-w-[180px] truncate">
                        {pharmacy?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={m.type} label={TYPE_LABELS[m.type]} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
                        {formatDate(m.scheduledDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={m.status} label={STATUS_LABELS[m.status]} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs hidden lg:table-cell">
                        {performer?.name ?? <span className="text-text-tertiary">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs hidden lg:table-cell">
                        {m.cost > 0 ? (
                          <span className="text-warning font-medium">{formatCurrency(m.cost)}</span>
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
      )}

      <CreateMaintenanceModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
