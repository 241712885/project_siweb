"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type Role = "admin" | "pelanggan";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("pelanggan");
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<any>({});
  const [globalError, setGlobalError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const savedAttempt = localStorage.getItem("login_attempt");
    if (savedAttempt) setAttempt(parseInt(savedAttempt));
  }, []);

  useEffect(() => {
    localStorage.setItem("login_attempt", attempt.toString());
  }, [attempt]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setForm({ username: "", email: "", password: "" });
    setError({});
    setGlobalError("");
    setInputCaptcha("");
    generateCaptcha();
  }, [role]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const validate = () => {
    const e: any = {};
    if (role === "admin") {
      if (!form.username.trim()) {
        e.username = "Username tidak boleh kosong";
      } else if (form.username !== "admin123") {
        e.username = "Username admin tidak valid";
      }
      
      if (!form.email.trim()) {
        e.email = "Email tidak boleh kosong";
      } else if (form.email !== "admin@gmail.com") {
        e.email = "Email admin tidak valid";
      }

      if (!form.password) {
        e.password = "Password tidak boleh kosong";
      } else if (form.password !== "paketinaja2026") {
        e.password = "Password admin tidak valid";
      }
    } else {
        if (!form.username.trim()) {
          e.username = "Username tidak boleh kosong";
        } else if (form.username.length < 5) {
          e.username = "Username minimal 5 karakter";
        }

          if (!form.email.trim()) {
            e.email = "Email tidak boleh kosong";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "Format email tidak valid";
          }
    }
    if (!form.password) {
      e.password = "Password tidak boleh kosong";
    }
    if (!inputCaptcha.trim()) {
      e.captcha = "Captcha tidak boleh kosong";
    } else if (inputCaptcha.toUpperCase() !== captcha) {
      e.captcha = "Captcha tidak sesuai";
      generateCaptcha();
      setInputCaptcha("");
    }
    setError(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (attempt >= 3) {
      setGlobalError("Kesempatan login habis. Silakan reset terlebih dahulu.");
      return;
    }
    setGlobalError("");
    if (!validate()) {
      setAttempt((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGlobalError(data.error || "Username, email, atau password salah");
        setAttempt((prev) => prev + 1);
        generateCaptcha();
        setInputCaptcha("");
        setToast({ type: "error", message: data.error || "Login gagal. Periksa kembali data Anda." });
        return;
      }

      setAttempt(0);
      localStorage.removeItem("login_attempt");
      setToast({ type: "success", message: "Login berhasil!" });
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/beranda");
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setGlobalError("Terjadi kesalahan koneksi. Coba lagi.");
      setToast({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAttempt = () => {
    setAttempt(0);
    localStorage.removeItem("login_attempt");
    setGlobalError("");
    setError({});
    generateCaptcha();
    setInputCaptcha("");
    setForm({ username: "", email: "", password: "" });
  };

  const sisaPercobaan = 3 - attempt;
  const locked = attempt >= 3;

  return (
    <div className="page-wrapper">
      {/* Decorative circles */}
      <div className="deco deco-tl" />
      <div className="deco deco-br" />
      <div className="deco deco-mid" />

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div className="card">
        <div className="logo-ring">
          <Image src="/LogoPaketinAja.jpeg" alt="PaketinAja Logo"
            width={80} height={80} priority
            style={{ objectFit: "contain", borderRadius: "50%" }}
          />
        </div>
        <h1 className="title">Welcome to PaketinAja</h1>
        <p className="subtitle">Sign in to continue</p>

        <div className="role-toggle">
          <button type="button" onClick={() => setRole("pelanggan")}
            className={`role-btn ${role === "pelanggan" ? "role-active" : ""}`}>
            Pelanggan
          </button>
          <button type="button" onClick={() => setRole("admin")}
            className={`role-btn ${role === "admin" ? "role-active" : ""}`}>
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="field">
            <label className="label">Username</label>
            <div className={`input-wrap ${error.username ? "has-error" : ""}`}>
              <input
                type="text"
                placeholder={"Masukkan username"}
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  setError({ ...error, username: undefined });
                  setGlobalError("");
                }}
                disabled={locked}
                className="inp"
              />
            </div>
            {error.username && <p className="err">{error.username}</p>}
          </div>

          {/* Email */}
          <div className="field">
            <label className="label">Email</label>
            <div className={`input-wrap ${error.email ? "has-error" : ""}`}>
              <input
                type="email"
                placeholder={"Masukkan email"}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setError({ ...error, email: undefined });
                  setGlobalError("");
                }}
                disabled={locked}
                className="inp"
              />
            </div>
            {error.email && <p className="err">{error.email}</p>}
          </div>

          {/* Password */}
          <div className="field">
            <label className="label">Password</label>
            <div className={`input-wrap ${error.password ? "has-error" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setError({ ...error, password: undefined });
                  setGlobalError("");
                }}
                disabled={locked}
                className="inp"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-btn"
                >
                {showPassword ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
              </button>
            </div>
            {error.password && <p className="err">{error.password}</p>}
          </div>

          {/* Captcha */}
          <div className="field">
            <label className="label">Captcha</label>
            <div className="captcha-row">
              <div className="captcha-box">
                <span className="captcha-text">{captcha}</span>
              </div>
              <button type="button" onClick={generateCaptcha} className="refresh-btn" title="Refresh captcha">
                🔄
              </button>
            </div>
            <div className={`input-wrap ${error.captcha ? "has-error" : ""}`}>
              <input
                type="text"
                placeholder="Masukkan captcha di atas"
                value={inputCaptcha}
                onChange={(e) => {
                  setInputCaptcha(e.target.value.toUpperCase());
                  setError({ ...error, captcha: undefined });
                }}
                disabled={locked}
                className="inp"
                maxLength={5}
              />
            </div>
            {error.captcha && <p className="err">{error.captcha}</p>}
          </div>

          {globalError && (
            <div className="global-error"><span>⚠️</span> {globalError}</div>
          )}

          {!locked && attempt > 0 && (
            <p className="attempt-text">
              Sisa percobaan:{" "}
              <span className={sisaPercobaan <= 1 ? "attempt-red" : "attempt-green"}>
                {sisaPercobaan}x
              </span>
            </p>
          )}

          {locked && (
            <div className="lock-box">
              <p>Terlalu banyak percobaan gagal.</p>
              <button type="button" onClick={resetAttempt} className="reset-btn">
                Reset Kesempatan
              </button>
            </div>
          )}

          <button type="submit" disabled={locked || isLoading} className="submit-btn">
            {isLoading ? <span className="spinner" /> : "Sign in"}
          </button>
        </form>

        <div className="footer-links">
          <p className="footer-item">Forgot Password?</p>
          {role === "pelanggan" && (
            <p className="footer-item">
              Need an account?{" "}
              <span className="link" onClick={() => router.push("/login-regist/register")}>
                Register
              </span>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .page-wrapper {
          min-height: 100vh;
          background: #2BAB6F;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 16px;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Decorative circles */
        .deco {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .deco-tl {
          width: 300px; height: 300px;
          background: rgba(255,255,255,0.07);
          top: -100px; left: -100px;
        }
        .deco-br {
          width: 400px; height: 400px;
          background: rgba(255,255,255,0.05);
          bottom: -150px; right: -150px;
        }
        .deco-mid {
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.04);
          top: 40%; left: 10%;
        }

        /* Toast */
        .toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          animation: slideDown 0.3s ease;
          white-space: nowrap;
        }
        .toast-success { background: #22c55e; color: #fff; }
        .toast-error   { background: #ef4444; color: #fff; }
        .toast-icon { font-size: 15px; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Card */
        .card {
          background: #fff;
          border-radius: 20px;
          padding: 28px 26px 20px;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .logo-ring {
          width: 68px; height: 68px;
          background: #2BAB6F;
          border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          margin: 0 auto 12px;
          box-shadow: 0 4px 12px rgba(43,171,111,0.4);
          overflow: hidden;
        }

        .title {
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px;
        }
        .subtitle {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin: 0 0 18px;
        }

        /* Fields */
        .field { margin-bottom: 10px; }
        .label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #444;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .input-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          background: #fafafa;
          transition: border-color 0.2s;
          overflow: hidden;
          padding-left: 12px;
        }
        .input-wrap:focus-within { border-color: #2BAB6F; background: #fff; }
        .input-wrap.has-error { border-color: #ef4444; }
        .inp {
            flex: 1; border: none; outline: none;
            background: transparent;
            font-size: 11.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 8px 8px 8px 12px; /* tambah padding-left 12px */
            color: #1a1a1a;
            }
        .inp::placeholder { color: #bbb; }
        .inp:disabled { opacity: 0.5; cursor: not-allowed; }
        .eye-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0 10px;
          font-size: 13px;
          width: auto;
          margin: 0;
        }

        .err {
          color: #ef4444;
          font-size: 10px;
          margin: 3px 0 0;
        }

        /* Captcha */
        .captcha-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .captcha-box {
          background: linear-gradient(135deg, #f0fdf6 0%, #dcfce7 100%);
          border: 1.5px dashed #2BAB6F;
          border-radius: 8px;
          padding: 6px 14px;
          flex: 1;
        }
        .captcha-text {
          font-family: 'Courier New', monospace;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #1a6640;
          user-select: none;
          text-decoration: line-through;
          text-decoration-color: rgba(43,171,111,0.3);
        }
        .refresh-btn {
          background: transparent;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          width: auto;
          transition: border-color 0.2s;
          margin: 0;
        }
        .refresh-btn:hover { border-color: #2BAB6F; }

        /* Errors / States */
        .global-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 11px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .attempt-text {
          font-size: 10px;
          text-align: center;
          color: #888;
          margin: 6px 0 0;
        }
        .attempt-green { color: #16a34a; font-weight: 600; }
        .attempt-red   { color: #dc2626; font-weight: 600; }

        .lock-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 12px;
          margin-top: 8px;
          text-align: center;
          font-size: 11px;
          color: #dc2626;
        }
        .lock-box p { margin: 0 0 8px; }
        .reset-btn {
          background: #f97316;
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 7px 18px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          width: auto;
          margin: 0;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 11px;
          background: #2BAB6F;
          color: #fff;
          border: none;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.1s;
          box-shadow: 0 4px 12px rgba(43,171,111,0.35);
        }
        .submit-btn:hover:not(:disabled) { background: #22925e; transform: translateY(-1px); }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .footer-links {
          margin-top: 14px;
          text-align: center;
        }
        .footer-item {
          font-size: 10px;
          color: #888;
          margin: 4px 0;
        }
        .link {
          color: #2BAB6F;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .link:hover { color: #1a8a56; }
        .role-toggle {
          position: relative;
          display: flex;
          background: #e3e5ea;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 18px;
          overflow: hidden;
        }

        .role-slider {
          position: absolute;
          top: 4px;
          bottom: 4px;
          width: calc(50% - 4px);
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #2BAB6F 0%,
            #23955f 100%
          );
          box-shadow: 0 4px 12px rgba(43, 171, 111, 0.25);
          transition: all 0.3s ease;
        }

        .slide-left {
          left: 4px;
        }

        .slide-right {
          left: calc(50%);
        }

        .role-btn {
          flex: 1;
          position: relative;
          z-inde: 2;
          background: transparent;
          border: none;
          padding: 10px;
          font-size: 12px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .role-active {
          color: white;
        }

        .role-btn:not(.role-active):hover {
          color: #2BAB6F;
        }
        
        .role-toggle {
          display: flex;
          background: #e5e7eb;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 18px;
          gap: 4px;
        }

        .role-btn {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          color: #6b7280;
          transition: all 0.25s ease;
        }

        .role-btn.role-active {
          background: #2BAB6F;
          color: white;
          box-shadow: 0 4px 12px rgba(43, 171, 111, 0.3);
        }

        .role-btn:hover:not(.role-active) {
          background: rgba(43, 171, 111, 0.08);
          color: #2BAB6F;
        }
      `}</style>
    </div>
  );
}