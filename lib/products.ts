import { Product, SortOption } from "@/types";

export function filterProducts(
  products: Product[],
  options: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
  }
): Product[] {
  return products.filter((product) => {
    if (options.categoryId) {
      if (options.categoryId === "men") {
        const isMen =
          product.specifications.gender === "رجالي" ||
          product.subCategoryId?.startsWith("men-");
        if (!isMen) return false;
      } else if (options.categoryId === "women") {
        const isWomen =
          product.specifications.gender === "نسائي" ||
          product.subCategoryId?.startsWith("women-");
        if (!isWomen) return false;
      } else if (product.categoryId !== options.categoryId) {
        return false;
      }
    }
    if (
      options.subCategoryId &&
      product.subCategoryId !== options.subCategoryId
    ) {
      return false;
    }
    if (options.search) {
      const query = options.search.toLowerCase();
      if (!product.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (options.minPrice !== undefined && product.price < options.minPrice) {
      return false;
    }
    if (options.maxPrice !== undefined && product.price > options.maxPrice) {
      return false;
    }
    if (options.inStockOnly && !product.inStock) {
      return false;
    }
    return true;
  });
}

export function sortProducts(
  products: Product[],
  sort: SortOption
): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
    default:
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }
}

export function paginateProducts<T>(
  items: T[],
  page: number,
  perPage: number
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const start = (page - 1) * perPage;
  const paginatedItems = items.slice(start, start + perPage);
  return { items: paginatedItems, totalPages, totalItems };
}

export function getRelatedProducts(
  products: Product[],
  currentProduct: Product,
  limit = 4
): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.categoryId === currentProduct.categoryId ||
          p.subCategoryId === currentProduct.subCategoryId)
    )
    .slice(0, limit);
}
