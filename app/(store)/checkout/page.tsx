"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageTransition, SlideUp } from "@/components/layout/animations";
import { useCart } from "@/hooks/useCart";

function CheckoutContent() {
  const { items, isHydrated } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/cart");
    }
  }, [isHydrated, items.length, router]);

  if (!isHydrated || items.length === 0) {
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
          items={[
            { label: "السلة", href: "/cart" },
            { label: "إتمام الشراء" },
          ]}
          className="mb-6"
        />

        <SlideUp>
          <h1 className="text-2xl md:text-3xl font-bold mb-8">إتمام الشراء</h1>
        </SlideUp>

        <CheckoutForm />
      </div>
    </PageTransition>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
