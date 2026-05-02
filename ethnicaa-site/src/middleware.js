import { NextResponse } from "next/server";

function isAuthorized(request) {
  const configuredUser = process.env.SEO_AGENT_USER;
  const configuredPassword = process.env.SEO_AGENT_PASSWORD;

  if (!configuredUser || !configuredPassword) return false;

  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Basic ")) return false;

  try {
    const decoded = atob(auth.slice("Basic ".length));
    const index = decoded.indexOf(":");
    return (
      decoded.slice(0, index) === configuredUser &&
      decoded.slice(index + 1) === configuredPassword
    );
  } catch {
    return false;
  }
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host");

  if (
    request.nextUrl.pathname.startsWith("/admin/seo-agent") ||
    request.nextUrl.pathname.startsWith("/api/seo/")
  ) {
    if (!isAuthorized(request)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Ethnicaa SEO Agent"',
        },
      });
    }
  }

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
  matcher: [
    "/admin/:path*",
    "/api/seo/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
