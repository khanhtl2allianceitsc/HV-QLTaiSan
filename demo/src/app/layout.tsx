import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "HV QLTaiSan - Quản Lý Tài Sản",
  description: "Hệ thống quản lý tài sản chuỗi nhà thuốc Hoàng Việt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
