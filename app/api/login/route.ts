import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

const ADMIN = {
  nama: "admin123",
  email: "admin@gmail.com",
  password: "admin2026",
  role: "admin",
};

export async function POST(req: NextRequest) {
  try {
    const { nama, email, password } = await req.json();

    if (!nama || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek admin dulu
    if (
      nama === ADMIN.nama &&
      email === ADMIN.email &&
      password === ADMIN.password
    ) {
      const response = NextResponse.json({
        message: "Login berhasil",
        role: "admin",
      });
      response.cookies.set("user_role", "admin", { httpOnly: true, path: "/" });
      return response;
    }

    // Cek ke database
    const users = await sql`
      SELECT id, nama, email, role
      FROM users
      WHERE email = ${email} AND password = ${password}
      LIMIT 1
    ` as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = users[0];

    const response = NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      nama: user.nama,
    });

    // Simpan id dan role user ke cookie
    response.cookies.set("user_id", String(user.id), { httpOnly: true, path: "/" });
    response.cookies.set("user_role", user.role, { httpOnly: true, path: "/" });
    response.cookies.set("user_nama", user.nama, { httpOnly: true, path: "/" });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}