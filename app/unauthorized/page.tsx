"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#2BAB6F] flex items-center justify-center relative overflow-hidden px-4">

      {/* Card */}
      <div
        className={`
          relative z-10 w-[330px] bg-[#EDEDED] rounded-2xl px-6 py-8 text-center shadow-2xl
          transition-all duration-500 ease-out
          ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
        `}
      >
        {/* Icon */}
        <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>

        {/* Text */}
        <h1 className="text-base font-bold text-gray-800 mb-2">
          Akses Ditolak
        </h1>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-5">
          Halaman ini hanya bisa diakses setelah masuk ke akun Anda.
          <br />
          Silakan login terlebih dahulu untuk melanjutkan.
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#2BAB6F]/40 to-transparent mb-5" />

        {/* Button */}
        <button
          onClick={() => router.push("/login-regist/login")}
          className="w-full py-2.5 bg-[#2BAB6F] hover:bg-[#239961] text-white text-[13px] font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>→</span>
          Masuk ke Akun
        </button>

        {/* Hint */}
        <p className="mt-3 text-[10px] text-gray-400">
          Belum punya akun?{" "}
          <span
            className="text-[#2BAB6F] font-semibold cursor-pointer hover:text-[#1a7a4a] transition-colors"
            onClick={() => router.push("/login-regist/register")}
          >
            Daftar sekarang
          </span>
        </p>
      </div>
    </div>
  );
}