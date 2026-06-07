import { sql } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = await sql`
      SELECT 
        id,
        nama as nama_kendaraan,
        jenis as jenis_kendaraan,
        plat as plat_nomor,
        kapasitas as kapasitas_muatan,
        status as status_kendaraan
      FROM kendaraan
      WHERE ${search
        ? sql`nama ILIKE ${`%${search}%`} OR plat ILIKE ${`%${search}%`}`
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
    const {
      nama_kendaraan,
      jenis_kendaraan,
      plat_nomor,
      kapasitas_muatan,
      status_kendaraan
    } = await req.json();

    const result = await sql`
      INSERT INTO kendaraan (nama, jenis, plat, kapasitas, status)
      VALUES (
        ${nama_kendaraan},
        ${jenis_kendaraan},
        ${plat_nomor},
        ${kapasitas_muatan},
        ${status_kendaraan}
      )
      RETURNING *
    `;

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const {
      id,
      nama_kendaraan,
      jenis_kendaraan,
      plat_nomor,
      kapasitas_muatan,
      status_kendaraan
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    const result = await sql`
      UPDATE kendaraan
      SET nama = ${nama_kendaraan},
          jenis = ${jenis_kendaraan},
          plat = ${plat_nomor},
          kapasitas = ${kapasitas_muatan},
          status = ${status_kendaraan}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Kendaraan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // ✅ Cek pesanan yang belum selesai
    const cek = await sql`
      SELECT COUNT(*) as total 
      FROM pemesanan 
      WHERE id_kendaraan = ${Number(id)}
        AND status_pengiriman != 'selesai'
    ` as any[];

    if (Number(cek[0].total) > 0) {
      return NextResponse.json(
        { error: "Kendaraan tidak dapat dihapus karena masih digunakan dalam pesanan yang belum selesai." },
        { status: 400 }
      );
    }

    await sql`DELETE FROM kendaraan WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}