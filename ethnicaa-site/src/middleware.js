import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host");

  // If host starts with www. redirect to non-www
  if (host && host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    url.host = newHost;
    
    // Perform a 301 Permanent Redirect
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Ensure it runs on all routes except static assets
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
