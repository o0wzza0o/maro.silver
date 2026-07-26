"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { categories, getCategoryBySlug } from "@/data/categories";
import { filterProducts, sortProducts, paginateProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/product-grid";
import type { ProductFilters } from "@/components/products/product-grid";
import { SubCategoryChips } from "@/components/products/sub-category-chips";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGridSkeleton } from "@/components/layout/skeletons";
import { PageTransition, SlideUp } from "@/components/layout/animations";
import { SortOption, ViewMode } from "@/types";

const ITEMS_PER_PAGE = 8;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const sortParam = (searchParams.get("sort") as SortOption) || "newest";

  const [sort, setSort] = useState<SortOption>(sortParam);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSubCategory, setActiveSubCategory] = useState<
    string | undefined
  >();
  const [filters, setFilters] = useState<ProductFilters>({
    inStockOnly: false,
  });

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const filteredProducts = useMemo(() => {
    let result = filterProducts(products, {
      categoryId: category?.id,
      subCategoryId: activeSubCategory,
      inStockOnly: filters.inStockOnly,
      maxPrice: filters.maxPrice,
    });
    result = sortProducts(result, sort);
    return result;
  }, [category?.id, activeSubCategory, sort, filters]);

  const { items: paginatedProducts, totalPages } = useMemo(
    () => paginateProducts(filteredProducts, currentPage, ITEMS_PER_PAGE),
    [filteredProducts, currentPage]
  );

  const handleSubCategoryChange = (subCategoryId: string | undefined) => {
    setActiveSubCategory(subCategoryId);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "المنتجات", href: "/products" },
            ...(category ? [{ label: category.name }] : []),
          ]}
          className="mb-6"
        />

        <SlideUp>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {category ? category.name : "جميع المنتجات"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {filteredProducts.length} منتج
          </p>
        </SlideUp>

        {category?.subCategories && (
          <div className="mb-6">
            <SubCategoryChips
              subCategories={category.subCategories}
              activeSubCategory={activeSubCategory}
              onSubCategoryChange={handleSubCategoryChange}
            />
          </div>
        )}

        {!category && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium transition-all hover:bg-secondary"
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        <ProductGrid
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          sort={sort}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </PageTransition>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
