"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Beranda");
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-18");

  useEffect(() => {
    fetch("/api/pemesanan")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const total = data.length;
  const gudang = data.filter(d => d.status === "Gudang").length;
  const proses = data.filter(d => d.status === "Proses").length;
  const terkirim = data.filter(d => d.status === "Terkirim").length;

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
                    className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium"
                >
                    Beranda
                </button>

                <button
                    onClick={() => {
                        router.push("/admin/order");
                        setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
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
            <button className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">Keluar</button>
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

        {/* CONTENT */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10">

          <h1 className="text-xl sm:text-2xl font-bold">Beranda Admin</h1>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Ringkasan data pengiriman</p>

          {/* DATE PICKER */}
          <div className="mb-8">
            <div className="bg-gray-100 p-4 rounded-xl inline-flex flex-col sm:flex-row gap-4 sm:gap-6">

              <div>
                <p className="text-sm text-gray-500">Tanggal Mulai</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Tanggal Selesai</p>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border"
                />
              </div>

            </div>
          </div>

          {/* CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Card title="Total Pesanan" value={total} />
            <Card title="Di Gudang" value={gudang} />
            <Card title="Pengiriman" value={proses} />
            <Card title="Terkirim" value={terkirim} />
          </div>

          {/* CHART */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-10">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Status Pengiriman</h3>

            <div className="flex items-end justify-between sm:justify-start sm:gap-10 h-40">
              <Bar label="Gudang" value={gudang} />
              <Bar label="Proses" value={proses} />
              <Bar label="Terkirim" value={terkirim} />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Data Pengiriman</h3>

            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Resi</th>
                    <th className="text-left">Pengirim</th>
                    <th className="text-left">Penerima</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.resi}</td>
                      <td>{item.pengirim}</td>
                      <td>{item.penerima}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-lg sm:text-xl font-bold">{value}</h2>
    </div>
  );
}

function Bar({ label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <div
        style={{ height: `${value * 30}px` }}
        className="w-8 sm:w-12 bg-green-500 rounded"
      ></div>
      <span className="text-xs mt-2">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: any) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs
      ${
        status === "Menunggu"
          ? "bg-yellow-200 text-yellow-800"
          : status === "Proses"
          ? "bg-blue-200 text-blue-800"
          : "bg-green-200 text-green-800"
      }`}>
      {status}
    </span>
  );
}