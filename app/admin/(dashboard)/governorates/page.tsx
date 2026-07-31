"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { getGovernorates } from "@/data/governorates";
import { adminCreateGovernorate, adminUpdateGovernorate, adminDeleteGovernorate } from "@/lib/admin-api";
import type { Governorate } from "@/types";

export default function AdminGovernoratesPage() {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Governorate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [citiesRaw, setCitiesRaw] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setGovernorates(await getGovernorates().catch(() => []));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() {
    setEditItem(null); setName(""); setCitiesRaw(""); setError(""); setShowForm(true);
  }

  function openEdit(g: Governorate) {
    setEditItem(g); setName(g.name); setCitiesRaw(g.cities.join("، ")); setError(""); setShowForm(true);
  }

  async function handleSave() {
    if (!name.trim()) { setError("الاسم مطلوب"); return; }
    const cities = citiesRaw.split(/[،,\n]+/).map((c) => c.trim()).filter(Boolean);
    setSaving(true); setError("");
    try {
      if (editItem) {
        await adminUpdateGovernorate(editItem.id, { name: name.trim(), cities });
      } else {
        await adminCreateGovernorate({ name: name.trim(), cities });
      }
      setShowForm(false); await fetchData();
    } catch (e: any) {
      setError(e?.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    await adminDeleteGovernorate(id).catch(() => null);
    await fetchData(); setDeleteId(null); setDeleting(false);
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{governorates.length} محافظة</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors">
          <Plus className="h-4 w-4" /> إضافة محافظة
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-gray-300" /></div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-5 py-3 font-medium text-gray-600">المحافظة</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">المدن</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {governorates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">لا توجد محافظات بعد</td>
                </tr>
              ) : (
                governorates.map((gov) => (
                  <tr key={gov.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{gov.name}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {gov.cities.slice(0, 5).map((city) => (
                          <span key={city} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">{city}</span>
                        ))}
                        {gov.cities.length > 5 && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">+{gov.cities.length - 5}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(gov)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="تعديل">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(gov.id)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="حذف">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{editItem ? "تعديل المحافظة" : "إضافة محافظة"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المحافظة *</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المدن <span className="text-gray-400 text-xs">(افصل بفاصلة أو سطر جديد)</span>
                </label>
                <textarea value={citiesRaw} onChange={(e) => setCitiesRaw(e.target.value)} rows={4}
                  placeholder="القاهرة، الجيزة، الإسكندرية..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editItem ? "حفظ" : "إضافة"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center" dir="rtl">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3"><Trash2 className="h-6 w-6 text-red-600" /></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 mb-6">هل أنت متأكد من حذف هذه المحافظة؟</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />} حذف
              </button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
