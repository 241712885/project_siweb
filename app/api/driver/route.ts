import { sql } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = search
      ? await sql`
          SELECT * FROM driver
          WHERE nama_driver ILIKE ${`%${search}%`}
          OR no_telepon ILIKE ${`%${search}%`}
          ORDER BY id DESC
        `
      : await sql`SELECT * FROM driver ORDER BY id DESC`;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nama_driver, no_telepon, no_sim, status_driver } = await req.json();

    const result = await sql`
      INSERT INTO driver (nama_driver, no_telepon, no_sim, status_driver)
      VALUES (${nama_driver}, ${no_telepon}, ${no_sim}, ${status_driver})
      RETURNING *
    `;

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}