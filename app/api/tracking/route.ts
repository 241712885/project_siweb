// app/api/tracking/route.ts
import { sql } from "../../lib/db";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const resi = searchParams.get("resi");

  if (!resi || resi.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Nomor resi tidak boleh kosong." },
      { status: 400 }
    );
  }

  try {
    const rows = await sql`
      SELECT
        p.id,
        p.no_resi,
        p.nama_pengirim,
        p.no_telp_pengirim,
        p.alamat_pengirim,
        p.nama_penerima,
        p.no_telp_penerima,
        p.alamat_penerima,
        p.berat,
        p.total_harga,
        p.metode_pembayaran,
        p.status_pengiriman,
        p.status_transaksi,
        p.catatan,
        p.tanggal_kirim,
        p.created_at,
        jp.nama_jenis   AS jenis_pengiriman,
        jp.estimasi_hari,
        u.nama          AS nama_customer
      FROM pemesanan p
      LEFT JOIN jenis_pengiriman jp ON jp.id = p.id_jenis_pengiriman
      LEFT JOIN users u             ON u.id  = p.id_customer
      WHERE UPPER(p.no_resi) = UPPER(${resi.trim()})
      LIMIT 1
    ` as PemesananRow[];

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nomor resi tidak ditemukan. Periksa kembali nomor resi Anda." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PemesananRow {
  id: number;
  no_resi: string;
  nama_pengirim: string;
  no_telp_pengirim: string | null;
  alamat_pengirim: string | null;
  nama_penerima: string;
  no_telp_penerima: string | null;
  alamat_penerima: string | null;
  berat: number;
  total_harga: number;
  metode_pembayaran: string | null;
  status_pengiriman: StatusPengiriman;
  status_transaksi: string;
  catatan: string | null;
  tanggal_kirim: string | null;
  created_at: string;
  jenis_pengiriman: string | null;
  estimasi_hari: number | null;
  nama_customer: string | null;
}

type StatusPengiriman = "pending" | "diproses" | "dalam pengiriman" | "selesai";