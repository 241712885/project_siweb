import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    const noResi = new URL(req.url).searchParams.get("resi");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Belum login" },
        { status: 401 }
      );
    }

    if (!noResi) {
      return NextResponse.json(
        { success: false, message: "No resi wajib diisi" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT
        p.*,
        jp.nama_jenis AS jenis_pengiriman,
        jp.estimasi   AS estimasi_hari,
        u.nama        AS nama_customer
      FROM pemesanan p
      LEFT JOIN jenis_pengiriman jp ON jp.id = p.id_jenis_pengiriman
      LEFT JOIN users u             ON u.id  = p.id_customer
      WHERE p.no_resi     = ${noResi}
        AND p.id_customer = ${Number(userId)}
      LIMIT 1
    ` as any[];

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Masukkan nomor resi yang valid. Contoh: PKT-17820601" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data" },
      { status: 500 }
    );
  }
}