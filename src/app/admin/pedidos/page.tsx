import { getOrders } from "@/lib/api";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersTable initialOrders={orders} />;
}
