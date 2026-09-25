"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dots from "./globe-dots.json";
import icon from "@/assets/brand/icon.png";

// Paleta oficial da marca — pontos em roxo/azul-violeta, sem o ciano da
// referência (a referência era só pra pegar o estilo: mapa de pontos com
// curvatura de globo, não a cor).
const DOT_COLOR = "#A78BFA";
const DOT_COLOR_DIM = "#7C3AED";

// Posição aproximada da Europa (15°E, 50°N) dentro do canvas, calculada a
// partir da mesma projeção ortográfica usada em scripts/generate-globe-dots.mjs
// (rotate([-20,-8])) — usada como ponto de fuga do zoom ao rolar a página.
const EUROPE_ORIGIN = "47% 17%";

const SCROLL_ZOOM_DISTANCE = 700; // px rolados até o zoom/giro atingirem o máximo
const MAX_EXTRA_SCALE = 0.85; // some 0.85 ao 1 base => até 1.85x
const MAX_EXTRA_ROTATION = 50; // graus extras de giro, além do giro ambiente contínuo

export default function GlobeMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const radius = size / 2;
      const dotRadius = Math.max(1, size / 260);

      // Halo/atmosfera bem sutil atrás dos pontos.
      const glow = ctx.createRadialGradient(radius, radius, radius * 0.75, radius, radius, radius * 1.05);
      glow.addColorStop(0, "rgba(167,139,250,0.12)");
      glow.addColorStop(1, "rgba(167,139,250,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(radius, radius, radius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      for (const [x, y] of dots as [number, number][]) {
        const px = radius + x * radius;
        const py = radius + y * radius;
        const distFromCenter = Math.sqrt(x * x + y * y);
        // Pontos perto do limbo (borda da esfera) ficam um pouco mais
        // fracos — dá a sensação de curvatura/profundidade.
        ctx.fillStyle = distFromCenter > 0.82 ? DOT_COLOR_DIM : DOT_COLOR;
        ctx.globalAlpha = distFromCenter > 0.82 ? 0.55 : 0.9;
        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    draw();
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  // Ao rolar a página: gira um pouco mais (além do giro ambiente contínuo
  // do CSS) e dá zoom na Europa. Desligado com prefers-reduced-motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let rafId = 0;
    function update() {
      const progress = Math.min(1, Math.max(0, window.scrollY / SCROLL_ZOOM_DISTANCE));
      setScrollProgress(progress);
    }
    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full max-w-[420px] min-[900px]:max-w-[480px]"
    >
      {/* Favicon da marca por trás do globo, com glow extra na seta pra
          dar destaque — puramente decorativo, some atrás do halo/pontos. */}
      <div className="pointer-events-none absolute inset-[-20%] z-0 flex items-center justify-center">
        <Image
          src={icon}
          alt=""
          className="h-[75%] w-[75%] object-contain opacity-35"
          style={{
            filter:
              "drop-shadow(0 0 18px rgba(167,139,250,0.85)) drop-shadow(0 0 42px rgba(124,58,237,0.55))",
          }}
        />
      </div>

      {/* Halo pulsando por trás — fica parado (é radialmente simétrico,
          giro/zoom nele não mudaria nada visualmente). */}
      <div
        className="animate-pulse-glow absolute inset-[-8%] z-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.25) 0%, rgba(124,58,237,0.1) 55%, transparent 75%)",
        }}
      />
      {/* Janela de recorte FIXA (não escala) — o zoom acontece só no
          conteúdo de dentro, então a imagem cresce "dentro da lente" em vez
          de vazar por cima do que vem depois na página. */}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
        <div
          className="h-full w-full"
          style={{
            transform: `scale(${1 + scrollProgress * MAX_EXTRA_SCALE}) rotate(${scrollProgress * MAX_EXTRA_ROTATION}deg)`,
            transformOrigin: EUROPE_ORIGIN,
            transition: "transform 0.2s ease-out",
          }}
        >
          <canvas ref={canvasRef} className="animate-globe-spin block h-full w-full" />
        </div>
      </div>
    </div>
  );
}
