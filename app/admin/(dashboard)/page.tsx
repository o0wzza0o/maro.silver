import Link from "next/link";
import { Package, FolderOpen, Image, MapPin, ArrowLeft, TrendingUp } from "lucide-react";
import { getProducts } from "@/data/products";
import { getCategories } from "@/data/categories";
import { getBanners } from "@/data/banners";
import { getGovernorates } from "@/data/governorates";
import { AnalyticsSection } from "@/components/admin/analytics-section";

export default async function AdminDashboardPage() {
  const [products, categories, banners, governorates] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getBanners().catch(() => []),
    getGovernorates().catch(() => []),
  ]);

  const inStock = products.filter((p) => p.inStock).length;
  const newProducts = products.filter((p) => p.isNew).length;
  const bestSellers = products.filter((p) => p.isBestSeller).length;

  const stats = [
    {
      label: "المنتجات",
      value: products.length,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-50 text-blue-600",
      badge: `${inStock} متوفر`,
    },
    {
      label: "التصنيفات",
      value: categories.length,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-purple-50 text-purple-600",
      badge: null,
    },
    {
      label: "البانرات",
      value: banners.length,
      icon: Image,
      href: "/admin/banners",
      color: "bg-amber-50 text-amber-600",
      badge: null,
    },
    {
      label: "المحافظات",
      value: governorates.length,
      icon: MapPin,
      href: "/admin/governorates",
      color: "bg-emerald-50 text-emerald-600",
      badge: null,
    },
  ];

  const highlights = [
    { label: "منتج جديد", value: newProducts, color: "text-emerald-600 bg-emerald-50" },
    { label: "الأكثر مبيعاً", value: bestSellers, color: "text-amber-600 bg-amber-50" },
    { label: "غير متوفر", value: products.length - inStock, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div dir="rtl" className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-white/70" />
          <span className="text-sm text-white/70">نظرة عامة</span>
        </div>
        <h2 className="text-2xl font-bold">أهلاً بك في لوحة الإدارة</h2>
        <p className="mt-1 text-sm text-gray-400">
          تحكّم الكامل في متجر MARO SILVER من هنا
        </p>
      </div>

      {/* Analytics */}
      <AnalyticsSection />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`rounded-xl p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowLeft className="h-4 w-4 text-gray-300 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            {stat.badge && (
              <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {stat.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Product Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.label} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{h.label}</p>
            <p className={`text-2xl font-bold rounded-xl inline-block px-3 py-1 ${h.color}`}>
              {h.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "إضافة منتج", href: "/admin/products", icon: Package, color: "border-blue-200 hover:bg-blue-50" },
            { label: "إضافة تصنيف", href: "/admin/categories", icon: FolderOpen, color: "border-purple-200 hover:bg-purple-50" },
            { label: "إضافة بانر", href: "/admin/banners", icon: Image, color: "border-amber-200 hover:bg-amber-50" },
            { label: "إضافة محافظة", href: "/admin/governorates", icon: MapPin, color: "border-emerald-200 hover:bg-emerald-50" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-4 text-center text-sm font-medium text-gray-600 transition-colors ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
