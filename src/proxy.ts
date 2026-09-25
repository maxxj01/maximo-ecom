import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-constants";

// Gate de acesso ao admin. Checa só a presença do cookie de sessão (stub) —
// a validação de fato do valor acontece em isAdminSession() (server-only,
// usa node:crypto). Ver TODO em src/lib/auth.ts: isto deve virar uma
// checagem de sessão do Auth0.
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(ADMIN_SESSION_COOKIE);
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/acesso-restrito", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
