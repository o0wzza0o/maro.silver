"use client";

import { ProductCard } from "@/components/cards/product-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageTransition, SlideUp } from "@/components/layout/animations";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { items, isHydrated } = useWishlist();

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
        <Breadcrumb items={[{ label: "المفضلة" }]} className="mb-6" />

        <SlideUp>
          <h1 className="text-2xl md:text-3xl font-bold mb-8">المفضلة</h1>
        </SlideUp>

        {items.length === 0 ? (
          <EmptyState
            title="قائمة المفضلة فارغة"
            description="احفظ المنتجات التي تعجبك للرجوع إليها لاحقاً."
            actionLabel="تصفح المنتجات"
            actionHref="/products"
            icon={<Heart className="h-10 w-10 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product, index) => (
              <SlideUp key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </SlideUp>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
