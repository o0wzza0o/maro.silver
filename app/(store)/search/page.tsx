"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, X } from "lucide-react";
import { getProducts, recentSearches, suggestedSearchProducts } from "@/data/products";
import { filterProducts } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/cards/product-card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageTransition, SlideUp } from "@/components/layout/animations";
import { formatPrice } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Product } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [storedSearches, setStoredSearches] = useLocalStorage<string[]>(
    "maro-silver-recent-searches",
    recentSearches
  );

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, suggestedData] = await Promise.all([
        getProducts(),
        suggestedSearchProducts(),
      ]);
      setProducts(productsData);
      setSuggestedProducts(suggestedData);
    };
    fetchData();
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return filterProducts(products, { search: query.trim() });
  }, [query, products]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setStoredSearches((prev) => {
        const filtered = prev.filter((s) => s !== searchQuery);
        return [searchQuery, ...filtered].slice(0, 5);
      });
    }
  };

  const clearRecentSearches = () => {
    setStoredSearches([]);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Breadcrumb items={[{ label: "البحث" }]} className="mb-6" />

        <SlideUp>
          <h1 className="text-2xl md:text-3xl font-bold mb-6">البحث</h1>
        </SlideUp>

        <div className="relative mb-8">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن مجوهرات فضية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(query);
            }}
            className="pr-12 h-12 text-base"
            autoFocus
          />
        </div>

        {query.trim() ? (
          <div>
            <p className="text-muted-foreground mb-6">
              {searchResults.length} نتيجة لـ &quot;{query}&quot;
            </p>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                لم يتم العثور على نتائج
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recent Searches */}
            {storedSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    عمليات البحث الأخيرة
                  </h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    مسح الكل
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {storedSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Suggested Products */}
            <section>
              <h2 className="font-semibold mb-4">منتجات مقترحة</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {suggestedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:shadow-soft"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-2 group-hover:underline">
                        {product.name}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
