import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "خاتم فضة عيار 925 بتصميم كلاسيكي",
    slug: "classic-silver-ring-925",
    price: 45000,
    originalPrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop",
    ],
    categoryId: "rings",
    subCategoryId: "men-rings",
    rating: 4.8,
    reviewCount: 124,
    description:
      "خاتم فضة عيار 925 مصنوع يدوياً بتصميم كلاسيكي أنيق. يتميز بجودة عالية ولمعة دائمة تناسب جميع المناسبات.",
    specifications: {
      material: "فضة 925",
      category: "خواتم",
      gender: "رجالي",
      weight: "8 جرام",
    },
    sizes: ["7", "8", "9", "10", "11"],
    inStock: true,
    stockCount: 15,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "سلسلة فضة بتعليقة قلب",
    slug: "silver-heart-pendant-chain",
    price: 75000,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
    ],
    categoryId: "chains",
    subCategoryId: "women-chains",
    rating: 4.9,
    reviewCount: 89,
    description:
      "سلسلة فضة عيار 925 مع تعليقة على شكل قلب مرصعة بأحجار الزركونيا. هدية مثالية للمناسبات الخاصة.",
    specifications: {
      material: "فضة 925",
      category: "سلاسل",
      gender: "نسائي",
      weight: "12 جرام",
    },
    inStock: true,
    stockCount: 20,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "3",
    name: "أسورة فضة مضفرة",
    slug: "braided-silver-bracelet",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    categoryId: "bracelets",
    subCategoryId: "men-bracelets",
    rating: 4.6,
    reviewCount: 67,
    description:
      "أسورة فضة عيار 925 بتصميم مضفر يدوياً. قطعة فريدة تعكس الأناقة والذوق الرفيع.",
    specifications: {
      material: "فضة 925",
      category: "أساور",
      gender: "رجالي",
      weight: "15 جرام",
    },
    sizes: ["S", "M", "L"],
    inStock: true,
    stockCount: 10,
    isBestSeller: true,
  },
  {
    id: "4",
    name: "أقراط فضة بتصميم زهري",
    slug: "floral-silver-earrings",
    price: 28000,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611652028919-3afe8d2f4f1b?w=800&h=800&fit=crop",
    ],
    categoryId: "earrings",
    subCategoryId: "women-earrings",
    rating: 4.7,
    reviewCount: 45,
    description:
      "أقراط فضة عيار 925 بتصميم زهري راقٍ. خفيفة الوزن ومريحة للارتداء اليومي.",
    specifications: {
      material: "فضة 925",
      category: "أقراط",
      gender: "نسائي",
      weight: "4 جرام",
    },
    inStock: true,
    stockCount: 25,
    isNew: true,
  },
  {
    id: "5",
    name: "دلاية فضة بتصميم هلال",
    slug: "crescent-silver-pendant",
    price: 42000,
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    ],
    categoryId: "chains",
    subCategoryId: "men-pendants",
    rating: 4.5,
    reviewCount: 38,
    description:
      "دلاية فضة عيار 925 على شكل هلال مع نقش عربي تقليدي. قطعة فنية تجمع بين الأصالة والحداثة.",
    specifications: {
      material: "فضة 925",
      category: "دلايات",
      gender: "رجالي",
      weight: "10 جرام",
    },
    inStock: true,
    stockCount: 12,
  },
  {
    id: "6",
    name: "خاتم فضة مرصع بالزركونيا",
    slug: "zirconia-silver-ring",
    price: 65000,
    originalPrice: 80000,
    images: [
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    ],
    categoryId: "rings",
    subCategoryId: "women-rings",
    rating: 4.9,
    reviewCount: 156,
    description:
      "خاتم فضة عيار 925 مرصع بالزركونيا عالية الجودة. يضيف لمسة من الفخامة لأي إطلالة.",
    specifications: {
      material: "فضة 925",
      category: "خواتم",
      gender: "نسائي",
      weight: "6 جرام",
    },
    sizes: ["5", "6", "7", "8", "9"],
    inStock: true,
    stockCount: 18,
    isBestSeller: true,
  },
  {
    id: "7",
    name: "سلسلة فضة رجالية سميكة",
    slug: "thick-mens-silver-chain",
    price: 95000,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    ],
    categoryId: "chains",
    subCategoryId: "men-chains",
    rating: 4.8,
    reviewCount: 92,
    description:
      "سلسلة فضة عيار 925 رجالية بسمك 5 مم. تصميم جريء وأنيق يناسب محبي المظهر القوي.",
    specifications: {
      material: "فضة 925",
      category: "سلاسل",
      gender: "رجالي",
      weight: "35 جرام",
    },
    sizes: ["50 سم", "55 سم", "60 سم"],
    inStock: true,
    stockCount: 8,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "8",
    name: "أسورة فضة نسائية رفيعة",
    slug: "thin-womens-silver-bracelet",
    price: 32000,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
    ],
    categoryId: "bracelets",
    subCategoryId: "women-bracelets",
    rating: 4.6,
    reviewCount: 54,
    description:
      "أسورة فضة عيار 925 رفيعة وأنيقة مع قفل آمن. مثالية للارتداء اليومي أو المناسبات.",
    specifications: {
      material: "فضة 925",
      category: "أساور",
      gender: "نسائي",
      weight: "8 جرام",
    },
    inStock: true,
    stockCount: 22,
    isNew: true,
  },
  {
    id: "9",
    name: "أقراط فضة طويلة",
    slug: "long-silver-earrings",
    price: 38000,
    images: [
      "https://images.unsplash.com/photo-1611652028919-3afe8d2f4f1b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    categoryId: "earrings",
    subCategoryId: "women-earrings",
    rating: 4.4,
    reviewCount: 31,
    description:
      "أقراط فضة عيار 925 طويلة بتصميم عصري. تضيف لمسة من الأناقة للإطلالات المسائية.",
    specifications: {
      material: "فضة 925",
      category: "أقراط",
      gender: "نسائي",
      weight: "6 جرام",
    },
    inStock: true,
    stockCount: 14,
  },
  {
    id: "10",
    name: "خاتم فضة رجالي كلاسيك",
    slug: "signet-mens-silver-ring",
    price: 55000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&h=800&fit=crop",
    ],
    categoryId: "rings",
    subCategoryId: "men-rings",
    rating: 4.7,
    reviewCount: 78,
    description:
      "خاتم فضة عيار 925 بتصميم كلاسيكي أنيق. رمز للأناقة والرجولة.",
    specifications: {
      material: "فضة 925",
      category: "خواتم",
      gender: "رجالي",
      weight: "12 جرام",
    },
    sizes: ["8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 11,
    isBestSeller: true,
  },
  {
    id: "11",
    name: "طقم فضة (سلسلة + أقراط)",
    slug: "silver-necklace-earrings-set",
    price: 120000,
    originalPrice: 150000,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    ],
    categoryId: "chains",
    subCategoryId: "women-chains",
    rating: 5.0,
    reviewCount: 42,
    description:
      "طقم فضة عيار 925 يتضمن سلسلة وأقراط متناسقة. مثالي للهدايا والمناسبات الخاصة.",
    specifications: {
      material: "فضة 925",
      category: "أطقم",
      gender: "نسائي",
      weight: "25 جرام",
    },
    inStock: true,
    stockCount: 6,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "12",
    name: "أسورة فضة بتعليقات",
    slug: "charm-silver-bracelet",
    price: 48000,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
    ],
    categoryId: "bracelets",
    subCategoryId: "women-bracelets",
    rating: 4.8,
    reviewCount: 63,
    description:
      "أسورة فضة عيار 925 مع تعليقات متعددة قابلة للتخصيص. قطعة فريدة تعبر عن شخصيتك.",
    specifications: {
      material: "فضة 925",
      category: "أساور",
      gender: "نسائي",
      weight: "18 جرام",
    },
    inStock: false,
    stockCount: 0,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBestSellers(limit = 6): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export const recentSearches = [
  "خاتم فضة",
  "سلسلة نسائية",
  "أسورة رجالية",
  "أقراط",
  "دلاية فضة",
];

export const suggestedSearchProducts = products.slice(0, 4);
