"use server";

import { getAdminClient } from "@/lib/supabase-admin";

export async function trackOrder(orderNumber: string) {
  if (!orderNumber || orderNumber.trim() === "") {
    return { error: "يرجى إدخال رقم الطلب" };
  }

  const cleanOrderNumber = orderNumber.trim().toUpperCase();

  try {
    const { data, error } = await getAdminClient()
      .from("orders")
      .select("*")
      .eq("order_number", cleanOrderNumber)
      .single();

    if (error || !data) {
      return { error: "لم نتمكن من العثور على طلب بهذا الرقم. تأكد من الرقم والمحاولة مرة أخرى." };
    }

    return { order: data };
  } catch (err) {
    console.error("Track order error:", err);
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." };
  }
}
