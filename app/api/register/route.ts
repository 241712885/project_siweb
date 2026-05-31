import { NextRequest, NextResponse } from "next/server";
import { sql } from "./../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nama, email, phone, address, password } = await req.json();

    if (!nama || !email || !phone || !address || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const result = await sql`
      INSERT INTO users (nama, email, phone, address, password, role)
      VALUES (${nama}, ${email}, ${phone}, ${address}, ${password}, 'pelanggan')
      RETURNING id, nama, email, role
    `;

    return NextResponse.json({
      message: "Registrasi berhasil",
      user: result[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}