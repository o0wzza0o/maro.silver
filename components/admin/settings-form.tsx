"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateAdminCredentials } from "@/lib/actions/admin-settings";
import { Loader2, Key, CheckCircle2 } from "lucide-react";

export function SettingsForm({ currentUsername }: { currentUsername: string }) {
  const [username, setUsername] = useState(currentUsername);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateAdminCredentials(username, password || undefined);
      if (res.success) {
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم تحديث بيانات الدخول بنجاح وتفعيلها فوراً.",
        });
        setPassword(""); // Clear password field after save
      } else {
        toast({
          title: "خطأ",
          description: res.error || "حدث خطأ أثناء الحفظ",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Key className="h-4 w-4 text-gray-500" />
        تغيير بيانات الدخول
      </h3>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="اترك الحقل فارغاً للاحتفاظ بكلمة المرور الحالية"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
            dir="ltr"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          حفظ التعديلات
        </button>
      </div>
    </form>
  );
}
