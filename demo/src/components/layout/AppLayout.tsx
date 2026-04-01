"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

function LoadingSpinner() {
  return (
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  );
}

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
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-page-bg overflow-hidden relative">
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02] pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
