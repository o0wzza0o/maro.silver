"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getProducts } from "@/data/products";
import { getCategories } from "@/data/categories";
import { adminDeleteProduct } from "@/lib/admin-api";
import { ProductForm } from "@/components/admin/products/product-form";
import type { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      getProducts().catch(() => []),
      getCategories().catch(() => []),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  async function handleDelete(id: string) {
    setDeleting(true);
    await adminDeleteProduct(id).catch(() => null);
    await fetchData();
    setDeleteId(null);
    setDeleting(false);
  }

  function handleSuccess() {
    setShowForm(false);
    setEditProduct(null);
    // Bust cache
    (window as any).__productsCache = null;
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المنتجات..."
            className="w-full rounded-xl border border-gray-200 bg-white pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          إضافة منتج
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {filtered.length} منتج من أصل {products.length}
      </p>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">المنتج</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">السعر</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">التصنيف</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">المخزون</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">الحالة</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    لا توجد منتجات مطابقة
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                              لا صورة
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400 dir-ltr">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {product.price.toLocaleString("ar-EG")} ج
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through mr-1">
                            {product.originalPrice.toLocaleString("ar-EG")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {cat?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{product.stockCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              product.inStock
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.inStock ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {product.inStock ? "متوفر" : "غير متوفر"}
                          </span>
                          <div className="flex gap-1">
                            {product.isNew && (
                              <span className="rounded-full bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px] font-medium">
                                جديد
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="rounded-full bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[10px] font-medium">
                                الأكثر مبيعاً
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditProduct(product); setShowForm(true); }}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-10 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">
                {editProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditProduct(null); }}
                className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
              <ProductForm
                categories={categories}
                initialData={
                  editProduct
                    ? {
                        id: editProduct.id,
                        name: editProduct.name,
                        slug: editProduct.slug,
                        price: editProduct.price,
                        original_price: editProduct.originalPrice,
                        images: editProduct.images,
                        category_id: editProduct.categoryId,
                        description: editProduct.description,
                        specifications: editProduct.specifications as unknown as Record<string, string>,
                        sizes: editProduct.sizes,
                        in_stock: editProduct.inStock,
                        stock_count: editProduct.stockCount,
                        is_new: editProduct.isNew ?? false,
                        is_best_seller: editProduct.isBestSeller ?? false,
                      }
                    : undefined
                }
                onSuccess={handleSuccess}
                onCancel={() => { setShowForm(false); setEditProduct(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center" dir="rtl">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                حذف
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
