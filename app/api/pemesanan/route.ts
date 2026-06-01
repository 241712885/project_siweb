import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tanggalMulai   = searchParams.get("tanggalMulai");
    const tanggalSelesai = searchParams.get("tanggalSelesai");

    let data;
    if (tanggalMulai && tanggalSelesai) {
      data = await sql`
        SELECT * FROM pemesanan
        WHERE tanggal_kirim >= ${tanggalMulai}
          AND tanggal_kirim <= ${tanggalSelesai}
        ORDER BY id DESC
      `;
    } else {
      data = await sql`
        SELECT * FROM pemesanan ORDER BY id DESC
      `;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      type,
      weight,
      total,
      metode_pembayaran,
      notes,
      email,
      idDriver,
      idKendaraan,
      namaBarang,
    } = await req.json();

    // Generate no resi
    const noResi = "PKT-" + Date.now();

    // Cari id_customer dari email (opsional)
    let idCustomer = null;
    if (email) {
      const users = await sql`
        SELECT id FROM users WHERE email = ${email} LIMIT 1
      ` as any[];
      if (users.length > 0) idCustomer = users[0].id;
    }

    // Cari id_jenis_pengiriman dari tipe paket
    const jenisList = await sql`
      SELECT id FROM jenis_pengiriman WHERE nama_jenis = ${type} LIMIT 1
    ` as any[];
    const idJenisPengiriman = jenisList.length > 0 ? jenisList[0].id : null;

    // Insert pesanan
    await sql`
      INSERT INTO pemesanan (
        nama_pengirim, no_telp_pengirim, alamat_pengirim,
        nama_penerima, no_telp_penerima, alamat_penerima,
        berat, total_harga, metode_pembayaran,
        catatan, no_resi, status_pengiriman, status_transaksi,
        tanggal_kirim, id_customer, id_jenis_pengiriman,
        id_driver, id_kendaraan, nama_barang
      ) VALUES (
        ${senderName}, ${senderPhone}, ${senderAddress},
        ${receiverName}, ${receiverPhone}, ${receiverAddress},
        ${Number(weight)}, ${total}, ${metode_pembayaran},
        ${notes || null}, ${noResi}, 'pending', 'belum bayar',
        CURRENT_DATE, ${idCustomer}, ${idJenisPengiriman},
        ${Number(idDriver)}, ${Number(idKendaraan)}, ${namaBarang}
      )
    `;

    // Update status driver & kendaraan jadi tidak tersedia
    await sql`UPDATE driver SET status = 'bertugas' WHERE id = ${Number(idDriver)}`;
    await sql`UPDATE kendaraan SET status = 'digunakan' WHERE id = ${Number(idKendaraan)}`;

    return NextResponse.json({ no_resi: noResi });
  } catch (error) {
    console.error("POST pemesanan error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }
}