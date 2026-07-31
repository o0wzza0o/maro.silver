import { ShoppingCart } from "lucide-react";
import { getOrders } from "@/lib/supabase-admin";
import { OrdersClient } from "@/components/admin/orders-client";

export default async function AdminOrdersPage() {
  const orders = await getOrders().catch(() => []);

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <ShoppingCart className="h-6 w-6 text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-sm text-gray-500">تابع جميع طلبات العملاء وحالات التوصيل</p>
        </div>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
