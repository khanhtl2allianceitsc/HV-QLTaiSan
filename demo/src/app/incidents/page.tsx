"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertTriangle, FileSearch } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { formatDate, getLevelLabel, getStatusLabel } from "@/lib/utils";
import type { IncidentReport, Task, IncidentLevel } from "@/types";

const LEVEL_OPTIONS = [
  { value: "", label: "Tất cả cấp độ" },
  { value: "1", label: "Cấp 1 - Gấp" },
  { value: "2", label: "Cấp 2 - Bình thường" },
  { value: "3", label: "Cấp 3 - Cải thiện" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "open", label: "Mở" },
  { value: "processing", label: "Đang xử lý" },
  { value: "resolved", label: "Đã xử lý" },
  { value: "closed", label: "Đã đóng" },
];

const SOLUTION_OPTIONS = [
  { value: "self_repair", label: "Tự sửa" },
  { value: "replace_parts", label: "Thay linh kiện" },
  { value: "outsource", label: "Thuê ngoài" },
];

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

interface CreateIncidentForm {
  pharmacyId: string;
  assetId: string;
  level: string;
  title: string;
  description: string;
  imageUrls: string[];
}

const EMPTY_FORM: CreateIncidentForm = {
  pharmacyId: "",
  assetId: "",
  level: "2",
  title: "",
  description: "",
  imageUrls: [],
};

