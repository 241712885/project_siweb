"use client";
import { useState } from "react";

export default function OrderManagement() {
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
        if (!form.senderAddress || form.senderAddress.split(",").length < 3) error.senderAddress = "Alamat belum lengkap";
        
        if (!form.receiverName) error.receiverName = "Nama penerima wajib diisi";
        if (!form.receiverPhone) error.receiverPhone = "Nomor telepon wajib diisi";
        if (!/^\d+$/.test(form.receiverPhone)) error.receiverPhone = "Nomor telepon tidak valid";
        if (!form.receiverAddress || form.receiverAddress.split(",").length < 3) error.receiverAddress = "Alamat belum lengkap";

        if (!form.weight || Number(form.weight) < 1) error.weight = "Minimal 1 kg";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) error.email = "Format email salah";

        if (!form.payment) error.payment = "Pilih metode pembayaran";

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            setShowSuccess(true);
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
                    <div className="flex items-center gap-3 mb-10">
                        <img src="/LogoPaketinAja.jpeg" className="w-10 h-10 rounded-full object-contain" />
                        <span className="text-green-700 font-semibold text-lg">PaketinAja</span>
                    </div>

                    <div className="space-y-2 flex-1">
                        {["Beranda", "Lacak", "Riwayat", "Profil"].map((item) => (
                            <button 
                                key={item} 
                                onClick={() => setOpen(false)}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"  
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
                </div>
            </div>
            
            {/* Main */}
            <div className={`transition-all duration-300 ${open ? 'blur-sm' : ''}`}>
                <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
                    <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <img src="/humbergerMenu.png" alt="menu" className="w-8 h- object-contain" />
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

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-green-700">Data Pengirim</h2>

                            <input name="senderName" placeholder="Nama" onChange={handleChange} className="input" />
                            <p className="error">{errors.senderName}</p>

                            <input name="senderPhone" placeholder="Nomor Telepon" onChange={handleChange} className="input" />
                            <p className="error">{errors.senderPhone}</p>

                            <textarea name="senderAddress" placeholder="Alamat Lengkap" onChange={handleChange} className="input" />
                            <p className="error">{errors.senderAddress}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-green-700">Data Penerima</h2>

                            <input name="receiverName" placeholder="Nama" onChange={handleChange} className="input" />
                            <p className="error">{errors.receiverName}</p>

                            <input name="receiverPhone" placeholder="Nomor Telepon" onChange={handleChange} className="input" />
                            <p className="error">{errors.receiverPhone}</p>

                            <textarea name="receiverAddress" placeholder="Alamat lengkap" onChange={handleChange} className="input" />
                            <p className="error">{errors.receiverAddress}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow mt-6">
                        <h2 className="font-semibold mb-4 text-green-700">Detail Paket</h2>
                        <select name="type" onChange={handleChange} className="input">
                            <option>Paket Kecil</option>
                            <option>Paket Sedang</option>
                            <option>Paket Besar</option>
                        </select>

                        <input name="weight" placeholder="Berat (kg)" onChange={handleChange} className="input" />
                        <p className="error">{errors.weight}</p>

                        <input name="email" placeholder="Email" onChange={handleChange} className="input" />
                        <p className="error">{errors.email}</p>

                        <textarea name="notes" placeholder="Catatan tambahan (opsional)" onChange={handleChange} className="input" />
                    </div>

                    {/* Payment */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Metode Pembayaran</h3>

                        <div className="flex gap-4">
                            <button onClick={() => setForm({...form, payment: 'tunai'})} className="btn">Tunai</button>
                            <button onClick={() => setForm({...form, payment: 'transfer'})} className="btn">Transfer</button>
                        </div>

                        <p className="error">{errors.payment}</p>
                    </div>

                    <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition">
                        + Simpan Pesanan
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl text-center max-w-sm">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ✔
                        </div>

                        <h2 className="text-xl font-semibold text-green-700">Pesanan Telah Tersimpan!</h2>
                        <button onClick={() => setShowSuccess(false)} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full"
                            >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}