"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Building2, Phone, MapPin, Users,
  Package, AlertTriangle, ClipboardList, ChevronRight,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

type TabKey = "assets" | "incidents" | "inventory";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "assets", label: "Tài sản", icon: Package },
  { key: "incidents", label: "Sự cố", icon: AlertTriangle },
  { key: "inventory", label: "Kiểm kê", icon: ClipboardList },
];

export default function PharmacyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { pharmacies, users, assets, incidents, inventoryCycles } = useStore();

  const pharmacy = pharmacies.find((p) => p.id === id);
  const manager = pharmacy ? users.find((u) => u.id === pharmacy.managerId) : undefined;

  const pharmacyAssets = assets.filter((a) => a.pharmacyId === id);
  const pharmacyIncidents = incidents.filter((i) => i.pharmacyId === id);
  const pharmacyCycles = inventoryCycles.filter((c) => c.pharmacyIds.includes(id));

  const [activeTab, setActiveTab] = useState<TabKey>("assets");

  if (!pharmacy) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/pharmacies")} className="self-start">
          <ArrowLeft size={14} />
          Quay lại
        </Button>
        <EmptyState
          icon={Building2}
          title="Không tìm thấy quầy thuốc"
          description="Quầy thuốc không tồn tại hoặc đã bị xóa"
          action={{ label: "Về danh sách", onClick: () => router.push("/pharmacies") }}
        />
      </div>
    );
  }

  const getAssetUser = (userId: string) => users.find((u) => u.id === userId);
  const getIncidentAsset = (assetId: string) => assets.find((a) => a.id === assetId);

  const incidentLevelLabel: Record<number, string> = {
    1: "Cấp 1 - Gấp",
    2: "Cấp 2 - Bình thường",
    3: "Cấp 3 - Cải thiện",
  };
  const incidentLevelColor: Record<number, string> = {
    1: "text-danger",
    2: "text-warning",
    3: "text-info",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/pharmacies")}
        className="self-start"
      >
        <ArrowLeft size={14} />
        Quay lại
      </Button>

      {/* Pharmacy info header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={26} className="text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-lg font-semibold text-text-primary leading-snug">
                {pharmacy.name}
              </h1>
              <Badge status={pharmacy.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>{pharmacy.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone size={14} className="flex-shrink-0" />
                <span>{pharmacy.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users size={14} className="flex-shrink-0" />
                <span>Quản lý: {manager?.name ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Package size={14} className="flex-shrink-0" />
                <span>{pharmacy.assetCount} tài sản đang quản lý</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border-color rounded-xl p-1 self-start">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === key
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-page-bg",
            ].join(" ")}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "assets" && (
        <>
          {pharmacyAssets.length === 0 ? (
            <Card>
              <EmptyState icon={Package} title="Chưa có tài sản" description="Quầy thuốc này chưa có tài sản nào được ghi nhận" />
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Mã TS</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Tên tài sản</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden sm:table-cell">Danh mục</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Trạng thái</th>
                      <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden md:table-cell">Vị trí</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => router.push(`/assets/${asset.id}`)}
                        className="border-b border-border-color last:border-0 hover:bg-page-bg cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-md">
                            {asset.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-text-primary">{asset.name}</td>
                        <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{asset.category}</td>
                        <td className="px-4 py-3">
                          <Badge status={asset.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{asset.location}</td>
                        <td className="px-4 py-3">
                          <ChevronRight size={14} className="text-text-secondary/40" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {activeTab === "incidents" && (
        <>
          {pharmacyIncidents.length === 0 ? (
            <Card>
              <EmptyState icon={AlertTriangle} title="Chưa có sự cố" description="Chưa có sự cố nào được báo cáo tại quầy thuốc này" />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {pharmacyIncidents.map((incident) => {
                const incidentAsset = getIncidentAsset(incident.assetId);
                return (
                  <Card key={incident.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-text-secondary">{incident.code}</span>
                          <span className={["text-xs font-medium", incidentLevelColor[incident.level]].join(" ")}>
                            {incidentLevelLabel[incident.level]}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-text-primary mb-1">{incident.title}</p>
                        {incidentAsset && (
                          <p className="text-xs text-text-secondary">Tài sản: {incidentAsset.name}</p>
                        )}
                        <p className="text-xs text-text-secondary mt-1">{formatDate(incident.createdAt)}</p>
                      </div>
                      <Badge status={incident.status} size="sm" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "inventory" && (
        <>
          {pharmacyCycles.length === 0 ? (
            <Card>
              <EmptyState icon={ClipboardList} title="Chưa có kỳ kiểm kê" description="Chưa có kỳ kiểm kê nào liên quan đến quầy thuốc này" />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {pharmacyCycles.map((cycle) => (
                <Card key={cycle.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-text-secondary">{cycle.code}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary mb-1">{cycle.name}</p>
                      <p className="text-xs text-text-secondary">
                        {formatDate(cycle.startDate)} – {formatDate(cycle.endDate)}
                      </p>
                    </div>
                    <Badge status={cycle.status} size="sm" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
