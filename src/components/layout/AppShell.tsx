"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export function AppShell({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-[900px]:flex min-h-screen">
      <Sidebar
        isAdmin={isAdmin}
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>

      <CartDrawer />
    </div>
  );
}
