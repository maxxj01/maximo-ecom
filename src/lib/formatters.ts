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

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
