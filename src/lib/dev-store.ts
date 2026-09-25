import type { Order, Product } from "./types";

/**
 * TEMPORARY in-memory store — used ONLY while VALTOWN_API_URL is not set.
 * Resets on every server restart, not shared across instances. This exists
 * purely so the storefront/admin UI can be clicked through before the real
 * Val Town backend (lib/api.ts) is wired up. Delete this whole file once
 * VALTOWN_API_URL + VALTOWN_API_KEY are configured — lib/api.ts stops
 * importing it automatically at that point.
 */

let products: Product[] = [
  {
    id: "p1",
    category: "Google Ads",
    title: "Conta Google Ads Premium",
    code: "GADS-25489931",
    attributes: [
      { label: "Limite de gasto", value: "Alto" },
      { label: "Verificação", value: "Aprovada" },
      { label: "Garantia", value: "30 dias" },
    ],
    price: 39.9,
    planPrice: 29.9,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Pedir",
    ctaType: "order",
    createdAt: "2026-08-02T12:00:00.000Z",
  },
  {
    id: "p2",
    category: "Stripe",
    title: "Conta Stripe Verificada",
    code: "STRP-77213840",
    attributes: [
      { label: "Verificação", value: "KYC completo" },
      { label: "Países suportados", value: "Global" },
      { label: "Garantia", value: "15 dias" },
    ],
    price: 59.9,
    planPrice: null,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Pedir",
    ctaType: "order",
    createdAt: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "p3",
    category: "Payments",
    title: "Conta Payments Premium",
    code: "PAY-10495522",
    attributes: [
      { label: "Processamento", value: "Alto volume" },
      { label: "Aprovação", value: "Imediata" },
      { label: "Garantia", value: "30 dias" },
    ],
    price: 49.9,
    planPrice: 34.9,
    status: "esgotado",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Pedir",
    ctaType: "order",
    createdAt: "2026-07-28T12:00:00.000Z",
  },
  {
    id: "p4",
    category: "Google Ads",
    title: "Conta Google Ads Agência",
    code: "GADS-33081254",
    attributes: [
      { label: "Limite de gasto", value: "Alto (agência)" },
      { label: "Contas gerenciadas", value: "Múltiplas" },
    ],
    price: 19.9,
    planPrice: 14.9,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Falar no WhatsApp",
    ctaType: "link",
    ctaUrl: "https://wa.me/5587981738048",
    createdAt: "2026-09-01T12:00:00.000Z",
  },
];

let orders: Order[] = [];

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 120));
}

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const devStore = {
  async getProducts(): Promise<Product[]> {
    return delay([...products]);
  },
  async getProduct(id: string): Promise<Product | null> {
    return delay(products.find((p) => p.id === id) ?? null);
  },
  async createProduct(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const product: Product = {
      ...data,
      id: newId("p"),
      createdAt: new Date().toISOString(),
    };
    products = [product, ...products];
    return delay(product);
  },
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    let updated: Product | undefined;
    products = products.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, ...data, id: p.id, createdAt: p.createdAt };
      return updated;
    });
    if (!updated) throw new Error(`Produto ${id} não encontrado`);
    return delay(updated);
  },
  async deleteProduct(id: string): Promise<void> {
    products = products.filter((p) => p.id !== id);
    return delay(undefined);
  },
  async getOrders(): Promise<Order[]> {
    return delay([...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
  async createOrder(data: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
    const order: Order = {
      ...data,
      id: newId("o"),
      status: "novo",
      createdAt: new Date().toISOString(),
    };
    orders = [order, ...orders];
    return delay(order);
  },
  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    let updated: Order | undefined;
    orders = orders.map((o) => {
      if (o.id !== id) return o;
      updated = { ...o, status };
      return updated;
    });
    if (!updated) throw new Error(`Pedido ${id} não encontrado`);
    return delay(updated);
  },
};
