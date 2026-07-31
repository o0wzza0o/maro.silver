"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Product, SortOption, ViewMode } from "@/types";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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



function FilterPanel({
  initialFilters,
  onApply,
  onClose,
}: {
  initialFilters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  onClose: () => void;
}) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">التوفر</Label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm">المتوفر فقط</span>
        </label>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">السعر الأقصى (جنيه)</Label>
        <Input
          type="number"
          placeholder="أدخل الحد الأقصى للسعر..."
          value={filters.maxPrice || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilters({
              ...filters,
              maxPrice: val === "" ? undefined : Number(val),
            });
          }}
          min={0}
        />
      </div>

      <div className="pt-6 border-t border-gray-100 flex gap-3">
        <Button 
          className="flex-1" 
          onClick={() => {
            onApply(filters);
            onClose();
          }}
        >
          تطبيق الفلاتر
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => {
            setFilters({ inStockOnly: false, maxPrice: undefined });
          }}
        >
          إعادة ضبط
        </Button>
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
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              تصفية
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] font-cairo overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-right font-bold text-xl">تصفية المنتجات</SheetTitle>
            </SheetHeader>
            <FilterPanel 
              initialFilters={filters} 
              onApply={onFiltersChange}
              onClose={() => setFilterOpen(false)}
            />
          </SheetContent>
        </Sheet>

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
