"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Send, Clock, DollarSign, ExternalLink } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
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
  const [submittingComment, setSubmittingComment] = useState(false);
  const [solution, setSolution] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [actualCost, setActualCost] = useState("");

  // Initialize local state from task data (only once)
  const [initialized, setInitialized] = useState(false);
  if (task && !initialized) {
    setSolution(task.solution ?? "");
    setEstimatedCost(task.estimatedCost > 0 ? String(task.estimatedCost) : "");
    setActualCost(task.actualCost > 0 ? String(task.actualCost) : "");
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
    const updates: { solution?: TaskSolution; estimatedCost?: number; actualCost?: number } = {};
    if (solution) updates.solution = solution as TaskSolution;
    if (estimatedCost) updates.estimatedCost = Number(estimatedCost);
    if (actualCost) updates.actualCost = Number(actualCost);
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
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };

    addComment(newComment);
    if (currentUser) {
      logActivity(currentUser.id, `Thêm bình luận trên ${task!.code}`, "task", task!.id);
    }
    setCommentText("");
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

              {/* Costs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Chi phí dự tính (VND)
                  </label>
                  <div className="relative">
                    <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="number"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary"
                    />
                  </div>
                  {estimatedCost && (
                    <p className="text-xs text-text-secondary mt-1">
                      {formatCurrency(Number(estimatedCost))}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Chi phí thực tế (VND)
                  </label>
                  <div className="relative">
                    <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="number"
                      value={actualCost}
                      onChange={(e) => setActualCost(e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary"
                    />
                  </div>
                  {actualCost && (
                    <p className="text-xs text-text-secondary mt-1">
                      {formatCurrency(Number(actualCost))}
                    </p>
                  )}
                </div>
              </div>

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
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Dự tính</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(task.estimatedCost)}
                  </span>
                </div>
                {task.actualCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">Thực tế</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatCurrency(task.actualCost)}
                    </span>
                  </div>
                )}
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
