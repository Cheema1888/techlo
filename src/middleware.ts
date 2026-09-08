import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== request.nextUrl.host) {
          return NextResponse.json({ success: false, error: "Cross-site request blocked" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ success: false, error: "Invalid request origin" }, { status: 403 });
      }
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
