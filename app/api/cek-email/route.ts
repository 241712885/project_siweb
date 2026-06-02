import { sql } from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const email = new URL(req.url).searchParams.get("email");

    if (!email) {
      return NextResponse.json({ exists: false });
    }

    const result = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    ` as any[];

    return NextResponse.json({ exists: result.length > 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}