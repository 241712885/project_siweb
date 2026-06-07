import { sql } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = await sql`
      SELECT 
        id,
        nama as nama_driver,
        no_telp as no_telepon,
        no_sim,
        status as status_driver
      FROM driver
      WHERE ${search
        ? sql`nama ILIKE ${`%${search}%`} OR no_telp ILIKE ${`%${search}%`}`
        : sql`TRUE`}
      ORDER BY id DESC
    `;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nama_driver, no_telepon, no_sim, status_driver } = await req.json();

    const result = await sql`
      INSERT INTO driver (nama, no_telp, no_sim, status)
      VALUES (${nama_driver}, ${no_telepon}, ${no_sim}, ${status_driver})
      RETURNING *
    `;

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, nama_driver, no_telepon, no_sim, status_driver } = await req.json();

    const result = await sql`
      UPDATE driver
      SET nama = ${nama_driver},
          no_telp = ${no_telepon},
          no_sim = ${no_sim},
          status = ${status_driver}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const cek = await sql`
      SELECT COUNT(*) as total 
      FROM pemesanan 
      WHERE id_driver = ${Number(id)}
        AND status_pengiriman != 'selesai'
    ` as any[];

    if (Number(cek[0].total) > 0) {
      return NextResponse.json(
        { error: "Driver tidak dapat dihapus karena masih memiliki pesanan yang belum selesai." },
        { status: 400 }
      );
    }

    await sql`DELETE FROM driver WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}