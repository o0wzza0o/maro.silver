"use client";

import { CartView } from "@/components/cart/cart-view";
import { EmptyState } from "@/components/layout/empty-state";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageTransition, SlideUp } from "@/components/layout/animations";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";

function CartContent() {
  const { items, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Breadcrumb
          items={[{ label: "سلة التسوق" }]}
          className="mb-6"
        />

        <SlideUp>
          <h1 className="text-2xl md:text-3xl font-bold mb-8">سلة التسوق</h1>
        </SlideUp>

        {items.length === 0 ? (
          <EmptyState
            title="سلة التسوق فارغة"
            description="لم تقم بإضافة أي منتجات بعد. تصفح مجموعتنا واختر ما يناسبك."
            icon={<ShoppingBag className="h-10 w-10 text-muted-foreground" />}
          />
        ) : (
          <CartView />
        )}
      </div>
    </PageTransition>
  );
}

export default function CartPage() {
  return <CartContent />;
}
