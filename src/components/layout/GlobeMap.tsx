"use client";

import { useEffect, useRef } from "react";
import dots from "./globe-dots.json";

// Paleta oficial da marca — pontos em roxo/azul-violeta, sem o ciano da
// referência (a referência era só pra pegar o estilo: mapa de pontos com
// curvatura de globo, não a cor).
const DOT_COLOR = "#A78BFA";
const DOT_COLOR_DIM = "#7C3AED";

export default function GlobeMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full max-w-[420px] min-[900px]:max-w-[480px]"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
