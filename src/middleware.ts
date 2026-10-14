import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role as string | undefined;

  // Public routes
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/auth");

  // Auth pages
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
    // Student cannot access any /admin route
    if (pathname.startsWith("/admin") && role === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin / Librarian should not stay on student-only routes
    const studentOnlyRoutes = [
      "/dashboard",
      "/browse",
      "/borrowed",
      "/reservations",
      "/history",
      "/fines",
      "/profile",
    ];

    const isStudentRoute = studentOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isStudentRoute && (role === "ADMIN" || role === "LIBRARIAN")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};