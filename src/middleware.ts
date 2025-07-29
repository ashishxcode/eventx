import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const authRoutes = ["/login", "/signup"];
const protectedRoutePrefixes = ["/dashboard"];

const isPublicRoute = (pathname: string) =>
  publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

const isAuthRoute = (pathname: string) =>
  authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

const isProtectedRoute = (pathname: string) =>
  protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  try {
    if (isAuthRoute(pathname) && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedRoute(pathname) && !session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/.*).*)"],
};
