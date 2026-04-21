"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderManagement() {
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();
    const [resi, setResi] = useState("");
    const [form, setForm] = useState({
        senderName: "",
        senderPhone: "",
        senderAddress: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        weight: "",
        email: "",
        payment: "",
        notes: "",
        type: "Paket Kecil",
    });

    const [errors, setErrors] = useState<any>({});
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let error: any = {};
        if (!form.senderName) error.senderName = "Nama pengirim wajib diisi";
        if (!form.senderPhone) error.senderPhone = "Nomor telepon wajib diisi";
        if (!/^\d+$/.test(form.senderPhone)) error.senderPhone = "Nomor telepon tidak valid";
        if (!form.senderAddress) {
            error.senderAddress = "Alamat pengirim wajib diisi";
        } else if (form.senderAddress.split(",").length < 3) {
            error.senderAddress = "Isi alamat dengan format: Nama Jalan, Kota, Provinsi (contoh: Jl. Sudirman No.5, Jakarta, DKI Jakarta";
        }

        if (!form.receiverName) error.receiverName = "Nama penerima wajib diisi";
        if (!form.receiverPhone) error.receiverPhone = "Nomor telepon wajib diisi";
        if (!/^\d+$/.test(form.receiverPhone)) error.receiverPhone = "Nomor telepon tidak valid";
        if (!form.receiverAddress) {
            error.receiverAddress = "Alamat penerima wajib diisi";
        } else if (form.receiverAddress.split(",").length < 3) {
            error.receiverAddress = "Isi alamat dengan format: Nama Jalan, Kota, Provinsi (contoh: Jl. Sudirman No.5, Jakarta, DKI Jakarta";
        }

        if (!form.weight || Number(form.weight) < 1) error.weight = "Minimal 1 kg";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) error.email = "Format email salah";

        if (!form.payment) error.payment = "Pilih metode pembayaran";

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            const randomNumber = Math.floor(199 + Math.random() * 900);
            const generatedResi = `CRG-2026${randomNumber}`;
            setResi(generatedResi);

            if (form.payment === "tunai") {
                setShowSuccess(true);
            } else if (form.payment === "transfer") {
                router.push(`/admin/order/transfer?resi=${generatedResi}&total=${totalPrice()}`);
            }
        }
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

    const formatRupiah = (number: number) => {
        return "Rp " + number.toLocaleString("id-ID");
    };

    const [active, setActive] = useState("Pemesanan");

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
                    </div>

                    {/* Logout */}
                    <button 
                        onClick={() => {
                            router.push("/keluar");
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
                </div>
            </div>

            {/* Main */}
            <div className={`transition-all duration-300 ${open ? 'blur-sm' : ''}`}>
                <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
                    <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <img src="/humbergerMenu.png" alt="menu" className="w-8 h-8" />
                    </button>

                    <div className="flex items-center gap-2">
                        <img src="/LogoPaketinAja.jpeg" className="w-8 h-8 rounded-full object-contain" />
                        <span className="text-gray-700 font-semibold">PaketinAja</span>
                    </div>
                    <div />
                </div>
            
                {/* Content */}
                <div className="px-10 py-10">
                    <h1 className="text-2xl font-bold mb-6">Input Pesanan Baru</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
                            <h2 className="font-semibold mb-4 text-green-700">Data Pengirim</h2>

                            <input name="senderName" placeholder="Nama" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.senderName}</p>

                            <input name="senderPhone" placeholder="Nomor Telepon" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.senderPhone}</p>

                            <textarea name="senderAddress" placeholder="Alamat Lengkap" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 h-24 resize-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.senderAddress}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
                            <h2 className="font-semibold mb-4 text-green-700">Data Penerima</h2>

                            <input name="receiverName" placeholder="Nama" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.receiverName}</p>

                            <input name="receiverPhone" placeholder="Nomor Telepon" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.receiverPhone}</p>

                            <textarea name="receiverAddress" placeholder="Alamat lengkap" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 h-24 resize-none focus:ring-2 focus:ring-green-500" />
                            <p className="text-red-500 text-sm">{errors.receiverAddress}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow mt-10 max-w-10xl mx-auto">
                        <h2 className="font-semibold mb-6 text-green-700">Detail Paket</h2>

                        <div className="grid md:grid-cols-3 gap-6 items-stretch">
                            {/* Kiri */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Tipe Paket</label>
                                    <select name="type" onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500">
                                        <option>Paket Kecil</option>
                                        <option>Paket Sedang</option>
                                        <option>Paket Besar</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Berat (kg)</label>
                                    <input 
                                        name="weight"
                                        type="number"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Tengah */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Email Pelanggan</label>
                                    <input
                                        name="email"
                                        type="email"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Total Harga</label>
                                    <input
                                        value={formatRupiah(totalPrice())}
                                        readOnly
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 h-20 resize-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Kanan */}
                            <div className="flex flex-col h-full">
                                <label className="text-sm text-gray-600 mb-1">Catatan</label>
                                <textarea
                                    name="notes"
                                    onChange={handleChange}
                                    className="w-full flex-1 px-3 py-2 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Metode Pembayaran</h3>

                        <div className="flex gap-4">
                            <div
                                onClick={() => setForm({ ...form, payment: "tunai" })}
                                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition w-48
                                ${form.payment === "tunai" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.payment === "tunai" ? "border-blue-500" : "border-gray-300"}`}>
                                    {form.payment === "tunai" && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                </div>
                                <span className="text-sm font-medium">Tunai</span>
                            </div>
                            <div
                                onClick={() => setForm({ ...form, payment: "transfer" })}
                                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition w-48
                                ${form.payment === "transfer" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.payment === "transfer" ? "border-blue-500" : "border-gray-300"}`}>
                                    {form.payment === "transfer" && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </div>
                                <span className="text-sm font-medium">Transfer</span>
                            </div>
                        </div>
                        <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
                    </div>

                    <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition">
                        + Simpan Pesanan
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-gray-100 p-10 rounded-3xl text-center w-[400px] shadow-xl">
                        <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                ✔
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-green-800 leading-snug">Pesanan Telah <br /> Tersimpan!</h2>
                        <p className="mt-4 text-gray-600">Nomor resi Anda adalah{" "}<span className="text-green-700 font-semibold">{resi}</span></p>
                        <p className="text-gray-500 text-sm mt-1">Pesanan sedang diproses.</p>
                        <button 
                            onClick={() => {
                                setShowSuccess(false);
                                router.push("/admin/beranda");
                            }} 
                            className="mt-8 bg-green-700 hover:bg-green-800 text-white w-full py-4 rounded-full text-lg font-semibold shadow-md transition"
                        >
                            Tutup
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}