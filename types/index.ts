export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSpecifications {
  material: string;
  category: string;
  gender: string;
  weight?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  subCategoryId?: string;
  rating: number;
  reviewCount: number;
  description: string;
  specifications: ProductSpecifications;
  sizes?: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: "cod";
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";
export type ViewMode = "grid" | "list";

export interface Governorate {
  id: string;
  name: string;
  cities: string[];
}
