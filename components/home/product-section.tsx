"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/cards/product-card";
import { SlideUp } from "@/components/layout/animations";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
  horizontal?: boolean;
}

export function ProductSection({
  title,
  products,
  viewAllHref = "/products",
  horizontal = false,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16" aria-labelledby={`section-${title}`}>
      <div className="container mx-auto px-4">
        <SlideUp>
          <div className="flex items-center justify-between mb-8">
            <h2 id={`section-${title}`} className="text-2xl md:text-3xl font-bold">
              {title}
            </h2>
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              عرض الكل
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </SlideUp>

        {horizontal ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {products.map((product, index) => (
              <SlideUp key={product.id} delay={index * 0.05}>
                <ProductCard product={product} horizontal />
              </SlideUp>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <SlideUp key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </SlideUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
