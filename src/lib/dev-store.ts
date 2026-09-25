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
    title: "Google Ads 3 Linhas",
    code: "GADS-25489931",
    attributes: [],
    price: 199,
    planPrice: null,
    caption: "Conta nova verificada sem gastos",
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Comprar agora",
    ctaType: "order",
    createdAt: "2026-08-02T12:00:00.000Z",
  },
  {
    id: "p2",
    category: "Stripe",
    title: "Stripe Verificada D3",
    code: "STRP-77213840",
    attributes: [],
    price: 0,
    priceOnRequest: true,
    planPrice: null,
    caption: null,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Reservar",
    ctaType: "order",
    createdAt: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "p3",
    category: "Shopify",
    title: "Payments Verificada D5",
    code: "SHOP-10495522",
    attributes: [],
    price: 0,
    priceOnRequest: true,
    planPrice: null,
    caption: "Docs reais e pessoais com tudo correto",
    bestSeller: true,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Reservar",
    ctaType: "order",
    createdAt: "2026-07-28T12:00:00.000Z",
  },
  {
    id: "p4",
    category: "Google Ads",
    title: "Google Ads G2",
    code: "GADS-33081254",
    attributes: [],
    price: 599,
    planPrice: null,
    caption: "Conta verificada aquecida",
    bestSeller: true,
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Comprar agora",
    ctaType: "order",
    createdAt: "2026-09-01T12:00:00.000Z",
  },
  {
    id: "p5",
    category: "Shopify",
    title: "Payments Verificada D7",
    code: "SHOP-70210394",
    attributes: [],
    price: 0,
    priceOnRequest: true,
    planPrice: null,
    caption: "Docs reais e pessoais com tudo correto",
    status: "disponivel",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Reservar",
    ctaType: "order",
    createdAt: "2026-09-20T12:00:00.000Z",
  },
  {
    id: "p6",
    category: "Shopify",
    title: "Payments Verificada D3",
    code: "SHOP-30938471",
    attributes: [],
    price: 0,
    priceOnRequest: true,
    planPrice: null,
    caption: "Docs reais e pessoais com tudo correto",
    bestSeller: true,
    status: "esgotado",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Reservar",
    ctaType: "order",
    createdAt: "2026-09-20T12:00:00.000Z",
  },
  {
    id: "p7",
    category: "Shopify",
    title: "Payments Verificada D2",
    code: "SHOP-20938472",
    attributes: [],
    price: 0,
    priceOnRequest: true,
    planPrice: null,
    caption: "Docs reais e pessoais com tudo correto",
    status: "esgotado",
    visible: true,
    imageUrl: "/placeholder-product.svg",
    ctaLabel: "Reservar",
    ctaType: "order",
    createdAt: "2026-09-20T12:00:00.000Z",
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
