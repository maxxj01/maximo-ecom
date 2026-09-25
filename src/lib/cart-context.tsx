"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "./types";

export type CartLine = {
  productId: string;
  title: string;
  imageUrl: string;
  priceOption: "normal" | "plan";
  unitPrice: number;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, priceOption: "normal" | "plan") => void;
  removeFromCart: (productId: string, priceOption: "normal" | "plan") => void;
  setQty: (productId: string, priceOption: "normal" | "plan", qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "maximo-ecom:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage — an external system that isn't
    // readable during server render, so this has to run in an effect.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // localStorage indisponível (modo privado, etc.) — carrinho começa vazio.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignora falha de storage
    }
  }, [lines, hydrated]);

  const addToCart = useCallback(
    (product: Product, priceOption: "normal" | "plan") => {
      const unitPrice =
        priceOption === "plan" && product.planPrice != null
          ? product.planPrice
          : product.price;
      setLines((prev) => {
        const existing = prev.find(
          (l) => l.productId === product.id && l.priceOption === priceOption
        );
        if (existing) {
          return prev.map((l) =>
            l === existing ? { ...l, qty: l.qty + 1 } : l
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            imageUrl: product.imageUrl,
            priceOption,
            unitPrice,
            qty: 1,
          },
        ];
      });
      setIsOpen(true);
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, priceOption: "normal" | "plan") => {
      setLines((prev) =>
        prev.filter(
          (l) => !(l.productId === productId && l.priceOption === priceOption)
        )
      );
    },
    []
  );

  const setQty = useCallback(
    (productId: string, priceOption: "normal" | "plan", qty: number) => {
      if (qty <= 0) {
        removeFromCart(productId, priceOption);
        return;
      }
      setLines((prev) =>
        prev.map((l) =>
          l.productId === productId && l.priceOption === priceOption
            ? { ...l, qty }
            : l
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    count,
    total,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
