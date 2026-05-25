import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// mapping UI → DB
function reverseStatus(status: string) {
  switch (status) {
    case "Pending":
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

    const dbStatus = reverseStatus(body.status);

    await sql`
      UPDATE pemesanan
      SET status_pengiriman = ${dbStatus}
      WHERE id = ${Number(params.id)}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}