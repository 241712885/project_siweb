import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// UI → DB
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
    default:
      return "pending";
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Status tidak ada" },
        { status: 400 }
      );
    }

    const dbStatus = reverseStatus(body.status);

    await sql`
      UPDATE pemesanan
      SET status_pengiriman = ${dbStatus}
      WHERE id = ${Number(params.id)}
    `;

    return NextResponse.json({ message: "Status berhasil diupdate" });
  } catch (error) {
    console.error("PATCH shipments error:", error);
    return NextResponse.json(
      { error: "Gagal update status" },
      { status: 500 }
    );
  }
}