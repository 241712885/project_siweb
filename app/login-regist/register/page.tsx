"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  });

  const [error, setError] = useState<any>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.toLowerCase().includes(".com");
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setGlobalError("");

    let newError: any = {};

    if (!form.username) {
      newError.username = "Username tidak boleh kosong";
    } else if (form.username.length < 10) {
      newError.username = "Username minimal 10 karakter";
    }

    if (!form.email) {
      newError.email = "Email tidak boleh kosong";
    } else if (!isValidEmail(form.email)) {
      newError.email = "Email tidak valid (contoh: nama@email.com)";
    }

    if (!form.phone) {
      newError.phone = "Nomor Telepon tidak boleh kosong";
    } else if (form.phone.length < 10) {
      newError.phone = "Nomor telepon minimal 10 digit";
    } else if (form.phone.length > 15) {
      newError.phone = "Nomor telepon maksimal 15 digit";
    }

    if (!form.address) newError.address = "Alamat tidak boleh kosong";

    if (!form.password) {
      newError.password = "Password tidak boleh kosong";
    } else if (form.password.length < 8) {
      newError.password = "Password minimal 8 karakter";
    }

    if (!form.confirmPassword) {
      newError.confirmPassword = "Konfirmasi Password tidak boleh kosong";
    } else if (form.password !== form.confirmPassword) {
      newError.confirmPassword = "Konfirmasi password tidak sesuai";
    }

    if (!form.captcha) {
      newError.captcha = "Captcha tidak boleh kosong";
    } else if (form.captcha !== captchaCode) {
      newError.captcha = "Captcha tidak sesuai";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      generateCaptcha();
      setForm({ ...form, captcha: "" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.username,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          if (data.field === "email") {
            setError((prev: any) => ({ ...prev, email: "Email sudah digunakan" }));
          } else if (data.field === "nama" || data.field === "username") {
            setError((prev: any) => ({ ...prev, username: "Username sudah digunakan" }));
          } else if (data.field === "phone") {
            setError((prev: any) => ({ ...prev, phone: "Nomor telepon sudah digunakan" }));
          } else {
            setGlobalError(data.message || "Data sudah terdaftar");
          }
        } else if (res.status === 400) {
          setGlobalError(data.message || "Data yang dimasukkan tidak valid");
        } else {
          setGlobalError(data.message || "Registrasi gagal. Coba lagi.");
        }
        return;
      }

      router.push("/login-regist/login");
    } catch (err) {
      setGlobalError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2BAB6F] flex justify-center items-start px-4 py-5">
      <div className="w-full max-w-[300px] bg-[#EDEDED] rounded-2xl p-4">

        <h2 className="text-center text-[15px] font-semibold mb-1.5 text-gray-900">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Username</label>
            <input
              value={form.username}
              placeholder="Masukkan username"
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.username}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Email</label>
            <input
              value={form.email}
              placeholder="Masukkan email"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.email}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Nomor Telepon</label>
            <input
              value={form.phone}
              placeholder="Masukkan nomor telepon"
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, phone: onlyNumber });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.phone}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Alamat</label>
            <input
              value={form.address}
              placeholder="Masukkan alamat"
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.address}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              placeholder="Masukkan password"
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.password}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700">Konfirmasi Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              placeholder="Masukkan ulang password"
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[8px]">{error.confirmPassword}</span>
          </div>

          <div className="mb-[5px]">
            <label className="text-[10px] text-gray-700 block">
              Captcha
            </label>

            <div className="bg-gray-300 px-1.5 py-0.5 rounded-md text-[9px] mb-1 inline-block tracking-[2px] font-bold">
              {captchaCode}
            </div>

            <input
              value={form.captcha}
              placeholder="Masukkan captcha"
              onChange={(e) => {
                setForm({ ...form, captcha: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-1.5 py-1.5 rounded-lg border border-gray-300 text-[10px] box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />

            <span className="text-red-600 text-[8px] block">
              {error.captcha}
            </span>
          </div>
          
          {globalError && (
            <div className="bg-red-100 text-red-600 px-1.5 py-1.5 rounded-lg text-[9px] mt-1">
              {globalError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-1.5 bg-[#2BAB6F] text-white border-none rounded-full mt-1.5 cursor-pointer text-xs disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Register"}
          </button>

          <p className="text-[9px] text-center mt-1.5 text-gray-700">
            Sudah punya akun?{" "}
            <Link href="/login-regist/login" className="text-[#2BAB6F] font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}