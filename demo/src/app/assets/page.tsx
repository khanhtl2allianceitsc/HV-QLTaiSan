"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, Plus, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calcRemainingValue } from "@/lib/depreciation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Asset, AssetStatus } from "@/types";

const ALL_OPTION = { value: "all", label: "Tất cả" };

const STATUS_OPTIONS = [
  ALL_OPTION,
  { value: "active", label: "Hoạt động" },
  { value: "needs_repair", label: "Cần sửa chữa" },
  { value: "broken", label: "Hư hỏng" },
  { value: "inactive", label: "Ngừng HĐ" },
  { value: "transferred", label: "Điều chuyển" },
];

interface FormState {
  code: string;
  name: string;
  category: string;
  type: string;
  pharmacyId: string;
  location: string;
  status: AssetStatus;
  originalCost: string;
  depreciationMonths: string;
}

const EMPTY_FORM: FormState = {
  code: "",
  name: "",
  category: "",
  type: "",
  pharmacyId: "",
  location: "",
  status: "active",
  originalCost: "",
  depreciationMonths: "",
};

export default function AssetsPage() {
  const router = useRouter();
  const { assets, pharmacies, assetCategories, addAsset, addToast, logActivity, currentUser } = useStore();

  const [search, setSearch] = useState("");
  const [pharmacyFilter, setPharmacyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Build filter options
  const pharmacyOptions = useMemo(() => [
    ALL_OPTION,
    ...pharmacies.map((p) => ({ value: p.id, label: p.name })),
  ], [pharmacies]);

  const categoryOptions = useMemo(() => [
    ALL_OPTION,
    ...assetCategories.map((c) => ({ value: c.name, label: c.name })),
  ], [assetCategories]);

  const selectedCategoryTypes = useMemo(() => {
    const cat = assetCategories.find((c) => c.name === form.category);
    return cat ? cat.types : [];
  }, [assetCategories, form.category]);

  // Filter assets
  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        search === "" ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase());
      const matchPharmacy = pharmacyFilter === "all" || a.pharmacyId === pharmacyFilter;
      const matchCategory = categoryFilter === "all" || a.category === categoryFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchPharmacy && matchCategory && matchStatus;
    });
  }, [assets, search, pharmacyFilter, categoryFilter, statusFilter]);

  const getPharmacyName = (id: string) => pharmacies.find((p) => p.id === id)?.name ?? "—";

  function handleFormChange(field: keyof FormState, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset type when category changes
      if (field === "category") next.type = "";
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.name || !form.category || !form.pharmacyId) return;

    setSubmitting(true);
    const newAsset: Asset = {
      id: `a-${Date.now()}`,
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      pharmacyId: form.pharmacyId,
      location: form.location.trim(),
      status: form.status,
      originalCost: Number(form.originalCost) || 0,
      depreciationMonths: Number(form.depreciationMonths) || 36,
      installDate: new Date().toISOString().slice(0, 10),
      responsibleUserId: currentUser?.id ?? "",
      totalRepairCost: 0,
    };

    addAsset(newAsset);
    if (currentUser) {
      logActivity(currentUser.id, `Thêm tài sản ${newAsset.code}`, "asset", newAsset.id);
    }
    addToast("success", `Đã thêm tài sản ${newAsset.code} thành công`);
    setForm(EMPTY_FORM);
    setModalOpen(false);
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Tài sản</h1>
          <p className="text-sm text-text-secondary mt-0.5">Quản lý toàn bộ tài sản trong chuỗi nhà thuốc</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="md">
          <Plus size={15} />
          Thêm tài sản
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          placeholder="Tìm theo mã, tên, danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-text-secondary/70"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <CustomSelect
          value={pharmacyFilter}
          onChange={setPharmacyFilter}
          options={pharmacyOptions}
          placeholder="Quầy thuốc"
          className="w-full sm:w-60"
        />
        <CustomSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          placeholder="Danh mục"
          className="w-full sm:w-48"
        />
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          placeholder="Trạng thái"
          className="w-full sm:w-44"
        />
      </div>

      {/* Stats */}
      <p className="text-sm text-text-secondary">
        Hiển thị{" "}
        <span className="font-semibold text-text-primary">{filtered.length}</span> /{" "}
        {assets.length} tài sản
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Package}
            title="Không có tài sản nào"
            description="Thử thay đổi bộ lọc hoặc thêm tài sản mới"
            action={{ label: "Thêm tài sản", onClick: () => setModalOpen(true) }}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Mã TS</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Tên tài sản</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden lg:table-cell">Quầy thuốc</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden sm:table-cell">Danh mục</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3">Trạng thái</th>
                  <th className="text-right text-xs font-semibold text-text-secondary px-4 py-3 hidden md:table-cell">Đơn giá</th>
                  <th className="text-right text-xs font-semibold text-text-secondary px-4 py-3 hidden md:table-cell">Còn lại</th>
                  <th className="text-left text-xs font-semibold text-text-secondary px-4 py-3 hidden lg:table-cell">Khấu hao</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => (
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
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell max-w-[180px] truncate">
                      {getPharmacyName(asset.pharmacyId)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{asset.category}</td>
                    <td className="px-4 py-3">
                      <Badge status={asset.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell text-right font-medium tabular-nums">{formatCurrency(asset.originalCost)}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-right font-medium tabular-nums">
                      {(() => {
                        const rv = calcRemainingValue(asset.originalCost, asset.depreciationMonths, asset.installDate);
                        const pct = asset.originalCost > 0 ? Math.round((rv / asset.originalCost) * 100) : 0;
                        return (
                          <span className={pct > 50 ? "text-success" : pct > 20 ? "text-warning" : "text-danger"}>
                            {formatCurrency(rv)}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">{asset.depreciationMonths} tháng</td>
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

      {/* Create asset modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setForm(EMPTY_FORM); }}
        title="Thêm tài sản mới"
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Code + Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Mã tài sản <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleFormChange("code", e.target.value)}
                placeholder="VD: TS-031"
                required
                className="h-9 px-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Tên tài sản <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Tên tài sản"
                required
                className="h-9 px-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Danh mục <span className="text-danger">*</span>
              </label>
              <CustomSelect
                value={form.category}
                onChange={(v) => handleFormChange("category", v)}
                options={assetCategories.map((c) => ({ value: c.name, label: c.name }))}
                placeholder="Chọn danh mục"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Loại tài sản
              </label>
              <CustomSelect
                value={form.type}
                onChange={(v) => handleFormChange("type", v)}
                options={selectedCategoryTypes.map((t) => ({ value: t, label: t }))}
                placeholder="Chọn loại"
              />
            </div>
          </div>

          {/* Pharmacy */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Quầy thuốc <span className="text-danger">*</span>
            </label>
            <CustomSelect
              value={form.pharmacyId}
              onChange={(v) => handleFormChange("pharmacyId", v)}
              options={pharmacies.map((p) => ({ value: p.id, label: p.name }))}
              placeholder="Chọn quầy thuốc"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Vị trí
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleFormChange("location", e.target.value)}
              placeholder="VD: Quầy thu ngân, Phòng kho..."
              className="h-9 px-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Original Cost + Depreciation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Đơn giá (VND)
              </label>
              <input
                type="number"
                value={form.originalCost}
                onChange={(e) => handleFormChange("originalCost", e.target.value)}
                placeholder="VD: 12000000"
                className="h-9 px-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Khấu hao (tháng)
              </label>
              <input
                type="number"
                value={form.depreciationMonths}
                onChange={(e) => handleFormChange("depreciationMonths", e.target.value)}
                placeholder="VD: 36"
                className="h-9 px-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Trạng thái
            </label>
            <CustomSelect
              value={form.status}
              onChange={(v) => handleFormChange("status", v as AssetStatus)}
              options={STATUS_OPTIONS.slice(1)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border-color mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={!form.code || !form.name || !form.category || !form.pharmacyId}
            >
              Thêm tài sản
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
