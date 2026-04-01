"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Layers, Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRoleLabel } from "@/lib/utils";
import type { User, AssetCategory, SlaConfig } from "@/types";

type SettingsTab = "users" | "categories" | "sla";

const TABS: { value: SettingsTab; label: string; icon: React.ElementType }[] = [
  { value: "users", label: "Người dùng", icon: Users },
  { value: "categories", label: "Loại tài sản", icon: Layers },
  { value: "sla", label: "Cấu hình SLA", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("users");
  const { users, assetCategories, slaConfigs } = useStore();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Cấu hình hệ thống</h1>
        <p className="text-sm text-text-secondary mt-1">Quản lý người dùng, danh mục và cấu hình SLA</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <Card className="p-1.5">
            <nav className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={[
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left",
                      activeTab === tab.value
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
                    ].join(" ")}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "users" && <UsersTab users={users} />}
          {activeTab === "categories" && <CategoriesTab categories={assetCategories} />}
          {activeTab === "sla" && <SlaTab slaConfigs={slaConfigs} />}
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({ users }: { users: User[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Người dùng ({users.length})</h2>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border-color">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Điện thoại
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-page-bg/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: user.themeColor }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text-primary">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={user.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab({ categories }: { categories: AssetCategory[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">Danh mục tài sản ({categories.length})</h2>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => {
          const isOpen = !!expanded[cat.id];
          return (
            <Card key={cat.id} className="overflow-hidden">
              <button
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-page-bg/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{cat.name}</p>
                    <p className="text-xs text-text-secondary">{cat.types.length} loại</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown size={16} className="text-text-secondary" />
                ) : (
                  <ChevronRight size={16} className="text-text-secondary" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-border-color pt-3">
                  <div className="flex flex-wrap gap-2">
                    {cat.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs bg-page-bg border border-border-color text-text-primary px-2.5 py-1 rounded-lg"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLA Tab ──────────────────────────────────────────────────────────────────

function SlaTab({ slaConfigs }: { slaConfigs: SlaConfig[] }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">Cấu hình SLA</h2>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page-bg/50 border-b border-border-color">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Cấp độ
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Thời gian phản hồi
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Thời gian hoàn thành
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Màu sắc
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {slaConfigs.map((sla) => (
                <tr key={sla.level} className="hover:bg-page-bg/40 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: sla.color }}
                      />
                      <span className="font-medium text-text-primary">{sla.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-text-primary">{sla.responseHours} giờ</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-text-primary">
                      {sla.completionHours >= 24
                        ? `${sla.completionHours / 24} ngày (${sla.completionHours}h)`
                        : `${sla.completionHours} giờ`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md border border-border-color flex-shrink-0"
                        style={{ background: sla.color }}
                      />
                      <span className="text-xs font-mono text-text-secondary">{sla.color}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info note */}
        <div className="px-4 py-3 bg-info/5 border-t border-border-color">
          <p className="text-xs text-text-secondary">
            SLA được tính từ thời điểm sự cố được báo cáo đến khi được tiếp nhận (phản hồi) và hoàn tất (hoàn thành).
          </p>
        </div>
      </Card>
    </div>
  );
}
