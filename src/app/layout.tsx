import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { isAdminSession } from "@/lib/auth";
import { Providers } from "./providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Máximo Ecom — Vitrine",
  description: "Google Ads e Payments de alta qualidade, prontas para escalar suas operações.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const isAdmin = await isAdminSession();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Providers isAdmin={isAdmin}>{children}</Providers>
      </body>
    </html>
  );
}
