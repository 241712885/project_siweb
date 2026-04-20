"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TransferPage() {
    const params = useSearchParams();
    const resi = params.get("resi");
    const total = Number(params.get("total"));
    const [showSuccess, setShowSuccess] = useState(false);
    const [time, setTime] = useState(60);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (t: number) => {
        const minutes = Math.floor(t / 60);
        const seconds = t % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const formatRupiah = (number: number) => {
        return "Rp " + number.toLocaleString("id-ID");
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E8FDF5] to-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-2xl font-bold">Pembayaran Transfer Bank</h1>
                <p className="text-gray-500 mb-4">Selesaikan pembayaran untuk mengaktifkan pesanan.</p>

                <div className="flex justify-between items-center bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-xl mb-6">
                    <span>Selesaikan pembayaran sebelum</span>
                    <span className="font-semibold">{formatTime(time)}</span>
                </div>

                <div className="flex justify-between bg-white p-4 rounded-xl border mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Nomor Resi</p>
                        <p className="font-bold">{resi}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-sm">Total Pembayaran</p>
                        <p className="font-bold text-green-600">
                            {formatRupiah(total)}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border space-y-4 mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Bank Tujuan</p>
                        <p className="font-semibold text-lg">BCA</p>
                    </div>

                    <div className="border rounded-xl p-4">
                        <p className="text-gray-500 text-sm">Nomor Rekening</p>
                        <p className="font-semibold">1234567890</p>
                    </div>

                    <div className="border rounded-xl p-4">
                        <p className="text-gray-500 text-sm">Nama Penerima</p>
                        <p className="font-semibold">PT PaketinAja Indonesia</p>
                    </div>

                    <div className="border rounded-xl p-4">
                        <p className="text-gray-500 text-sm">Jumlah Transfer</p>
                        <p className="font-semibold text-green-600">
                            {formatRupiah(total)}
                        </p>
                    </div>
                </div>

                <button
                    disabled={time === 0}
                    onClick={() => setShowSuccess(true)}
                    className={`w-full py-4 rounded-full font-semibold shadow-lg text-white transition
                    ${time === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                    {time === 0 ? "Waktu Habis" : "Konfirmasi Pembayaran"}
                </button>

                {showSuccess && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                        <div className="bg-gray-100 p-10 rounded-3xl text-center w-[400px] shadow-xl">
                            <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    ✔
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-green-800 leading-snug">Pembayaran Telah Dikonfirmasi!</h2>
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
        </div>
    );
}