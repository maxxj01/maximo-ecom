"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";
import { AppShell } from "@/components/layout/AppShell";

export function Providers({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        <AppShell isAdmin={isAdmin}>{children}</AppShell>
        <Toaster position="top-center" richColors closeButton />
      </CartProvider>
    </ThemeProvider>
  );
}
