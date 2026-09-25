// Constante isolada (sem importar next/headers) para poder ser usada tanto
// em src/lib/auth.ts (server-only) quanto em src/proxy.ts (runtime de proxy).
export const ADMIN_SESSION_COOKIE = "maximo_admin_session";
