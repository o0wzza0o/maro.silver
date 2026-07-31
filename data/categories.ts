import { Category } from "@/types";
import { getCategories as fetchCategories, getCategoryBySlug as fetchCategoryBySlug, getCategoryById as fetchCategoryById } from "@/lib/supabase-data";

// Cache for client-side
let categoriesCache: Category[] | null = null;

export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;
  categoriesCache = await fetchCategories();
  return categoriesCache;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return await fetchCategoryBySlug(slug) || undefined;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return await fetchCategoryById(id) || undefined;
}
