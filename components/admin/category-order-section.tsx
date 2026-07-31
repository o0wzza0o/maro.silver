/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Plus, X, Loader2, GripVertical } from "lucide-react";
import type { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  allCategories: Category[];
  initialHomeIds: string[];
  initialNavIds: string[];
}

const MAX_HOME = 6;
const MAX_NAV  = 8;

const HOME_KEY = "home_category_order";
const NAV_KEY  = "nav_category_order";

async function saveOrder(key: string, ids: string[]) {
  const res = await fetch("/api/admin/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "app_settings", action: "update", id: key, data: ids }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "فشل الحفظ");
  }
}

/** Single draggable category card */
function SortableCard({
  cat,
  onRemove,
}: {
  cat: Category;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex flex-col items-center gap-1 group select-none">
      <div className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        {cat.image ? (
          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">لا صورة</div>
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-white drop-shadow" />
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-0.5 right-0.5 rounded-full bg-red-500 text-white w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          title="إزالة"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
      <span className="text-[10px] text-gray-600 text-center max-w-[64px] truncate">{cat.name}</span>
    </div>
  );
}

/** One sortable container */
function OrderContainer({
  title,
  subtitle,
  max,
  selectedIds,
  allCategories,
  onChange,
}: {
  title: string;
  subtitle: string;
  max: number;
  selectedIds: string[];
  allCategories: Category[];
  onChange: (ids: string[]) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selected = selectedIds
    .map(id => allCategories.find(c => c.id === id))
    .filter(Boolean) as Category[];

  const available = allCategories.filter(c => !selectedIds.includes(c.id));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedIds.indexOf(active.id as string);
    const newIndex = selectedIds.indexOf(over.id as string);
    onChange(arrayMove(selectedIds, oldIndex, newIndex));
  }

  function add(id: string) {
    if (selectedIds.length >= max) return;
    onChange([...selectedIds, id]);
    setShowPicker(false);
  }

  function remove(id: string) {
    onChange(selectedIds.filter(i => i !== id));
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle} &mdash; الحد الأقصى: {max}</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedIds} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-3 min-h-[76px]">
            {selected.map((cat) => (
              <SortableCard key={cat.id} cat={cat} onRemove={() => remove(cat.id)} />
            ))}

            {/* Add card */}
            {selected.length < max && (
              <div className="relative">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="إضافة تصنيف"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Picker dropdown */}
                {showPicker && (
                  <div className="absolute top-full mt-2 right-0 z-50 w-52 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500">اختر تصنيفاً</div>
                    <div className="max-h-48 overflow-y-auto">
                      {available.length === 0 && (
                        <div className="px-3 py-3 text-xs text-gray-400 text-center">لا توجد تصنيفات متاحة</div>
                      )}
                      {available.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => add(cat.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-right"
                        >
                          {cat.image && (
                            <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                          )}
                          <span className="text-sm text-gray-800">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button
                        onClick={() => setShowPicker(false)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {selected.length === 0 && (
        <p className="text-xs text-gray-400 -mt-2">لم يتم اختيار أي تصنيف. سيتم عرض التصنيفات الافتراضية.</p>
      )}
    </div>
  );
}

export function CategoryOrderSection({ allCategories, initialHomeIds, initialNavIds }: Props) {
  const { toast } = useToast();
  const [homeIds, setHomeIds] = useState<string[]>(initialHomeIds);
  const [navIds, setNavIds]   = useState<string[]>(initialNavIds);
  const [saving, setSaving]   = useState(false);

  async function save() {
    setSaving(true);
    try {
      await Promise.all([
        saveOrder(HOME_KEY, homeIds),
        saveOrder(NAV_KEY, navIds),
      ]);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث ترتيب التصنيفات في الصفحة الرئيسية والقائمة",
      });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">ترتيب التصنيفات</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            اسحب الكروت لتغيير الترتيب، أو اضغط <span className="font-medium text-gray-700">+</span> لإضافة تصنيف
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ الترتيب
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OrderContainer
          title="الصفحة الرئيسية"
          subtitle="تظهر كبطاقات تحت السلايدر"
          max={MAX_HOME}
          selectedIds={homeIds}
          allCategories={allCategories}
          onChange={setHomeIds}
        />
        <OrderContainer
          title="شريط التصنيفات (Navbar)"
          subtitle="تظهر في القائمة العلوية"
          max={MAX_NAV}
          selectedIds={navIds}
          allCategories={allCategories}
          onChange={setNavIds}
        />
      </div>
    </div>
  );
}
