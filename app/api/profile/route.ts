import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Belum login" }, { status: 401 });
    }

    const users = await sql`
      SELECT id, nama, email, phone, address FROM users WHERE id = ${userId} LIMIT 1
    ` as any[];

    if (users.length === 0) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Belum login" }, { status: 401 });
    }

    const { email, password, phone, address } = await req.json();

    await sql`
      UPDATE users SET
        email    = ${email},
        password = ${password},
        phone    = ${phone},
        address  = ${address}
      WHERE id = ${userId}
    `;

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}