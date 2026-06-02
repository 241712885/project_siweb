import { NextRequest, NextResponse } from "next/server";
import { sql } from "./../../lib/db";
export const runtime = "nodejs";

function mapStatus(dbStatus: string) {
  switch (dbStatus) {
    case "pending":
      return "Menunggu Pick Up";
    case "diproses":
      return "Di Gudang";
    case "dalam pengiriman":
      return "Dalam Pengiriman";
    case "sampai tujuan":
    case "selesai":
      return "Terkirim";
    default:
      return "Menunggu Pick Up";
  }
}

export async function GET() {
  try {
    const data = await sql`
      SELECT 
        p.id,
        p.no_resi,
        p.nama_pengirim,
        p.nama_penerima,
        p.status_pengiriman,
        p.tanggal_kirim
      FROM pemesanan p
      ORDER BY p.tanggal_kirim DESC
    `;

    const formatted = data.map((item: any) => ({
      id: item.id,
      receipt: item.no_resi,
      sender: item.nama_pengirim,
      receiver: item.nama_penerima,
      status: mapStatus(item.status_pengiriman),
      date: item.tanggal_kirim,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET shipments error:", error);
    return NextResponse.json(
      { error: "Gagal ambil data pengiriman" },
      { status: 500 }
    );
  }
}