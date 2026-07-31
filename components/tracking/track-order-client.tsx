"use client";

import { useState } from "react";
import { trackOrder } from "@/app/(store)/track-order/actions";
import { Search, Loader2, Package, MapPin, Phone, User, Calendar, CheckCircle, Clock, Truck, XCircle, Box, Navigation } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const STATUS_STEPS = [
  { id: "pending", label: "قيد الانتظار", icon: Clock },
  { id: "confirmed", label: "تم التأكيد", icon: CheckCircle },
  { id: "preparing", label: "جاري التجهيز", icon: Box },
  { id: "shipped", label: "تم الشحن", icon: Truck },
  { id: "out_for_delivery", label: "في الطريق إليك", icon: Navigation },
  { id: "delivered", label: "تم التوصيل", icon: Package },
];

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    const result = await trackOrder(orderNumber);

    if (result.error) {
      setError(result.error);
    } else if (result.order) {
      setOrder(result.order);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8" dir="rtl">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">تتبع طلبك</h1>
          <p className="text-gray-500">أدخل رقم الطلب الخاص بك لمعرفة حالة الطلب الحالية وموعد التوصيل.</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
          <input
            type="text"
            placeholder="أدخل رقم الطلب (مثال: #MS-2026...)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full pl-32 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tracking-wider text-left"
            dir="ltr"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !orderNumber.trim()} 
            className="absolute left-1 top-1 bottom-1 px-6 rounded-lg"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تتبع الطلب"}
          </Button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-900 mb-1">لم نتمكن من العثور على الطلب</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Order Result */}
      {order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Order Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
              <h2 className="text-xl font-bold font-mono text-gray-900 uppercase tracking-wider">
                {order.order_number || `#${order.id.slice(0,8)}`}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">تاريخ الطلب</p>
              <p className="font-medium text-gray-900" dir="ltr">
                {new Date(order.created_at).toLocaleString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
            <h3 className="font-bold text-lg mb-8">حالة الطلب</h3>
            
            {order.status === "cancelled" ? (
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <XCircle className="w-8 h-8 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900 text-lg">الطلب ملغي</h4>
                  <p className="text-red-700 text-sm mt-1">تم إلغاء هذا الطلب ولا يمكن استكماله.</p>
                </div>
              </div>
            ) : (
              <div className="relative flex justify-between md:max-w-2xl mx-auto">
                {/* Connecting Line Background */}
                <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-100 -z-10 rounded-full"></div>
                
                {/* Connecting Line Active */}
                <div 
                  className="absolute top-5 right-[10%] h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.max(0, STATUS_STEPS.findIndex(s => s.id === order.status) / (STATUS_STEPS.length - 1)) * 80}%`,
                  }}
                ></div>

                {STATUS_STEPS.map((step, index) => {
                  const currentIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
                  const isCompleted = index <= currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-16 md:w-24 gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm border-2 ${
                        isActive ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200" : 
                        isCompleted ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                        "bg-white text-gray-300 border-gray-100"
                      }`}>
                        <step.icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
                      </div>
                      <span className={`text-[10px] md:text-xs font-semibold text-center leading-tight ${
                        isActive ? "text-emerald-700" : 
                        isCompleted ? "text-gray-700" : 
                        "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-lg border-b border-gray-50 pb-3">بيانات التوصيل</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3 items-start">
                  <User className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">الاسم</p>
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">رقم الهاتف</p>
                    <p className="font-medium text-gray-900" dir="ltr">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs">العنوان</p>
                    <p className="font-medium text-gray-900 leading-relaxed">
                      {order.governorate}، {order.city}<br />
                      <span className="text-gray-600">{order.address}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
              <h3 className="font-bold text-lg border-b border-gray-50 pb-3 mb-4">المنتجات ({order.items?.length || 0})</h3>
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                        <span>الكمية: {item.quantity}</span>
                        {item.selectedSize && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>المقاس: {item.selectedSize}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-left font-bold text-emerald-600 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                <span className="font-bold text-gray-700">الإجمالي النهائي</span>
                <span className="text-xl font-black text-emerald-600">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
