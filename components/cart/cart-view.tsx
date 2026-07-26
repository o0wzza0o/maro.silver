"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CartView() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    toast({
      title: "كود الخصم",
      description: "هذه الميزة للعرض فقط - لا يوجد خادم خلفي",
    });
  };

  if (items.length === 0) {
    return null;
  }

  const shipping = subtotal > 100000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-4 rounded-xl border border-border p-4"
          >
            <Link
              href={`/products/${item.product.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary"
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium line-clamp-2 hover:underline"
                >
                  {item.product.name}
                </Link>
                {item.selectedSize && (
                  <p className="text-sm text-muted-foreground mt-1">
                    المقاس: {item.selectedSize}
                  </p>
                )}
                <p className="font-semibold mt-1">
                  {formatPrice(item.product.price)}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.product.id)}
                  aria-label="حذف المنتج"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border p-6 h-fit space-y-4">
        <h2 className="text-lg font-semibold">ملخص الطلب</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="كود الخصم"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button variant="outline" onClick={handleApplyCoupon}>
            تطبيق
          </Button>
        </div>

        <div className="flex justify-between border-t border-border pt-4 font-semibold text-lg">
          <span>الإجمالي</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">إتمام الشراء</Link>
        </Button>
      </div>
    </div>
  );
}
