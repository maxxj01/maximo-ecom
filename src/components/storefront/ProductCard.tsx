"use client";

import Image from "next/image";
import { Check, Copy, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatBRL, maskId } from "@/lib/formatters";
import { useCart } from "@/lib/cart-context";

const MAX_VISIBLE_ATTRIBUTES = 3;

function copyCode(code: string) {
  navigator.clipboard
    .writeText(code)
    .then(() => toast.success("Código copiado!"))
    .catch(() => toast.error("Não foi possível copiar o código."));
}

export function ProductCard({
  product,
  layout = "grid",
  onQuickOrder,
}: {
  product: Product;
  layout?: "grid" | "list";
  onQuickOrder: (product: Product) => void;
}) {
  const { addToCart } = useCart();
  const isSoldOut = product.status === "esgotado";
  const visibleAttributes = product.attributes.slice(0, MAX_VISIBLE_ATTRIBUTES);

  const handleMainCta = () => {
    if (isSoldOut) return;
    if (product.ctaType === "link" && product.ctaUrl) {
      window.open(product.ctaUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onQuickOrder(product);
  };

  const image = (
    <div
      className={
        layout === "grid"
          ? "relative aspect-square w-full overflow-hidden rounded-t-lg bg-bg-subtle"
          : "relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-bg-subtle"
      }
    >
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        sizes={layout === "grid" ? "(min-width: 900px) 25vw, 50vw" : "112px"}
        className={`object-cover ${isSoldOut ? "opacity-50 grayscale" : ""}`}
      />
      <span className="absolute left-2 top-2 rounded-full bg-bg/90 px-2 py-0.5 text-[11px] font-semibold text-purple shadow-sm">
        {product.category}
      </span>
      {isSoldOut && (
        <span className="absolute right-2 top-2 rounded-full bg-red px-2 py-0.5 text-[11px] font-semibold text-white">
          Esgotado
        </span>
      )}
    </div>
  );

  const body = (
    <div className={layout === "grid" ? "flex flex-1 flex-col gap-3 p-4" : "flex flex-1 flex-col gap-2 py-1"}>
      <h3 className="text-base font-bold leading-snug text-text">{product.title}</h3>

      {visibleAttributes.length > 0 && (
        <ul className="space-y-1">
          {visibleAttributes.map((attr) => (
            <li key={attr.label} className="flex items-center gap-1.5 text-xs text-text-muted">
              <Check size={14} className="shrink-0 text-green" />
              <span className="font-medium text-text">{attr.label}:</span> {attr.value}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => copyCode(product.code)}
        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-2 py-1 font-mono text-xs text-text-muted hover:text-text"
      >
        {maskId(product.code)}
        <Copy size={12} />
      </button>

      <div className="mt-auto flex flex-col gap-3 pt-1">
        <div>
          <div className="text-lg font-extrabold text-text">{formatBRL(product.price)}</div>
          {product.planPrice != null && (
            <div className="text-xs font-semibold text-purple">
              Com plano: {formatBRL(product.planPrice)}
            </div>
          )}
          {!isSoldOut && product.caption && (
            <div className="mt-1 text-xs font-medium text-purple">{product.caption}</div>
          )}
          {!isSoldOut && (
            <div className="mt-1 text-xs text-text-muted">Cartão de crédito ou PIX</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {product.ctaType === "order" && (
            <button
              type="button"
              aria-label="Adicionar ao carrinho"
              disabled={isSoldOut}
              onClick={() => {
                if (isSoldOut) return;
                addToCart(product, "normal");
                toast.success(`${product.title} adicionado ao carrinho`);
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text hover:bg-lilac-light/60 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          )}
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleMainCta}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-purple px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-purple/25 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple/35 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted disabled:opacity-100 disabled:shadow-none"
          >
            {product.ctaType === "link" && <ExternalLink size={14} />}
            {isSoldOut ? "Esgotado" : product.ctaLabel || "Pedir"}
          </button>
        </div>
      </div>
    </div>
  );

  if (layout === "list") {
    return (
      <div className="flex gap-4 rounded-lg border border-border bg-bg p-3 shadow-sm transition-shadow hover:shadow-md">
        {image}
        {body}
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple hover:shadow-lg hover:shadow-purple/30">
      {image}
      {body}

      {/* Visão rápida: revela por cima do card no hover (desktop only —
          :hover não dispara em touch, então no celular o card fica normal). */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between rounded-lg border border-purple/40 bg-bg/97 p-5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        <span className="absolute left-2.5 top-2.5 h-3 w-3 border-l-2 border-t-2 border-purple" />
        <span className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b-2 border-r-2 border-purple" />

        <div className="overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wide text-purple">Visão rápida</div>
          <h4 className="mt-1 text-base font-extrabold leading-snug text-text">{product.title}</h4>

          {product.caption && (
            <>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                Sobre o produto
              </div>
              <p className="mt-1 text-sm text-text-muted">{product.caption}</p>
            </>
          )}

          {visibleAttributes.length > 0 && (
            <>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                O que está incluso
              </div>
              <ul className="mt-1 space-y-1">
                {visibleAttributes.map((attr) => (
                  <li key={attr.label} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Check size={14} className="shrink-0 text-green" />
                    <span className="font-medium text-text">{attr.label}:</span> {attr.value}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleMainCta}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-purple px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-purple/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted disabled:opacity-100 disabled:shadow-none"
        >
          {product.ctaType === "link" && <ExternalLink size={14} />}
          {isSoldOut ? "Esgotado" : product.ctaLabel || "Pedir"}
        </button>
      </div>
    </div>
  );
}
