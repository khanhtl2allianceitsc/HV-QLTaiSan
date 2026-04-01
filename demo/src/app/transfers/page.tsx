"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRightLeft, FileSearch, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import type { TransferRecord } from "@/types";

/* ─── Types ─────────────────────────────────────────────────── */

type TabValue = "all" | "pharmacy_transfer" | "responsibility_transfer";

interface CreateTransferForm {
  type: "pharmacy_transfer" | "responsibility_transfer";
  assetId: string;
  toPharmacyId: string;
  toUserId: string;
  reason: string;
  notes: string;
}

const EMPTY_FORM: CreateTransferForm = {
  type: "pharmacy_transfer",
  assetId: "",
  toPharmacyId: "",
  toUserId: "",
  reason: "",
  notes: "",
};

/* ─── Transfer type badge ───────────────────────────────────── */

function TypeBadge({ type }: { type: TransferRecord["type"] }) {
  if (type === "pharmacy_transfer") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
        Điều chuyển
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
      Bàn giao
    </span>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function TransfersPage() {
  const router = useRouter();
  const {
    transfers,
    assets,
    pharmacies,
    users,
    currentUser,
    addTransfer,
    addToast,
    logActivity,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateTransferForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  /* ── Derived: selected asset info ── */
  const selectedAsset = assets.find((a) => a.id === form.assetId);
  const fromPharmacy = pharmacies.find((p) => p.id === selectedAsset?.pharmacyId);
  const fromUser = users.find((u) => u.id === selectedAsset?.responsibleUserId);

  /* ── Filter ── */
  const filtered = transfers.filter((tr) => {
    if (activeTab !== "all" && tr.type !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const asset = assets.find((a) => a.id === tr.assetId);
      const matchCode = tr.code.toLowerCase().includes(q);
      const matchAsset = asset
        ? `${asset.code} ${asset.name}`.toLowerCase().includes(q)
        : false;
      if (!matchCode && !matchAsset) return false;
    }
    return true;
  });

  /* ── Helpers ── */
  function getAsset(id: string) {
    return assets.find((a) => a.id === id);
  }
  function getPharmacyName(id?: string) {
    return id ? (pharmacies.find((p) => p.id === id)?.name ?? id) : "—";
  }
  function getUserName(id?: string) {
    return id ? (users.find((u) => u.id === id)?.name ?? id) : "—";
  }
  function getFromTo(tr: TransferRecord): { from: string; to: string } {
    if (tr.type === "pharmacy_transfer") {
      return {
        from: getPharmacyName(tr.fromPharmacyId),
        to: getPharmacyName(tr.toPharmacyId),
      };
    }
    return {
      from: getUserName(tr.fromUserId),
      to: getUserName(tr.toUserId),
    };
  }
  function getPerformerName(id: string) {
    return users.find((u) => u.id === id)?.name ?? id;
  }

  /* ── Form handlers ── */
  function handleFormChange<K extends keyof CreateTransferForm>(
    field: K,
    value: CreateTransferForm[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "type") {
        next.assetId = "";
        next.toPharmacyId = "";
        next.toUserId = "";
      }
      if (field === "assetId") {
        next.toPharmacyId = "";
        next.toUserId = "";
      }
      return next;
    });
  }

  /* ── Submit ── */
  function handleSubmit() {
    if (!form.assetId || !form.reason.trim()) {
      addToast("error", "Vui lòng chọn tài sản và nhập lý do.");
      return;
    }
    if (form.type === "pharmacy_transfer" && !form.toPharmacyId) {
      addToast("error", "Vui lòng chọn nhà thuốc nhận.");
      return;
    }
    if (form.type === "responsibility_transfer" && !form.toUserId) {
      addToast("error", "Vui lòng chọn người nhận bàn giao.");
      return;
    }

    setSubmitting(true);

    const now = new Date().toISOString();
    const dcCount =
      transfers.filter((t) => t.type === "pharmacy_transfer").length + 1;
    const bgCount =
      transfers.filter((t) => t.type === "responsibility_transfer").length + 1;
    const code =
      form.type === "pharmacy_transfer"
        ? `DC-${String(dcCount).padStart(3, "0")}`
        : `BG-${String(bgCount).padStart(3, "0")}`;

    const asset = assets.find((a) => a.id === form.assetId);

    const newTransfer: TransferRecord = {
      id: `tr-${Date.now()}`,
      code,
      assetId: form.assetId,
      type: form.type,
      ...(form.type === "pharmacy_transfer"
        ? {
            fromPharmacyId: asset?.pharmacyId,
            toPharmacyId: form.toPharmacyId,
          }
        : {
            fromUserId: asset?.responsibleUserId,
            toUserId: form.toUserId,
          }),
      reason: form.reason.trim(),
      notes: form.notes.trim() || undefined,
      transferDate: now.split("T")[0],
      performedById: currentUser?.id ?? "u1",
      status: "draft",
    };

    addTransfer(newTransfer);

    if (currentUser) {
      logActivity(
        currentUser.id,
        `Tạo ${form.type === "pharmacy_transfer" ? "phiếu điều chuyển" : "phiếu bàn giao"} ${code}`,
        "transfer",
        newTransfer.id
      );
    }

    addToast(
      "success",
      `Đã tạo ${
        form.type === "pharmacy_transfer" ? "phiếu điều chuyển" : "phiếu bàn giao"
      } ${code}.`
    );
    setForm(EMPTY_FORM);
    setShowModal(false);
    setSubmitting(false);
  }

  /* ── Asset options by type ── */
  const assetOptions = assets.map((a) => ({
    value: a.id,
    label: `${a.code} - ${a.name}`,
  }));

  const toPharmacyOptions = pharmacies
    .filter((p) => p.id !== selectedAsset?.pharmacyId)
    .map((p) => ({ value: p.id, label: p.name }));

  const toUserOptions = users
    .filter((u) => u.id !== selectedAsset?.responsibleUserId && u.status === "active")
    .map((u) => ({ value: u.id, label: u.name }));

  /* ── Tab counts ── */
  const counts = {
    all: transfers.length,
    pharmacy_transfer: transfers.filter((t) => t.type === "pharmacy_transfer").length,
    responsibility_transfer: transfers.filter(
      (t) => t.type === "responsibility_transfer"
    ).length,
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: "all", label: `Tất cả (${counts.all})` },
    {
      value: "pharmacy_transfer",
      label: `Điều chuyển (${counts.pharmacy_transfer})`,
    },
    {
      value: "responsibility_transfer",
      label: `Bàn giao (${counts.responsibility_transfer})`,
    },
  ];

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Phiếu Điều Chuyển &amp; Bàn Giao
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Quản lý phiếu điều chuyển quầy và bàn giao phụ trách ({transfers.length} phiếu)
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} size="md">
          <Plus size={16} />
          Tạo phiếu
        </Button>
      </div>

      {/* Tabs + Search */}
      <Card>
        <div className="px-4 pt-4 pb-0 flex flex-col gap-3">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border-color">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={[
                  "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px",
                  activeTab === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative pb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã phiếu hoặc tên tài sản..."
              className="w-full max-w-sm pl-9 pr-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="Không có phiếu nào"
            description="Chưa có phiếu điều chuyển hoặc bàn giao phù hợp."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  {[
                    "Mã phiếu",
                    "Loại",
                    "Tài sản",
                    "Từ → Đến",
                    "Trạng thái",
                    "Ngày",
                    "Thực hiện",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filtered.map((tr) => {
                  const asset = getAsset(tr.assetId);
                  const { from, to } = getFromTo(tr);
                  return (
                    <tr
                      key={tr.id}
                      className="hover:bg-page-bg/60 cursor-pointer transition-colors"
                      onClick={() => router.push(`/transfers/${tr.id}`)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                          {tr.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <TypeBadge type={tr.type} />
                      </td>
                      <td className="px-4 py-3">
                        {asset ? (
                          <div>
                            <p className="font-medium text-text-primary">
                              {asset.code}
                            </p>
                            <p className="text-xs text-text-secondary line-clamp-1 max-w-[160px]">
                              {asset.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-text-secondary">{tr.assetId}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                          <span className="max-w-[100px] truncate" title={from}>
                            {from}
                          </span>
                          <ArrowRightLeft
                            size={12}
                            className="flex-shrink-0 text-text-tertiary"
                          />
                          <span className="max-w-[100px] truncate" title={to}>
                            {to}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={tr.status} />
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDate(tr.transferDate)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {getPerformerName(tr.performedById)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Create Transfer Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setForm(EMPTY_FORM);
        }}
        title="Tạo phiếu điều chuyển / bàn giao"
        size="md"
      >
        <div className="flex flex-col gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Loại phiếu <span className="text-danger">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "pharmacy_transfer", label: "Điều chuyển quầy" },
                  { value: "responsibility_transfer", label: "Bàn giao phụ trách" },
                ] as const
              ).map((opt) => {
                const isSelected = form.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleFormChange("type", opt.value)}
                    className={[
                      "py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors text-center",
                      isSelected
                        ? opt.value === "pharmacy_transfer"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-border-color text-text-secondary hover:border-border-hover",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
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
              placeholder="Chọn tài sản..."
            />
            {selectedAsset && (
              <p className="text-xs text-text-secondary mt-1">
                {form.type === "pharmacy_transfer"
                  ? `Hiện tại tại: ${fromPharmacy?.name ?? "—"}`
                  : `Phụ trách hiện tại: ${fromUser?.name ?? "—"}`}
              </p>
            )}
          </div>

          {/* Destination */}
          {form.type === "pharmacy_transfer" ? (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Nhà thuốc nhận <span className="text-danger">*</span>
              </label>
              <CustomSelect
                value={form.toPharmacyId}
                onChange={(v) => handleFormChange("toPharmacyId", v)}
                options={toPharmacyOptions}
                placeholder={
                  form.assetId ? "Chọn nhà thuốc nhận..." : "Chọn tài sản trước"
                }
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Người nhận bàn giao <span className="text-danger">*</span>
              </label>
              <CustomSelect
                value={form.toUserId}
                onChange={(v) => handleFormChange("toUserId", v)}
                options={toUserOptions}
                placeholder={
                  form.assetId ? "Chọn người nhận..." : "Chọn tài sản trước"
                }
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Lý do <span className="text-danger">*</span>
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => handleFormChange("reason", e.target.value)}
              placeholder="Nhập lý do điều chuyển hoặc bàn giao..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ghi chú{" "}
              <span className="text-text-tertiary font-normal">(tùy chọn)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              placeholder="Thêm ghi chú nếu cần..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-text-primary placeholder:text-text-secondary/60 resize-none"
            />
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
            <Button className="flex-1" onClick={handleSubmit} isLoading={submitting}>
              Tạo phiếu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
