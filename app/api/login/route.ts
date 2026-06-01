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
    console.log("Mencoba login dengan:", { email, password }); // ← tambah ini

    const users = await sql`
      SELECT id, nama, email, password, role  // ← tambah password di SELECT
      FROM users
      WHERE email = ${email}                   // ← hapus AND password dulu
      LIMIT 1
    ` as any[];

    console.log("User ditemukan:", users[0]);  // ← tambah ini

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
    console.error("Detail error:", error); // ← tambah ini
    return NextResponse.json(
      { message: "Terjadi kesalahan server", detail: String(error) }, // ← tambah detail
      { status: 500 }
    );
  }
}