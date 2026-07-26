import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "men",
    name: "رجالي",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    subCategories: [
      { id: "all-men", name: "الكل", slug: "all" },
      { id: "men-rings", name: "خواتم رجالي", slug: "men-rings" },
      { id: "men-chains", name: "سلاسل رجالي", slug: "men-chains" },
      { id: "men-bracelets", name: "أساور رجالي", slug: "men-bracelets" },
      { id: "men-pendants", name: "دلايات رجالي", slug: "men-pendants" },
    ],
  },
  {
    id: "women",
    name: "نسائي",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    subCategories: [
      { id: "all-women", name: "الكل", slug: "all" },
      { id: "women-rings", name: "خواتم نسائي", slug: "women-rings" },
      { id: "women-chains", name: "سلاسل نسائي", slug: "women-chains" },
      { id: "women-bracelets", name: "أساور نسائي", slug: "women-bracelets" },
      { id: "women-earrings", name: "أقراط نسائي", slug: "women-earrings" },
    ],
  },
  {
    id: "chains",
    name: "سلاسل",
    slug: "chains",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
  },
  {
    id: "rings",
    name: "خواتم",
    slug: "rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
  },
  {
    id: "bracelets",
    name: "أساور",
    slug: "bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
  },
  {
    id: "earrings",
    name: "أقراط",
    slug: "earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
