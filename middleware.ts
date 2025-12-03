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
    const res = NextResponse.next();
    
    // Adicionar headers CSP para permitir conexões com Supabase e Vercel
    // Permite unsafe-eval para Next.js funcionar corretamente
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' https://controle-de-mesas-git-main-stenios-projects-07a3b7e7.vercel.app https://*.supabase.co https://controle-de-mesas.vercel.app; script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self';"
    );
    
    return res;
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

      const res = NextResponse.next();
      
      // Adicionar headers CSP
      res.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https://controle-de-mesas-git-main-stenios-projects-07a3b7e7.vercel.app https://*.supabase.co https://controle-de-mesas.vercel.app; script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self';"
      );
      
      return res;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Todas as outras rotas passam direto
  const res = NextResponse.next();
  
  // Adicionar headers CSP
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://controle-de-mesas-git-main-stenios-projects-07a3b7e7.vercel.app https://*.supabase.co https://controle-de-mesas.vercel.app; script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self';"
  );
  
  return res;
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
