/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink, GripVertical } from "lucide-react";
import { getBanners } from "@/data/banners";
import { adminCreateBanner, adminUpdateBanner, adminDeleteBanner, adminReorderBanners } from "@/lib/admin-api";
import type { Banner } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setBanners(await getBanners().catch(() => []));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBanners((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newBanners = arrayMove(items, oldIndex, newIndex);
      
      // Save new order to backend asynchronously
      adminReorderBanners(newBanners.map(b => b.id)).catch(() => {
        setError("فشل في حفظ الترتيب الجديد");
      });

      return newBanners;
    });
  }

  function openAdd() {
    setEditItem(null);
    setTitle(""); setSubtitle(""); setImage(""); setCtaText(""); setCtaLink("");
    setError(""); setShowForm(true);
  }

  function openEdit(b: Banner) {
    setEditItem(b);
    setTitle(b.title); setSubtitle(b.subtitle); setImage(b.image);
    setCtaText(b.ctaText); setCtaLink(b.ctaLink);
    setError(""); setShowForm(true);
  }

  async function handleSave() {
    if (!title.trim()) { setError("العنوان مطلوب"); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        title: title.trim(), subtitle: subtitle.trim(), image: image.trim(),
        cta_text: ctaText.trim(), cta_link: ctaLink.trim(),
      };
      if (editItem) {
        await adminUpdateBanner(editItem.id, payload);
      } else {
        await adminCreateBanner(payload);
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
    await adminDeleteBanner(id).catch(() => null);
    await fetchData();
    setDeleteId(null);
    setDeleting(false);
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{banners.length} بانر</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors">
          <Plus className="h-4 w-4" /> إضافة بانر
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-gray-300" /></div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-8">
            {banners.length === 0 && (
              <div className="rounded-[24px] bg-white border border-gray-100 py-24 text-center text-gray-400">لا توجد بانرات بعد</div>
            )}
            <SortableContext 
              items={banners.map(b => b.id)} 
              strategy={verticalListSortingStrategy}
            >
              {banners.map((banner) => (
                <SortableBannerItem 
                  key={banner.id} 
                  banner={banner} 
                  onEdit={openEdit} 
                  onDelete={setDeleteId} 
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{editItem ? "تعديل البانر" : "إضافة بانر"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              {[
                { label: "العنوان *", value: title, set: setTitle, dir: "rtl", placeholder: "" },
                { label: "العنوان الفرعي", value: subtitle, set: setSubtitle, dir: "rtl", placeholder: "" },
                { label: "رابط الصورة", value: image, set: setImage, dir: "ltr", placeholder: "https://..." },
                { label: "نص زر الدعوة", value: ctaText, set: setCtaText, dir: "rtl", placeholder: "تسوق الآن" },
                { label: "رابط الدعوة", value: ctaLink, set: setCtaLink, dir: "ltr", placeholder: "/products" },
              ].map(({ label, value, set, dir, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={value} onChange={(e) => set(e.target.value)} dir={dir as "rtl" | "ltr"} placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              ))}
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
            <p className="text-sm text-gray-500 mb-6">هل أنت متأكد من حذف هذا البانر؟</p>
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

function SortableBannerItem({ 
  banner, 
  onEdit, 
  onDelete 
}: { 
  banner: Banner; 
  onEdit: (b: Banner) => void; 
  onDelete: (id: string) => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group relative w-full aspect-[16/9] lg:aspect-[21/9] xl:aspect-[3/1] rounded-[24px] overflow-hidden shadow-sm border border-gray-100 bg-gray-100 ${isDragging ? "opacity-75 scale-[1.02] shadow-2xl" : ""}`}
    >
      {/* Banner Image */}
      {banner.image ? (
        <img 
          src={banner.image} 
          alt={banner.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          لا توجد صورة
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      {/* Content matching frontend */}
      <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end pointer-events-none text-white">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 drop-shadow-md">
          {banner.title}
        </h3>
        {banner.subtitle && (
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 md:mb-6 max-w-xl drop-shadow">
            {banner.subtitle}
          </p>
        )}
        
        {banner.ctaLink && (
          <div className="pointer-events-auto">
            <a 
              href={banner.ctaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
            >
              {banner.ctaText || "اكتشف الآن"}
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </a>
          </div>
        )}
      </div>

      {/* Floating Action Controls */}
      <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
        <button 
          onClick={() => onEdit(banner)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-all hover:scale-105"
          title="تعديل"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onDelete(banner.id)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-sm text-gray-700 hover:bg-white hover:text-red-600 transition-all hover:scale-105"
          title="حذف"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-sm text-gray-700 hover:bg-white hover:text-gray-900 transition-all cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
        title="اسحب للترتيب"
      >
        <GripVertical className="h-5 w-5" />
      </div>
    </div>
  );
}
