"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBRL } from "@/lib/formatters";
import { OrderModal } from "./OrderModal";

export function CartDrawer() {
  const { lines, total, isOpen, closeCart, setQty, removeFromCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={closeCart}
        className="absolute inset-0 bg-black/40"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-bg shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">Carrinho</h2>
          <button
            type="button"
            aria-label="Fechar carrinho"
            onClick={closeCart}
            className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.priceOption}`} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-bg-subtle">
                    <Image src={line.imageUrl} alt={line.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="text-sm font-semibold leading-snug">{line.title}</div>
                    {line.priceOption === "plan" && (
                      <span className="w-fit rounded-full bg-lilac-light px-2 py-0.5 text-[10px] font-semibold text-purple">
                        Com plano
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-border px-1">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          onClick={() => setQty(line.productId, line.priceOption, line.qty - 1)}
                          className="p-1.5 text-text-muted hover:text-text"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          onClick={() => setQty(line.productId, line.priceOption, line.qty + 1)}
                          className="p-1.5 text-text-muted hover:text-text"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">{formatBRL(line.unitPrice * line.qty)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remover item"
                    onClick={() => removeFromCart(line.productId, line.priceOption)}
                    className="h-fit rounded-md p-1.5 text-text-muted hover:text-red"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0}
            onClick={() => setCheckoutOpen(true)}
            className="w-full rounded-full bg-purple px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar pedido
          </button>
        </div>
      </aside>

      {checkoutOpen && (
        <OrderModal mode="cart" onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
}
