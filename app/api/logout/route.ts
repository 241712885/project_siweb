import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout berhasil" });
    
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    response.cookies.set("user_id", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    response.cookies.set("user_nama", "", { path: "/", maxAge: 0 });
    response.cookies.set("user_role", "", { httpOnly: true, path: "/", maxAge: 0 });

    return response;
}