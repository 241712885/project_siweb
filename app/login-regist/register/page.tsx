"use client";

import { useState } from "react";
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
  const captchaCode = "xDM72w";
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.toLowerCase().includes(".com");
  };
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

    if (Object.keys(newError).length > 0) return;

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
    <div className="container">
      <div className="card">

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              value={form.username}
              placeholder="Masukkan username"
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.username}</span>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              placeholder="Masukkan email"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.email}</span>
          </div>

          <div className="field">
            <label>Nomor Telepon</label>
            <input
              value={form.phone}
              placeholder="Masukkan nomor telepon"
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, phone: onlyNumber });
                setGlobalError("");
              }}
            />
            <span className="error">{error.phone}</span>
          </div>

          <div className="field">
            <label>Alamat</label>
            <input
              value={form.address}
              placeholder="Masukkan alamat"
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.address}</span>
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              placeholder="Masukkan password"
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.password}</span>
          </div>

          <div className="field">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              placeholder="Masukkan ulang password"
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.confirmPassword}</span>
          </div>

          <div className="field">
            <label>Captcha</label>
            <div className="captcha-box">{captchaCode}</div>
            <input
              placeholder="Masukkan captcha"
              onChange={(e) => {
                setForm({ ...form, captcha: e.target.value });
                setGlobalError("");
              }}
            />
            <span className="error">{error.captcha}</span>
          </div>

          {globalError && (
            <div className="global-error">{globalError}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Register"}
          </button>

          <p className="footer">
            Sudah punya akun?{" "}
            <Link href="/login-regist/login" className="link">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <style jsx global>{`
        * { font-family: 'Poppins', sans-serif; }
        body { margin: 0; }
      `}</style>

      <style jsx>{`
        .container {
          min-height: 100vh;
          overflow-y: auto;
          background: #2BAB6F;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px 0;
        }

        .card {
          width: 300px;
          background: #EDEDED;
          padding: 16px;
          border-radius: 16px;
        }

        h2 {
          text-align: center;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .field {
          margin-bottom: 5px;
        }

        label {
          font-size: 10px;
        }

        input {
          width: 100%;
          padding: 6px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 10px;
          box-sizing: border-box;
        }

        .captcha-box {
          background: #ddd;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 9px;
          margin: 2px 0;
          display: inline-block;
          letter-spacing: 2px;
          font-weight: bold;
        }

        button {
          width: 100%;
          padding: 7px;
          background: #2BAB6F;
          color: white;
          border: none;
          border-radius: 18px;
          margin-top: 5px;
          cursor: pointer;
          font-size: 12px;
        }

        button:disabled {
          background: gray;
          cursor: not-allowed;
        }

        .error {
          color: red;
          font-size: 8px;
        }

        .global-error {
          background: #ffe5e5;
          color: red;
          padding: 6px;
          border-radius: 8px;
          font-size: 9px;
          margin-top: 4px;
        }

        .footer {
          font-size: 9px;
          text-align: center;
          margin-top: 5px;
        }

        .link {
          color: #2BAB6F;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}