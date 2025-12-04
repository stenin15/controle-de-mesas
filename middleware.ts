import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('🟡 [MIDDLEWARE] Requisição recebida:', {
    pathname,
    method: req.method,
    url: req.url
  });

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
    console.log('🟢 [MIDDLEWARE] Rota pública - permitindo acesso:', pathname);
    return NextResponse.next();
  }

  // Apenas proteger /admin e /funcionario
  if (pathname.startsWith("/admin") || pathname.startsWith("/funcionario")) {
    console.log('🔐 [MIDDLEWARE] Rota protegida detectada:', pathname);
    
    const token = req.cookies.get("token")?.value;
    
    console.log('🔐 [MIDDLEWARE] Token encontrado?', !!token);
    console.log('🔐 [MIDDLEWARE] Cookies disponíveis:', req.cookies.getAll().map(c => c.name));

    if (!token) {
      console.log('🔴 [MIDDLEWARE] Token não encontrado - redirecionando para /login');
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log('🔐 [MIDDLEWARE] Verificando token...');
    const user = verifyToken(token);

    if (!user) {
      console.log('🔴 [MIDDLEWARE] Token inválido ou expirado - redirecionando para /login');
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log('✅ [MIDDLEWARE] Token válido:', {
      userId: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome
    });

    if (pathname.startsWith("/admin") && user.role !== "admin") {
      console.log('🟡 [MIDDLEWARE] Usuário não é admin - redirecionando para /funcionario');
      return NextResponse.redirect(new URL("/funcionario", req.url));
    }

    if (pathname.startsWith("/funcionario") && user.role === "admin") {
      console.log('🟡 [MIDDLEWARE] Admin tentando acessar área de funcionário - redirecionando para /admin');
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    console.log('✅ [MIDDLEWARE] Acesso permitido para:', pathname);
    return NextResponse.next();
  }

  // Todas as outras rotas passam direto
  console.log('🟢 [MIDDLEWARE] Rota não protegida - permitindo acesso:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apenas intercepta rotas que começam com /admin ou /funcionario
    "/admin/:path*",
    "/funcionario/:path*",
  ],
};
