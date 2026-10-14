import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // Public routes that don't need auth
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );

  // Auth pages (login/register etc.)
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Already logged in → redirect away from auth pages
  if (session && isAuthPage) {
    if (role === "ADMIN" || role === "LIBRARIAN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Not logged in → protect private routes
  if (!session && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection
  if (session) {
    // Student trying to access admin area
    if (pathname.startsWith("/admin") && role === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin/Librarian trying to access student dashboard area
    if (
      (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/browse") ||
        pathname.startsWith("/borrowed") ||
        pathname.startsWith("/reservations") ||
        pathname.startsWith("/history") ||
        pathname.startsWith("/fines") ||
        pathname.startsWith("/profile")) &&
      (role === "ADMIN" || role === "LIBRARIAN")
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};