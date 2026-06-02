import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    const noResi = new URL(req.url).searchParams.get("resi");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Belum login" }, { status: 401 });
    }

    if (!noResi) {
      return NextResponse.json({ success: false, message: "No resi wajib diisi" }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM pemesanan
      WHERE no_resi = ${noResi}
        AND id_customer = ${Number(userId)}
      LIMIT 1
    ` as any[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, message: "Paket tidak ditemukan atau bukan milik Anda" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}