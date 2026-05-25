import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// ============================================================
// GET - Ambil semua data pemesanan + filter search/status/tanggal
// ============================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search         = searchParams.get("search")         || "";
    const status         = searchParams.get("status")         || "";
    const tanggalMulai   = searchParams.get("tanggalMulai")   || "";
    const tanggalSelesai = searchParams.get("tanggalSelesai") || "";

    let orders;

    if (search && status && status !== "Semua Status" && tanggalMulai && tanggalSelesai) {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE (p.no_resi ILIKE ${'%' + search + '%'} OR p.nama_pengirim ILIKE ${'%' + search + '%'} OR p.nama_penerima ILIKE ${'%' + search + '%'})
          AND p.status_pengiriman = ${status.toLowerCase()}
          AND p.tanggal_kirim BETWEEN ${tanggalMulai}::date AND ${tanggalSelesai}::date
        ORDER BY p.created_at DESC`;

    } else if (search && status && status !== "Semua Status") {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE (p.no_resi ILIKE ${'%' + search + '%'} OR p.nama_pengirim ILIKE ${'%' + search + '%'} OR p.nama_penerima ILIKE ${'%' + search + '%'})
          AND p.status_pengiriman = ${status.toLowerCase()}
        ORDER BY p.created_at DESC`;

    } else if (search && tanggalMulai && tanggalSelesai) {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE (p.no_resi ILIKE ${'%' + search + '%'} OR p.nama_pengirim ILIKE ${'%' + search + '%'} OR p.nama_penerima ILIKE ${'%' + search + '%'})
          AND p.tanggal_kirim BETWEEN ${tanggalMulai}::date AND ${tanggalSelesai}::date
        ORDER BY p.created_at DESC`;

    } else if (status && status !== "Semua Status" && tanggalMulai && tanggalSelesai) {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE p.status_pengiriman = ${status.toLowerCase()}
          AND p.tanggal_kirim BETWEEN ${tanggalMulai}::date AND ${tanggalSelesai}::date
        ORDER BY p.created_at DESC`;

    } else if (search) {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE (p.no_resi ILIKE ${'%' + search + '%'} OR p.nama_pengirim ILIKE ${'%' + search + '%'} OR p.nama_penerima ILIKE ${'%' + search + '%'})
        ORDER BY p.created_at DESC`;

    } else if (status && status !== "Semua Status") {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE p.status_pengiriman = ${status.toLowerCase()}
        ORDER BY p.created_at DESC`;

    } else if (tanggalMulai && tanggalSelesai) {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        WHERE p.tanggal_kirim BETWEEN ${tanggalMulai}::date AND ${tanggalSelesai}::date
        ORDER BY p.created_at DESC`;

    } else {
      orders = await sql`
        SELECT p.*,
               jp.nama_jenis AS tipe_paket, jp.harga_per_kg,
               d.nama_driver, d.no_telepon AS telepon_driver,
               k.nama_kendaraan, k.plat_nomor
        FROM pemesanan p
        LEFT JOIN jenis_pengiriman jp ON p.id_jenis_pengiriman = jp.id
        LEFT JOIN driver            d  ON p.id_driver           = d.id
        LEFT JOIN kendaraan         k  ON p.id_kendaraan         = k.id
        ORDER BY p.created_at DESC`;
    }

    return Response.json({ data: orders });
  } catch (error) {
    console.error("GET /api/pemesanan error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================
// POST - Tambah pesanan baru + set driver & kendaraan → sibuk
// ============================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
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
      payment,
      notes,
      email,
      idDriver,
      idKendaraan,
    } = body;

    // Validasi field wajib
    if (!senderName || !receiverName || !type || !weight || !total || !payment) {
      return Response.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }
    if (!idDriver || !idKendaraan) {
      return Response.json({ error: "Driver dan kendaraan wajib dipilih" }, { status: 400 });
    }

    // Validasi driver masih tersedia
    const driverCheck = await sql`
      SELECT id, status_driver FROM driver WHERE id = ${parseInt(idDriver)} LIMIT 1
    `;
    if (!driverCheck[0]) {
      return Response.json({ error: "Driver tidak ditemukan" }, { status: 404 });
    }
    if (driverCheck[0].status_driver !== "tersedia") {
      return Response.json({ error: "Driver yang dipilih sudah tidak tersedia" }, { status: 409 });
    }

    // Validasi kendaraan masih tersedia
    const kendaraanCheck = await sql`
      SELECT id, status_kendaraan FROM kendaraan WHERE id = ${parseInt(idKendaraan)} LIMIT 1
    `;
    if (!kendaraanCheck[0]) {
      return Response.json({ error: "Kendaraan tidak ditemukan" }, { status: 404 });
    }
    if (kendaraanCheck[0].status_kendaraan !== "tersedia") {
      return Response.json({ error: "Kendaraan yang dipilih sudah tidak tersedia" }, { status: 409 });
    }

    // Resolve jenis pengiriman
    const jenisMap: Record<string, string> = {
      "Paket Kecil":  "Biasa",
      "Paket Sedang": "Cepat",
      "Paket Besar":  "VVIP",
    };
    const namaJenis = jenisMap[type] || "Biasa";
    const jenisRows = await sql`
      SELECT id FROM jenis_pengiriman WHERE nama_jenis = ${namaJenis} LIMIT 1
    `;
    const idJenisPengiriman = jenisRows[0]?.id ?? null;

    // Resolve customer (opsional)
    let idCustomer = null;
    if (email) {
      const userRows = await sql`
        SELECT id FROM users WHERE email = ${email} AND role = 'pelanggan' LIMIT 1
      `;
      idCustomer = userRows[0]?.id ?? null;
    }

    // Generate nomor resi
    const today   = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const prefix  = `CGD-${dateStr}-`;
    const countRows = await sql`
      SELECT COUNT(*) AS total FROM pemesanan WHERE no_resi LIKE ${prefix + '%'}
    `;
    const urutan = (parseInt(countRows[0].total) + 1).toString().padStart(4, "0");
    const noResi = `${prefix}${urutan}`;

    // Insert pesanan
    const result = await sql`
      INSERT INTO pemesanan (
        no_resi,
        id_customer,
        id_jenis_pengiriman,
        id_driver,
        id_kendaraan,
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
        tanggal_kirim
      ) VALUES (
        ${noResi},
        ${idCustomer},
        ${idJenisPengiriman},
        ${parseInt(idDriver)},
        ${parseInt(idKendaraan)},
        ${senderName},
        ${senderPhone},
        ${senderAddress},
        ${receiverName},
        ${receiverPhone},
        ${receiverAddress},
        ${parseFloat(weight)},
        ${parseFloat(total)},
        ${payment},
        'pending',
        'belum bayar',
        ${notes || null},
        CURRENT_DATE
      )
      RETURNING id, no_resi
    `;

    // Update status driver & kendaraan → sibuk
    await sql`UPDATE driver    SET status_driver    = 'bertugas' WHERE id = ${parseInt(idDriver)}`;
    await sql`UPDATE kendaraan SET status_kendaraan = 'digunakan' WHERE id = ${parseInt(idKendaraan)}`;

    return Response.json(
      {
        message: "Pesanan berhasil disimpan",
        no_resi: result[0].no_resi,
        id:      result[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/pemesanan error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================
// PATCH - Update status pengiriman / status transaksi
//         Jika status selesai/batal → bebaskan driver & kendaraan
// ============================================================
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status_pengiriman, status_transaksi } = body;

    if (!id) {
      return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    await sql`
      UPDATE pemesanan SET
        status_pengiriman = COALESCE(NULLIF(${status_pengiriman || ""}, ''), status_pengiriman),
        status_transaksi  = COALESCE(NULLIF(${status_transaksi  || ""}, ''), status_transaksi)
      WHERE id = ${id}
    `;

    // Jika pesanan selesai → bebaskan driver & kendaraan
    // Nilai valid: 'pending' | 'diproses' | 'dalam pengiriman' | 'selesai'
    const statusDone = ["selesai"];
    if (status_pengiriman && statusDone.includes(status_pengiriman.toLowerCase())) {
      const rows = await sql`
        SELECT id_driver, id_kendaraan FROM pemesanan WHERE id = ${id} LIMIT 1
      `;
      const { id_driver, id_kendaraan } = rows[0] || {};

      if (id_driver) {
        await sql`UPDATE driver    SET status_driver    = 'tersedia' WHERE id = ${id_driver}`;
      }
      if (id_kendaraan) {
        await sql`UPDATE kendaraan SET status_kendaraan = 'tersedia' WHERE id = ${id_kendaraan}`;
      }
    }

    return Response.json({ message: "Status berhasil diupdate" });
  } catch (error) {
    console.error("PATCH /api/pemesanan error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================
// DELETE - Hapus pesanan + bebaskan driver & kendaraan
// ============================================================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    // Ambil id_driver & id_kendaraan sebelum dihapus
    const rows = await sql`
      SELECT id_driver, id_kendaraan FROM pemesanan WHERE id = ${parseInt(id)} LIMIT 1
    `;
    const { id_driver, id_kendaraan } = rows[0] || {};

    await sql`DELETE FROM pemesanan WHERE id = ${parseInt(id)}`;

    // Bebaskan driver & kendaraan setelah pesanan dihapus
    if (id_driver) {
      await sql`UPDATE driver    SET status_driver    = 'tersedia' WHERE id = ${id_driver}`;
    }
    if (id_kendaraan) {
      await sql`UPDATE kendaraan SET status_kendaraan = 'tersedia' WHERE id = ${id_kendaraan}`;
    }

    return Response.json({ message: "Pesanan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/pemesanan error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}