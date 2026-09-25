"use client";

import dynamic from "next/dynamic";
import { Store, CheckCircle2 } from "lucide-react";
import { PlatformLogoStrip } from "./PlatformLogoStrip";

// Canvas 2D simples (sem WebGL/Three.js) — ainda assim carregado só no
// cliente pra não entrar no bundle/paint inicial da hero.
const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

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

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-8">
        <div className="flex flex-col items-center gap-7 text-center min-[900px]:items-start min-[900px]:text-left">
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
            <span className="block text-white">Google Ads e Payments</span>
            <span className="brand-gradient-text block">de alta qualidade</span>
          </h1>

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

        <div
          className="animate-fade-in-up flex w-full justify-center min-[900px]:w-auto min-[900px]:shrink-0 min-[900px]:justify-end"
          style={{ animationDelay: "120ms" }}
        >
          <GlobeMap />
        </div>
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
