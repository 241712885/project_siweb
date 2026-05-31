import { NextRequest, NextResponse } from "next/server";

const ADMIN = {
  nama: "admin123",
  email: "admin@gmail.com",
  password: "admin2026",
  role: "admin",
};

export async function POST(req: NextRequest) {
  try {
    const { nama, email, password } = await req.json();

    if (!nama || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek admin dulu
    if (
      nama === ADMIN.nama &&
      email === ADMIN.email &&
      password === ADMIN.password
    ) {
      return NextResponse.json({
        message: "Login berhasil",
        role: "admin",
      });
    }

    // Selain admin = pelanggan, asal field tidak kosong
    // (validasi minimal: email harus ada @)
    if (!email.includes("@")) {
      return NextResponse.json(
        { message: "Email tidak valid" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Login berhasil",
      role: "pelanggan",
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}