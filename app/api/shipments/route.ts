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

export async function PATCH(req: NextRequest) {
  try {
    const { id, status_pengiriman } = await req.json();

    if (!id || !status_pengiriman) {
      return NextResponse.json({ error: "ID dan status wajib diisi" }, { status: 400 });
    }

    const validStatus = ["pending", "diproses", "dalam pengiriman", "selesai"];
    if (!validStatus.includes(status_pengiriman)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const result = await sql`
      UPDATE pemesanan
      SET status_pengiriman = ${status_pengiriman}
      WHERE id = ${id}
      RETURNING id, id_driver, id_kendaraan, status_pengiriman
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const pesanan = result[0] as any;

    if (status_pengiriman === "selesai") {
      if (pesanan.id_driver) {
        await sql`
          UPDATE driver SET status = 'tersedia' WHERE id = ${pesanan.id_driver}
        `;
      }
      if (pesanan.id_kendaraan) {
        await sql`
          UPDATE kendaraan SET status = 'tersedia' WHERE id = ${pesanan.id_kendaraan}
        `;
      }
    }

    return NextResponse.json({ success: true, data: pesanan });
  } catch (error) {
    console.error("PATCH pengiriman error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}