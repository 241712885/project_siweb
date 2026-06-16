import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

function reverseStatus(status: string) {
  switch (status) {
    case "Menunggu Pick Up":
      return "pending";
    case "Di Gudang":
      return "diproses";
    case "Dalam Pengiriman":
      return "dalam pengiriman";
    case "Terkirim":
      return "selesai";
    case "Dibatalkan":       
      return "dibatalkan";
    default:
      return "pending";
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ error: "Status tidak ada" }, { status: 400 });
    }

    const dbStatus = reverseStatus(body.status);

    const result = await sql`
      UPDATE pemesanan
      SET status_pengiriman = ${dbStatus}
      WHERE id = ${Number(id)}
      RETURNING id_driver, id_kendaraan
    ` as any[];

    if ((dbStatus === "selesai" || dbStatus === "dibatalkan") && result.length > 0) {
      const { id_driver, id_kendaraan } = result[0];

      if (id_driver) {
        await sql`UPDATE driver SET status = 'tersedia' WHERE id = ${id_driver}`;
      }
      if (id_kendaraan) {
        await sql`UPDATE kendaraan SET status = 'tersedia' WHERE id = ${id_kendaraan}`;
      }
    }

    return NextResponse.json({ message: "Status berhasil diupdate" });
  } catch (error) {
    console.error("PATCH shipments error:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}