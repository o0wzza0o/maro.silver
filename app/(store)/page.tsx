import { HeroSlider } from "@/components/home/hero-slider";
import { CategoriesSection } from "@/components/home/categories-section";
import { ProductSection } from "@/components/home/product-section";
import { getCategories } from "@/data/categories";
import { getBestSellers, getNewArrivals } from "@/data/products";
import { getAppSetting } from "@/lib/supabase-data";
import { PageTransition } from "@/components/layout/animations";

export default async function HomePage() {
  const [categories, bestSellers, newArrivals, homeOrderIds] = await Promise.all([
    getCategories(),
    getBestSellers(),
    getNewArrivals(),
    getAppSetting<string[]>("home_category_order", []),
  ]);

  // Apply admin-configured order; fall back to first 6
  const orderedHomeCategories = homeOrderIds.length > 0
    ? homeOrderIds.map(id => categories.find(c => c.id === id)).filter(Boolean) as typeof categories
    : categories.slice(0, 6);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <HeroSlider />
      </div>

      <CategoriesSection categories={orderedHomeCategories} />

      <ProductSection
        title="الأكثر مبيعاً"
        products={bestSellers}
        viewAllHref="/products?sort=popular"
        horizontal
      />

      <div className="bg-secondary/50">
        <ProductSection
          title="وصل حديثاً"
          products={newArrivals}
          viewAllHref="/products?sort=newest"
          horizontal
        />
      </div>
    </PageTransition>
  );
}
