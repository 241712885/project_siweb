import { sql } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = search
      ? await sql`
          SELECT * FROM kendaraan
          WHERE nama_kendaraan ILIKE ${`%${search}%`}
          OR plat_nomor ILIKE ${`%${search}%`}
          ORDER BY id DESC
        `
      : await sql`SELECT * FROM kendaraan ORDER BY id DESC`;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}