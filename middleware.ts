import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // SEMPRE permitir estas rotas - nunca interceptar
  const publicPaths = [
    "/",
    "/login",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/test",
  ];

  // Verificar se é rota pública
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth/")
  ) {
    // CSP REMOVIDO TEMPORARIAMENTE PARA TESTE
    // Se o projeto funcionar sem CSP, podemos adicionar depois de forma mais permissiva
    return NextResponse.next();
  }

  // Apenas proteger /admin e /funcionario
  if (pathname.startsWith("/admin") || pathname.startsWith("/funcionario")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const user = verifyToken(token);

      if (pathname.startsWith("/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/funcionario", req.url));
      }

      if (pathname.startsWith("/funcionario") && user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // CSP REMOVIDO TEMPORARIAMENTE PARA TESTE
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Todas as outras rotas passam direto
  // CSP REMOVIDO TEMPORARIAMENTE PARA TESTE
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/api/:path*",
    "/",
    "/admin/:path*",
    "/funcionario/:path*",
  ],
};
