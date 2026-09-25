import "server-only";
import type { Order, Product } from "./types";
import { devStore } from "./dev-store";

/**
 * Data layer — backed by a Val Town HTTP API (val.town: SQLite + HTTP vals).
 *
 * TODO: connect to Val Town.
 *   1. Create a val exposing REST-ish endpoints for products/orders
 *      (GET/POST /products, PATCH/DELETE /products/:id, GET/POST /orders,
 *      PATCH /orders/:id) backed by Val Town's SQLite storage.
 *   2. Set VALTOWN_API_URL (e.g. https://your-user-yourval.web.val.run) and
 *      VALTOWN_API_KEY in .env.local (see .env.example).
 *   3. Once VALTOWN_API_URL is set, every function below calls the real API
 *      instead of the temporary in-memory dev store (src/lib/dev-store.ts) —
 *      no call-site changes needed. Delete dev-store.ts when it's no longer
 *      referenced anywhere.
 *
 * Until then, all functions fall back to the dev store so the UI has
 * something to render.
 */

const VALTOWN_API_URL = process.env.VALTOWN_API_URL;
const VALTOWN_API_KEY = process.env.VALTOWN_API_KEY;

let warnedFallback = false;
function warnFallbackOnce() {
  if (warnedFallback) return;
  warnedFallback = true;
  console.warn(
    "[lib/api] VALTOWN_API_URL não configurada — usando o dev-store temporário em memória. " +
      "Veja o TODO em src/lib/api.ts para conectar o backend real no Val Town."
  );
}

async function valtownFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${VALTOWN_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(VALTOWN_API_KEY ? { Authorization: `Bearer ${VALTOWN_API_KEY}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Val Town API error ${res.status} em ${path}: ${await res.text()}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.getProducts();
  }
  return valtownFetch<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.getProduct(id);
  }
  return valtownFetch<Product | null>(`/products/${id}`);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.createProduct(data);
  }
  return valtownFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.updateProduct(id, data);
  }
  return valtownFetch<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.deleteProduct(id);
  }
  await valtownFetch<void>(`/products/${id}`, { method: "DELETE" });
}

export async function getOrders(): Promise<Order[]> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.getOrders();
  }
  return valtownFetch<Order[]>("/orders");
}

export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Promise<Order> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.createOrder(data);
  }
  return valtownFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  if (!VALTOWN_API_URL) {
    warnFallbackOnce();
    return devStore.updateOrderStatus(id, status);
  }
  return valtownFetch<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
