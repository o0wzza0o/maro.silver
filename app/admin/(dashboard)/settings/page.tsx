import { Shield, CheckCircle2 } from "lucide-react";
import { SettingsForm } from "@/components/admin/settings-form";
import { WhatsAppSettings } from "@/components/admin/whatsapp-settings";
import { getAppSetting } from "@/lib/supabase-data";

export default async function AdminSettingsPage() {
  const username = await getAppSetting<string>("admin_username", process.env.ADMIN_USERNAME || "");
  const whatsappLink = await getAppSetting<string>("whatsapp_link", "");

  return (
    <div dir="rtl" className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-5 w-5 text-white/70" />
          <span className="text-sm text-white/70">إعدادات الأمان</span>
        </div>
        <h2 className="text-xl font-bold">إعدادات الإدارة</h2>
        <p className="mt-1 text-sm text-gray-400">
          إدارة بيانات الوصول وإعدادات النظام
        </p>
      </div>

      {/* WhatsApp Settings */}
      <WhatsAppSettings initialLink={whatsappLink} />

      {/* Credentials Form */}
      <SettingsForm currentUsername={username} />


      {/* Security Notes */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
        <h3 className="font-semibold text-gray-900">ملاحظات الأمان</h3>
        <ul className="space-y-2.5 text-sm text-gray-600">
          {[
            "استخدم كلمة مرور قوية تحتوي على أرقام وحروف ورموز",
            "لا تشارك بيانات الدخول مع أي شخص غير موثوق",
            "صلاحية الجلسة تنتهي بعد 7 أيام من تسجيل الدخول",
            "يتم تشفير كوكي الجلسة وهو HTTP-only للحماية من XSS",
            "لا تنشر ملف .env على GitHub أو أي مستودع عام",
          ].map((note) => (
            <li key={note} className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
