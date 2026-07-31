"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { adminUpdateOrderStatus } from "@/lib/admin-api";
import {
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Calendar,
  Search,
  Box,
  Navigation
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUSES = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  confirmed: { label: "تم التأكيد", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  preparing: { label: "جاري التجهيز", icon: Box, color: "text-purple-600", bg: "bg-purple-50" },
  shipped: { label: "تم الشحن", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
  out_for_delivery: { label: "في الطريق إليك", icon: Navigation, color: "text-orange-600", bg: "bg-orange-50" },
  delivered: { label: "تم التوصيل", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled: { label: "ملغي", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminUpdateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الإعدادات",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 py-32 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">لا توجد طلبات بعد</h3>
        <p className="text-gray-500 max-w-sm mt-1">
          ستظهر هنا جميع الطلبات الواردة من العملاء للبدء في تجهيزها وشحنها.
        </p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const orderNumber = order.order_number?.toLowerCase() || order.id.toLowerCase();
    return (
      orderNumber.includes(q) ||
      order.customer_name?.toLowerCase().includes(q) ||
      order.customer_phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">لا توجد طلبات مطابقة لبحثك.</div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            const statusObj = STATUSES[order.status as keyof typeof STATUSES] || STATUSES.pending;
            const StatusIcon = statusObj.icon;
            const date = new Date(order.created_at).toLocaleString("ar-EG", {
              year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            });

            return (
              <div key={order.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition-all">
                {/* Header / Summary */}
                <div
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">رقم الطلب</p>
                      <p className="font-semibold font-mono text-sm text-gray-900 uppercase">{order.order_number || `#${order.id.slice(0, 8)}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">تاريخ الطلب</p>
                      <p className="font-medium text-sm text-gray-900 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span dir="ltr">{date}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">العميل</p>
                      <p className="font-medium text-sm text-gray-900 flex items-center gap-1.5">
                        <User className="h-4 w-4 text-gray-400" />
                        {order.customer_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">الإجمالي</p>
                      <p className="font-bold text-sm text-emerald-600">{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 transition-colors ${statusObj.bg} ${statusObj.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-semibold">{statusObj.label}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 font-cairo bg-white shadow-md border border-gray-100 z-50">
                        {Object.entries(STATUSES).map(([key, val]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleStatusChange(order.id, key)}
                            className={`flex items-center gap-2 cursor-pointer ${order.status === key ? 'bg-gray-50' : ''}`}
                          >
                            <val.icon className={`h-4 w-4 ${val.color}`} />
                            <span className="font-medium">{val.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-50 p-5 bg-gray-50/30">
                    <div className="grid lg:grid-cols-3 gap-8">

                      {/* Customer Info */}
                      <div className="space-y-4 lg:col-span-1">
                        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">بيانات الشحن</h4>

                        <div className="space-y-3 text-sm">
                          <div className="flex gap-3">
                            <Phone className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-500 text-xs">رقم الهاتف</p>
                              <p className="font-medium text-gray-900" dir="ltr">{order.customer_phone}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-500 text-xs">العنوان</p>
                              <p className="font-medium text-gray-900">
                                {order.governorate}، {order.city}<br />
                                <span className="text-gray-600">{order.address}</span>
                              </p>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="bg-amber-50 rounded-lg p-3 mt-4 border border-amber-100">
                              <p className="text-xs text-amber-800 font-bold mb-1">ملاحظات العميل:</p>
                              <p className="text-sm text-amber-900">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-4 lg:col-span-2">
                        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">المنتجات المطلوبة</h4>
                        <div className="space-y-3">
                          {order.items && order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{item.product.name}</p>
                                  {item.selectedSize && (
                                    <p className="text-xs text-gray-500">المقاس: {item.selectedSize}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-sm text-gray-900">{formatPrice(item.price)}</p>
                                <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
