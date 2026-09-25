"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as api from "./api";
import { ADMIN_SESSION_COOKIE, adminSessionValue, checkAdminPassword } from "./auth";
import type { Order, OrderItem, Product } from "./types";

// --- Auth (stub — ver TODO em lib/auth.ts) -------------------------------

export async function loginAction(
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!checkAdminPassword(password)) {
    return { ok: false, error: "Senha incorreta." };
  }
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, adminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  revalidatePath("/");
}

// --- Produtos --------------------------------------------------------------

export async function createProductAction(
  data: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  const product = await api.createProduct(data);
  revalidatePath("/");
  revalidatePath("/admin/produtos");
  return product;
}

export async function updateProductAction(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const product = await api.updateProduct(id, data);
  revalidatePath("/");
  revalidatePath("/admin/produtos");
  return product;
}

export async function deleteProductAction(id: string): Promise<void> {
  await api.deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/admin/produtos");
}

export async function toggleProductVisibleAction(
  id: string,
  visible: boolean
): Promise<Product> {
  return updateProductAction(id, { visible });
}

export async function toggleProductStatusAction(
  id: string,
  status: Product["status"]
): Promise<Product> {
  return updateProductAction(id, { status });
}

// --- Pedidos -----------------------------------------------------------

export async function createOrderAction(data: {
  items: OrderItem[];
  total: number;
  buyerName: string;
  buyerContact: string;
  note?: string;
}): Promise<Order> {
  const order = await api.createOrder(data);
  revalidatePath("/admin/pedidos");
  return order;
}

export async function updateOrderStatusAction(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const order = await api.updateOrderStatus(id, status);
  revalidatePath("/admin/pedidos");
  return order;
}
