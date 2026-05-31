import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = search
      ? await sql`
          SELECT * FROM kendaraan
          WHERE nama_kendaraan ILIKE ${'%' + search + '%'}
             OR plat_nomor     ILIKE ${'%' + search + '%'}
          ORDER BY id DESC`
      : await sql`SELECT * FROM kendaraan ORDER BY id DESC`;

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nama_kendaraan, jenis_kendaraan, plat_nomor, kapasitas_muatan, status_kendaraan } = await req.json();

    if (!nama_kendaraan || !plat_nomor || !kapasitas_muatan) {
      return Response.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO kendaraan (nama_kendaraan, jenis_kendaraan, plat_nomor, kapasitas_muatan, status_kendaraan)
      VALUES (${nama_kendaraan}, ${jenis_kendaraan}, ${plat_nomor}, ${parseFloat(kapasitas_muatan)}, ${status_kendaraan})
      RETURNING *
    `;

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, nama_kendaraan, jenis_kendaraan, plat_nomor, kapasitas_muatan, status_kendaraan } = await req.json();

    if (!id) return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });

    await sql`
      UPDATE kendaraan SET
        nama_kendaraan   = ${nama_kendaraan},
        jenis_kendaraan  = ${jenis_kendaraan},
        plat_nomor       = ${plat_nomor},
        kapasitas_muatan = ${parseFloat(kapasitas_muatan)},
        status_kendaraan = ${status_kendaraan}
      WHERE id = ${id}
    `;

    return Response.json({ message: "Kendaraan berhasil diupdate" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });

    const kendaraan = await sql`SELECT status_kendaraan FROM kendaraan WHERE id = ${parseInt(id)}`;
    
    if (!kendaraan[0]) return Response.json({ error: "Kendaraan tidak ditemukan" }, { status: 404 });

    if (kendaraan[0].status_kendaraan === "digunakan") {
      return Response.json(
        { error: "Kendaraan tidak bisa dihapus karena sedang digunakan." },
        { status: 409 }
      );
    }

    await sql`UPDATE pemesanan SET id_kendaraan = NULL WHERE id_kendaraan = ${parseInt(id)}`;
    await sql`DELETE FROM kendaraan WHERE id = ${parseInt(id)}`;
    
    return Response.json({ message: "Kendaraan berhasil dihapus" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}