export default function IncidentsPage() {
  const router = useRouter();
  const { incidents, tasks, assets, pharmacies, users, currentUser, addIncident, addToast, logActivity } =
    useStore();

  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPharmacy, setFilterPharmacy] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateIncidentForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Pharmacy options for filter
  const pharmacyOptions = [
    { value: "", label: "Tất cả nhà thuốc" },
    ...pharmacies.map((p) => ({ value: p.id, label: p.name })),
  ];

  // Asset options filtered by selected pharmacy in form
  const assetOptions = form.pharmacyId
    ? assets
        .filter((a) => a.pharmacyId === form.pharmacyId)
        .map((a) => ({ value: a.id, label: `${a.code} - ${a.name}` }))
    : [];

  // Filtered incidents
  const filtered = incidents.filter((inc) => {
    if (filterLevel && inc.level !== Number(filterLevel)) return false;
    if (filterStatus && inc.status !== filterStatus) return false;
    if (filterPharmacy && inc.pharmacyId !== filterPharmacy) return false;
    return true;
  });

  function getPharmacyName(id: string) {
    return pharmacies.find((p) => p.id === id)?.name ?? id;
  }

  function getAssetName(id: string) {
    const a = assets.find((x) => x.id === id);
    return a ? `${a.code} - ${a.name}` : id;
  }

  function getReporterName(id: string) {
    return users.find((u) => u.id === id)?.name ?? id;
  }

  function getLinkedTaskStatus(inc: IncidentReport) {
    if (!inc.taskId) return null;
    return tasks.find((t) => t.id === inc.taskId) ?? null;
  }

  function handleFormChange(field: keyof CreateIncidentForm, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset asset when pharmacy changes
      if (field === "pharmacyId") next.assetId = "";
      return next;
    });
  }

  function handleSubmit() {
    if (!form.pharmacyId || !form.assetId || !form.title.trim()) {
      addToast("error", "Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setSubmitting(true);

    const now = new Date().toISOString();
    const incidentCount = incidents.length + 1;
    const taskCount = tasks.length + 1;
    const incidentId = `inc-${Date.now()}`;
    const taskId = `task-${Date.now()}`;
    const incidentCode = `SC-${String(incidentCount).padStart(3, "0")}`;
    const taskCode = `TASK-${String(taskCount).padStart(3, "0")}`;
    const level = Number(form.level) as IncidentLevel;

    // SLA deadlines based on level
    const slaResponseHours = level === 1 ? 1 : 4;
    const slaCompletionHours = level === 1 ? 8 : 48;
    const responseSla = new Date(Date.now() + slaResponseHours * 3600000).toISOString();
    const completionSla = new Date(Date.now() + slaCompletionHours * 3600000).toISOString();

    const newIncident: IncidentReport = {
      id: incidentId,
      code: incidentCode,
      assetId: form.assetId,
      pharmacyId: form.pharmacyId,
      reporterId: currentUser?.id ?? "u1",
      level,
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrls: form.imageUrls,
      status: "open",
      createdAt: now,
      taskId,
    };
    const pharmacy = pharmacies.find((p) => p.id === form.pharmacyId);

    const newTask: Task = {
      id: taskId,
      code: taskCode,
      incidentId,
      assetId: form.assetId,
      pharmacyId: form.pharmacyId,
      title: `${form.title.trim()} - ${pharmacy?.name ?? ""}`,
      description: form.description.trim(),
      status: "pending",
      level,
      assigneeId: null,
      creatorId: currentUser?.id ?? "u1",
      solution: null,
      estimatedCost: 0,
      actualCost: 0,
      laborCost: 0,
      materialCost: 0,
      supervisionCost: 0,
      responseSla,
      completionSla,
      slaStatus: "on_time",
      createdAt: now,
      updatedAt: now,
      beforeImages: [],
      duringImages: [],
      afterImages: [],
    };

    addIncident(newIncident);
    // Add task to store
    useStore.setState((s) => ({ tasks: [...s.tasks, newTask] }));

    if (currentUser) {
      logActivity(currentUser.id, `Tạo phiếu báo hỏng ${incidentCode}`, "incident", incidentId);
    }

    addToast("success", `Đã tạo phiếu báo hỏng ${incidentCode} và công việc ${taskCode}.`);
    setForm(EMPTY_FORM);
    setShowModal(false);
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Báo hỏng</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Quản lý phiếu báo hỏng thiết bị ({incidents.length} phiếu)
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} size="md">
          <Plus size={16} />
          Tạo báo hỏng
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-wrap gap-3">
          <div className="w-44">
            <CustomSelect
              value={filterLevel}
              onChange={setFilterLevel}
              options={LEVEL_OPTIONS}
              placeholder="Tất cả cấp độ"
            />
          </div>
          <div className="w-48">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              options={STATUS_OPTIONS}
              placeholder="Tất cả trạng thái"
            />
          </div>
          <div className="w-64">
            <CustomSelect
              value={filterPharmacy}
              onChange={setFilterPharmacy}
              options={pharmacyOptions}
              placeholder="Tất cả nhà thuốc"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="Không có phiếu báo hỏng"
            description="Chưa có phiếu nào phù hợp với bộ lọc hiện tại."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Mã phiếu
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Tiêu đề
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Tài sản
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Nhà thuốc
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Cấp độ
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filtered.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-page-bg/60 cursor-pointer transition-colors"
                    onClick={() => router.push(`/incidents/${inc.id}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                        {inc.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-text-primary line-clamp-1 max-w-[240px]">
                        {inc.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{getAssetName(inc.assetId)}</td>
                    <td className="px-4 py-3">
                      <span className="text-text-secondary line-clamp-1 max-w-[180px]">
                        {getPharmacyName(inc.pharmacyId)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <LevelBadge level={inc.level} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={inc.status} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatDate(inc.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setForm(EMPTY_FORM);
        }}
        title="Tạo phiếu báo hỏng"
        size="md"
      >
        <div className="flex flex-col gap-4">
          {/* Pharmacy */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Nhà thuốc <span className="text-danger">*</span>
            </label>
            <CustomSelect
              value={form.pharmacyId}
              onChange={(v) => handleFormChange("pharmacyId", v)}
              options={pharmacies.map((p) => ({ value: p.id, label: p.name }))}
              placeholder="Chọn nhà thuốc..."
            />
          </div>

          {/* Asset */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tài sản <span className="text-danger">*</span>
            </label>
            <CustomSelect
              value={form.assetId}
              onChange={(v) => handleFormChange("assetId", v)}
              options={assetOptions}
              placeholder={form.pharmacyId ? "Chọn tài sản..." : "Chọn nhà thuốc trước"}
            />
            {form.pharmacyId && assetOptions.length === 0 && (
              <p className="text-xs text-text-secondary mt-1">Không có tài sản nào tại nhà thuốc này.</p>
            )}
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Mức độ nghiêm trọng <span className="text-danger">*</span>
            </label>
            <div className="flex gap-2">
              {([1, 2, 3] as IncidentLevel[]).map((lvl) => {
                const isSelected = form.level === String(lvl);
                const colorMap: Record<number, string> = {
                  1: isSelected
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-border-color text-text-secondary hover:border-red-300",
                  2: isSelected
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-border-color text-text-secondary hover:border-amber-300",
                  3: isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-border-color text-text-secondary hover:border-blue-300",
                };
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleFormChange("level", String(lvl))}
                    className={[
                      "flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors",
                      colorMap[lvl],
                    ].join(" ")}
                  >
                    {getLevelLabel(lvl)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tiêu đề <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="Mô tả ngắn gọn sự cố..."
              className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Mô tả chi tiết sự cố, triệu chứng, ảnh hưởng..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60 resize-none"
            />
          </div>

          {/* Photos */}
          <PhotoUpload
            images={form.imageUrls}
            onChange={(imgs) => setForm((prev) => ({ ...prev, imageUrls: imgs }))}
            label="Ảnh sự cố"
            required
          />

          {/* Info box */}
          <div className="flex items-start gap-2 p-3 bg-primary-light rounded-lg">
            <AlertTriangle size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-primary">
              Hệ thống sẽ tự động tạo công việc (Task) liên kết với phiếu báo hỏng này.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setForm(EMPTY_FORM);
              }}
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              Tạo phiếu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
