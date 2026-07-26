import { Banner } from "@/types";

export const banners: Banner[] = [
  {
    id: "1",
    title: "مجموعة الفضة الفاخرة",
    subtitle: "اكتشف أحدث تصاميم المجوهرات الفضية المصنوعة يدوياً",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=800&fit=crop",
    ctaText: "تسوق الآن",
    ctaLink: "/products",
  },
  {
    id: "2",
    title: "عروض خاصة",
    subtitle: "خصم يصل إلى 30% على مجموعة الخواتم الفضية",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&h=800&fit=crop",
    ctaText: "تسوق الآن",
    ctaLink: "/products?category=rings",
  },
  {
    id: "3",
    title: "وصل حديثاً",
    subtitle: "تشكيلة جديدة من الأساور والسلاسل الفضية",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&h=800&fit=crop",
    ctaText: "اكتشف المزيد",
    ctaLink: "/products?sort=newest",
  },
];
