"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "لوحة التحكم",
  "/admin/products": "إدارة المنتجات",
  "/admin/categories": "إدارة التصنيفات",
  "/admin/banners": "إدارة البانرات",
  "/admin/governorates": "إدارة المحافظات",
  "/admin/orders": "الطلبات",
  "/admin/settings": "الإعدادات",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([key]) => pathname === key)?.[1] ||
    Object.entries(pageTitles).find(([key]) => key !== "/admin" && pathname.startsWith(key))?.[1] ||
    "لوحة الإدارة";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir="rtl">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
