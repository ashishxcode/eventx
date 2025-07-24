import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Allow access to auth routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Protect dashboard route
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*", "/signup/:path*"],
};
