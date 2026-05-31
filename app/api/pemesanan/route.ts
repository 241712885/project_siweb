import { sql } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await sql`
      SELECT * FROM pemesanan ORDER BY id DESC
    `;

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}