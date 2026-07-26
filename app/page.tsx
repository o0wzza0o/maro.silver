import { HeroSlider } from "@/components/home/hero-slider";
import { CategoriesSection } from "@/components/home/categories-section";
import { ProductSection } from "@/components/home/product-section";
import { categories } from "@/data/categories";
import { getBestSellers, getNewArrivals } from "@/data/products";
import { PageTransition } from "@/components/layout/animations";

export default function HomePage() {
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <HeroSlider />
      </div>

      <CategoriesSection categories={categories} />

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
