"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { MOCK_USERS } from "@/lib/mockData";
import { getRoleLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Package,
  Clock,
  BarChart3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ─── Feature highlight item ───────────────────────────────────────────────────

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureItem({ icon, title, desc }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold text-sm leading-tight">{title}</p>
        <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

// ─── Role color map ───────────────────────────────────────────────────────────

const ROLE_BADGE_MAP: Record<string, { bg: string; text: string }> = {
  admin: { bg: "bg-purple-100", text: "text-purple-700" },
  ops_manager: { bg: "bg-blue-100", text: "text-blue-700" },
  operations: { bg: "bg-emerald-100", text: "text-emerald-700" },
  counter_staff: { bg: "bg-amber-100", text: "text-amber-700" },
  inventory_staff: { bg: "bg-cyan-100", text: "text-cyan-700" },
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase().includes(email.trim().toLowerCase()) && u.status === "active"
    );

    if (!found) {
      setError("Email không tồn tại trong hệ thống");
      setIsLoading(false);
      return;
    }

    if (password !== "123456") {
      setError("Mật khẩu không đúng. Vui lòng thử lại.");
      setIsLoading(false);
      return;
    }

    login(found);
    router.push("/");
  };

  const fillDemo = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("123456");
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--page-bg)" }}>
      {/* ── Left panel (hidden on mobile) ── */}
      <div
        className="hidden md:flex md:w-[45%] lg:w-[48%] flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1d4ed8 0%, #2563EB 40%, #1e40af 75%, #1e3a8a 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute bottom-32 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.05)", transform: "translate(30%, 30%)" }}
        />

        {/* Top: branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
              style={{ background: "rgba(255,255,255,0.18)", color: "#fff", letterSpacing: "-0.02em" }}
            >
              HV
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">Hồng Vân</p>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Pharma Chain
              </p>
            </div>
          </div>

          <h1
            className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Quản Lý<br />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Tài Sản</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Hệ thống quản lý tài sản thông minh cho chuỗi nhà thuốc
          </p>
        </div>

        {/* Middle: features */}
        <div className="relative z-10 space-y-5">
          <FeatureItem
            icon={<Package className="w-5 h-5 text-white" />}
            title="Quản lý tài sản theo QR code"
            desc="Tra cứu nhanh, cập nhật trạng thái tức thì qua quét mã"
          />
          <FeatureItem
            icon={<Clock className="w-5 h-5 text-white" />}
            title="Theo dõi SLA & vận hành"
            desc="Giám sát tiến độ xử lý, cảnh báo khi sắp trễ hạn"
          />
          <FeatureItem
            icon={<BarChart3 className="w-5 h-5 text-white" />}
            title="Kiểm kê & báo cáo thông minh"
            desc="Chu kỳ kiểm kê tự động, báo cáo chi phí & bất thường"
          />
        </div>

        {/* Bottom: trust badges */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              5 nhà thuốc
            </span>
          </div>
          <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.2)" }} />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Dữ liệu thời gian thực
            </span>
          </div>
          <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.2)" }} />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Bảo mật cao
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2.5 mb-8 self-start">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
            style={{ background: "var(--primary)" }}
          >
            HV
          </div>
          <span className="font-bold text-base text-text-primary">Quản Lý Tài Sản</span>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="mb-8">
            <h2
              className="text-2xl font-extrabold text-text-primary"
              style={{ letterSpacing: "-0.02em" }}
            >
              Đăng nhập
            </h2>
            <p className="text-text-secondary text-sm mt-1.5">
              Chào mừng bạn trở lại — vui lòng điền thông tin đăng nhập
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl border p-7"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border-color)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Mail size={15} />
                  </span>
                  <input
                    id="email"
                    type="text"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Nhập email của bạn"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--surface)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Lock size={15} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border transition-all"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--surface)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "var(--danger)",
                  }}
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-11 text-sm font-semibold mt-1"
                isLoading={isLoading}
                disabled={!email.trim() || !password}
              >
                Đăng nhập
              </Button>
            </form>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Tài khoản demo
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
          </div>

          {/* Demo accounts */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border-color)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="px-5 py-3 border-b"
              style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                Nhấn thẻ để điền nhanh
              </p>
            </div>

            {/* 2-column grid */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {MOCK_USERS.map((user) => {
                const badge = ROLE_BADGE_MAP[user.role] ?? { bg: "bg-gray-100", text: "text-gray-600" };
                const initials = user.name.split(" ").pop()?.slice(0, 1) ?? user.name[0];
                const isSelected = email === user.email;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => fillDemo(user.email)}
                    className="flex flex-col gap-2 p-3 rounded-xl text-left transition-all"
                    style={{
                      border: isSelected
                        ? "1.5px solid var(--primary)"
                        : "1.5px solid var(--border-color)",
                      background: isSelected ? "rgba(37,99,235,0.04)" : "var(--page-bg)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Avatar circle */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                        style={{ backgroundColor: user.themeColor }}
                      >
                        {initials}
                      </div>
                      <p
                        className="text-xs font-semibold truncate leading-tight"
                        style={{ color: isSelected ? "var(--primary)" : "var(--text-primary)" }}
                      >
                        {user.name.split(" ").slice(-2).join(" ")}
                      </p>
                    </div>
                    <span
                      className={[
                        "text-xs font-medium px-2 py-0.5 rounded-full inline-block",
                        badge.bg,
                        badge.text,
                      ].join(" ")}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="px-5 py-2.5 border-t text-center"
              style={{ background: "var(--page-bg)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Mật khẩu:{" "}
                <span className="font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                  123456
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
