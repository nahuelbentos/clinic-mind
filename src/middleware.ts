import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes entirely
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Auth check: strip locale prefix to get canonical path
  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, "") || "/";
  const isDashboard = pathWithoutLocale.startsWith("/dashboard");
  const isAdmin = pathWithoutLocale.startsWith("/admin");

  if (isDashboard || isAdmin) {
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      const localeMatch = pathname.match(/^\/(es|en)\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Let next-intl handle locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
