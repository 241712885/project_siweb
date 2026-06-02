// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const nama = req.cookies.get("user_nama")?.value;
  const userId = req.cookies.get("user_id")?.value;

  if (!nama || !userId) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true, nama, userId });
}