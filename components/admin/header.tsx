"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6"
      dir="rtl"
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors"
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          مدير النظام
        </span>
      </div>
    </header>
  );
}
