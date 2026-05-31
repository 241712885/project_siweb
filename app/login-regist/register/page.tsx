"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [captchaCode, setCaptchaCode] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setCaptchaCode(result);
  };

  useEffect(() => { generateCaptcha(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const validate = () => {
    const e: any = {};

    if (!form.username.trim()) {
      e.username = "Username tidak boleh kosong";
    } else if (form.username.length < 5) {
      e.username = "Username minimal 5 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      e.username = "Username hanya boleh huruf, angka, dan _";
    }

    if (!form.email.trim()) {
      e.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Format email tidak valid";
    }

    if (!form.phone.trim()) {
      e.phone = "Nomor telepon tidak boleh kosong";
    } else if (form.phone.length < 10 || form.phone.length > 13) {
      e.phone = "Nomor telepon harus 10–13 digit";
    }

    if (!form.address.trim()) {
      e.address = "Alamat tidak boleh kosong";
    } else if (form.address.trim().length < 10) {
      e.address = "Alamat terlalu pendek (min. 10 karakter)";
    }

    if (!form.password) {
      e.password = "Password tidak boleh kosong";
    } else if (form.password.length < 8) {
      e.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = "Password harus mengandung huruf kapital";
    } else if (!/[0-9]/.test(form.password)) {
      e.password = "Password harus mengandung angka";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Konfirmasi password tidak boleh kosong";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Password tidak cocok";
    }

    if (!form.captcha.trim()) {
      e.captcha = "Captcha tidak boleh kosong";
    } else if (form.captcha !== captchaCode) {
      e.captcha = "Captcha tidak sesuai";
      generateCaptcha();
      setForm((prev) => ({ ...prev, captcha: "" }));
    }

    setError(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle field-specific errors from server
        if (data.field) {
          setError({ [data.field]: data.error });
        }
        setToast({ type: "error", message: data.error || "Registrasi gagal. Coba lagi." });
        generateCaptcha();
        setForm((prev) => ({ ...prev, captcha: "" }));
        return;
      }

      setToast({ type: "success", message: "Registrasi berhasil! Silakan login." });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Terjadi kesalahan jaringan. Coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Lemah", color: "#ef4444", width: "30%" };
    if (score === 2) return { label: "Cukup", color: "#f97316", width: "60%" };
    if (score === 3) return { label: "Kuat", color: "#22c55e", width: "85%" };
    return { label: "Sangat Kuat", color: "#16a34a", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="page-wrapper">
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
        <div className="card-header">
          <h1 className="title">Register</h1>
          <p className="subtitle">Buat akun PaketinAja Anda</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="field">
            <label className="label">Username</label>
            <div className={`input-wrap ${error.username ? "has-error" : ""}`}>
              <input
                className="inp"
                type="text"
                placeholder="Masukkan username"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  setError({ ...error, username: undefined });
                }}
              />
            </div>
            {error.username && <p className="err">{error.username}</p>}
          </div>

          {/* Email */}
          <div className="field">
            <label className="label">Email</label>
            <div className={`input-wrap ${error.email ? "has-error" : ""}`}>
              <input
                className="inp"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setError({ ...error, email: undefined });
                }}
              />
            </div>
            {error.email && <p className="err">{error.email}</p>}
          </div>

          {/* Phone */}
          <div className="field">
            <label className="label">Nomor Telepon</label>
            <div className={`input-wrap ${error.phone ? "has-error" : ""}`}>
              <input
                className="inp"
                type="tel"
                placeholder="Masukkan nomor telepon"
                value={form.phone}
                maxLength={13}
                onChange={(e) => {
                  const only = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, phone: only });
                  setError({ ...error, phone: undefined });
                }}
              />
            </div>
            {error.phone && <p className="err">{error.phone}</p>}
          </div>

          {/* Address */}
          <div className="field">
            <label className="label">Alamat</label>
            <div className={`input-wrap textarea-wrap ${error.address ? "has-error" : ""}`}>
              <textarea
                className="inp textarea"
                placeholder="Masukkan alamat lengkap"
                value={form.address}
                rows={2}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  setError({ ...error, address: undefined });
                }}
              />
            </div>
            {error.address && <p className="err">{error.address}</p>}
          </div>

          {/* Password */}
          <div className="field">
            <label className="label">Password</label>
            <div className={`input-wrap ${error.password ? "has-error" : ""}`}>
              <input
                className="inp"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 karakter, huruf kapital & angka"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setError({ ...error, password: undefined });
                }}
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
            {form.password && strength && (
              <div className="strength-bar">
                <div className="strength-track">
                  <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {error.password && <p className="err">{error.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <label className="label">Konfirmasi Password</label>
            <div className={`input-wrap ${error.confirmPassword ? "has-error" : ""}`}>
              <input
                className="inp"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                  setError({ ...error, confirmPassword: undefined });
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="eye-btn"
                >
                {showConfirm ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
              </button>
            </div>
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="match-ok">✓ Password cocok</p>
            )}
            {error.confirmPassword && <p className="err">{error.confirmPassword}</p>}
          </div>

          {/* Captcha */}
          <div className="field">
            <label className="label">Captcha</label>
            <div className="captcha-row">
              <div className="captcha-box">
                <span className="captcha-text">{captchaCode}</span>
              </div>
              <button type="button" onClick={generateCaptcha} className="refresh-btn" title="Refresh captcha">🔄</button>
            </div>
            <div className={`input-wrap ${error.captcha ? "has-error" : ""}`}>
              <input
                className="inp"
                type="text"
                placeholder="Masukkan captcha di atas"
                value={form.captcha}
                onChange={(e) => {
                  setForm({ ...form, captcha: e.target.value });
                  setError({ ...error, captcha: undefined });
                }}
                maxLength={6}
              />
            </div>
            {error.captcha && <p className="err">{error.captcha}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? <span className="spinner" /> : "Register"}
          </button>
        </form>

        <div className="footer-links">
          <p className="footer-item">
            Sudah punya akun?{" "}
            <span className="link" onClick={() => router.push("/login-regist/login")}>
              Sign In
            </span>
          </p>
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
        .input-wrap:focus-within {
            border-color: #2BAB6F;
            background: #fff;
            box-shadow: none;
        }
        .input-wrap.has-error { border-color: #ef4444; }
        .inp {
            flex: 1; border: none; outline: none;
            background: transparent;
            font-size: 11.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 8px 8px 8px 12px; /* tambah padding-left 12px */
            color: #1a1a1a;
        }
        .inp,
            .inp:focus {
            caret-color: #333 !important;
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

        .textarea {
            resize: none;
        }
      `}</style>
    </div>
  );
}