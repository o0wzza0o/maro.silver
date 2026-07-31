"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  initialLink: string;
}

export function WhatsAppSettings({ initialLink }: Props) {
  const [link, setLink] = useState(initialLink);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "app_settings",
          action: "update",
          id: "whatsapp_link",
          data: link.trim(),
        }),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      toast({ title: "تم الحفظ بنجاح", description: "تم تحديث رابط واتساب" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        {/* WhatsApp icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white" className="h-5 w-5">
            <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.627 4.609 1.72 6.561L2.667 29.333l6.961-1.688A13.284 13.284 0 0 0 16.003 29.333c7.363 0 13.33-5.97 13.33-13.333S23.366 2.667 16.003 2.667zm0 24.267a11.09 11.09 0 0 1-5.657-1.547l-.405-.24-4.131 1.001.98-4.025-.264-.414A11.041 11.041 0 0 1 4.93 16c0-6.108 4.967-11.067 11.073-11.067S27.07 9.892 27.07 16 22.11 26.934 16.003 26.934zm6.077-8.287c-.333-.167-1.97-.973-2.274-1.085-.304-.111-.525-.167-.746.167-.222.333-.858 1.084-1.051 1.307-.194.222-.388.25-.721.083-.333-.167-1.409-.52-2.683-1.656-.992-.886-1.662-1.98-1.856-2.313-.194-.333-.02-.514.145-.68.15-.149.333-.389.5-.583.167-.194.222-.333.333-.555.111-.222.056-.417-.028-.583-.083-.167-.746-1.8-1.022-2.467-.269-.648-.543-.56-.746-.57l-.636-.011c-.222 0-.583.083-.888.417-.305.333-1.163 1.136-1.163 2.77 0 1.635 1.19 3.215 1.356 3.438.167.222 2.344 3.578 5.682 5.017.794.343 1.414.547 1.897.7.797.253 1.523.217 2.096.131.639-.095 1.97-.806 2.247-1.584.278-.778.278-1.445.194-1.584-.083-.139-.305-.222-.638-.389z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">زر واتساب الطائر</h3>
          <p className="text-xs text-gray-400">يظهر في جميع صفحات المتجر</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">رابط واتساب</label>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://wa.me/201234567890"
          dir="ltr"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          مثال: <span className="font-mono" dir="ltr">https://wa.me/201234567890</span> — استبدل الرقم برقم واتساب المطلوب
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          حفظ الرابط
        </button>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#25D366] hover:underline"
          >
            اختبار الرابط ↗
          </a>
        )}
      </div>
    </form>
  );
}
