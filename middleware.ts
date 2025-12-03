import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // SEMPRE permitir assets e APIs - nunca interceptar
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api")
  ) {
    const res = NextResponse.next();
    // Habilita cookies cross-path e desbloqueia Supabase/Vercel
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
    );
    return res;
  }

  // Rotas públicas
  if (pathname === "/" || pathname === "/login") {
    const res = NextResponse.next();
    // Habilita cookies cross-path e desbloqueia Supabase/Vercel
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
    );
    return res;
  }

  // Proteger apenas /admin e /funcionario
  if (pathname.startsWith("/admin") || pathname.startsWith("/funcionario")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
      );
      return res;
    }

    try {
      const user = verifyToken(token);

      if (pathname.startsWith("/admin") && user.role !== "admin") {
        const res = NextResponse.redirect(new URL("/funcionario", req.url));
        res.headers.set(
          "Content-Security-Policy",
          "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
        );
        return res;
      }

      if (pathname.startsWith("/funcionario") && user.role === "admin") {
        const res = NextResponse.redirect(new URL("/admin", req.url));
        res.headers.set(
          "Content-Security-Policy",
          "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
        );
        return res;
      }

      const res = NextResponse.next();
      res.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
      );
      return res;
    } catch {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
      );
      return res;
    }
  }

  const res = NextResponse.next();
  // Habilita cookies cross-path e desbloqueia Supabase/Vercel
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.vercel.app; script-src 'self' 'unsafe-inline';"
  );
  return res;
}

export const config = {
  matcher: ['/login', '/api/:path*', '/admin/:path*', '/funcionario/:path*'],
};
