"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function pageTitle(pathname: string): string {
  if (pathname === "/") return "Vitrine";
  if (pathname.startsWith("/admin/produtos")) return "Produtos";
  if (pathname.startsWith("/admin/pedidos")) return "Pedidos";
  if (pathname.startsWith("/acesso-restrito")) return "Área restrita";
  return "Máximo Ecom";
}

export function Topbar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { count, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Client-only mount flag so the theme icon matches next-themes' resolved
  // value instead of the server-rendered guess (avoids a hydration flash).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/95 px-4 py-3 backdrop-blur min-[900px]:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={onOpenDrawer}
          className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60 min-[900px]:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-extrabold">
          {pathname === "/" ? (
            <span className="brand-gradient-text">Máximo Ecom</span>
          ) : (
            pageTitle(pathname)
          )}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Alternar tema"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60"
        >
          {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          aria-label="Abrir carrinho"
          onClick={openCart}
          className="relative rounded-md p-2 text-text-muted hover:bg-lilac-light/60"
        >
          <ShoppingCart size={18} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
