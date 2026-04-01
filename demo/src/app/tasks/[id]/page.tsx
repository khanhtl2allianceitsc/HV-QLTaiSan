"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Send, Clock, ExternalLink } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { formatDate, formatDateTime, formatCurrency, timeAgo, getLevelLabel } from "@/lib/utils";
import type { TaskStatus, TaskComment, IncidentLevel } from "@/types";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Chờ tiếp nhận",
  accepted: "Đã tiếp nhận",
  in_progress: "Đang xử lý",
  waiting_confirmation: "Chờ xác nhận",
  completed: "Hoàn tất",
  rejected: "Từ chối",
};

const SOLUTION_OPTIONS = [
  { value: "self_repair", label: "Tự sửa chữa" },
  { value: "replace_parts", label: "Thay linh kiện" },
  { value: "outsource", label: "Thuê đơn vị ngoài" },
];

function LevelBadge({ level }: { level: IncidentLevel }) {
  const map: Record<IncidentLevel, { bg: string; text: string; dot: string }> = {
    1: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    2: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    3: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  };
  const c = map[level];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
        c.bg,
        c.text,
      ].join(" ")}
    >
      <span className={["w-2 h-2 rounded-full flex-shrink-0", c.dot].join(" ")} />
      {getLevelLabel(level)}
    </span>
  );
}

