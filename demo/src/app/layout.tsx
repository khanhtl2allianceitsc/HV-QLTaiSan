import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hồng Vân - Quản Lý Tài Sản",
  description: "Hệ thống quản lý tài sản chuỗi nhà thuốc Hồng Vân",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${lexend.variable} h-full antialiased`}>
      <body className="h-full">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
