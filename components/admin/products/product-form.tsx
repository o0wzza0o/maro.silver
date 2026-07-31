"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Loader2 } from "lucide-react";
import { adminCreateProduct, adminUpdateProduct } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  slug: z.string().min(2, "الرابط مطلوب"),
  price: z.coerce.number().min(1, "السعر مطلوب"),
  original_price: z.coerce.number().optional().nullable(),
  description: z.string().optional(),
  category_id: z.string().optional().nullable(),
  stock_count: z.coerce.number().min(0),
  in_stock: z.boolean(),
  is_new: z.boolean(),
  is_best_seller: z.boolean(),
  material: z.string().optional(),
  gender: z.string().optional(),
  weight: z.string().optional(),
  spec_category: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ProductInput {
  name?: string;
  slug?: string;
  price?: number;
  original_price?: number | null;
  images?: string[];
  category_id?: string | null;
  description?: string | null;
  specifications?: Record<string, string>;
  sizes?: string[];
  in_stock?: boolean;
  stock_count?: number;
  is_new?: boolean;
  is_best_seller?: boolean;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductInput & { id?: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  categories,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const isEdit = !!initialData?.id;
  const [images, setImages] = useState<string[]>(initialData?.images || [""]);
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [sizeInput, setSizeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      price: initialData?.price || 0,
      original_price: initialData?.original_price ?? null,
      description: initialData?.description || "",
      category_id: initialData?.category_id || null,
      stock_count: initialData?.stock_count || 0,
      in_stock: initialData?.in_stock ?? true,
      is_new: initialData?.is_new ?? false,
      is_best_seller: initialData?.is_best_seller ?? false,
      material: initialData?.specifications?.material || "فضة 925",
      gender: initialData?.specifications?.gender || "غير محدد",
      weight: initialData?.specifications?.weight || "",
      spec_category: initialData?.specifications?.category || "مجوهرات",
    },
  });

  const nameValue = watch("name");

  function handleNameBlur() {
    if (!isEdit) {
      setValue("slug", slugify(nameValue));
    }
  }

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  }

  function addImage() {
    setImages((prev) => [...prev, ""]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addSize() {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes((prev) => [...prev, sizeInput.trim()]);
      setSizeInput("");
    }
  }

  function removeSize(size: string) {
    setSizes((prev) => prev.filter((s) => s !== size));
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");

    const filteredImages = images.filter((img) => img.trim() !== "");
    if (filteredImages.length === 0) {
      setError("أضف صورة واحدة على الأقل");
      setLoading(false);
      return;
    }

    const payload = {
      name: data.name,
      slug: data.slug,
      price: data.price,
      original_price: data.original_price || null,
      images: filteredImages,
      category_id: data.category_id || null,
      description: data.description || null,
      specifications: {
        material: data.material || "فضة 925",
        gender: data.gender || "غير محدد",
        weight: data.weight || "",
        category: data.spec_category || "مجوهرات",
      },
      sizes,
      in_stock: data.in_stock,
      stock_count: data.stock_count,
      is_new: data.is_new,
      is_best_seller: data.is_best_seller,
    };

    try {
      if (isEdit && initialData?.id) {
        await adminUpdateProduct(initialData.id, payload as Record<string, unknown>);
      } else {
        await adminCreateProduct(payload as Record<string, unknown>);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
          <input
            {...register("name")}
            onBlur={handleNameBlur}
            placeholder="مثال: خاتم فضة ناعم"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الرابط (Slug) *</label>
          <input
            {...register("slug")}
            dir="ltr"
            placeholder="product-slug"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
          <select
            {...register("category_id")}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">-- بدون تصنيف --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ج.م) *</label>
          <input
            type="number"
            {...register("price")}
            min={0}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السعر الأصلي <span className="text-gray-400">(قبل الخصم)</span>
          </label>
          <input
            type="number"
            {...register("original_price")}
            min={0}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="وصف المنتج..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">روابط الصور *</label>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                dir="ltr"
                placeholder="https://..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="rounded-xl p-2.5 text-red-500 hover:bg-red-50 transition-colors border border-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="mt-2 flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4" /> إضافة صورة
        </button>
      </div>

      {/* Specifications */}
      <div className="rounded-xl border border-gray-200 p-4 space-y-4">
        <p className="text-sm font-medium text-gray-700">المواصفات</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">المادة</label>
            <input
              {...register("material")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">الجنس</label>
            <select
              {...register("gender")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="غير محدد">غير محدد</option>
              <option value="رجالي">رجالي</option>
              <option value="نسائي">نسائي</option>
              <option value="أطفال">أطفال</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">الوزن</label>
            <input
              {...register("weight")}
              placeholder="مثال: 5 جرام"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">فئة المواصفة</label>
            <input
              {...register("spec_category")}
              placeholder="مثال: مجوهرات"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">المقاسات</label>
        <div className="flex gap-2 mb-2">
          <input
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
            placeholder="مثال: 7, 8, 9"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="button"
            onClick={addSize}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            إضافة
          </button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm"
              >
                {size}
                <button type="button" onClick={() => removeSize(size)}>
                  <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stock & Flags */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عدد المخزون</label>
          <input
            type="number"
            {...register("stock_count")}
            min={0}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="flex flex-col gap-3 pt-1">
          {[
            { name: "in_stock" as const, label: "متوفر في المخزون" },
            { name: "is_new" as const, label: "منتج جديد" },
            { name: "is_best_seller" as const, label: "الأكثر مبيعاً" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register(name)}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
