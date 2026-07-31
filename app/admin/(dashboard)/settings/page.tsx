import { Shield, Key, Lock, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const maskedPassword = "•".repeat(12);

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

      {/* Current Credentials */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Key className="h-4 w-4 text-gray-500" />
          بيانات الدخول الحالية
        </h3>

        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">اسم المستخدم</p>
              <p className="font-medium text-gray-900 font-mono">{username}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">كلمة المرور</p>
              <p className="font-medium text-gray-400 tracking-widest">{maskedPassword}</p>
            </div>
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* How to change */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">كيفية تغيير بيانات الدخول</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          بيانات الدخول مخزّنة في ملف <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">.env</code> في مجلد المشروع.
          لتغييرها، افتح الملف وعدّل القيم التالية:
        </p>

        <div className="rounded-xl bg-gray-900 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/10 text-xs text-gray-400">.env</div>
          <pre className="px-5 py-4 text-sm text-emerald-400 leading-relaxed">
            <code>{`ADMIN_USERNAME=your_username_here
ADMIN_PASSWORD=your_secure_password_here
ADMIN_SESSION_SECRET=your_random_secret_here`}</code>
          </pre>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex gap-2">
          <span className="shrink-0">⚠️</span>
          <span>بعد تعديل ملف <code className="bg-amber-100 px-1 rounded">.env</code>، أعد تشغيل الخادم حتى تسري التغييرات.</span>
        </div>
      </div>

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
