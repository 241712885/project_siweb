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

    if (email === ADMIN.email && password === ADMIN.password) {
      const response = NextResponse.json({
        message: "Login berhasil",
        role: "admin",
      });
      response.cookies.set("user_nama", ADMIN.nama, { path: "/" });
      response.cookies.set("user_role", "admin", { httpOnly: true, path: "/" });
      return response;
    }

    // Cek ke database
    console.log("Mencoba login dengan:", { email, password });

    const users = await sql`
      SELECT id, nama, email, password, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    ` as any[];

    console.log("User ditemukan:", users[0]); 

    const user = users[0];

    const response = NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      nama: user.nama,
    });

    response.cookies.set("user_id", String(user.id), { httpOnly: true, path: "/" });
    response.cookies.set("user_role", user.role, { httpOnly: true, path: "/" });
    response.cookies.set("user_nama", user.nama, { path: "/" });

    return response;

  } catch (error) {
    console.error("Detail error:", error); 
    return NextResponse.json(
      { message: "Terjadi kesalahan server", detail: String(error) }, 
      { status: 500 }
    );
  }
}