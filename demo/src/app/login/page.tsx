"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { MOCK_USERS } from "@/lib/mockData";
import { getRoleLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Building2, Lock, Mail } from "lucide-react";

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

    // Simulate async delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase().includes(email.trim().toLowerCase()) && u.status === "active"
    );

    if (!found) {
      setError("Email không tồn tại");
      setIsLoading(false);
      return;
    }

    if (password !== "123456") {
      setError("Mật khẩu không đúng");
      setIsLoading(false);
      return;
    }

    login(found);
    router.push("/");
  };

  const fillDemo = (email: string) => {
    setEmail(email);
    setPassword("123456");
    setError("");
  };

  const roleColorMap: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    ops_manager: "bg-blue-100 text-blue-700",
    operations: "bg-emerald-100 text-emerald-700",
    counter_staff: "bg-amber-100 text-amber-700",
    inventory_staff: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-page-bg to-info/5 flex flex-col items-center justify-center p-4">
      {/* Background decorative blobs */}
      <div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none translate-x-1/3 translate-y-1/3"
        style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo / App header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/25 mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">HV QL Tài Sản</h1>
          <p className="text-text-secondary text-sm mt-1">Hệ thống quản lý tài sản chuỗi nhà thuốc</p>
        </div>

        {/* Login card */}
        <div className="bg-surface rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-border-color p-8">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Mail size={16} />
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
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border-color bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Lock size={16} />
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
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-border-color bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-danger text-sm bg-danger/8 border border-danger/20 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={!email.trim() || !password}
            >
              Đăng nhập
            </Button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 bg-surface/80 backdrop-blur-sm rounded-2xl border border-border-color overflow-hidden">
          <div className="px-5 py-3 border-b border-border-color bg-page-bg/50">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Tài khoản demo &mdash; Nhấn để điền
            </p>
          </div>
          <div className="divide-y divide-border-color">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => fillDemo(user.email)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-primary-light transition-colors text-left group"
              >
                {/* Avatar initial */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                  style={{ backgroundColor: user.themeColor }}
                >
                  {user.name.split(" ").pop()?.slice(0, 1) ?? user.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>

                <span
                  className={[
                    "text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                    roleColorMap[user.role] ?? "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {getRoleLabel(user.role)}
                </span>
              </button>
            ))}
          </div>
          <div className="px-5 py-2.5 bg-page-bg/50 border-t border-border-color">
            <p className="text-xs text-text-secondary text-center">
              Mật khẩu chung: <span className="font-mono font-semibold text-text-primary">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
