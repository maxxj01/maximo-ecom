"use client";

import { Store, CheckCircle2 } from "lucide-react";
import { PlatformLogoStrip } from "./PlatformLogoStrip";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 py-16 min-[900px]:py-24"
      style={{
        background: "linear-gradient(120deg, #0A0A14 0%, #150E2E 45%, #241A45 100%)",
      }}
    >
      {/* Grid sutil na paleta da marca, por trás de tudo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(124,58,237,0.14) 1px, transparent 1px), linear-gradient(0deg, rgba(124,58,237,0.14) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 85% 75% at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at center, black 55%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-7 text-center">
          <div
            className="animate-fade-in-up inline-flex items-center rounded-full border border-purple/25 bg-lilac-light px-4 py-2 text-sm font-semibold text-purple"
            style={{ animationDelay: "0ms" }}
          >
            Suporte direto, sem intermediários
          </div>

          <h1
            className="animate-fade-in-up max-w-xl text-4xl font-extrabold leading-tight tracking-tight min-[900px]:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="text-white">Máximo</span> <span className="brand-gradient-text">Ecom</span>{" "}
            <span className="text-white">Store</span>
          </h1>

          <p
            className="animate-fade-in-up max-w-md text-lg font-semibold leading-snug text-white/85 min-[900px]:text-xl"
            style={{ animationDelay: "120ms" }}
          >
            Google Ads e Payments de alta qualidade
          </p>

          <p
            className="animate-fade-in-up max-w-md text-lg leading-relaxed text-white/80"
            style={{ animationDelay: "160ms" }}
          >
            prontas para escalar suas operações. Contas selecionadas, estrutura
            profissional e soluções pensadas para oferecer mais estabilidade,
            desempenho e eficiência às suas operações.
          </p>

          <div className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 rounded-full bg-purple px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple/30 transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-purple/40"
            >
              <Store size={16} />
              Ver produtos
            </a>
          </div>
        </div>
      </div>

      <div
        className="animate-fade-in-up relative z-10 mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm leading-relaxed text-white/60 backdrop-blur-sm min-[900px]:mt-14"
        style={{ animationDelay: "280ms" }}
      >
        A Máximo Ecom centraliza contas verificadas para suas operações de
        anúncios e pagamentos, incluindo contas Google Ads, Stripe e Shopify
        Payments. As categorias do catálogo foram organizadas para facilitar a
        descoberta dos produtos e entregar uma navegação mais clara para
        usuários e buscadores.
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center gap-7 min-[900px]:mt-16">
        <div className="animate-fade-in-up" style={{ animationDelay: "320ms" }}>
          <PlatformLogoStrip />
        </div>

        <div
          className="animate-fade-in-up flex items-center gap-2 text-sm font-medium text-white/80"
          style={{ animationDelay: "400ms" }}
        >
          <CheckCircle2 size={16} className="text-purple-light" />
          Suporte direto com quem cuida da sua conta
        </div>
      </div>
    </section>
  );
}
