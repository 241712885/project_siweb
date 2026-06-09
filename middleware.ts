import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login-regist/login",
  "/login-regist/register",
  "/unauthorized",
];

const ADMIN_PATHS = [
  "/admin/armada",
  "/admin/beranda",
  "/admin/order",
  "/admin/order/transfer",
  "/admin/pengiriman",
];

const PELANGGAN_PATHS = [
  "/pelanggan/dashboard",
  "/pelanggan/history",
  "/pelanggan/profile",
  "/pelanggan/tracking",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // static assets & API bebas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)
  ) {
    return NextResponse.next();
  }

  // public path bebas diakses
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path);
  if (isPublic) return NextResponse.next();

  const session = request.cookies.get("session");
  const userRole = request.cookies.get("user_role");

  // belum login → redirect ke login
  if (!session || !session.value) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const role = userRole?.value;

  // admin mencoba akses halaman pelanggan
  const isPelangganPath = PELANGGAN_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  if (isPelangganPath && role !== "pelanggan") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // pelanggan mencoba akses halaman admin
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // /keluar hanya bisa diakses kalau sudah login (sudah lolos cek session di atas)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};