import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

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
  { params }: { params: Promise<{ id: string }> }  // ← Promise<>
) {
  try {
    const { id } = await params;  // ← await params
    const body = await req.json();

    const dbStatus = reverseStatus(body.status);

    await sql`
      UPDATE pemesanan
      SET status_pengiriman = ${dbStatus}
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({
      success: true,
      message: "Status berhasil diupdate",
    });
  } catch (error) {
    console.error("PATCH pemesanan error:", error);
    return NextResponse.json(
      { error: "Gagal update" },
      { status: 500 }
    );
  }
}