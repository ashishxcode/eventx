import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes("/login")) {
    const { email } = await request.json();
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }

  if (pathname.includes("/logout")) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("session");
    return response;
  }

  return NextResponse.json({ error: "Invalid route" }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes("/session")) {
    const session = request.cookies.get("session")?.value;
    return NextResponse.json({ session: session || null });
  }

  return NextResponse.json({ error: "Invalid route" }, { status: 400 });
}
