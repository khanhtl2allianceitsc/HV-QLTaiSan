"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastContainer } from "@/components/ui/Toast";

/* ─── Branded loader ─────────────────────────────────────────── */
function BrandedLoader() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner ring around HV initials */}
        <div className="relative w-16 h-16">
          {/* Outer spinner ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="var(--primary-lighter)"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="44 132"
              strokeDashoffset="0"
            />
          </svg>
          {/* Center badge */}
          <div
            className="absolute inset-2 rounded-full bg-primary flex items-center justify-center"
            style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }}
          >
            <span className="text-white text-sm font-bold tracking-wide leading-none select-none">
              HV
            </span>
          </div>
        </div>

        <p className="text-sm text-text-tertiary font-medium tracking-wide">
          Đang tải…
        </p>
      </div>
    </div>
  );
}

/* ─── AppLayout ──────────────────────────────────────────────── */

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <BrandedLoader />;
  }

  if (!currentUser || pathname === "/login" || pathname === "/features") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-page-bg overflow-hidden relative animate-fade-in">
      {/* Decorative gradient blobs — subtle depth cues */}
      <div
        aria-hidden="true"
        className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(37,99,235,0.06) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(5,150,105,0.05) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 65%)",
        }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}
