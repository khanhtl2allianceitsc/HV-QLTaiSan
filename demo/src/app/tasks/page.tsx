"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutList, Columns, Search, ClipboardList } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, getLevelLabel, getStatusLabel } from "@/lib/utils";
import type { Task, TaskStatus, IncidentLevel } from "@/types";

type ViewMode = "table" | "kanban";

const TASK_STATUSES: TaskStatus[] = [
  "pending",
  "accepted",
  "in_progress",
  "waiting_confirmation",
  "completed",
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Chờ tiếp nhận",
  accepted: "Đã tiếp nhận",
  in_progress: "Đang xử lý",
  waiting_confirmation: "Chờ xác nhận",
  completed: "Hoàn tất",
  rejected: "Từ chối",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-info/10 text-info border-info/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  waiting_confirmation: "bg-purple-50 text-purple-700 border-purple-200",
  completed: "bg-success/10 text-success border-success/20",
  rejected: "bg-danger/10 text-danger border-danger/20",
};

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
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        c.bg,
        c.text,
      ].join(" ")}
    >
      <span className={["w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot].join(" ")} />
      {getLevelLabel(level)}
    </span>
  );
}

export default function TasksPage() {
  const router = useRouter();
  const { tasks, users, pharmacies, updateTaskStatus } = useStore();

  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPharmacy, setFilterPharmacy] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSla, setFilterSla] = useState("");

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    ...TASK_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  const assigneeOptions = [
    { value: "", label: "Tất cả người xử lý" },
    ...users
      .filter((u) => u.role === "operations" || u.role === "ops_manager")
      .map((u) => ({ value: u.id, label: u.name })),
  ];

  const pharmacyOptions = [
    { value: "", label: "Tất cả nhà thuốc" },
    ...pharmacies.map((p) => ({ value: p.id, label: p.name })),
  ];

  const levelOptions = [
    { value: "", label: "Tất cả cấp độ" },
    { value: "1", label: "Cấp 1 - Gấp" },
    { value: "2", label: "Cấp 2 - Bình thường" },
    { value: "3", label: "Cấp 3 - Cải thiện" },
  ];

  const slaOptions = [
    { value: "", label: "Tất cả SLA" },
    { value: "on_time", label: "Trong hạn" },
    { value: "at_risk", label: "Sắp trễ" },
    { value: "overdue", label: "Quá hạn" },
  ];

  const filtered = tasks.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterAssignee && t.assigneeId !== filterAssignee) return false;
    if (filterPharmacy && t.pharmacyId !== filterPharmacy) return false;
    if (filterLevel && t.level !== Number(filterLevel)) return false;
    if (filterSla && t.slaStatus !== filterSla) return false;
    if (search) {
      const q = search.toLowerCase();
      const pharmacy = pharmacies.find((p) => p.id === t.pharmacyId);
      const assignee = users.find((u) => u.id === t.assigneeId);
      if (
        !t.code.toLowerCase().includes(q) &&
        !t.title.toLowerCase().includes(q) &&
        !(pharmacy?.name.toLowerCase().includes(q)) &&
        !(assignee?.name.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  function getUser(id: string | null) {
    if (!id) return null;
    return users.find((u) => u.id === id) ?? null;
  }

  function getPharmacyName(id: string) {
    return pharmacies.find((p) => p.id === id)?.name ?? id;
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    const task = tasks.find((t) => t.id === draggableId);
    if (!task || task.status === newStatus) return;
    updateTaskStatus(draggableId, newStatus);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Công việc</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Quản lý và theo dõi công việc ({tasks.length} công việc)
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-page-bg border border-border-color rounded-lg p-1">
          <button
            onClick={() => setView("table")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              view === "table"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            <LayoutList size={15} />
            Bảng
          </button>
          <button
            onClick={() => setView("kanban")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              view === "kanban"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            <Columns size={15} />
            Kanban
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60"
            />
          </div>
          <div className="w-44">
            <CustomSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
          </div>
          <div className="w-44">
            <CustomSelect value={filterAssignee} onChange={setFilterAssignee} options={assigneeOptions} />
          </div>
          <div className="w-56">
            <CustomSelect value={filterPharmacy} onChange={setFilterPharmacy} options={pharmacyOptions} />
          </div>
          <div className="w-40">
            <CustomSelect value={filterLevel} onChange={setFilterLevel} options={levelOptions} />
          </div>
          <div className="w-36">
            <CustomSelect value={filterSla} onChange={setFilterSla} options={slaOptions} />
          </div>
        </div>
      </Card>

      {/* Content */}
      {view === "table" ? (
        <TableView
          tasks={filtered}
          getUser={getUser}
          getPharmacyName={getPharmacyName}
          onRowClick={(id) => router.push(`/tasks/${id}`)}
        />
      ) : (
        <KanbanView
          tasks={filtered}
          getUser={getUser}
          getPharmacyName={getPharmacyName}
          onCardClick={(id) => router.push(`/tasks/${id}`)}
          onDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
}

// ─── Table View ───────────────────────────────────────────────

interface TableViewProps {
  tasks: Task[];
  getUser: (id: string | null) => ReturnType<typeof useStore.getState>["users"][number] | null;
  getPharmacyName: (id: string) => string;
  onRowClick: (id: string) => void;
}

function TableView({ tasks, getUser, getPharmacyName, onRowClick }: TableViewProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={ClipboardList}
          title="Không có công việc"
          description="Chưa có công việc nào phù hợp với bộ lọc hiện tại."
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-color">
              {["Mã", "Tiêu đề", "Nhà thuốc", "Cấp độ", "Người xử lý", "Trạng thái", "SLA", "Cập nhật"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {tasks.map((task) => {
              const assignee = getUser(task.assigneeId);
              return (
                <tr
                  key={task.id}
                  onClick={() => onRowClick(task.id)}
                  className="hover:bg-page-bg/60 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                      {task.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-primary line-clamp-1 max-w-[220px]">
                      {task.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-text-secondary line-clamp-1 max-w-[160px]">
                      {getPharmacyName(task.pharmacyId)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LevelBadge level={task.level} />
                  </td>
                  <td className="px-4 py-3">
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar user={assignee} size="sm" />
                        <span className="text-text-primary text-xs">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-text-secondary text-xs italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <SlaBadge slaStatus={task.slaStatus} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap text-xs">
                    {formatDate(task.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Kanban View ──────────────────────────────────────────────

interface KanbanViewProps {
  tasks: Task[];
  getUser: (id: string | null) => ReturnType<typeof useStore.getState>["users"][number] | null;
  getPharmacyName: (id: string) => string;
  onCardClick: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const KANBAN_COLUMNS: TaskStatus[] = ["pending", "accepted", "in_progress", "waiting_confirmation", "completed"];

function KanbanView({ tasks, getUser, getPharmacyName, onCardClick, onDragEnd }: KanbanViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="flex-shrink-0 w-72 flex flex-col gap-3">
              {/* Column header */}
              <div
                className={[
                  "flex items-center justify-between px-3 py-2 rounded-xl border",
                  STATUS_COLORS[status],
                ].join(" ")}
              >
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs font-bold bg-white/60 rounded-full px-2 py-0.5">
                  {columnTasks.length}
                </span>
              </div>

              {/* Droppable column */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={[
                      "flex flex-col gap-2 min-h-[120px] rounded-xl p-2 transition-colors",
                      snapshot.isDraggingOver ? "bg-primary/5" : "bg-page-bg/40",
                    ].join(" ")}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            onClick={() => onCardClick(task.id)}
                            className={[
                              "bg-surface border border-border-color rounded-xl p-3 cursor-pointer transition-all",
                              dragSnapshot.isDragging
                                ? "shadow-[0_8px_24px_rgba(0,0,0,0.15)] rotate-1 scale-[1.02]"
                                : "shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px",
                            ].join(" ")}
                          >
                            {/* Card code */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                                {task.code}
                              </span>
                              <SlaBadge slaStatus={task.slaStatus} size="xs" />
                            </div>

                            {/* Title */}
                            <p className="text-sm font-medium text-text-primary line-clamp-2 mb-2">
                              {task.title}
                            </p>

                            {/* Pharmacy */}
                            <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                              {getPharmacyName(task.pharmacyId)}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <LevelBadge level={task.level} />
                              {getUser(task.assigneeId) ? (
                                <UserAvatar user={getUser(task.assigneeId)!} size="sm" />
                              ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-dashed border-border-color flex items-center justify-center">
                                  <span className="text-text-secondary/40 text-xs">?</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columnTasks.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-xs text-text-secondary/50">
                        Kéo thẻ vào đây
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

// ─── SLA Badge ────────────────────────────────────────────────

function SlaBadge({ slaStatus, size = "sm" }: { slaStatus: string; size?: "xs" | "sm" }) {
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    on_time: { bg: "bg-success/10", text: "text-success", dot: "bg-success", label: "Trong hạn" },
    at_risk: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning", label: "Sắp trễ" },
    overdue: { bg: "bg-danger/10", text: "text-danger", dot: "bg-danger", label: "Quá hạn" },
  };
  const c = map[slaStatus] ?? map["on_time"];
  return (
    <span
      className={[
        "inline-flex items-center gap-1 font-medium rounded-full",
        size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
        c.bg,
        c.text,
      ].join(" ")}
    >
      <span className={["rounded-full flex-shrink-0", size === "xs" ? "w-1 h-1" : "w-1.5 h-1.5", c.dot].join(" ")} />
      {c.label}
    </span>
  );
}
