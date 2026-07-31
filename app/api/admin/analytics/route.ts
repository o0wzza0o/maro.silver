import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase-admin";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "maro-silver-secret-session-key-2025";

async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_SECRET;
}

export async function GET(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today"; // today | week | month

  // Determine date ranges
  const now = new Date();
  let currentStart = new Date();
  let previousStart = new Date();
  let chartFormat: "hour" | "day" = "day";
  let chartPoints = 0;

  if (period === "today") {
    currentStart.setHours(0, 0, 0, 0);
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 1);
    chartFormat = "hour";
    chartPoints = 24;
  } else if (period === "week") {
    currentStart.setDate(currentStart.getDate() - 7);
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 7);
    chartFormat = "day";
    chartPoints = 7;
  } else {
    // month
    currentStart.setDate(currentStart.getDate() - 30);
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 30);
    chartFormat = "day";
    chartPoints = 30;
  }

  try {
    const { data: allOrders, error } = await getAdminClient()
      .from("orders")
      .select("created_at, items")
      .gte("created_at", previousStart.toISOString());

    const orders = allOrders || [];

    // Filter current and previous
    const currentOrders = orders.filter(
      (o: any) => new Date(o.created_at) >= currentStart
    );
    const previousOrders = orders.filter(
      (o: any) => new Date(o.created_at) >= previousStart && new Date(o.created_at) < currentStart
    );

    // Calculate metrics
    const getProductsSold = (orderList: any[]) => {
      return orderList.reduce((total, order) => {
        let orderTotal = 0;
        if (Array.isArray(order.items)) {
          orderTotal = order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        }
        return total + orderTotal;
      }, 0);
    };

    const currentProductsSold = getProductsSold(currentOrders);
    const previousProductsSold = getProductsSold(previousOrders);
    const currentOrdersCount = currentOrders.length;
    const previousOrdersCount = previousOrders.length;

    // Calculate percentage change
    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Generate Chart Data
    const generateChartData = () => {
      const chartMap = new Map<string, { products: number; orders: number }>();
      
      // Initialize buckets
      if (chartFormat === "hour") {
        for (let i = 0; i < 24; i++) {
          chartMap.set(`${i}:00`, { products: 0, orders: 0 });
        }
      } else if (chartFormat === "day") {
        for (let i = chartPoints - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          chartMap.set(key, { products: 0, orders: 0 });
        }
      }

      // Fill data
      currentOrders.forEach((o: any) => {
        const d = new Date(o.created_at);
        let key = "";
        if (chartFormat === "hour") {
          key = `${d.getHours()}:00`;
        } else {
          key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }

        if (chartMap.has(key)) {
          const current = chartMap.get(key)!;
          let qty = 0;
          if (Array.isArray(o.items)) {
            qty = o.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          }
          chartMap.set(key, { products: current.products + qty, orders: current.orders + 1 });
        }
      });

      return Array.from(chartMap.entries()).map(([label, data]) => ({
        label,
        products: data.products,
        orders: data.orders,
      }));
    };

    const chartData = generateChartData();

    return NextResponse.json({
      productsSold: {
        current: currentProductsSold,
        previous: previousProductsSold,
        change: calcChange(currentProductsSold, previousProductsSold),
        chart: chartData.map((d) => ({ label: d.label, value: d.products })),
      },
      orders: {
        current: currentOrdersCount,
        previous: previousOrdersCount,
        change: calcChange(currentOrdersCount, previousOrdersCount),
        chart: chartData.map((d) => ({ label: d.label, value: d.orders })),
      },
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    // Even if it fails (e.g. table doesn't exist), return 0s so UI doesn't break
    return NextResponse.json({
      productsSold: { current: 0, previous: 0, change: 0, chart: [] },
      orders: { current: 0, previous: 0, change: 0, chart: [] },
    });
  }
}
