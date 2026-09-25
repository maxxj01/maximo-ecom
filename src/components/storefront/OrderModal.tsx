"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Product, OrderItem } from "@/lib/types";
import { formatBRL } from "@/lib/formatters";
import { useCart } from "@/lib/cart-context";
import { createOrderAction } from "@/lib/actions";

type Props =
  | { mode: "quick"; product: Product; onClose: () => void }
  | { mode: "cart"; onClose: () => void };

export function OrderModal(props: Props) {
  const { onClose } = props;
  const cart = useCart();
  const [priceOption, setPriceOption] = useState<"normal" | "plan">("normal");
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items: OrderItem[] =
    props.mode === "quick"
      ? [
          {
            productId: props.product.id,
            title: props.product.title,
            priceOption,
            unitPrice:
              priceOption === "plan" && props.product.planPrice != null
                ? props.product.planPrice
                : props.product.price,
            qty: 1,
          },
        ]
      : cart.lines.map((line) => ({
          productId: line.productId,
          title: line.title,
          priceOption: line.priceOption,
          unitPrice: line.unitPrice,
          qty: line.qty,
        }));

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerContact.trim()) {
      toast.error("Preencha nome e contato.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createOrderAction({
        items,
        total,
        buyerName: buyerName.trim(),
        buyerContact: buyerContact.trim(),
        note: note.trim() || undefined,
      });
      toast.success("Pedido enviado! Vamos entrar em contato em breve.");
      if (props.mode === "cart") {
        cart.clearCart();
        cart.closeCart();
      }
      onClose();
    } catch {
      toast.error("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative w-full max-w-md rounded-lg border border-border bg-bg p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {props.mode === "quick" ? "Pedir" : "Finalizar pedido"}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-lilac-light/60"
          >
            <X size={18} />
          </button>
        </div>

        {props.mode === "quick" && (
          <div className="mb-4">
            <div className="mb-2 text-sm font-semibold">{props.product.title}</div>
            {props.product.planPrice != null ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriceOption("normal")}
                  className={`rounded-md border px-3 py-2 text-left text-sm ${
                    priceOption === "normal" ? "border-purple bg-lilac-light" : "border-border"
                  }`}
                >
                  <div className="font-semibold">Normal</div>
                  <div>{formatBRL(props.product.price)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPriceOption("plan")}
                  className={`rounded-md border px-3 py-2 text-left text-sm ${
                    priceOption === "plan" ? "border-purple bg-lilac-light" : "border-border"
                  }`}
                >
                  <div className="font-semibold">Com plano</div>
                  <div>{formatBRL(props.product.planPrice)}</div>
                </button>
              </div>
            ) : (
              <div className="text-sm text-text-muted">{formatBRL(props.product.price)}</div>
            )}
          </div>
        )}

        {props.mode === "cart" && (
          <ul className="mb-4 max-h-40 space-y-1 overflow-y-auto rounded-md bg-bg-subtle p-3 text-sm">
            {items.map((item) => (
              <li key={`${item.productId}-${item.priceOption}`} className="flex justify-between">
                <span>
                  {item.qty}x {item.title}
                  {item.priceOption === "plan" ? " (com plano)" : ""}
                </span>
                <span className="font-medium">{formatBRL(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-4 flex justify-between text-sm font-bold">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">Nome</label>
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">
              Contato (WhatsApp, e-mail...)
            </label>
            <input
              value={buyerContact}
              onChange={(e) => setBuyerContact(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-muted">
              Observação (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-purple px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Enviar pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
