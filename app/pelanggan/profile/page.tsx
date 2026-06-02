"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Ambil data profil saat halaman dibuka
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (res.ok && json.success) {
          setForm({
            nama:     json.data.nama     ?? "",
            email:    json.data.email    ?? "",
            password: "",
            phone:    json.data.phone    ?? "",
            address:  json.data.address  ?? "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.email.includes("@")) newErrors.email = "Format email salah, harus menggunakan (@)";
    if (form.password.length > 0 && form.password.length < 8) newErrors.password = "Password minimal 8 karakter";
    if (form.phone.length < 10) newErrors.phone = "Nomor telepon minimal 10 digit";
    if (!form.address.trim()) newErrors.address = "Alamat belum lengkap (contoh: jalan, nomor, kota)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
          phone:    form.phone,
          address:  form.address,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccess("Perubahan profil berhasil disimpan");
        setForm({ ...form, password: "" });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setErrors({ submit: json.message ?? "Gagal menyimpan perubahan" });
      }
    } catch (e) {
      setErrors({ submit: "Tidak dapat terhubung ke server" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
      {success && (
        <div className="fixed top-5 right-5 z-[60] bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {success}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-10">
            <div className="flex flex-col">
              <span className="text-green-700 font-semibold text-lg">PaketinAja</span>
              <span className="text-gray-700 text-sm">Kirim mudah, cepat, dan aman</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <button onClick={() => { router.push("/pelanggan/dashboard"); setOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Beranda</button>
            <button onClick={() => { router.push("/pelanggan/history"); setOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Riwayat</button>
            <button onClick={() => { router.push("/pelanggan/profile"); setOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium">Profil</button>
          </div>
          <button onClick={() => router.push("/keluar")} className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
        </div>
      </div>

      {/* Main */}
      <div className={`transition-all duration-300 ${open ? "blur-sm" : ""}`}>

        {/* Navbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <img src="/humbergerMenu.png" alt="menu" className="w-8 h-8 object-contain" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/LogoPaketinAja.jpeg" className="w-8 h-8 rounded-full object-contain" />
            <span className="text-gray-700 font-semibold">PaketinAja</span>
          </div>
          <div />
        </div>

        {/* Content */}
        <div className="px-10 py-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold">Profil Saya</h2>
          <p className="text-gray-500 text-sm mb-6">Kelola informasi profil Anda</p>

          <div className="bg-white p-6 rounded-2xl shadow max-w-xl w-full">
            <h3 className="font-bold mb-3">Edit Profil</h3>

            {loading ? (
              <p className="text-gray-400 text-sm text-center py-6">Memuat data profil...</p>
            ) : (
              <>
                {errors.submit && <p className="text-red-500 text-sm mb-3">{errors.submit}</p>}

                <div className="mb-4">
                  <label>Nama</label>
                  <input value={form.nama} disabled className="w-full px-4 py-2 border rounded-lg mt-1 bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>

                <div className="mb-4">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg mt-1" />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>

                <div className="mb-4">
                  <label>Password Baru <span className="text-gray-400 text-xs">(kosongkan jika tidak ingin mengubah)</span></label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-red-500 text-sm">{errors.password}</p>
                </div>

                <div className="mb-4">
                  <label>Nomor Telepon</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg mt-1" />
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                </div>

                <div className="mb-4">
                  <label>Alamat</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg mt-1" />
                  <p className="text-red-500 text-sm">{errors.address}</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-green-600 text-white w-full py-3 rounded-lg mt-3 hover:bg-green-700 transition-all duration-200 disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </>
            )}
          </div>

          <div className="max-w-xl w-full mt-6 flex flex-col gap-3">
            <button onClick={() => router.push("/keluar")} className="border border-red-600 text-red-700 py-3 rounded-lg hover:bg-red-100 transition-all duration-200">Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
}