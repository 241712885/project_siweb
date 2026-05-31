"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.email.includes("@")) {
      newErrors.email = "Format email salah harus menggunakan (@)";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (form.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 digit";
    }

    if (!form.address.trim()) {
      newErrors.address = "Alamat belum lengkap (contoh: jalan, nomor, kota)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSuccess("Perubahan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
        {open && (
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
                onClick={() => setOpen(false)} 
            />
        )}

        {/* Sidebar */}
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 
            ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >  
            <div className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-10">
                    <div className="flex flex-col">
                        <span className="text-green-700 font-semibold text-lg">
                            PaketinAja
                        </span>
                        <span className="text-gray-700 text-sm">
                            Kirim mudah, cepat, dan aman
                        </span>
                    </div>
                </div>

                {/* Menu */}
                <div className="space-y-2 flex-1">
                    <button 
                        onClick={() => {
                            router.push("/pelanggan/dashboard");
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        Beranda
                    </button>

                    <button
                        onClick={() => {
                            router.push("/pelanggan/history");
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        Riwayat
                    </button>

                    <button
                        onClick={() => {
                            router.push("/pelanggan/profile");
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
                    >
                        Profil
                    </button>
                </div>

                {/* Logout */}
                <button 
                  onClick={() => {
                      router.push("/keluar");
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
            </div>
        </div>

        {/* MAIN */}
        <div className={`transition-all duration-300 ${open ? "blur-sm" : ""}`}>

          {/* NAVBAR ATAS */}
          <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src="/humbergerMenu.png"
                alt="menu"
                className="w-8 h-8 object-contain"
              />
            </button>

            {/* LOGO ATAS */}
            <div className="flex items-center gap-2">
              <img
                src="/LogoPaketinAja.jpeg"
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="text-gray-700 font-semibold">
                PaketinAja
              </span>
            </div>

            <div />
          </div>

          {/* CONTENT */}
          <div className="px-10 py-10 flex flex-col items-center">

            <h2 className="text-2xl font-bold">Profil Saya</h2>
            <p className="text-gray-500 text-sm mb-6">
              Kelola informasi profil Anda
            </p>

            <div className="bg-white p-6 rounded-2xl shadow max-w-xl w-full">
              <h3 className="font-bold mb-3">Edit Profil</h3>

              {success && (
                <p className="text-green-600 text-sm mb-3">{success}</p>
              )}

              {/* EMAIL */}
              <div className="mb-4">
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
                <p className="text-red-500 text-sm">{errors.email}</p>
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label>Password</label>

                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <p className="text-red-500 text-sm">{errors.password}</p>
              </div>

              {/* PHONE */}
              <div className="mb-4">
                <label>Nomor Telepon</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
                <p className="text-red-500 text-sm">{errors.phone}</p>
              </div>

              {/* ADDRESS */}
              <div className="mb-4">
                <label>Alamat</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
                <p className="text-red-500 text-sm">{errors.address}</p>
              </div>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white w-full py-3 rounded-lg mt-3 hover:bg-green-700 transition-all duration-200"
              >
                Simpan Perubahan
              </button>
            </div>

            {/* BUTTON BAWAH */}
            <div className="max-w-xl w-full mt-6 flex flex-col gap-3">
              <button 
                onClick={() => router.push("/keluar")}
                className="border border-red-600 text-red-700 py-3 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-200">
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}