"use client";
import { useRouter } from "next/navigation";

export default function KeluarPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-600">
            <div className="border border-green-600 rounded-xl px-10 py-8 text-center bg-white shadow">
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Konfirmasi
                </h2>
                <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin keluar?
                </p>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                    >
                        Tidak
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Ya
                    </button>
                </div>
            </div>
        </div>
    );
}