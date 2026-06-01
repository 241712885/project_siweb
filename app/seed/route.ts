import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await sql.begin(async (sql) => {
      // USERS
      await sql`
        INSERT INTO users
        (id, nama, email, role, password, phone, address)
        VALUES
        (
          1,
          'Nella',
          'nella@gmail.com',
          'pelanggan',
          ${hashedPassword},
          '081234567890',
          'Yogyakarta'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // DRIVER
      await sql`
        INSERT INTO driver
        (id, nama, no_sim, no_telp, status)
        VALUES
        (
          1,
          'Budi Santoso',
          'SIMA123456',
          '081111111111',
          'tersedia'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // JENIS PENGIRIMAN
      await sql`
        INSERT INTO jenis_pengiriman
        (id, nama_jenis, estimasi, deskripsi, harga_per_kg)
        VALUES
        (
          1,
          'Express',
          '1 Hari',
          'Pengiriman cepat',
          15000
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // KENDARAAN
      await sql`
        INSERT INTO kendaraan
        (id, nama, jenis, plat, kapasitas, status)
        VALUES
        (
          1,
          'Motor Honda',
          'Motor',
          'AB1234CD',
          50,
          'tersedia'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // LOGIN LOGS
      await sql`
        INSERT INTO login_logs
        (id, user_id, nama, email, role)
        VALUES
        (
          1,
          1,
          'Nella',
          'nella@gmail.com',
          'pelanggan'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // ORDERS
      await sql`
        INSERT INTO orders
        (id, receipt, sender, receiver, type, total)
        VALUES
        (
          1,
          'ORD001',
          'Nella',
          'Andi',
          'paket kecil',
          25000
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // PAKET
      await sql`
        INSERT INTO paket
        (id, tipe_paket, berat, nama_barang, catatan)
        VALUES
        (
          1,
          'paket kecil',
          2,
          'Buku Pemrograman',
          'Jangan dilipat'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // PEMESANAN
      await sql`
        INSERT INTO pemesanan
        (
          id,
          no_resi,
          id_customer,
          id_jenis_pengiriman,
          nama_pengirim,
          no_telp_pengirim,
          alamat_pengirim,
          nama_penerima,
          no_telp_penerima,
          alamat_penerima,
          berat,
          total_harga,
          metode_pembayaran,
          status_pengiriman,
          status_transaksi,
          catatan,
          tanggal_kirim,
          id_driver,
          id_kendaraan
        )
        VALUES
        (
          1,
          'RESI001',
          1,
          1,
          'Nella',
          '081234567890',
          'Yogyakarta',
          'Andi',
          '082222222222',
          'Jakarta',
          2,
          30000,
          'transfer',
          'diproses',
          'belum bayar',
          'Barang mudah pecah',
          CURRENT_DATE,
          1,
          1
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // TARIF
      await sql`
        INSERT INTO tarif
        (
          id,
          id_kota_asal,
          id_kota_tujuan,
          id_jenis_pengiriman,
          harga_per_kg,
          jenis_pengiriman
        )
        VALUES
        (
          1,
          1,
          2,
          1,
          15000,
          'Express'
        )
        ON CONFLICT (id) DO NOTHING;
      `;

      // TRANSAKSI
      await sql`
        INSERT INTO transaksi
        (
          resi,
          id_user,
          id_paket,
          nama_pengirim,
          nama_penerima,
          total_harga,
          status
        )
        VALUES
        (
          'RESI001',
          1,
          1,
          'Nella',
          'Andi',
          30000,
          'diproses'
        )
        ON CONFLICT (resi) DO NOTHING;
      `;
    });

    return Response.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error,
      },
      {
        status: 500,
      }
    );
  }
}