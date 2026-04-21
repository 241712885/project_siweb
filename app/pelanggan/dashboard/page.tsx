"use client"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const menuClicked = () => setOpen(false);
    const router = useRouter();
    
    const features = [
        {
            icon:"/cepat.png",
            title:"Pengiriman Cepat",
            description:"Paket dikirim dengan proses cepat dan tepat waktu."
        },
        {
            icon:"/uang.png",
            title:"Harga Terjangkau",
            description:"Biaya kirim transparan dan ramah di kantong."
        },
        {
            icon:"/bumi.png",
            title:"Jangkauan Luas",
            description:"Melayani pengiriman ke seluruh Indonesia."
        },
        {
            icon:"/gembok.png",
            title:"Aman & Terpercaya",
            description:"Paket dijaga hingga sampai tujuan dengan aman."
        },
    ];

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
                            className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
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
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
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
                <div className="px-10 py-10 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-semibold text-emerald-950">Selamat Datang, Imanuella 👋</h1>
                        <p className="text-gray-600 mt-2 text-base md:text-lg">Lacak paketmu dengan mudah, cepat, dan tanpa ribet</p>
                    </div>
                </div>

                <div className="bg-green-600 text-white p-6 md:p-8 rounded-2xl max-w-2xl mx-auto shadow-md">
                    <h2 className="font-semibold text-lg mb-1">Lacak Paket</h2>
                    <p className="text-green-100 mb-6">Masukkan nomor resi untuk melacak status paket Anda</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Masukkan nomor resi..." 
                            className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none"
                        />
                        <button className="bg-white text-green-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Lacak
                        </button>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-xl md:text-2xl font-semibold text-emerald-950 mb-10">
                        Mengapa PaketinAja?
                    </h2>


                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {features.map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                                <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain mb-4" />
                                <h3 className="font-semibold text-gray-800 mb-1 text-left">{item.title}</h3>
                                <p className="text-gray-500 text-sm text-left">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}