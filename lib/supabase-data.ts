import { supabase } from './supabase';
import { Product as LocalProduct, Category as LocalCategory, Banner as LocalBanner, Governorate as LocalGovernorate } from '@/types';

interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at: string;
}

interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  images: string[];
  category_id: string | null;
  sub_category_id: string | null;
  description: string | null;
  specifications: Record<string, any>;
  sizes: string[] | null;
  in_stock: boolean | null;
  stock_count: number | null;
  is_new: boolean | null;
  is_best_seller: boolean | null;
  created_at: string;
}

interface SupabaseBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta_text: string;
  cta_link: string;
  created_at: string;
  order_index?: number;
}

interface SupabaseGovernorate {
  id: string;
  name: string;
  cities: string[];
  created_at: string;
}

function transformCategory(supabaseCategory: SupabaseCategory): LocalCategory {
  return {
    id: supabaseCategory.id,
    name: supabaseCategory.name,
    slug: supabaseCategory.slug,
    image: supabaseCategory.image,
    subCategories: [],
  };
}

function transformProduct(supabaseProduct: SupabaseProduct): LocalProduct {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    slug: supabaseProduct.slug,
    price: supabaseProduct.price,
    originalPrice: supabaseProduct.original_price || undefined,
    images: supabaseProduct.images,
    categoryId: supabaseProduct.category_id || '',
    subCategoryId: supabaseProduct.sub_category_id || undefined,
    description: supabaseProduct.description || '',
    specifications: {
      material: supabaseProduct.specifications?.material || 'فضة 925',
      category: supabaseProduct.specifications?.category || 'مجوهرات',
      gender: supabaseProduct.specifications?.gender || 'غير محدد',
      weight: supabaseProduct.specifications?.weight,
    },
    sizes: supabaseProduct.sizes || [],
    inStock: supabaseProduct.in_stock ?? true,
    stockCount: supabaseProduct.stock_count || 0,
    isNew: supabaseProduct.is_new || false,
    isBestSeller: supabaseProduct.is_best_seller || false,
    rating: 0,
    reviewCount: 0,
  };
}

function transformBanner(supabaseBanner: SupabaseBanner): LocalBanner {
  return {
    id: supabaseBanner.id,
    title: supabaseBanner.title,
    subtitle: supabaseBanner.subtitle,
    image: supabaseBanner.image,
    ctaText: supabaseBanner.cta_text,
    ctaLink: supabaseBanner.cta_link,
    orderIndex: supabaseBanner.order_index ?? 0,
  };
}

function transformGovernorate(supabaseGovernorate: SupabaseGovernorate): LocalGovernorate {
  return {
    id: supabaseGovernorate.id,
    name: supabaseGovernorate.name,
    cities: supabaseGovernorate.cities,
  };
}

export async function getCategories(): Promise<LocalCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return (data || []).map(transformCategory);
}

export async function getCategoryBySlug(slug: string): Promise<LocalCategory | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return transformCategory(data);
}

export async function getCategoryById(id: string): Promise<LocalCategory | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return transformCategory(data);
}

export async function getProducts(): Promise<LocalProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data || []).map(transformProduct);
}

export async function getProductBySlug(slug: string): Promise<LocalProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return transformProduct(data);
}

export async function getProductById(id: string): Promise<LocalProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return transformProduct(data);
}

export async function getProductsByCategory(categorySlug: string): Promise<LocalProduct[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
  return (data || []).map(transformProduct);
}

export async function getBestSellers(limit = 6): Promise<LocalProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
  return (data || []).map(transformProduct);
}

export async function getNewArrivals(limit = 8): Promise<LocalProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
  return (data || []).map(transformProduct);
}

export async function getBanners(): Promise<LocalBanner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
  return (data || []).map(transformBanner);
}

export async function getGovernorates(): Promise<LocalGovernorate[]> {
  const { data, error } = await supabase
    .from('governorates')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching governorates:', error);
    return [];
  }
  return (data || []).map(transformGovernorate);
}

export async function getGovernorateById(id: string): Promise<LocalGovernorate | null> {
  const { data, error } = await supabase
    .from('governorates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return transformGovernorate(data);
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export async function getAppSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return fallback;
  return data.value as T;
}
