import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "./auth-constants";

export { ADMIN_SESSION_COOKIE };

/**
 * TODO: trocar por Auth0.
 *
 * Isto é um stub de autenticação v1: uma única senha compartilhada para
 * qualquer pessoa que administra a loja, sem contas individuais, sem
 * expiração de sessão configurável e sem recuperação de senha. Serve só
 * para não travar o resto do app enquanto o Auth0 não é configurado — não
 * é adequado para produção. Quando o Auth0 entrar, isto tudo (este arquivo,
 * o proxy.ts que o usa, e a tela em /acesso-restrito) deve ser substituído
 * pelo fluxo de login real e checagem de papel de admin do Auth0.
 */

const ADMIN_PASSWORD = process.env.ADMIN_STUB_PASSWORD;

if (!ADMIN_PASSWORD && process.env.NODE_ENV !== "production") {
  console.warn(
    "[lib/auth] ADMIN_STUB_PASSWORD não definida — usando senha padrão de desenvolvimento " +
      "'maximo-dev'. Defina ADMIN_STUB_PASSWORD em .env.local antes de ir para produção."
  );
}

const EFFECTIVE_PASSWORD = ADMIN_PASSWORD || "maximo-dev";

function sessionToken(): string {
  return createHash("sha256").update(EFFECTIVE_PASSWORD).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  return password === EFFECTIVE_PASSWORD;
}

export function adminSessionValue(): string {
  return sessionToken();
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(value) && value === sessionToken();
}
