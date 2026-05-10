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

  // --- SUBDOMAIN ROUTING (Multi-Tenancy) ---
  const isDevelopment = host.includes("localhost") || host.includes("127.0.0.1");
  const mainDomain = isDevelopment ? "localhost:3000" : "ethnicaa.com";
  
  // Extract subdomain (e.g., 'zara' from 'zara.ethnicaa.com')
  const subdomain = host.endsWith(`.${mainDomain}`) 
    ? host.replace(`.${mainDomain}`, "") 
    : null;

  if (subdomain && subdomain !== "www" && subdomain !== "admin") {
    // Internal rewrite to /storefront/[subdomain]/[path]
    return NextResponse.rewrite(new URL(`/storefront/${subdomain}${url.pathname}`, request.url));
  }

  // --- EXISTING LOGIC ---
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

  if (url.pathname === "/en" || url.pathname.startsWith("/en/")) {
    url.pathname = url.pathname.replace(/^\/en\/?/, "/");
    return NextResponse.redirect(url, 301);
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
