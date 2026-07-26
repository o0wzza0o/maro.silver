"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";
import { SlideUp } from "@/components/layout/animations";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-12 md:py-16" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4">
        <SlideUp>
          <h2
            id="categories-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-8"
          >
            تصنيفاتنا
          </h2>
        </SlideUp>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <SlideUp key={category.id} delay={index * 0.05}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative aspect-square w-full max-w-[120px] overflow-hidden rounded-2xl border border-border bg-secondary transition-all group-hover:shadow-soft-lg group-hover:-translate-y-1">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="120px"
                  />
                </div>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
