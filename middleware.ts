import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * One app, two hosts:
 *   daffodils.com        -> public site (the /admin path is hidden here)
 *   admin.daffodils.com  -> admin panel (every path is served from /admin)
 * Set ADMIN_HOST in production. Locally, open http://localhost:3000/admin.
 */
export async function middleware(req: NextRequest) {
  const adminHost = process.env.ADMIN_HOST?.toLowerCase();
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const { pathname } = req.nextUrl;
  const onAdminHost = adminHost ? host === adminHost : false;

  // Public host must never expose the admin panel.
  if (adminHost && !onAdminHost && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Admin host only serves the admin panel (plus uploaded media in local mode).
  let target = pathname;
  if (onAdminHost && !(pathname === "/admin" || pathname.startsWith("/admin/")) && !pathname.startsWith("/media/")) {
    target = pathname === "/" ? "/admin" : `/admin${pathname}`;
  }

  const isAdminPath = target === "/admin" || target.startsWith("/admin/");
  if (isAdminPath && target !== "/admin/login") {
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const res =
    target !== pathname ? NextResponse.rewrite(new URL(target + req.nextUrl.search, req.url)) : NextResponse.next();
  if (isAdminPath) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|campus.jpg).*)"],
};
