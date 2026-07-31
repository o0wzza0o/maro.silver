"use client";

import { useState } from "react";
import useSWR from "swr";
import { TrendingUp, TrendingDown, Package, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

type Period = "today" | "week" | "month";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-sm min-w-[120px]" dir="rtl">
        <p className="text-gray-500 mb-1.5 text-xs font-medium">{label}</p>
        <p className="font-bold text-gray-900 flex items-center gap-2 text-base">
          <span 
            className="w-2.5 h-2.5 rounded-full shadow-sm" 
            style={{ backgroundColor: payload[0].color }}
          ></span>
          <span>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsCard({
  title,
  subtitle,
  icon: Icon,
  data,
  isLoading,
  period,
  setPeriod,
}: {
  title: string;
  subtitle: string;
  icon: any;
  data: any;
  isLoading: boolean;
  period: Period;
  setPeriod: (p: Period) => void;
}) {
  const isPositive = data?.change >= 0;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[320px]">
      <div className="p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <Icon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <div className="flex rounded-lg bg-gray-50 p-1">
            {(["today", "week", "month"] as Period[]).map((p) => {
              const labels = { today: "اليوم", week: "أسبوع", month: "شهر" };
              const active = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId={`${title}-activeTab`}
                      className="absolute inset-0 rounded-md bg-white shadow-sm border border-gray-200/50"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{labels[p]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-4">
          {isLoading ? (
            <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <motion.h4
              key={data?.current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-gray-900"
            >
              {data?.current?.toLocaleString() || 0}
            </motion.h4>
          )}

          {isLoading ? (
            <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1 text-sm font-semibold rounded-full px-2.5 py-1 ${
                isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
              }`}
            >
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span dir="ltr">
                {isPositive ? "+" : ""}
                {data?.change}%
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 mt-4 relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-50/50 animate-pulse" />
        ) : data?.chart?.length > 0 && data.current > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#color-${title})`}
                animationDuration={1000}
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 3, 
                  stroke: "#ffffff", 
                  fill: isPositive ? "#10b981" : "#ef4444",
                  style: { filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            لا توجد بيانات متاحة لهذه الفترة.
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  const [productsPeriod, setProductsPeriod] = useState<Period>("today");
  const [ordersPeriod, setOrdersPeriod] = useState<Period>("today");

  const { data: productsData, isLoading: productsLoading } = useSWR(
    `/api/admin/analytics?period=${productsPeriod}`,
    fetcher
  );

  const { data: ordersData, isLoading: ordersLoading } = useSWR(
    `/api/admin/analytics?period=${ordersPeriod}`,
    fetcher
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8" dir="rtl">
      <AnalyticsCard
        title="المنتجات المباعة"
        subtitle="تتبع عدد المنتجات المباعة بمرور الوقت."
        icon={Package}
        data={productsData?.productsSold}
        isLoading={productsLoading}
        period={productsPeriod}
        setPeriod={setProductsPeriod}
      />
      
      <AnalyticsCard
        title="الطلبات"
        subtitle="تتبع الطلبات الواردة بمرور الوقت."
        icon={ShoppingCart}
        data={ordersData?.orders}
        isLoading={ordersLoading}
        period={ordersPeriod}
        setPeriod={setOrdersPeriod}
      />
    </div>
  );
}
