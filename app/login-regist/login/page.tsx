"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<any>({});
  const [globalError, setGlobalError] = useState("");
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.toLowerCase().includes(".com");
  };

  useEffect(() => {
    const savedAttempt = localStorage.getItem("attempt");
    if (savedAttempt) {
      setAttempt(parseInt(savedAttempt));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("attempt", attempt.toString());
  }, [attempt]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (attempt >= 3) {
      setGlobalError("Kesempatan habis. Silakan reset dulu.");
      return;
    }

    setGlobalError("");

    let newError: any = {};
    let valid = true;

    if (!form.email) {
      newError.email = "Email tidak boleh kosong";
      valid = false;
    } else if (!isValidEmail(form.email)) {
      newError.email = "Email tidak valid (contoh: nama@email.com)";
      valid = false;
    }

    if (!form.password) {
      newError.password = "Password tidak boleh kosong";
      valid = false;
    }

    if (inputCaptcha !== captcha) {
      newError.captcha = "Captcha tidak valid";
      generateCaptcha();
      setInputCaptcha("");
      valid = false;
    }

    setError(newError);

    if (!valid) {
      setAttempt((prev) => prev + 1);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError((prev: any) => ({ ...prev, email: "Email tidak terdaftar" }));
        } else if (res.status === 401) {
          setError((prev: any) => ({ ...prev, password: "Password salah" }));
        } else {
          setGlobalError(data.message || "Login gagal");
        }
        setAttempt((prev) => prev + 1);
        generateCaptcha();
        setInputCaptcha("");
        return;
      }

      setAttempt(0);
      localStorage.removeItem("attempt");
      setGlobalError("");
      setError({});
      setInputCaptcha("");

      if (data.role === "admin") {
        router.push("/admin/beranda");
      } else if (data.role === "pelanggan") {
        router.push("/pelanggan/dashboard");
      } else {
        setGlobalError("Role tidak dikenali.");
      }
    } catch (err) {
      setGlobalError("Gagal terhubung ke server. Coba lagi.");
      setAttempt((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const resetAttempt = () => {
    setAttempt(0);
    localStorage.removeItem("attempt");
    setGlobalError("");
    setError({});
    generateCaptcha();
    setInputCaptcha("");
  };

  return (
    <div className="min-h-screen bg-[#2BAB6F] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[330px] bg-[#EDEDED] rounded-2xl p-5 text-center">

        <div className="w-[70px] h-[70px] bg-[#2BAB6F] rounded-full flex items-center justify-center mx-auto mb-2.5 overflow-hidden">
          <Image
            src="/LogoPaketinAja.jpeg"
            alt="logo"
            width={80}
            height={80}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        <h2 className="text-base font-semibold my-1 text-gray-900">Welcome to PaketinAja</h2>
        <p className="text-xs text-gray-600 mb-2.5">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="text-left mb-2">
            <label className="text-xs text-gray-700">Email</label>
            <input
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-2 py-2 mt-[3px] rounded-lg border border-gray-300 text-xs box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[10px]">{error.email}</span>
          </div>

          <div className="text-left mb-2">
            <label className="text-xs text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setGlobalError("");
              }}
              className="w-full px-2 py-2 mt-[3px] rounded-lg border border-gray-300 text-xs box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[10px]">{error.password}</span>
          </div>

          <div className="text-left mb-2">
            <label className="text-xs text-gray-700">Captcha</label>
            <div>
              <span className="inline-block bg-gray-300 px-2 py-1 rounded-md text-[10px] tracking-[3px] font-bold mb-[3px]">
                {captcha}
              </span>
            </div>
            <input
              placeholder="Masukkan captcha"
              value={inputCaptcha}
              onChange={(e) => {
                setInputCaptcha(e.target.value);
                setGlobalError("");
              }}
              className="w-full px-2 py-2 mt-[3px] rounded-lg border border-gray-300 text-xs box-border focus:outline-none focus:ring-2 focus:ring-[#2BAB6F]"
            />
            <span className="text-red-600 text-[10px]">{error.captcha}</span>
          </div>

          {globalError && (
            <div className="bg-red-100 text-red-600 px-1.5 py-1.5 rounded-lg text-[10px] mt-1.5">
              {globalError}
            </div>
          )}

          <p className="text-[10px] mt-1.5 text-gray-700">
            Sisa percobaan: {3 - attempt}
          </p>

          {attempt >= 3 && (
            <div className="bg-red-100 text-red-600 px-2 py-2 rounded-lg text-[10px] mt-2">
              <p>Terlalu banyak percobaan. Silakan reset.</p>
              <button
                type="button"
                onClick={resetAttempt}
                className="w-full py-2.5 bg-[#f4a742] text-white border-none rounded-full mt-1.5 cursor-pointer text-[13px]"
              >
                Reset Kesempatan
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={attempt >= 3 || loading}
            className="w-full py-2.5 bg-[#2BAB6F] text-white border-none rounded-full mt-2 cursor-pointer text-[13px] disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Sign in"}
          </button>

        </form>

        <div className="text-[10px] mt-2 text-gray-700">
          <p>
            Need an account?{" "}
            <span
              className="text-[#2BAB6F] font-medium cursor-pointer"
              onClick={() => router.push("/login-regist/register")}
            >
              Register
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}