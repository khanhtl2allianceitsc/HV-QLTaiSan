"use client";

import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import type { Task, Asset, IncidentReport, Pharmacy } from "@/types";

const CHART_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

type ReportTab = "sla" | "cost" | "assets" | "incidents";

const TABS: { value: ReportTab; label: string }[] = [
  { value: "sla", label: "SLA" },
  { value: "cost", label: "Chi phí" },
  { value: "assets", label: "Tài sản" },
  { value: "incidents", label: "Sự cố" },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("sla");
  const { tasks, assets, incidents, pharmacies } = useStore();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Báo cáo</h1>
        <p className="text-sm text-text-secondary mt-1">Thống kê và phân tích dữ liệu hệ thống</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border-color mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={[
              "px-5 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
              activeTab === tab.value
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "sla" && <SlaTab tasks={tasks} />}
      {activeTab === "cost" && <CostTab tasks={tasks} pharmacies={pharmacies} />}
      {activeTab === "assets" && <AssetsTab assets={assets} />}
      {activeTab === "incidents" && <IncidentsTab incidents={incidents} />}
    </div>
  );
}

// ─── SLA Tab ─────────────────────────────────────────────────────────────────

function SlaTab({ tasks }: { tasks: Task[] }) {
  const slaData = [
    { name: "Trong hạn", value: tasks.filter((t) => t.slaStatus === "on_time").length, color: CHART_COLORS[1] },
    { name: "Sắp trễ", value: tasks.filter((t) => t.slaStatus === "at_risk").length, color: CHART_COLORS[2] },
    { name: "Quá hạn", value: tasks.filter((t) => t.slaStatus === "overdue").length, color: CHART_COLORS[3] },
  ];

  const levelData = [
    { name: "Cấp 1 - Gấp", value: tasks.filter((t) => t.level === 1).length, color: CHART_COLORS[3] },
    { name: "Cấp 2 - Bình thường", value: tasks.filter((t) => t.level === 2).length, color: CHART_COLORS[2] },
    { name: "Cấp 3 - Cải thiện", value: tasks.filter((t) => t.level === 3).length, color: CHART_COLORS[0] },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Tasks theo trạng thái SLA</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={slaData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Bar dataKey="value" name="Số tasks" radius={[4, 4, 0, 0]}>
              {slaData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Tasks theo mức độ ưu tiên</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={levelData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {levelData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── Cost Tab ─────────────────────────────────────────────────────────────────

function CostTab({
  tasks,
  pharmacies,
}: {
  tasks: Task[];
  pharmacies: Pharmacy[];
}) {
  const costByPharmacy = pharmacies
    .map((p) => {
      const pharmTasks = tasks.filter((t) => t.pharmacyId === p.id);
      return {
        name: p.name.replace("Nhà thuốc Hồng Vân - ", ""),
        estimated: pharmTasks.reduce((s, t) => s + t.estimatedCost, 0),
        actual: pharmTasks.reduce((s, t) => s + t.actualCost, 0),
      };
    })
    .filter((d) => d.estimated > 0 || d.actual > 0);

  const totalEstimated = tasks.reduce((s, t) => s + t.estimatedCost, 0);
  const totalActual = tasks.reduce((s, t) => s + t.actualCost, 0);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <p className="text-sm text-text-secondary">Tổng chi phí ước tính</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{formatCurrency(totalEstimated)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-secondary">Tổng chi phí thực tế</p>
          <p className="text-2xl font-bold text-success mt-1">{formatCurrency(totalActual)}</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Chi phí sửa chữa theo nhà thuốc</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costByPharmacy} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
              formatter={(value) => formatCurrency(typeof value === "number" ? value : 0)}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="estimated" name="Ước tính" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Thực tế" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── Assets Tab ───────────────────────────────────────────────────────────────

function AssetsTab({ assets }: { assets: Asset[] }) {
  // Status pie
  const statusGroups: Record<string, number> = {};
  assets.forEach((a) => {
    statusGroups[a.status] = (statusGroups[a.status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusGroups).map(([key, val], i) => ({
    name: getStatusLabel(key),
    value: val,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Category bar
  const catGroups: Record<string, number> = {};
  assets.forEach((a) => {
    catGroups[a.category] = (catGroups[a.category] ?? 0) + 1;
  });
  const catData = Object.entries(catGroups).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Tài sản theo trạng thái</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {statusData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Tài sản theo danh mục</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={catData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Bar dataKey="value" name="Số lượng" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]}>
              {catData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── Incidents Tab ────────────────────────────────────────────────────────────

function IncidentsTab({ incidents }: { incidents: IncidentReport[] }) {
  // Last 6 months fake trend data
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const label = d.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" });
    // Seed with realistic fake counts
    const counts = [3, 5, 4, 7, 6, incidents.length];
    return { name: label, value: counts[i] ?? 0 };
  });

  // By level pie
  const levelData = [
    { name: "Cấp 1 - Gấp", value: incidents.filter((i) => i.level === 1).length, color: CHART_COLORS[3] },
    { name: "Cấp 2 - Bình thường", value: incidents.filter((i) => i.level === 2).length, color: CHART_COLORS[2] },
    { name: "Cấp 3 - Cải thiện", value: incidents.filter((i) => i.level === 3).length, color: CHART_COLORS[0] },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Sự cố theo tháng (6 tháng gần nhất)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Bar dataKey="value" name="Số sự cố" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-text-primary mb-4">Sự cố theo mức độ</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={levelData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {levelData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid rgba(15,23,42,0.08)", fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
