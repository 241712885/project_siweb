"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Driver {
  id: number;
  nama_driver: string;
  no_telepon: string;
  no_sim: string;
  status_driver: string;
}

interface Kendaraan {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  plat_nomor: string;
  kapasitas_muatan: number;
  status_kendaraan: string;
}

export default function OrderManagement() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resi, setResi] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [kendaraans, setKendaraans] = useState<Kendaraan[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const router = useRouter();

  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    weight: "",
    email: "",
    metode_pembayaran: "",
    notes: "",
    type: "Paket Kecil",
    idDriver: "",
    idKendaraan: "",
    namaBarang: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch driver & kendaraan yang tersedia
  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdown(true);
      try {
        const [driverRes, kendaraanRes] = await Promise.all([
          fetch("/api/driver"),
          fetch("/api/kendaraan"),
        ]);
        const driverData = await driverRes.json();
        const kendaraanData = await kendaraanRes.json();

        // Hanya tampilkan yang berstatus tersedia
        setDrivers(
          (driverData.data || []).filter(
            (d: Driver) => d.status_driver === "tersedia"
          )
        );
        setKendaraans(
          (kendaraanData.data || []).filter(
            (k: Kendaraan) => k.status_kendaraan === "tersedia"
          )
        );
      } catch (err) {
        console.error("Gagal fetch dropdown:", err);
      } finally {
        setLoadingDropdown(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const error: Record<string, string> = {};

    if (!form.senderName.trim()) error.senderName = "Nama pengirim wajib diisi";
    if (!form.senderPhone.trim()) error.senderPhone = "Nomor telepon wajib diisi";
    else if (!/^\d{9,15}$/.test(form.senderPhone))
      error.senderPhone = "Nomor telepon tidak valid (9-15 digit)";

    if (!form.senderAddress.trim()) {
      error.senderAddress = "Alamat pengirim wajib diisi";
    } else if (form.senderAddress.split(",").length < 3) {
      error.senderAddress =
        "Format: Nama Jalan, Kota, Provinsi (contoh: Jl. Sudirman No.5, Jakarta, DKI Jakarta)";
    }

    if (!form.receiverName.trim())
      error.receiverName = "Nama penerima wajib diisi";
    if (!form.receiverPhone.trim())
      error.receiverPhone = "Nomor telepon wajib diisi";
    else if (!/^\d{9,15}$/.test(form.receiverPhone))
      error.receiverPhone = "Nomor telepon tidak valid (9-15 digit)";

    if (!form.receiverAddress.trim()) {
      error.receiverAddress = "Alamat penerima wajib diisi";
    } else if (form.receiverAddress.split(",").length < 3) {
      error.receiverAddress =
        "Format: Nama Jalan, Kota, Provinsi (contoh: Jl. Sudirman No.5, Jakarta, DKI Jakarta)";
    }

    if (!form.weight || Number(form.weight) < 1)
      error.weight = "Berat minimal 1 kg";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      error.email = "Format email salah";
    if (!form.metode_pembayaran) error.metode_pembayaran = "Pilih metode pembayaran";
    if (!form.idDriver) error.idDriver = "Pilih driver";
    if (!form.idKendaraan) error.idKendaraan = "Pilih kendaraan";

    if (!form.namaBarang.trim()) error.namaBarang = "Nama barang wajib diisi";

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const getPricePerKg = () => {
    switch (form.type) {
      case "Paket Kecil":
        return 10000;
      case "Paket Sedang":
        return 15000;
      case "Paket Besar":
        return 20000;
      default:
        return 10000;
    }
  };

  const totalPrice = () => {
    const weight = Number(form.weight);
    if (!weight || weight < 1) return 0;
    return weight * getPricePerKg();
  };

  const formatRupiah = (number: number) =>
    "Rp " + number.toLocaleString("id-ID");

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/pemesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: form.senderName,
          senderPhone: form.senderPhone,
          senderAddress: form.senderAddress,
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          receiverAddress: form.receiverAddress,
          type: form.type,
          weight: form.weight,
          total: totalPrice(),
          metode_pembayaran: form.metode_pembayaran,
          notes: form.notes,
          email: form.email,
          idDriver: form.idDriver,
          idKendaraan: form.idKendaraan,
          namaBarang: form.namaBarang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Terjadi kesalahan, coba lagi.");
        return;
      }

      setResi(data.no_resi);

      setForm({
        senderName: "",
        senderPhone: "",
        senderAddress: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        weight: "",
        email: "",
        metode_pembayaran: "",
        notes: "",
        type: "Paket Kecil",
        idDriver: "",
        idKendaraan: "",
        namaBarang: "",
      });

      // Re-fetch dropdown supaya driver/kendaraan yang baru dipakai tidak muncul lagi
      const [driverRes, kendaraanRes] = await Promise.all([
        fetch("/api/driver"),
        fetch("/api/kendaraan"),
      ]);
      const driverData = await driverRes.json();
      const kendaraanData = await kendaraanRes.json();
      setDrivers(
        (driverData.data || []).filter(
          (d: Driver) => d.status_driver === "tersedia"
        )
      );
      setKendaraans(
        (kendaraanData.data || []).filter(
          (k: Kendaraan) => k.status_kendaraan === "tersedia"
        )
      );

      if (form.metode_pembayaran === "tunai") {
        setShowSuccess(true);
      } else {
        router.push(
          `/admin/order/transfer?resi=${data.no_resi}&total=${totalPrice()}`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungi server. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDriver = drivers.find((d) => d.id === Number(form.idDriver));
  const selectedKendaraan = kendaraans.find(
    (k) => k.id === Number(form.idKendaraan)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
      {/* Overlay sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
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

          <div className="space-y-2 flex-1">
            <button
              onClick={() => {
                router.push("/admin/beranda");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              Beranda
            </button>
            <button
              onClick={() => {
                router.push("/admin/order");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
            >
              Pemesanan
            </button>
            <button
              onClick={() => {
                router.push("/admin/pengiriman");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              Pengiriman
            </button>
            <button
              onClick={() => {
                router.push("/admin/armada");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              Armada
            </button>
          </div>

          <button
            onClick={() => router.push("/keluar")}
            className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Main */}
      <div className={`transition-all duration-300 ${open ? "blur-sm pointer-events-none" : ""}`}>
        {/* Navbar */}
        <div className="relative flex items-center justify-between px-8 py-5 bg-[#F5F7F6] border border-gray-300 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-200 via-green-500 to-emerald-300 blur-[1px]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-green-100 rounded-full opacity-40 blur-2xl" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-emerald-100 rounded-full opacity-40 blur-2xl" />
          
          <button
            onClick={() => setOpen(true)}
            className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition"
          >
            <img
              src="/humbergerMenu.png"
              alt="menu"
              className="w-8 h-8 object-contain"
            />
          </button>
          <div className="flex items-center gap-2">
            <img src="/LogoPaketinAja.jpeg" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
            <span className="text-gray-700 font-semibold">PaketinAja</span>
          </div>
          <div />
        </div>

        {/* Form */}
        <div className="px-10 py-10">
          <h1 className="text-2xl font-bold mb-6">Input Pesanan Baru</h1>

          {/* Data Pengirim & Penerima */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pengirim */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-2">
              <h2 className="font-semibold mb-4 text-green-700">
                Data Pengirim
              </h2>
              <input
                name="senderName"
                value={form.senderName}
                placeholder="Nama"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.senderName && (
                <p className="text-red-500 text-sm">{errors.senderName}</p>
              )}

              <input
                name="senderPhone"
                value={form.senderPhone}
                placeholder="Nomor Telepon"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.senderPhone && (
                <p className="text-red-500 text-sm">{errors.senderPhone}</p>
              )}

              <textarea
                name="senderAddress"
                value={form.senderAddress}
                placeholder="Alamat Lengkap (Nama Jalan, Kota, Provinsi)"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.senderAddress && (
                <p className="text-red-500 text-sm">{errors.senderAddress}</p>
              )}
            </div>

            {/* Penerima */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-2">
              <h2 className="font-semibold mb-4 text-green-700">
                Data Penerima
              </h2>
              <input
                name="receiverName"
                value={form.receiverName}
                placeholder="Nama"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.receiverName && (
                <p className="text-red-500 text-sm">{errors.receiverName}</p>
              )}

              <input
                name="receiverPhone"
                value={form.receiverPhone}
                placeholder="Nomor Telepon"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.receiverPhone && (
                <p className="text-red-500 text-sm">{errors.receiverPhone}</p>
              )}

              <textarea
                name="receiverAddress"
                value={form.receiverAddress}
                placeholder="Alamat Lengkap (Nama Jalan, Kota, Provinsi)"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.receiverAddress && (
                <p className="text-red-500 text-sm">{errors.receiverAddress}</p>
              )}
            </div>
          </div>

          {/* Detail Paket */}
          <div className="bg-white p-6 rounded-2xl shadow mt-8">
            <h2 className="font-semibold mb-6 text-green-700">Detail Paket</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Kiri */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Tipe Paket
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Paket Kecil</option>
                    <option>Paket Sedang</option>
                    <option>Paket Besar</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {form.type === "Paket Kecil" &&
                      "Rp 10.000/kg · Pengiriman Biasa"}
                    {form.type === "Paket Sedang" &&
                      "Rp 15.000/kg · Pengiriman Cepat"}
                    {form.type === "Paket Besar" &&
                      "Rp 20.000/kg · Pengiriman VVIP"}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Nama Barang
                  </label>
                  <input
                    name="namaBarang"
                    value={form.namaBarang}
                    placeholder="contoh: Sepatu, Elektronik, Makanan"
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.namaBarang && (
                    <p className="text-red-500 text-sm mt-1">{errors.namaBarang}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Berat (kg)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    min={1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* Tengah */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Email Pelanggan{" "}
                    <span className="text-gray-400">(opsional)</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="untuk menghubungkan ke akun pelanggan"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Total Harga
                  </label>
                  <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-green-700 font-semibold text-lg">
                    {formatRupiah(totalPrice())}
                  </div>
                </div>
              </div>

              {/* Kanan */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 block">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Catatan tambahan (opsional)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Driver & Kendaraan */}
          <div className="bg-white p-6 rounded-2xl shadow mt-8">
            <h2 className="font-semibold mb-6 text-green-700">
              Penugasan Driver & Kendaraan
            </h2>

            {loadingDropdown ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Memuat data driver & kendaraan...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pilih Driver */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Pilih Driver
                  </label>
                  {drivers.length === 0 ? (
                    <div className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-sm">
                      ⚠️ Tidak ada driver tersedia saat ini
                    </div>
                  ) : (
                    <select
                      name="idDriver"
                      value={form.idDriver}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">-- Pilih Driver --</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nama_driver} · {d.no_telepon}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.idDriver && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.idDriver}
                    </p>
                  )}
                  {/* Info driver terpilih */}
                  {selectedDriver && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
                      <p className="font-medium">{selectedDriver.nama_driver}</p>
                      <p className="text-green-600">
                        SIM: {selectedDriver.no_sim} · {selectedDriver.no_telepon}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pilih Kendaraan */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Pilih Kendaraan
                  </label>
                  {kendaraans.length === 0 ? (
                    <div className="w-full px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-sm">
                      ⚠️ Tidak ada kendaraan tersedia saat ini
                    </div>
                  ) : (
                    <select
                      name="idKendaraan"
                      value={form.idKendaraan}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">-- Pilih Kendaraan --</option>
                      {kendaraans.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama_kendaraan} · {k.plat_nomor}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.idKendaraan && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.idKendaraan}
                    </p>
                  )}
                  {/* Info kendaraan terpilih */}
                  {selectedKendaraan && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
                      <p className="font-medium">
                        {selectedKendaraan.nama_kendaraan}
                      </p>
                      <p className="text-green-600">
                        {selectedKendaraan.jenis_kendaraan} ·{" "}
                        {selectedKendaraan.plat_nomor} · Maks{" "}
                        {selectedKendaraan.kapasitas_muatan} kg
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metode Pembayaran */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
            <div className="flex gap-4">
              {["tunai", "transfer"].map((method) => (
                <div
                  key={method}
                  onClick={() => setForm({ ...form, metode_pembayaran: method })}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition w-48
                    ${
                      form.metode_pembayaran === method
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.metode_pembayaran === method
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {form.metode_pembayaran === method && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {method}
                  </span>
                </div>
              ))}
            </div>
            {errors.metode_pembayaran && (
              <p className="text-red-500 text-sm mt-2">{errors.metode_pembayaran}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold mt-8 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Menyimpan...
              </>
            ) : (
              "+ Simpan Pesanan"
            )}
          </button>
        </div>
      </div>

      {/* Sukses Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl text-center w-full max-w-[360px] shadow-2xl overflow-hidden">
            {/* Body */}
            <div className="px-10 pt-10 pb-8">
              {/* Ikon centang berlapis */}
              <div className="flex items-center justify-center mx-auto mb-6 w-20 h-20 rounded-full bg-green-100">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                  {/* Checkmark SVG */}
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Judul */}
              <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
                Pesanan Telah
                <br />
                Tersimpan!
              </h2>

              {/* Nomor resi */}
              <p className="mt-4 text-gray-500 text-sm">
                Nomor resi Anda adalah{" "}
                <span className="text-green-600 font-bold tracking-wide">
                  {resi}
                </span>
              </p>

              {/* Sub-teks */}
              <p className="mt-1 text-gray-400 text-sm">
                Pesanan sedang diproses.
              </p>
            </div>

            {/* Tombol Tutup */}
            <div className="px-6 pb-8">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push("/admin/beranda");
                }}
                className="w-full bg-green-700 hover:bg-green-800 active:scale-95 text-white py-4 rounded-2xl text-base font-semibold shadow transition-all duration-150"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}