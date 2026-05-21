import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    try {
        const orders = await sql`
            SELECT * FROM orders
            ORDER BY id DESC
        `;

        return Response.json(orders);

    } catch(error){
        return Response.json(
            {error:"Gagal mengambil data"},
            {status:500}
        );
    }
}

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const randomNumber =
            Math.floor(100 + Math.random() * 900);

        const generatedResi =
            `CRG-2026-${randomNumber}`;

        const result = await sql`

        INSERT INTO orders
        (
            receipt,
            sender,
            receiver,
            type,
            total
        )

        VALUES
        (
            ${generatedResi},
            ${body.senderName},
            ${body.receiverName},
            ${body.type},
            ${body.total}
        )

        RETURNING *
        `;

        return Response.json(result[0]);

    }catch(error){

        return Response.json(
            {error:"Gagal menyimpan data"},
            {status:500}
        );
    }
}