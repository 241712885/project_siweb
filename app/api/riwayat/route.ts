import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Belum login" }, { status: 401 });
    }

    const data = await sql`
      SELECT * FROM pemesanan
      WHERE id_customer = ${Number(userId)}
      ORDER BY id DESC
    `;

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}