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
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Log for debugging (Check your terminal!)
  console.log(`[Middleware] Host: ${host}, Path: ${pathname}`);

  // --- SUBDOMAIN ROUTING (Multi-Tenancy) ---
  const isDevelopment = host.includes("localhost") || host.includes("127.0.0.1");
  const mainDomain = isDevelopment ? "localhost:3000" : "ethnicaa.com";

  if (host !== mainDomain && host.endsWith(`.${mainDomain}`)) {
    const subdomain = host.replace(`.${mainDomain}`, "");
    if (subdomain && subdomain !== "www" && subdomain !== "admin") {
      console.log(`[Middleware] Rewriting to Storefront: ${subdomain}`);
      return NextResponse.rewrite(new URL(`/storefront/${subdomain}${pathname}`, request.url));
    }
  }

  // --- EXISTING LOGIC ---
  if (pathname.startsWith("/admin/seo-agent") || pathname.startsWith("/api/seo/")) {
    if (!isAuthorized(request)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Ethnicaa SEO Agent"' },
      });
    }
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.redirect(new URL(pathname.replace(/^\/en\/?/, "/"), request.url), 301);
  }

  if (host.startsWith("www.")) {
    return NextResponse.redirect(new URL(url.href.replace("www.", "")), 301);
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
