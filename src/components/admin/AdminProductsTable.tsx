"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Copy, Trash2, Plus, Search } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBRL, maskId } from "@/lib/formatters";
import { deleteProductAction, toggleProductVisibleAction } from "@/lib/actions";
import { ProductFormModal } from "./ProductFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

type ModalState =
  | { open: false }
  | { open: true; editingId?: string; initialValues?: Partial<Product> };

export function AdminProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [syncedInitialProducts, setSyncedInitialProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Re-sync local (optimistically-editable) state when router.refresh() hands
  // down a new initialProducts prop — adjusted during render, not in an
  // effect, per https://react.dev/learn/you-might-not-need-an-effect
  if (initialProducts !== syncedInitialProducts) {
    setSyncedInitialProducts(initialProducts);
    setProducts(initialProducts);
  }

  const stats = useMemo(
    () => ({
      total: products.length,
      disponiveis: products.filter((p) => p.status === "disponivel").length,
      esgotados: products.filter((p) => p.status === "esgotado").length,
      ocultos: products.filter((p) => !p.visible).length,
    }),
    [products]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleToggleVisible = async (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, visible: !p.visible } : p))
    );
    try {
      await toggleProductVisibleAction(product.id, !product.visible);
      router.refresh();
    } catch {
      toast.error("Não foi possível atualizar a visibilidade.");
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, visible: product.visible } : p))
      );
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProductAction(product.id);
      toast.success("Produto excluído.");
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o produto.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 min-[900px]:px-6">
      <div className="mb-6 grid grid-cols-2 gap-3 min-[560px]:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Disponíveis" value={stats.disponiveis} />
        <StatCard label="Esgotados" value={stats.esgotados} />
        <StatCard label="Ocultos" value={stats.ocultos} />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos"
            className="w-full rounded-full border border-border bg-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-purple"
          />
        </div>
        <button
          type="button"
          onClick={() => setModal({ open: true })}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-purple px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Com plano</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Visível</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-bg-subtle">
                      <Image src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold">{product.title}</div>
                      <div className="font-mono text-xs text-text-muted">{maskId(product.code)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{product.category}</td>
                <td className="px-4 py-3">{formatBRL(product.price)}</td>
                <td className="px-4 py-3 text-text-muted">
                  {product.planPrice != null ? formatBRL(product.planPrice) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.status === "disponivel"
                        ? "bg-green/10 text-green"
                        : "bg-red/10 text-red"
                    }`}
                  >
                    {product.status === "disponivel" ? "Disponível" : "Esgotado"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={product.visible}
                    onClick={() => handleToggleVisible(product)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      product.visible ? "bg-purple" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        product.visible ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label="Editar"
                      onClick={() => setModal({ open: true, editingId: product.id, initialValues: product })}
                      className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60 hover:text-text"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Duplicar"
                      onClick={() =>
                        setModal({
                          open: true,
                          initialValues: { ...product, title: `${product.title} (cópia)` },
                        })
                      }
                      className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60 hover:text-text"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Excluir"
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-md p-2 text-text-muted hover:bg-red/10 hover:text-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <ProductFormModal
          editingId={modal.editingId}
          initialValues={modal.initialValues}
          existingCategories={categories}
          onClose={() => setModal({ open: false })}
          onSaved={() => router.refresh()}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir produto"
          description={`Excluir "${deleteTarget.title}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          danger
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