function SlaBadge({ slaStatus }: { slaStatus: string }) {
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    on_time: { bg: "bg-success/10", text: "text-success", dot: "bg-success", label: "Trong hạn" },
    at_risk: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning", label: "Sắp trễ" },
    overdue: { bg: "bg-danger/10", text: "text-danger", dot: "bg-danger", label: "Quá hạn" },
  };
  const c = map[slaStatus] ?? map["on_time"];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
        c.bg,
        c.text,
      ].join(" ")}
    >
      <span className={["w-2 h-2 rounded-full flex-shrink-0", c.dot].join(" ")} />
      {c.label}
    </span>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    tasks,
    incidents,
    assets,
    pharmacies,
    users,
    comments,
    currentUser,
    updateTask,
    updateTaskStatus,
    addComment,
    addToast,
    logActivity,
  } = useStore();

  const task = tasks.find((t) => t.id === params.id);

  const [commentText, setCommentText] = useState("");
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [solution, setSolution] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [supervisionCost, setSupervisionCost] = useState("");

  // Photo groups for task images
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [duringImages, setDuringImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);

  // Initialize local state from task data (only once)
  const [initialized, setInitialized] = useState(false);
  if (task && !initialized) {
    setSolution(task.solution ?? "");
    setEstimatedCost(task.estimatedCost > 0 ? String(task.estimatedCost) : "");
    setActualCost(task.actualCost > 0 ? String(task.actualCost) : "");
    setLaborCost(task.laborCost > 0 ? String(task.laborCost) : "");
    setMaterialCost(task.materialCost > 0 ? String(task.materialCost) : "");
    setSupervisionCost(task.supervisionCost > 0 ? String(task.supervisionCost) : "");
    setBeforeImages(task.beforeImages ?? []);
    setDuringImages(task.duringImages ?? []);
    setAfterImages(task.afterImages ?? []);
    setInitialized(true);
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={40} className="text-text-secondary/40" />
        <p className="text-text-secondary">Không tìm thấy công việc.</p>
        <Button variant="secondary" onClick={() => router.push("/tasks")}>
          <ArrowLeft size={14} />
          Quay lại
        </Button>
      </div>
    );
  }

  const asset = assets.find((a) => a.id === task.assetId);
  const pharmacy = pharmacies.find((p) => p.id === task.pharmacyId);
  const assignee = users.find((u) => u.id === task.assigneeId) ?? null;
  const creator = users.find((u) => u.id === task.creatorId);
  const linkedIncident = task.incidentId ? incidents.find((i) => i.id === task.incidentId) ?? null : null;
  const taskComments = comments
    .filter((c) => c.taskId === task.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  function handleStatusChange(newStatus: TaskStatus, successMsg: string) {
    updateTaskStatus(task!.id, newStatus);
    if (currentUser) {
      logActivity(
        currentUser.id,
        `Cập nhật trạng thái ${task!.code} → ${STATUS_LABELS[newStatus]}`,
        "task",
        task!.id
      );
    }
    addToast("success", successMsg);
  }

  function handleSaveDetails() {
    type TaskSolution = "self_repair" | "replace_parts" | "outsource";
    const updates: {
      solution?: TaskSolution;
      estimatedCost?: number;
      actualCost?: number;
      laborCost?: number;
      materialCost?: number;
      supervisionCost?: number;
      beforeImages?: string[];
      duringImages?: string[];
      afterImages?: string[];
    } = {};
    if (solution) updates.solution = solution as TaskSolution;
    if (estimatedCost) updates.estimatedCost = Number(estimatedCost);
    if (actualCost) updates.actualCost = Number(actualCost);
    updates.laborCost = Number(laborCost) || 0;
    updates.materialCost = Number(materialCost) || 0;
    updates.supervisionCost = Number(supervisionCost) || 0;
    updates.beforeImages = beforeImages;
    updates.duringImages = duringImages;
    updates.afterImages = afterImages;
    updateTask(task!.id, updates);
    addToast("success", "Đã lưu thông tin công việc.");
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    setSubmittingComment(true);

    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      taskId: task!.id,
      userId: currentUser?.id ?? "u1",
      content: commentText.trim(),
      imageUrls: commentImages,
      createdAt: new Date().toISOString(),
    };

    addComment(newComment);
    if (currentUser) {
      logActivity(currentUser.id, `Thêm bình luận trên ${task!.code}`, "task", task!.id);
    }
    setCommentText("");
    setCommentImages([]);
    setSubmittingComment(false);
  }

  // Render action buttons based on current status
  function renderActionButtons() {
    const { status } = task!;

    if (status === "pending") {
      return (
        <Button
          className="w-full"
          onClick={() => handleStatusChange("accepted", `Đã tiếp nhận công việc ${task!.code}.`)}
        >
          Tiếp nhận
        </Button>
      );
    }
    if (status === "accepted") {
      return (
        <Button
          className="w-full"
          onClick={() => handleStatusChange("in_progress", `Đã bắt đầu xử lý ${task!.code}.`)}
        >
          Bắt đầu xử lý
        </Button>
      );
    }
    if (status === "in_progress") {
      return (
        <Button
          className="w-full"
          variant="secondary"
          onClick={() =>
            handleStatusChange("waiting_confirmation", `${task!.code} chờ xác nhận hoàn tất.`)
          }
        >
          Chuyển chờ xác nhận
        </Button>
      );
    }
    if (status === "waiting_confirmation") {
      return (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => handleStatusChange("completed", `${task!.code} đã hoàn tất!`)}
          >
            Xác nhận hoàn tất
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => handleStatusChange("rejected", `${task!.code} đã bị từ chối.`)}
          >
            Từ chối
          </Button>
        </div>
      );
    }
    return null;
  }

  // Compute totals from breakdown
  const estLabor = Number(laborCost) || 0;
  const estMaterial = Number(materialCost) || 0;
  const estSupervision = Number(supervisionCost) || 0;
  const computedTotal = estLabor + estMaterial + estSupervision;

  const isOutsource = solution === "outsource" || task.solution === "outsource";

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/tasks")}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách công việc
        </button>

        <div className="flex flex-wrap items-start gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-primary bg-primary-light px-2.5 py-1 rounded">
                {task.code}
              </span>
              <Badge status={task.status} />
              <LevelBadge level={task.level} />
              <SlaBadge slaStatus={task.slaStatus} />
            </div>
            <h1 className="text-xl font-bold text-text-primary mt-1">{task.title}</h1>
          </div>
        </div>
      </div>

      {/* Body: 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Info card */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">Chi tiết công việc</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Nhà thuốc" value={pharmacy?.name ?? task.pharmacyId} fullWidth />
              <InfoRow
                label="Tài sản"
                value={asset ? `${asset.code} - ${asset.name}` : task.assetId}
                fullWidth
              />
              <InfoRow label="Người tạo" value={creator?.name ?? task.creatorId} />
              <InfoRow label="Ngày tạo" value={formatDate(task.createdAt)} />
              {task.description && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-text-secondary mb-1.5">Mô tả</p>
                  <p className="text-sm text-text-primary leading-relaxed bg-page-bg rounded-lg p-3">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Linked incident */}
              {linkedIncident && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-text-secondary mb-1.5">Phiếu báo hỏng</p>
                  <button
                    onClick={() => router.push(`/incidents/${linkedIncident.id}`)}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <span className="font-mono font-bold bg-primary-light px-2 py-0.5 rounded text-xs">
                      {linkedIncident.code}
                    </span>
                    {linkedIncident.title}
                    <ExternalLink size={12} />
                  </button>
                </div>
              )}

              {/* Photo groups */}
              <div className="col-span-2 flex flex-col gap-4 pt-2 border-t border-border-color">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Ảnh công việc
                </h3>
                <PhotoUpload
                  images={beforeImages}
                  onChange={setBeforeImages}
                  label="Ảnh trước khi sửa"
                />
                <PhotoUpload
                  images={duringImages}
                  onChange={setDuringImages}
                  label="Ảnh trong khi sửa"
                />
                <PhotoUpload
                  images={afterImages}
                  onChange={setAfterImages}
                  label="Ảnh sau khi sửa"
                />
              </div>
            </div>
          </Card>

          {/* Solution + Cost card */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">Phương án & Chi phí</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Solution */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Phương án xử lý
                </label>
                <CustomSelect
                  value={solution}
                  onChange={setSolution}
                  options={SOLUTION_OPTIONS}
                  placeholder="Chọn phương án..."
                />
              </div>

              {/* Cost breakdown */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-text-secondary">Chi phí dự kiến (VND)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CostInput
                    label="Công thợ"
                    value={laborCost}
                    onChange={setLaborCost}
                    placeholder="0"
                  />
                  <CostInput
                    label="Vật tư"
                    value={materialCost}
                    onChange={setMaterialCost}
                    placeholder="0"
                  />
                  {(solution === "outsource" || task.solution === "outsource") && (
                    <CostInput
                      label="Giám sát"
                      value={supervisionCost}
                      onChange={setSupervisionCost}
                      placeholder="0"
                    />
                  )}
                </div>

                {/* Estimated total summary table */}
                {computedTotal > 0 && (
                  <div className="rounded-lg border border-border-color overflow-hidden text-sm">
                    <CostRow label="Công thợ" amount={estLabor} />
                    <CostRow label="Vật tư" amount={estMaterial} />
                    {isOutsource && <CostRow label="Giám sát" amount={estSupervision} />}
                    <div className="flex justify-between items-center px-3 py-2 bg-page-bg border-t border-border-color">
                      <span className="text-xs font-semibold text-text-primary">Tổng dự kiến</span>
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(computedTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actual cost breakdown display (if task has actual costs) */}
              {(task.actualCost > 0) && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-text-secondary">Chi phí thực tế</p>
                  <div className="rounded-lg border border-border-color overflow-hidden text-sm">
                    <CostRow label="Công thợ" amount={task.laborCost} />
                    <CostRow label="Vật tư" amount={task.materialCost} />
                    {task.solution === "outsource" && (
                      <CostRow label="Giám sát" amount={task.supervisionCost} />
                    )}
                    <div className="flex justify-between items-center px-3 py-2 bg-page-bg border-t border-border-color">
                      <span className="text-xs font-semibold text-text-primary">Tổng thực tế</span>
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(task.actualCost)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button variant="secondary" size="sm" className="self-start" onClick={handleSaveDetails}>
                Lưu thông tin
              </Button>
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">
                Bình luận ({taskComments.length})
              </h2>
            </div>

            {/* Comment list */}
            <div className="px-5 py-4 flex flex-col gap-4">
              {taskComments.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-6">
                  Chưa có bình luận nào.
                </p>
              ) : (
                taskComments.map((c) => {
                  const commentUser = users.find((u) => u.id === c.userId);
                  return (
                    <div key={c.id} className="flex gap-3">
                      {commentUser ? (
                        <UserAvatar user={commentUser} size="sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-page-bg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold text-text-primary">
                            {commentUser?.name ?? c.userId}
                          </span>
                          <span className="text-xs text-text-secondary">{timeAgo(c.createdAt)}</span>
                        </div>
                        <div className="bg-page-bg rounded-xl px-3 py-2.5">
                          <p className="text-sm text-text-primary leading-relaxed">{c.content}</p>
                          {c.imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {c.imageUrls.map((url, i) => (
                                <div
                                  key={url + i}
                                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-[9px] font-medium"
                                  style={{
                                    backgroundColor: `hsl(${(i * 67 + 200) % 360}, 55%, 60%)`,
                                  }}
                                >
                                  IMG
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add comment */}
            <div className="px-5 pb-5 flex gap-3">
              {currentUser && <UserAvatar user={currentUser} size="sm" />}
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddComment();
                  }}
                  placeholder="Thêm bình luận... (Ctrl+Enter để gửi)"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60 resize-none"
                />
                <PhotoUpload
                  images={commentImages}
                  onChange={setCommentImages}
                  label="Đính kèm ảnh"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    isLoading={submittingComment}
                    disabled={!commentText.trim()}
                  >
                    <Send size={13} />
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right (1/3) */}
        <div className="flex flex-col gap-5">
          {/* Status + Actions */}
          <Card>
            <div className="px-5 py-4 border-b border-border-color">
              <h2 className="text-sm font-semibold text-text-primary">Trạng thái & Hành động</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* Current status */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-text-secondary">Trạng thái hiện tại</p>
                <Badge status={task.status} />
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-text-secondary">Người xử lý</p>
                {assignee ? (
                  <div className="flex items-center gap-2.5">
                    <UserAvatar user={assignee} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{assignee.name}</p>
                      <p className="text-xs text-text-secondary">{assignee.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary italic">Chưa được phân công</p>
                )}
              </div>

              {/* SLA */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-text-secondary">SLA</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={12} className="flex-shrink-0" />
                    <span>Phản hồi: {formatDateTime(task.responseSla)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={12} className="flex-shrink-0" />
                    <span>Hoàn thành: {formatDateTime(task.completionSla)}</span>
                  </div>
                </div>
                <SlaBadge slaStatus={task.slaStatus} />
              </div>

              {/* Action buttons */}
              {task.status !== "completed" && task.status !== "rejected" && (
                <div className="pt-1 border-t border-border-color">
                  {renderActionButtons()}
                </div>
              )}

              {task.status === "completed" && task.completedAt && (
                <div className="pt-1 border-t border-border-color">
                  <p className="text-xs text-success font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success inline-block" />
                    Hoàn tất lúc {formatDateTime(task.completedAt)}
                  </p>
                </div>
              )}

              {task.status === "rejected" && (
                <div className="pt-1 border-t border-border-color">
                  <p className="text-xs text-danger font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                    Công việc đã bị từ chối
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Cost summary (if has data) */}
          {(task.estimatedCost > 0 || task.actualCost > 0) && (
            <Card>
              <div className="px-5 py-4 border-b border-border-color">
                <h2 className="text-sm font-semibold text-text-primary">Tóm tắt chi phí</h2>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {/* Estimated breakdown */}
                {task.estimatedCost > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-text-secondary mb-1">Chi phí dự kiến</p>
                    <CostRowSmall label="Công thợ" amount={task.laborCost} />
                    <CostRowSmall label="Vật tư" amount={task.materialCost} />
                    {task.solution === "outsource" && task.supervisionCost > 0 && (
                      <CostRowSmall label="Giám sát" amount={task.supervisionCost} />
                    )}
                    <div className="flex justify-between items-center pt-1.5 border-t border-border-color mt-1">
                      <span className="text-xs text-text-secondary">Tổng</span>
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(task.estimatedCost)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actual breakdown */}
                {task.actualCost > 0 && (
                  <div className="flex flex-col gap-1 pt-2 border-t border-border-color">
                    <p className="text-xs font-semibold text-text-secondary mb-1">Chi phí thực tế</p>
                    <CostRowSmall label="Công thợ" amount={task.laborCost} />
                    <CostRowSmall label="Vật tư" amount={task.materialCost} />
                    {task.solution === "outsource" && task.supervisionCost > 0 && (
                      <CostRowSmall label="Giám sát" amount={task.supervisionCost} />
                    )}
                    <div className="flex justify-between items-center pt-1.5 border-t border-border-color mt-1">
                      <span className="text-xs text-text-secondary">Tổng</span>
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(task.actualCost)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Variance */}
                {task.actualCost > 0 && task.estimatedCost > 0 && (
                  <div className="pt-2 border-t border-border-color flex justify-between items-center">
                    <span className="text-xs text-text-secondary">Chênh lệch</span>
                    <span
                      className={[
                        "text-sm font-semibold",
                        task.actualCost <= task.estimatedCost ? "text-success" : "text-danger",
                      ].join(" ")}
                    >
                      {task.actualCost <= task.estimatedCost ? "-" : "+"}
                      {formatCurrency(Math.abs(task.actualCost - task.estimatedCost))}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────── */

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

function CostInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-text-secondary mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary"
      />
      {value && Number(value) > 0 && (
        <p className="text-xs text-text-secondary mt-0.5">{formatCurrency(Number(value))}</p>
      )}
    </div>
  );
}

function CostRow({ label, amount }: { label: string; amount: number }) {
  if (amount <= 0) return null;
  return (
    <div className="flex justify-between items-center px-3 py-1.5 border-b border-border-color last:border-0">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-xs font-medium text-text-primary">{formatCurrency(amount)}</span>
    </div>
  );
}

function CostRowSmall({ label, amount }: { label: string; amount: number }) {
  if (amount <= 0) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-xs text-text-primary">{formatCurrency(amount)}</span>
    </div>
  );
}
