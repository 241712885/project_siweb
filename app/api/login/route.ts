import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";
export const runtime = "nodejs";

const ADMIN = {
  nama: "admin123",
  email: "admin@gmail.com",
  password: "admin2026",
  role: "admin",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Login admin
    if (email === ADMIN.email && password === ADMIN.password) {
      const response = NextResponse.json({
        message: "Login berhasil",
        role: "admin",
      });
      response.cookies.set("user_nama", ADMIN.nama, { path: "/" });
      response.cookies.set("user_role", "admin", { httpOnly: true, path: "/" });
      response.cookies.set("session", "admin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    // Cek ke database
    const users = await sql`
      SELECT id, nama, email, password, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    ` as any[];

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak terdaftar" },
        { status: 404 }
      );
    }

    if (password !== user.password) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Login berhasil",
      role: user.role,
    });

    // ✅ FIX: Set KEDUA cookie — "session" dan "user_id"
    response.cookies.set("session", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    console.error("Detail error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", detail: String(error) },
      { status: 500 }
    );
  }
}