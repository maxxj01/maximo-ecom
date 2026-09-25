"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Order } from "@/lib/types";
import { formatBRL, formatDate } from "@/lib/formatters";
import { updateOrderStatusAction } from "@/lib/actions";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

const STATUS_LABEL: Record<Order["status"], string> = {
  novo: "Novo",
  andamento: "Em andamento",
  concluido: "Concluído",
};

export function AdminOrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [syncedInitialOrders, setSyncedInitialOrders] = useState(initialOrders);

  // Adjusted during render (not in an effect) — see the same comment in
  // AdminProductsTable.tsx.
  if (initialOrders !== syncedInitialOrders) {
    setSyncedInitialOrders(initialOrders);
    setOrders(initialOrders);
  }

  const stats = useMemo(
    () => ({
      total: orders.length,
      novos: orders.filter((o) => o.status === "novo").length,
      andamento: orders.filter((o) => o.status === "andamento").length,
      concluidos: orders.filter((o) => o.status === "concluido").length,
    }),
    [orders]
  );

  const handleStatusChange = async (order: Order, status: Order["status"]) => {
    const previous = order.status;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await updateOrderStatusAction(order.id, status);
      router.refresh();
    } catch {
      toast.error("Não foi possível atualizar o status.");
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: previous } : o)));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 min-[900px]:px-6">
      <div className="mb-6 grid grid-cols-2 gap-3 min-[560px]:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Novos" value={stats.novos} />
        <StatCard label="Em andamento" value={stats.andamento} />
        <StatCard label="Concluídos" value={stats.concluidos} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border align-top last:border-0">
                <td className="px-4 py-3">
                  <div className="font-semibold">{order.buyerName}</div>
                  <div className="text-xs text-text-muted">{order.buyerContact}</div>
                  {order.note && <div className="mt-1 text-xs italic text-text-muted">“{order.note}”</div>}
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-0.5 text-xs text-text-muted">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.qty}x {item.title}
                        {item.priceOption === "plan" ? " (com plano)" : ""}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-semibold">{formatBRL(order.total)}</td>
                <td className="px-4 py-3 text-text-muted">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as Order["status"])}
                    className="rounded-md border border-border bg-bg px-2 py-1.5 text-xs font-semibold outline-none focus:border-purple"
                  >
                    {(Object.keys(STATUS_LABEL) as Order["status"][]).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                  Nenhum pedido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
