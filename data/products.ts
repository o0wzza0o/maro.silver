import { Product } from "@/types";
import { getProducts as fetchProducts, getProductBySlug as fetchProductBySlug, getProductById as fetchProductById, getBestSellers as fetchBestSellers, getNewArrivals as fetchNewArrivals } from "@/lib/supabase-data";

// Cache for client-side
let productsCache: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;
  productsCache = await fetchProducts();
  return productsCache;
}

export function clearProductsCache() {
  productsCache = null;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return await fetchProductBySlug(slug) || undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return await fetchProductById(id) || undefined;
}

export async function getBestSellers(limit = 6): Promise<Product[]> {
  return await fetchBestSellers(limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return await fetchNewArrivals(limit);
}

export const recentSearches = [
  "خاتم فضة",
  "سلسلة نسائية",
  "أسورة رجالية",
  "أقراط",
  "دلاية فضة",
];

export async function suggestedSearchProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, 4);
}
