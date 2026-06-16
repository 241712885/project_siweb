"use client";

import { Suspense } from "react";
import Loading from "./loading";
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

import { AdminShipmentItem, ShipmentStatus } from "../../lib/definitions";

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
    useState<AdminShipmentItem[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status")
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const handleStatusChange = async (
    id: string,
    newStatus: ShipmentStatus
  ) => {
    try {
      await fetch(`/api/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setShipments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("/api/shipments");
        const data = await res.json();
        setShipments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    if (!startDate || !endDate) return [];

    return shipments.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.receipt.toLowerCase().includes(keyword) ||
        item.sender.toLowerCase().includes(keyword) ||
        item.receiver.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword);

      const matchStatus =
        status === "Semua Status" ? true : item.status === status;

      const itemLocal = new Date(item.date);
      const itemDateOnly = `${itemLocal.getFullYear()}-${String(itemLocal.getMonth() + 1).padStart(2, "0")}-${String(itemLocal.getDate()).padStart(2, "0")}`;

      const matchDate =
        (!startDate || itemDateOnly >= startDate) &&
        (!endDate || itemDateOnly <= endDate);

      return matchSearch && matchStatus && matchDate;
    });
  }, [shipments, search, status, startDate, endDate]);
  const totalPages = Math.max(
  1,
  Math.ceil(
    filteredShipments.length /
    itemsPerPage
  )
);

  const paginatedShipments =
    filteredShipments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

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
                    🏠 Beranda
                </button>

                <button
                    onClick={() => {
                        router.push("/admin/order");
                        setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                    📋 Pemesanan
                </button>

                <button
                    onClick={() => {
                        router.push("/admin/pengiriman");
                        setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
                >
                    📦 Pengiriman
                </button>

                <button
                    onClick={() => {
                      router.push("/admin/armada");
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    🚚 Armada
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
      
      <div className={`transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Navbar */}
        <div className="relative flex items-center justify-between px-8 py-5 bg-[#F5F7F6] border border-gray-300 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-200 via-green-500 to-emerald-300 blur-[1px]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-green-100 rounded-full opacity-40 blur-2xl" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-emerald-100 rounded-full opacity-40 blur-2xl" />
          
          <button
            onClick={() => setSidebarOpen(true)}
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

        <Suspense fallback={<Loading/>}>
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
                      onChange={(e)=>{
                      setSearch(e.target.value)
                      setCurrentPage(1)
                      }}
                      placeholder="Cari resi, pengiriman, penerima..."
                      className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none border-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative flex items-center rounded-full border border-[#7BBE9D] bg-white px-4 py-2.5">
                    <select
                      value={status}
                      onChange={(e)=>{
                        setStatus(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full appearance-none bg-transparent text-sm text-slate-700 outline-none border-none focus:ring-0 pr-8 cursor-pointer"
                      style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                    >
                      {statusOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#EAF5EF] p-5 shadow-sm">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-green-900">
                        Tanggal Mulai
                      </label>
                      <div className="rounded-xl border border-green-100 bg-white px-4 py-3 transition-all duration-300 hover:border-green-300 focus-within:ring-2 focus-within:ring-green-300">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-green-900">
                        Tanggal Selesai
                      </label>
                      <div className="rounded-xl border border-green-100 bg-white px-4 py-3 transition-all duration-300 hover:border-green-300 focus-within:ring-2 focus-within:ring-green-300">
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
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-[16px] border border-slate-400 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
                  <thead className="bg-[#D9D4D4] text-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Resi</th>
                      <th className="px-4 py-3 font-semibold">Pengirim</th>
                      <th className="px-4 py-3 font-semibold">Penerima</th>
                      <th className="px-4 py-3 font-semibold">Driver</th>
                      <th className="px-4 py-3 font-semibold">Kendaraan</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                      {paginatedShipments.map((item,index)=>(                      
                        <tr
                          key={item.id}
                          className={
                            index !== paginatedShipments.length - 1
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
                        <td className="px-4 py-3 text-slate-500">
                          {item.driverName}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          <div>{item.vehicleName}</div>
                          <div className="text-xs text-slate-400">{item.vehiclePlate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative inline-block">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value as ShipmentStatus)
                              }
                              className={`appearance-none rounded-full px-3 py-1 pr-8 text-xs font-semibold outline-none cursor-pointer ${statusClass(
                                item.status
                              )}`}
                            >
                              {editableStatuses.map((statusItem) => (
                                <option key={statusItem} value={statusItem}>
                                  {statusItem}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                          </div>
                        </td>
                      </tr>
                    ))}

                    {paginatedShipments.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-8 text-center text-sm text-slate-500"
                        >
                          {!startDate || !endDate
                            ? "Pilih tanggal mulai dan tanggal selesai untuk menampilkan data."
                            : "Tidak ada data pengiriman yang cocok."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="flex justify-center items-center gap-2 mt-6">

              <button
                onClick={() =>setCurrentPage((prev:number)=>prev-1)}
                disabled={currentPage===1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {"< Previous"}
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() =>
                      setCurrentPage(pageNumber)
                    }
                    className={`w-10 h-10 rounded-lg border transition
                    ${currentPage === pageNumber ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-gray-100"}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev:number)=>prev+1)
                }
                disabled={currentPage===totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                {"Next >"}
              </button>
            </div>
          </div>
        </main>
        </Suspense>
      </div>
    </div>
  );
}