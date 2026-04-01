"use client";

import { useRouter } from "next/navigation";
import { UserCircle, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, getStatusLabel } from "@/lib/utils";

export default function MyAssetsPage() {
  const router = useRouter();
  const { currentUser, assets, pharmacies } = useStore();

  const myAssets = assets.filter(
    (a) => currentUser && a.responsibleUserId === currentUser.id
  );

  const totalCount   = myAssets.length;
  const activeCount  = myAssets.filter((a) => a.status === "active").length;
  const attentionCount = myAssets.filter(
    (a) => a.status === "needs_repair" || a.status === "broken"
  ).length;

  const getPharmacyName = (pharmacyId: string) =>
    pharmacies.find((p) => p.id === pharmacyId)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <UserCircle size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary leading-tight">
            Tài sản tôi quản lý
          </h1>
          {currentUser && (
            <p className="text-sm text-text-secondary mt-0.5">
              Phụ trách bởi: <span className="font-medium text-text-primary">{currentUser.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total */}
        <Card className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary leading-none">{totalCount}</p>
            <p className="text-xs text-text-secondary mt-1 font-medium">Tổng tài sản</p>
          </div>
        </Card>

        {/* Active */}
        <Card className="p-4 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#D1FAE5" }}
          >
            <CheckCircle size={20} style={{ color: "#059669" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary leading-none">{activeCount}</p>
            <p className="text-xs text-text-secondary mt-1 font-medium">Đang hoạt động</p>
          </div>
        </Card>

        {/* Needs attention */}
        <Card className="p-4 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <AlertTriangle size={20} style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary leading-none">{attentionCount}</p>
            <p className="text-xs text-text-secondary mt-1 font-medium">Cần xử lý</p>
          </div>
        </Card>
      </div>

      {/* Asset table */}
      {myAssets.length === 0 ? (
        <Card>
          <EmptyState
            icon={UserCircle}
            title="Chưa có tài sản được giao"
            description="Bạn chưa được phân công phụ trách tài sản nào. Liên hệ quản lý để được cập nhật."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Mã tài sản</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Tên tài sản</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden md:table-cell">Quầy thuốc</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden sm:table-cell">Danh mục</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Trạng thái</th>
                  <th className="text-right text-xs font-semibold text-text-secondary px-4 py-3 hidden lg:table-cell">Đơn giá</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden lg:table-cell">Khấu hao</th>
                </tr>
              </thead>
              <tbody>
                {myAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => router.push(`/assets/${asset.id}`)}
                    className="border-b border-border-color last:border-0 hover:bg-page-bg transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md">
                        {asset.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary max-w-[200px] truncate">
                      {asset.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell max-w-[180px] truncate">
                      {getPharmacyName(asset.pharmacyId)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                      {asset.category}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={asset.status} label={getStatusLabel(asset.status)} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary hidden lg:table-cell">
                      <span className="font-medium">{formatCurrency(asset.originalCost)}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                      {asset.depreciationMonths} tháng
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
