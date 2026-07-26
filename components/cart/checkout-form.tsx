"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CheckoutFormData } from "@/types";
import { governorates } from "@/data/governorates";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Image from "next/image";
import { Banknote } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  governorate: z.string().min(1, "اختر المحافظة"),
  city: z.string().min(1, "اختر المدينة"),
  address: z.string().min(5, "العنوان مطلوب"),
  notes: z.string().optional(),
  paymentMethod: z.literal("cod"),
});

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const selectedGov = governorates.find((g) => g.id === selectedGovernorate);
  const shipping = subtotal > 100000 ? 0 : 5000;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">معلومات العميل</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أدخل اسمك" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="07XX XXX XXXX"
                dir="ltr"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>المحافظة</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedGovernorate(value);
                  setValue("governorate", value);
                  setValue("city", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((gov) => (
                    <SelectItem key={gov.id} value={gov.id}>
                      {gov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.governorate && (
                <p className="text-xs text-destructive">
                  {errors.governorate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>المدينة</Label>
              <Select
                disabled={!selectedGov}
                onValueChange={(value) => setValue("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGov?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان التفصيلي</Label>
            <Textarea
              id="address"
              placeholder="الحي، الشارع، رقم المنزل..."
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات إضافية..."
              {...register("notes")}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">طريقة الدفع</h2>
          <label className="flex items-center gap-4 rounded-xl border-2 border-primary bg-secondary/50 p-4 cursor-pointer">
            <input
              type="radio"
              value="cod"
              defaultChecked
              className="h-4 w-4"
              {...register("paymentMethod")}
            />
            <Banknote className="h-6 w-6" />
            <div>
              <p className="font-medium">الدفع عند الاستلام</p>
              <p className="text-sm text-muted-foreground">
                ادفع نقداً عند استلام طلبك
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border p-6 h-fit space-y-4">
        <h2 className="text-lg font-semibold">ملخص الطلب</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  x{item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2">
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
        </Button>
      </div>
    </form>
  );
}
