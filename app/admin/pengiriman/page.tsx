"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Package,
  CalendarDays,
  Search,
  ChevronDown,
} from "lucide-react";

type ShipmentStatus =
  | "Menunggu Pick Up"
  | "Di Gudang"
  | "Dalam Pengiriman"
  | "Terkirim"
  | "Dibatalkan";

type AdminShipmentItem = {
  id: string;
  date: string;
  receipt: string;
  sender: string;
  receiver: string;
  status: ShipmentStatus;
};

const initialShipments: AdminShipmentItem[] = [
  {
    id: "1",
    date: "2026-03-11",
    receipt: "CRG-2026-004",
    sender: "Miranda",
    receiver: "Dhinda",
    status: "Terkirim",
  },
  {
    id: "2",
    date: "2026-04-12",
    receipt: "CRG-2026-005",
    sender: "Jio",
    receiver: "Ale",
    status: "Terkirim",
  },
  {
    id: "3",
    date: "2026-05-13",
    receipt: "CRG-2026-006",
    sender: "Vanesa",
    receiver: "Jennie",
    status: "Dalam Pengiriman",
  },
  {
    id: "4",
    date: "2026-06-14",
    receipt: "CRG-2026-007",
    sender: "Zayn",
    receiver: "Hendra",
    status: "Menunggu Pick Up",
  },
  {
    id: "5",
    date: "2026-07-15",
    receipt: "CRG-2026-008",
    sender: "Malik",
    receiver: "Harry",
    status: "Dibatalkan",
  },
  {
    id: "6",
    date: "2026-08-16",
    receipt: "CRG-2026-009",
    sender: "Khanza",
    receiver: "Hans",
    status: "Terkirim",
  },
  {
    id: "7",
    date: "2026-09-17",
    receipt: "CRG-2026-010",
    sender: "Pricila",
    receiver: "Husein",
    status: "Terkirim",
  },
];

const statusOptions: Array<ShipmentStatus | "Semua Status"> = [
  "Semua Status",
  "Menunggu Pick Up",
  "Di Gudang",
  "Dibatalkan",
  "Dalam Pengiriman",
  "Terkirim",
];

const editableStatuses: ShipmentStatus[] = [
  "Menunggu Pick Up",
  "Di Gudang",
  "Dalam Pengiriman",
  "Terkirim",
  "Dibatalkan",
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusClass(status: ShipmentStatus) {
  switch (status) {
    case "Terkirim":
      return "bg-[#D9EAFE] text-[#3485F7]";
    case "Dalam Pengiriman":
      return "bg-[#1E3A8A] text-white";
    case "Di Gudang":
      return "bg-[#2B1A0E] text-[#F3B24E]";
    case "Dibatalkan":
      return "bg-[#DDF7E5] text-[#2FA85A]";
    case "Menunggu Pick Up":
      return "bg-[#FFE8B5] text-[#C28A06]";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function updateText(status: ShipmentStatus) {
  return status === "Terkirim" ? "Selesai" : "Update";
}

function updateTextClass(status: ShipmentStatus) {
  return status === "Terkirim"
    ? "text-[#17A34A] font-semibold"
    : "text-slate-500";
}

export default function AdminPengirimanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [shipments, setShipments] =
    useState<AdminShipmentItem[]>(initialShipments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [startDate, setStartDate] = useState("2026-03-07");
  const [endDate, setEndDate] = useState("2026-06-18");

  const handleStatusChange = (id: string, newStatus: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.receipt.toLowerCase().includes(keyword) ||
        item.sender.toLowerCase().includes(keyword) ||
        item.receiver.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword);

      const matchStatus =
        status === "Semua Status" ? true : item.status === status;

      const itemDate = new Date(item.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const matchDate = itemDate >= start && itemDate <= end;

      return matchSearch && matchStatus && matchDate;
    });
  }, [shipments, search, status, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
      {sidebarOpen && (
          <div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
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

            {/* Menu */}
            <div className="space-y-2 flex-1">
                <button 
                    onClick={() => {
                        router.push("/admin/beranda");
                        setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                    Beranda
                </button>

                <button
                    onClick={() => {
                        router.push("/admin/order");
                        setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                    Pemesanan
                </button>

                <button
                    onClick={() => {
                        router.push("/admin/pengiriman");
                        setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
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

        <main className="px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <section>
              <h1 className="text-[30px] font-bold leading-tight text-slate-900">
                Management Pengiriman
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Kelola dan update status pengiriman
              </p>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px]">
                  <div className="flex items-center rounded-full border border-[#7BBE9D] bg-white px-4 py-2.5">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari resi, pengiriman, penerima..."
                      className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none border-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full appearance-none rounded-full border border-[#7BBE9D] bg-white px-4 py-2.5 text-sm text-slate-600 outline-none"
                    >
                      {statusOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="rounded-[18px] bg-[#DCE8E2] p-3 sm:p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[44px_1fr_1fr] md:items-end">
                    <div className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-700 md:flex">
                      <CalendarDays className="h-6 w-6" />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Tanggal Mulai
                      </label>
                      <div className="rounded-full bg-[#D8D1D5] px-4 py-2">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Tanggal Selesai
                      </label>
                      <div className="rounded-full bg-[#D8D1D5] px-4 py-2">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-700 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-[16px] border border-slate-400 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                  <thead className="bg-[#D9D4D4] text-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Resi</th>
                      <th className="px-4 py-3 font-semibold">Pengirim</th>
                      <th className="px-4 py-3 font-semibold">Penerima</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((item, index) => (
                      <tr
                        key={item.id}
                        className={
                          index !== filteredShipments.length - 1
                            ? "border-b border-slate-200"
                            : ""
                        }
                      >
                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.receipt}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {item.sender}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {item.receiver}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${updateTextClass(
                                item.status
                              )}`}
                            >
                              {updateText(item.status)}
                            </span>

                            <div className="relative">
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    item.id,
                                    e.target.value as ShipmentStatus
                                  )
                                }
                                className="appearance-none rounded-full border border-slate-300 bg-[#F8F8F8] px-3 py-1 pr-8 text-xs text-slate-600 outline-none"
                              >
                                {editableStatuses.map((statusItem) => (
                                  <option key={statusItem} value={statusItem}>
                                    {statusItem}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredShipments.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-sm text-slate-500"
                        >
                          Tidak ada data pengiriman yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}