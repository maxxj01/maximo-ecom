"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const WHATSAPP_URL = "https://wa.me/5587981738048";

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
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-gradient-bg inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-purple/25 transition-opacity hover:opacity-90 min-[560px]:px-4"
        >
          <MessageCircle size={16} />
          <span className="hidden min-[560px]:inline">Falar no WhatsApp</span>
        </a>

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
