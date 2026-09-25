"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Store, Package, ClipboardList, LogOut, X } from "lucide-react";
import logo from "@/assets/brand/logo.png";
import logoLight from "@/assets/brand/logo-light.png";
import icon from "@/assets/brand/icon.png";
import iconLight from "@/assets/brand/icon-light.png";
import { logoutAction } from "@/lib/actions";

// A logo é roxo-escuro sólido (sem variante clara própria) — no tema
// escuro, contra o fundo escuro do sidebar (--bg-subtle), ela ficava quase
// invisível ("camuflada"). Troca pra uma versão branca (logo-light/
// icon-light, mesmo alpha, RGB branco) quando o tema resolvido é dark.
function useBrandAssets() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return { logo: isDark ? logoLight : logo, icon: isDark ? iconLight : icon };
}

function NavLink({
  href,
  active,
  icon: Icon,
  children,
  onNavigate,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-lilac-light text-purple"
          : "text-text-muted hover:bg-lilac-light/60 hover:text-text"
      }`}
    >
      <Icon size={18} />
      {children}
    </Link>
  );
}

function SidebarContent({
  isAdmin,
  pathname,
  onNavigate,
}: {
  isAdmin: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const brand = useBrandAssets();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-5">
        <Link href="/" onClick={onNavigate} className="block">
          <Image src={brand.logo} alt="Máximo Ecom" priority className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <NavLink href="/" active={pathname === "/"} icon={Store} onNavigate={onNavigate}>
          Todos os produtos
        </NavLink>

        {isAdmin && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Admin
            </div>
            <NavLink
              href="/admin/produtos"
              active={pathname.startsWith("/admin/produtos")}
              icon={Package}
              onNavigate={onNavigate}
            >
              Produtos
            </NavLink>
            <NavLink
              href="/admin/pedidos"
              active={pathname.startsWith("/admin/pedidos")}
              icon={ClipboardList}
              onNavigate={onNavigate}
            >
              Pedidos
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-border px-5 py-4">
        {isAdmin && (
          <button
            type="button"
            onClick={async () => {
              await logoutAction();
              router.push("/");
              router.refresh();
            }}
            className="mb-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-lilac-light/60 hover:text-text"
          >
            <LogOut size={16} />
            Sair
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Image src={brand.icon} alt="" className="h-4 w-4" />
          <span>© {new Date().getFullYear()} Máximo Ecom</span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  isAdmin,
  drawerOpen,
  onCloseDrawer,
}: {
  isAdmin: boolean;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden min-[900px]:block min-[900px]:w-64 min-[900px]:shrink-0 min-[900px]:border-r min-[900px]:border-border min-[900px]:bg-bg-subtle">
        <SidebarContent isAdmin={isAdmin} pathname={pathname} />
      </aside>

      {/* Mobile drawer + overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 min-[900px]:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onCloseDrawer}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-bg shadow-xl">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={onCloseDrawer}
                className="rounded-md p-2 text-text-muted hover:bg-lilac-light/60"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent isAdmin={isAdmin} pathname={pathname} onNavigate={onCloseDrawer} />
          </aside>
        </div>
      )}
    </>
  );
}
