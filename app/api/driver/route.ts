import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const data = search
      ? await sql`
          SELECT * FROM driver
          WHERE nama_driver ILIKE ${'%' + search + '%'}
             OR no_telepon  ILIKE ${'%' + search + '%'}
          ORDER BY id DESC`
      : await sql`SELECT * FROM driver ORDER BY id DESC`;

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nama_driver, no_telepon, no_sim, status_driver } = await req.json();

    if (!nama_driver || !no_telepon || !no_sim) {
      return Response.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO driver (nama_driver, no_telepon, no_sim, status_driver)
      VALUES (${nama_driver}, ${no_telepon}, ${no_sim}, ${status_driver})
      RETURNING *
    `;

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, nama_driver, no_telepon, no_sim, status_driver } = await req.json();

    if (!id) return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });

    await sql`
      UPDATE driver SET
        nama_driver   = ${nama_driver},
        no_telepon    = ${no_telepon},
        no_sim        = ${no_sim},
        status_driver = ${status_driver}
      WHERE id = ${id}
    `;

    return Response.json({ message: "Driver berhasil diupdate" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });

    await sql`DELETE FROM driver WHERE id = ${parseInt(id)}`;

    return Response.json({ message: "Driver berhasil dihapus" });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}