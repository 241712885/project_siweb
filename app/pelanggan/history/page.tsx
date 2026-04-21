"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, Package, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

type TabType = "Semua" | "Proses" | "Selesai";

type ShipmentItem = {
  id: string;
  sender: string;
  receiver: string;
  date: string;
  status: string;
  category: TabType;
};

const shipments: ShipmentItem[] = [
  {
    id: "CRG-2026-027",
    sender: "Miranda",
    receiver: "Monica",
    date: "2026-04-28",
    status: "Terkirim",
    category: "Selesai",
  },
  {
    id: "CRG-2026-026",
    sender: "Jeremy",
    receiver: "Jeff",
    date: "2026-02-22",
    status: "Menunggu pick up",
    category: "Proses",
  },
  {
    id: "CRG-2026-022",
    sender: "Putra",
    receiver: "Miranda",
    date: "2026-02-19",
    status: "Menunggu pick up",
    category: "Proses",
  },
  {
    id: "CRG-2026-014",
    sender: "Miranda",
    receiver: "Adele",
    date: "2026-02-20",
    status: "Menunggu pick up",
    category: "Proses",
  },
  {
    id: "CRG-2026-025",
    sender: "Deni",
    receiver: "Adit",
    date: "2026-04-30",
    status: "Terkirim",
    category: "Selesai",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Riwayat");
  const [activeTab, setActiveTab] = useState<TabType>("Semua");
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const router = useRouter();

  const filteredShipments = useMemo(() => {
    return shipments.filter((item) => {
      const matchTab =
        activeTab === "Semua" ? true : item.category === activeTab;

      const itemDate = new Date(item.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;

      return matchTab && itemDate >= start && itemDate <= end;
    });
  }, [activeTab, startDate, endDate]);

  return (
    <div className="min-h-screen bg-[#DFF5EC] text-slate-800">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

        {/* Sidebar */}
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                            router.push("/pelanggan/dashboard");
                            setSidebarOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        Beranda
                    </button>

                    <button
                        onClick={() => {
                            router.push("/pelanggan/history");
                            setSidebarOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
                    >
                        Riwayat
                    </button>

                    <button
                        onClick={() => {
                            router.push("/pelanggan/profile");
                            setSidebarOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        Profil
                    </button>
                </div>
                <button 
                  onClick={() => {
                      router.push("/keluar");
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
            </div>
        </div>

      {/* Main */}
    <div className={`transition-all duration-300 ${sidebarOpen ? 'blur-sm' : ''}`}>
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <img src="/humbergerMenu.png" alt="menu" className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-2">
                <img src="/LogoPaketinAja.jpeg" className="w-8 h-8 rounded-full object-contain" />
                <span className="text-gray-700 font-semibold">PaketinAja</span>
            </div>
            <div />
        </div>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <section>
              <h1 className="text-[32px] font-bold leading-tight text-slate-900">
                Riwayat Pengiriman
              </h1>
              <p className="mt-1 text-[16px] text-slate-600">
                Lihat semua riwayat pengiriman anda
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {(["Semua", "Proses", "Selesai"] as TabType[]).map((tab) => {
                  const active = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`min-w-[120px] rounded-full border px-7 py-2 text-[16px] font-semibold transition duration-200 ${
                        active
                          ? "border-[#18A957] bg-[#18A957] text-white shadow-[0_8px_24px_rgba(24,169,87,0.18)]"
                          : "border-slate-300 bg-white text-slate-700 hover:border-[#18A957] hover:text-[#0f766e]"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[22px] bg-[#D8E7E1] px-5 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[56px_1fr_1fr] md:items-end">
                  <div className="hidden h-12 w-12 items-center justify-center rounded-xl text-slate-700 md:flex">
                    <CalendarDays className="h-8 w-8" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Tanggal Mulai
                    </label>
                    <div className="rounded-full bg-[#D9D5D7] px-4 py-2.5">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Tanggal Selesai
                    </label>
                    <div className="rounded-full bg-[#D9D5D7] px-4 py-2.5">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-10 space-y-6">
              {filteredShipments.map((item) => {
                const isDelivered = item.status === "Terkirim";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[24px] border border-slate-300 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF5EC] text-[#4BC59A]">
                        <Package className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {item.id}
                        </p>
                        <p className="text-[16px] text-slate-600">
                          {item.sender} <span className="mx-1">→</span> {item.receiver}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-[16px] font-bold text-slate-700">
                        {formatDate(item.date)}
                      </span>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          isDelivered
                            ? "bg-[#D9EAFE] text-[#3485F7]"
                            : "bg-[#FFE8B5] text-[#C28A06]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredShipments.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
                  Tidak ada data riwayat pada rentang tanggal ini.
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}