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

    // Validasi form di sisi client
    let newError: any = {};
    let valid = true;

    if (!form.nama) {
      newError.nama = "Nama tidak boleh kosong";
      valid = false;
    } else if (form.nama.length < 5) {
      newError.nama = "Nama minimal 5 karakter";
      valid = false;
    }

    if (!form.email) {
      newError.email = "Email tidak boleh kosong";
      valid = false;
    } else if (!form.email.includes("@")) {
      newError.email = "Email tidak valid (harus ada @)";
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

    // Kirim ke API
    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGlobalError(data.message || "Login gagal");
        setAttempt((prev) => prev + 1);
        generateCaptcha();
        setInputCaptcha("");
        return;
      }

      // Login berhasil — reset state
      setAttempt(0);
      localStorage.removeItem("attempt");
      setGlobalError("");
      setError({});
      setInputCaptcha("");

      // Redirect berdasarkan role dari database
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
    <div className="container">
      <div className="card">

        <div className="logo">
          <Image
            src="/LogoPaketinAja.jpeg"
            alt="logo"
            width={45}
            height={45}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        <h2>Welcome to PaketinAja</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>

          <div className="field">
            <label>Nama</label>
            <input
              placeholder="Masukkan nama"
              value={form.nama}
              onChange={(e) => {
                setForm({ ...form, nama: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.nama}</span>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.email}</span>
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.password}</span>
          </div>

          <div className="field">
            <label>Captcha</label>
            <div>
              <span className="captcha-code">{captcha}</span>
            </div>
            <input
              placeholder="Masukkan captcha"
              value={inputCaptcha}
              onChange={(e) => {
                setInputCaptcha(e.target.value);
                setGlobalError("");
              }}
            />
            <span className="error">{error.captcha}</span>
          </div>

          {globalError && (
            <div className="global-error">{globalError}</div>
          )}

          <p className="attempt">
            Sisa percobaan: {3 - attempt}
          </p>

          {attempt >= 3 && (
            <div className="limit-box">
              <p>Terlalu banyak percobaan. Silakan reset.</p>
              <button type="button" onClick={resetAttempt}>
                Reset Kesempatan
              </button>
            </div>
          )}

          <button type="submit" disabled={attempt >= 3 || loading}>
            {loading ? "Memproses..." : "Sign in"}
          </button>

        </form>

        <div className="footer">
          <p>Forgot Password?</p>
          <p>
            Need an account?{" "}
            <span
              className="link"
              onClick={() => router.push("/login-regist/register")}
            >
              Register
            </span>
          </p>
        </div>

      </div>

      <style jsx global>{`
        * {
          font-family: 'Poppins', sans-serif;
        }
        body {
          margin: 0;
        }
      `}</style>

      <style jsx>{`
        .container {
          height: 100vh;
          overflow-y: auto;
          background: #2BAB6F;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card {
          width: 330px;
          background: #EDEDED;
          padding: 20px;
          border-radius: 16px;
          text-align: center;
        }
        .logo {
          width: 70px;
          height: 70px;
          background: #2BAB6F;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          margin-bottom: 10px;
          overflow: hidden;
        }
        h2 {
          font-size: 16px;
          margin: 5px 0;
        }
        .subtitle {
          font-size: 12px;
          margin-bottom: 10px;
        }
        .field {
          text-align: left;
          margin-bottom: 8px;
        }
        label {
          font-size: 12px;
        }
        input {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-top: 3px;
          font-size: 12px;
          box-sizing: border-box;
        }
        .captcha-code {
          background: #ddd;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          display: inline-block;
          margin-bottom: 3px;
          letter-spacing: 3px;
          font-weight: bold;
        }
        button {
          width: 100%;
          padding: 10px;
          background: #2BAB6F;
          color: white;
          border: none;
          border-radius: 20px;
          margin-top: 8px;
          cursor: pointer;
          font-size: 13px;
        }
        button:disabled {
          background: gray;
          cursor: not-allowed;
        }
        .error {
          color: red;
          font-size: 10px;
        }
        .global-error {
          background: #ffe5e5;
          color: red;
          padding: 6px;
          border-radius: 8px;
          font-size: 10px;
          margin-top: 6px;
        }
        .attempt {
          font-size: 10px;
          margin-top: 5px;
        }
        .limit-box {
          background: #ffe5e5;
          color: red;
          padding: 8px;
          border-radius: 8px;
          font-size: 10px;
          margin-top: 8px;
        }
        .limit-box button {
          background: #f4a742;
          margin-top: 5px;
        }
        .footer {
          font-size: 10px;
          margin-top: 8px;
        }
        .link {
          color: #2BAB6F;
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}