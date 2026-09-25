// Gera src/components/layout/globe-dots.json: pontos [x, y] (normalizados
// em -1..1 dentro de um círculo unitário) marcando onde há terra, numa
// projeção ORTOGRÁFICA (o "olhar pra uma esfera de fora" que dá a
// curvatura/silhueta circular da referência) centrada em África/Europa —
// dados reais de contorno de continentes (world-atlas, Natural Earth 50m),
// não pontos sintéticos.
//
// Rodar de novo se quiser mudar a resolução/densidade/rotação:
//   node scripts/generate-globe-dots.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { feature } from "topojson-client";
import { geoContains, geoOrthographic } from "d3-geo";

const __dirname = dirname(fileURLToPath(import.meta.url));

const topology = JSON.parse(
  readFileSync(join(__dirname, "../node_modules/world-atlas/land-50m.json"), "utf8")
);
const land = feature(topology, topology.objects.land);

// Centra a vista em ~[20°E, 8°N] (África/Europa), como na referência.
const projection = geoOrthographic()
  .rotate([-20, -8])
  .translate([0, 0])
  .scale(1);

const GRID = 130; // pontos por diâmetro
const step = 2 / GRID;
const points = [];

for (let gy = 0; gy < GRID; gy++) {
  const y = -1 + gy * step;
  for (let gx = 0; gx < GRID; gx++) {
    const x = -1 + gx * step;
    if (x * x + y * y > 1) continue; // fora do círculo (fora da esfera)
    const lonLat = projection.invert([x, y]);
    if (!lonLat) continue;
    if (geoContains(land, lonLat)) {
      points.push([Number(x.toFixed(4)), Number(y.toFixed(4))]);
    }
  }
}

const outPath = join(__dirname, "../src/components/layout/globe-dots.json");
writeFileSync(outPath, JSON.stringify(points));
console.log(`Gerado ${points.length} pontos em ${outPath}`);
