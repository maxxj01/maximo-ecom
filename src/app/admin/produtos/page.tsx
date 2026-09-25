import { getProducts } from "@/lib/api";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <AdminProductsTable initialProducts={products} />;
}
