export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function maskId(code: string): string {
  const clean = code.replace(/\s+/g, "");
  if (clean.length <= 6) return clean;
  const first = clean.slice(0, 3);
  const last = clean.slice(-4);
  return `${first} ••• ${last}`;
}

// Deriva um subdomínio no padrão real de loja Shopify (ex:
// "ui12nc-e0.myshopify.com") a partir do código do produto, com o miolo
// oculto — mesma ideia do maskId, mas no formato de domínio da plataforma.
export function maskShopifyDomain(code: string): string {
  const clean = code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const first = (clean + "xxx").slice(0, 3);
  let hash = 0;
  for (const ch of clean) hash = (hash * 31 + ch.charCodeAt(0)) % 1296; // 36^2
  const last = hash.toString(36).padStart(2, "0");
  return `${first}•••${last}.myshopify.com`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
