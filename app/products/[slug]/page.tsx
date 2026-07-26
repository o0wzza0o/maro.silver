import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { getRelatedProducts } from "@/lib/products";
import { ProductDetailsView } from "@/components/products/product-details";
import { ProductSection } from "@/components/home/product-section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageTransition } from "@/components/layout/animations";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: `${product.name} | MARO SILVER`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(products, product);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Breadcrumb
          items={[
            { label: "المنتجات", href: "/products" },
            {
              label: product.specifications.category,
              href: `/products?category=${product.categoryId}`,
            },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <ProductDetailsView product={product} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-secondary/50 mt-12">
          <ProductSection
            title="منتجات مشابهة"
            products={relatedProducts}
            horizontal
          />
        </div>
      )}
    </PageTransition>
  );
}
