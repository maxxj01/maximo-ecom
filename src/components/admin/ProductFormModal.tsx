"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Plus, Trash2, Upload } from "lucide-react";
import type { Attribute, Product } from "@/lib/types";
import { createProductAction, updateProductAction } from "@/lib/actions";
import { ProductCard } from "@/components/storefront/ProductCard";

type FormState = {
  category: string;
  title: string;
  code: string;
  attributes: Attribute[];
  price: string;
  planPrice: string;
  caption: string;
  status: Product["status"];
  visible: boolean;
  imageUrl: string;
  ctaLabel: string;
  ctaType: Product["ctaType"];
  ctaUrl: string;
};

function toFormState(values?: Partial<Product>): FormState {
  return {
    category: values?.category ?? "",
    title: values?.title ?? "",
    code: values?.code ?? "",
    attributes: values?.attributes?.length ? values.attributes : [{ label: "", value: "" }],
    price: values?.price != null ? String(values.price) : "",
    planPrice: values?.planPrice != null ? String(values.planPrice) : "",
    caption: values?.caption ?? "",
    status: values?.status ?? "disponivel",
    visible: values?.visible ?? true,
    imageUrl: values?.imageUrl ?? "/placeholder-product.svg",
    ctaLabel: values?.ctaLabel ?? "Pedir",
    ctaType: values?.ctaType ?? "order",
    ctaUrl: values?.ctaUrl ?? "",
  };
}

export function ProductFormModal({
  initialValues,
  editingId,
  existingCategories,
  onClose,
  onSaved,
}: {
  initialValues?: Partial<Product>;
  editingId?: string;
  existingCategories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // TODO: quando o Val Town estiver conectado (src/lib/api.ts), trocar isto
  // por um upload real e usar a URL retornada. Por enquanto a imagem vira
  // uma data URL guardada direto no registro do produto.
  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("imageUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const updateAttribute = (index: number, key: keyof Attribute, value: string) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
    }));
  };

  const addAttribute = () =>
    setForm((prev) => ({ ...prev, attributes: [...prev.attributes, { label: "", value: "" }] }));

  const removeAttribute = (index: number) =>
    setForm((prev) => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));

  const previewProduct: Product = {
    id: editingId ?? "preview",
    category: form.category || "Categoria",
    title: form.title || "Título do produto",
    code: form.code || "000000000",
    attributes: form.attributes.filter((a) => a.label.trim()),
    price: Number(form.price) || 0,
    planPrice: form.planPrice.trim() ? Number(form.planPrice) : null,
    caption: form.caption.trim() || null,
    status: form.status,
    visible: form.visible,
    imageUrl: form.imageUrl,
    ctaLabel: form.ctaLabel || "Pedir",
    ctaType: form.ctaType,
    ctaUrl: form.ctaUrl || undefined,
    createdAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.code.trim() || !form.price.trim()) {
      toast.error("Preencha categoria, título, código e preço.");
      return;
    }
    if (form.ctaType === "link" && !form.ctaUrl.trim()) {
      toast.error("Informe a URL do botão para o tipo 'link'.");
      return;
    }

    const data: Omit<Product, "id" | "createdAt"> = {
      category: form.category.trim(),
      title: form.title.trim(),
      code: form.code.trim(),
      attributes: form.attributes.filter((a) => a.label.trim() && a.value.trim()),
      price: Number(form.price),
      planPrice: form.planPrice.trim() ? Number(form.planPrice) : null,
      caption: form.caption.trim() || null,
      status: form.status,
      visible: form.visible,
      imageUrl: form.imageUrl,
      ctaLabel: form.ctaLabel.trim() || "Pedir",
      ctaType: form.ctaType,
      ctaUrl: form.ctaType === "link" ? form.ctaUrl.trim() : undefined,
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProductAction(editingId, data);
        toast.success("Produto atualizado.");
      } else {
        await createProductAction(data);
        toast.success("Produto criado.");
      }
      onSaved();
      onClose();
    } catch {
      toast.error("Não foi possível salvar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-bg shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">{editingId ? "Editar produto" : "Novo produto"}</h2>
          <button type="button" aria-label="Fechar" onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-lilac-light/60">
            <X size={18} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-5 min-[900px]:grid-cols-[1.3fr_1fr]">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm text-text-muted transition-colors ${
                isDragging ? "border-purple bg-lilac-light/50" : "border-border"
              }`}
            >
              <Upload size={20} />
              Arraste uma imagem aqui ou clique para escolher
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Categoria</label>
                <input
                  list="category-suggestions"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                />
                <datalist id="category-suggestions">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Código</label>
                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm outline-none focus:border-purple"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-muted">Título</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Preço</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Preço com plano</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.planPrice}
                  onChange={(e) => set("planPrice", e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-muted">
                Legenda abaixo do preço
              </label>
              <input
                value={form.caption}
                onChange={(e) => set("caption", e.target.value)}
                placeholder="Opcional — ex: Conta nova verificada sem gastos"
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as Product["status"])}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="esgotado">Esgotado</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => set("visible", e.target.checked)}
                    className="h-4 w-4 accent-purple"
                  />
                  Visível na vitrine
                </label>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold text-text-muted">Características</label>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple"
                >
                  <Plus size={12} /> Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {form.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={attr.label}
                      onChange={(e) => updateAttribute(index, "label", e.target.value)}
                      placeholder="Rótulo"
                      className="w-1/2 rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                    />
                    <input
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, "value", e.target.value)}
                      placeholder="Valor"
                      className="w-1/2 rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                    />
                    <button
                      type="button"
                      aria-label="Remover característica"
                      onClick={() => removeAttribute(index)}
                      className="shrink-0 rounded-md p-2 text-text-muted hover:text-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Texto do botão</label>
                <input
                  value={form.ctaLabel}
                  onChange={(e) => set("ctaLabel", e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Ação do botão</label>
                <select
                  value={form.ctaType}
                  onChange={(e) => set("ctaType", e.target.value as Product["ctaType"])}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                >
                  <option value="order">Pedido interno</option>
                  <option value="link">Link externo</option>
                </select>
              </div>
            </div>

            {form.ctaType === "link" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">URL</label>
                <input
                  value={form.ctaUrl}
                  onChange={(e) => set("ctaUrl", e.target.value)}
                  placeholder="https://wa.me/..."
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-purple"
                />
              </div>
            )}
          </form>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Pré-visualização
            </div>
            <div className="max-w-xs">
              <ProductCard product={previewProduct} layout="grid" onQuickOrder={() => {}} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-lilac-light/60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
