"use client";

import { useState } from "react";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Product, SortOption, ViewMode } from "@/types";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface ProductFilters {
  inStockOnly: boolean;
  maxPrice?: number;
}

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر شعبية" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
];

const priceRanges = [
  { label: "جميع الأسعار", value: "all" },
  { label: "حتى 40,000 د.ع", value: "40000" },
  { label: "حتى 60,000 د.ع", value: "60000" },
  { label: "حتى 100,000 د.ع", value: "100000" },
];

function FilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">التوفر</Label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFiltersChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm">المتوفر فقط</span>
        </label>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">السعر الأقصى</Label>
        <Select
          value={filters.maxPrice?.toString() ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              maxPrice: value === "all" ? undefined : Number(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  currentPage,
  totalPages,
  onPageChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
}: ProductGridProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (filters.inStockOnly ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              فلتر
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>الفلاتر</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-8">
              <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
            </div>
          </DrawerContent>
        </Drawer>

        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden sm:flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/50"
              )}
              aria-label="عرض شبكي"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50"
              )}
              aria-label="عرض قائمة"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          لا توجد منتجات مطابقة
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              : "flex flex-col gap-4"
          )}
        >
          {products.map((product) =>
            viewMode === "grid" ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductCard
                key={product.id}
                product={product}
                horizontal
                className="min-w-0 w-full"
              />
            )
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-10"
      />
    </div>
  );
}
