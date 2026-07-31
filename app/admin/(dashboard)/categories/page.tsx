"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { getCategories } from "@/data/categories";
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setCategories(await getCategories().catch(() => []));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() {
    setEditItem(null);
    setName(""); setSlug(""); setImage("");
    setError(""); setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditItem(cat);
    setName(cat.name); setSlug(cat.slug); setImage(cat.image);
    setError(""); setShowForm(true);
  }

  async function handleSave() {
    if (!name.trim()) { setError("الاسم مطلوب"); return; }
    const finalSlug = slug.trim() || slugify(name);
    setSaving(true); setError("");
    try {
      if (editItem) {
        await adminUpdateCategory(editItem.id, { name: name.trim(), slug: finalSlug, image: image.trim() });
      } else {
        await adminCreateCategory({ name: name.trim(), slug: finalSlug, image: image.trim() });
      }
      setShowForm(false);
      await fetchData();
    } catch (e: any) {
      setError(e?.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    await adminDeleteCategory(id).catch(() => null);
    await fetchData();
    setDeleteId(null);
    setDeleting(false);
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length} تصنيف</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> إضافة تصنيف
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden group">
              <div className="aspect-video bg-gray-50 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300 text-sm">لا صورة</div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{cat.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(cat.id)} className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-3 rounded-2xl bg-white border border-gray-100 py-16 text-center text-gray-400">
              لا توجد تصنيفات بعد
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{editItem ? "تعديل التصنيف" : "إضافة تصنيف"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
                <input value={name} onChange={(e) => { setName(e.target.value); if (!editItem) setSlug(slugify(e.target.value)); }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرابط (Slug)</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                <input value={image} onChange={(e) => setImage(e.target.value)} dir="ltr" placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
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
            <p className="text-sm text-gray-500 mb-6">هل أنت متأكد من حذف هذا التصنيف؟</p>
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
