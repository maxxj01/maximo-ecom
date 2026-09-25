import { getProducts } from "@/lib/api";
import { Hero } from "@/components/layout/Hero";
import { Storefront } from "@/components/storefront/Storefront";
import { FAQSection } from "@/components/storefront/FAQSection";

export default async function Page() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <Storefront initialProducts={products} />
      <FAQSection />
    </>
  );
}
