"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search, Phone, MapPin, Package, Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { EmptyState } from "@/components/ui/EmptyState";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export default function PharmaciesPage() {
  const router = useRouter();
  const { pharmacies, users } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return pharmacies.filter((ph) => {
      const matchSearch =
        search === "" ||
        ph.name.toLowerCase().includes(search.toLowerCase()) ||
        ph.address.toLowerCase().includes(search.toLowerCase()) ||
        ph.phone.includes(search);

      const matchStatus =
        statusFilter === "all" || ph.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [pharmacies, search, statusFilter]);

  const getManager = (managerId: string) =>
    users.find((u) => u.id === managerId);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-text-primary">Quầy thuốc</h1>
        <p className="text-sm text-text-secondary">
          Quản lý thông tin các cơ sở nhà thuốc trong chuỗi
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm theo tên, địa chỉ, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-surface border border-border-color rounded-lg outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-text-secondary/70"
          />
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          className="w-full sm:w-52"
        />
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm text-text-secondary">
        <span>
          <span className="font-semibold text-text-primary">{pharmacies.length}</span> tổng số quầy
        </span>
        <span>·</span>
        <span>
          <span className="font-semibold text-success">{pharmacies.filter((p) => p.status === "active").length}</span> đang hoạt động
        </span>
        <span>·</span>
        <span>
          <span className="font-semibold text-text-secondary">{pharmacies.filter((p) => p.status === "inactive").length}</span> ngừng hoạt động
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Không tìm thấy quầy thuốc"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pharmacy) => {
            const manager = getManager(pharmacy.managerId);
            return (
              <Card
                key={pharmacy.id}
                onClick={() => router.push(`/pharmacies/${pharmacy.id}`)}
                className="p-5 flex flex-col gap-4"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                        {pharmacy.name}
                      </h3>
                    </div>
                  </div>
                  <Badge status={pharmacy.status} size="sm" />
                </div>

                {/* Address + phone */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-xs text-text-secondary">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0 text-text-secondary/60" />
                    <span className="leading-relaxed">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Phone size={13} className="flex-shrink-0 text-text-secondary/60" />
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border-color" />

                {/* Footer: manager + asset count */}
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-text-secondary/60" />
                    <span>{manager ? manager.name : "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package size={13} className="text-text-secondary/60" />
                    <span>
                      <span className="font-semibold text-text-primary">{pharmacy.assetCount}</span> tài sản
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
