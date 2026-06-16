"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Warehouse,
  Truck,
  CheckCircle2,
  BarChart3,
  ClipboardList,
  TrendingUp,
  Calendar,
  Banknote,
  CreditCard,
  DollarSign,
  PieChart,
} from "lucide-react";

type Order = {
  id: number;
  no_resi: string;
  nama_pengirim: string;
  nama_penerima: string;
  status_pengiriman: string;
  status_transaksi: string;
  total_harga: string;
  tanggal_kirim: string;
  tipe_paket: string | null;
  metode_pembayaran?: string; 
};

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const today    = new Date().toISOString().slice(0, 10);
  const firstDay = today.slice(0, 7) + "-01";
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate]     = useState(today);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pemesanan?tanggalMulai=${startDate}&tanggalSelesai=${endDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const safeData = Array.isArray(data) ? data : [];

  // Status pengiriman
  const total    = safeData.length;
  const gudang   = safeData.filter((d) =>
    d.status_pengiriman === "pending" || d.status_pengiriman === "diproses"
  ).length;
  const proses   = safeData.filter((d) =>
    d.status_pengiriman === "dalam pengiriman"
  ).length;
  const terkirim = safeData.filter((d) =>
    d.status_pengiriman === "selesai"
  ).length;

  const maxVal = Math.max(gudang, proses, terkirim, 1);

  // Pendapatan (semua status, bukan hanya selesai)
  const pendapatanTunai = safeData
    .filter((d) => d.metode_pembayaran === "tunai")
    .reduce((sum, d) => sum + Number(d.total_harga || 0), 0);

  const pendapatanTransfer = safeData
    .filter((d) => d.metode_pembayaran === "transfer")
    .reduce((sum, d) => sum + Number(d.total_harga || 0), 0);

  const totalPendapatan = pendapatanTunai + pendapatanTransfer;

  const maxPendapatan = Math.max(pendapatanTunai, pendapatanTransfer, 1);

  // ── Chart 3: Tren pesanan per hari ──────────────────────────────────────────
  const trendMap: Record<string, { total: number; selesai: number }> = {};
  safeData.forEach((d) => {
    const day = (d.tanggal_kirim || "").slice(0, 10);
    if (!day) return;
    if (!trendMap[day]) trendMap[day] = { total: 0, selesai: 0 };
    trendMap[day].total += 1;
    if (d.status_pengiriman === "selesai") trendMap[day].selesai += 1;
  });
  const trendDays = Object.keys(trendMap).sort();
  const trendMax  = Math.max(...trendDays.map((d) => trendMap[d].total), 1);

  // ── Chart 4: Donut proporsi status ──────────────────────────────────────────
  const donutData = [
    { label: "Gudang",   value: gudang,   color: "#FBBF24" },
    { label: "Proses",   value: proses,   color: "#60A5FA" },
    { label: "Selesai",  value: terkirim, color: "#34D399" },
  ];
  const donutTotal = gudang + proses + terkirim;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-10">
            <div className="flex flex-col">
              <span className="text-green-700 font-semibold text-lg">PaketinAja</span>
              <span className="text-gray-700 text-sm">Kirim mudah, cepat, dan aman</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <button onClick={() => { router.push("/admin/beranda"); setOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white font-medium">
              🏠 Beranda
            </button>
            <button onClick={() => { router.push("/admin/order"); setOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              📋 Pemesanan
            </button>
            <button onClick={() => { router.push("/admin/pengiriman"); setOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              📦 Pengiriman
            </button>
            <button onClick={() => { router.push("/admin/armada"); setOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              🚚 Armada
            </button>
          </div>

          <button onClick={() => router.push("/keluar")}
            className="w-full text-left px-4 py-2 text-red-500 text-base font-semibold mt-auto mb-20">
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
            <img src="/humbergerMenu.png" alt="menu" className="w-8 h-8 object-contain" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/LogoPaketinAja.jpeg" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
            <span className="text-gray-700 font-semibold">PaketinAja</span>
          </div>
          <div />
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
          <h1 className="text-xl sm:text-2xl font-bold">Beranda Admin</h1>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Ringkasan data pengiriman</p>

          {/* Filter Tanggal */}
          <div className="mb-8">
            <div className="bg-gray-200 p-4 rounded-xl inline-flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div>
                <p className="text-sm text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Mulai
                </p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Selesai
                </p>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <svg className="animate-spin h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-sm">Memuat data...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <Card title="Total Pesanan" value={total}    color="text-gray-800"   icon={<Package      className="w-5 h-5" />} />
                <Card title="Di Gudang"     value={gudang}   color="text-yellow-600" icon={<Warehouse    className="w-5 h-5" />} />
                <Card title="Pengiriman"    value={proses}   color="text-blue-600"   icon={<Truck        className="w-5 h-5" />} />
                <Card title="Selesai"       value={terkirim} color="text-green-600"  icon={<CheckCircle2 className="w-5 h-5" />} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <CardMoney
                  title="Pendapatan Tunai"
                  value={pendapatanTunai}
                  color="text-emerald-600"
                  bgAccent="bg-emerald-50 border-emerald-200"
                  icon={<Banknote className="w-5 h-5 text-emerald-500" />}
                />
                <CardMoney
                  title="Pendapatan Transfer"
                  value={pendapatanTransfer}
                  color="text-purple-600"
                  bgAccent="bg-purple-50 border-purple-200"
                  icon={<CreditCard className="w-5 h-5 text-purple-500" />}
                />
                <CardMoney
                  title="Total Pendapatan"
                  value={totalPendapatan}
                  color="text-blue-700"
                  bgAccent="bg-blue-50 border-blue-200"
                  icon={<DollarSign className="w-5 h-5 text-blue-600" />}
                  highlight
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                  <h3 className="font-semibold mb-4 text-sm sm:text-base flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-green-600" />
                    Status Pesanan
                  </h3>
                  <DonutChart data={donutData} total={donutTotal} />
                </div>
             

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                  <h3 className="font-semibold mb-6 text-sm sm:text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Pendapatan per Metode Pembayaran
                  </h3>
                  <div className="flex items-end gap-10 h-44">
                    <BarMoney label="Tunai"    value={pendapatanTunai}    maxVal={maxPendapatan} color="bg-emerald-500" />
                    <BarMoney label="Transfer" value={pendapatanTransfer} maxVal={maxPendapatan} color="bg-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-4 text-sm sm:text-base flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-green-600" />
                  Pesanan Terbaru
                </h3>
                {safeData.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">
                    Tidak ada data pada rentang tanggal ini
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-2 pr-4">No Resi</th>
                          <th className="pb-2 pr-4">Pengirim</th>
                          <th className="pb-2 pr-4">Penerima</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2 pr-4">Pembayaran</th>
                          <th className="pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeData.slice(0, 5).map((d) => (
                          <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-2 pr-4 font-mono text-xs">{d.no_resi}</td>
                            <td className="py-2 pr-4">{d.nama_pengirim}</td>
                            <td className="py-2 pr-4">{d.nama_penerima}</td>
                            <td className="py-2 pr-4"><StatusBadge status={d.status_pengiriman} /></td>
                            <td className="py-2 pr-4"><PaymentBadge payment={d.metode_pembayaran} /></td>
                            <td className="py-2 text-green-700 font-semibold">
                              {"Rp " + Number(d.total_harga).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Card({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className={`text-xl sm:text-2xl font-bold mt-0.5 ${color}`}>{value}</h2>
      </div>
    </div>
  );
}

function CardMoney({
  title, value, color, bgAccent, icon, highlight,
}: {
  title: string; value: number; color: string; bgAccent: string; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl shadow border ${bgAccent} ${highlight ? "ring-2 ring-blue-400" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
      <h2 className={`text-lg sm:text-xl font-bold ${color}`}>
        Rp {value.toLocaleString("id-ID")}
      </h2>
    </div>
  );
}

function Bar({ label, value, maxVal, color }: { label: string; value: number; maxVal: number; color: string }) {
  const height = maxVal > 0 ? Math.max((value / maxVal) * 120, value > 0 ? 8 : 0) : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-gray-600">{value}</span>
      <div style={{ height: `${height}px` }} className={`w-10 sm:w-14 ${color} rounded-t transition-all duration-500`} />
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

function BarMoney({ label, value, maxVal, color }: { label: string; value: number; maxVal: number; color: string }) {
  const height = maxVal > 0 ? Math.max((value / maxVal) * 120, value > 0 ? 8 : 0) : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-gray-600">
        Rp {value >= 1_000_000
          ? (value / 1_000_000).toFixed(1) + "Jt"
          : (value / 1000).toFixed(0) + "K"}
      </span>
      <div style={{ height: `${height}px` }} className={`w-16 rounded-t ${color} transition-all duration-500`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function DonutChart({
  data, total,
}: {
  data: { label: string; value: number; color: string }[];
  total: number;
}) {
  if (total === 0) {
    return <p className="text-gray-400 text-sm text-center py-10">Tidak ada data</p>;
  }

  // Build SVG donut slices
  const cx = 70; const cy = 70; const r = 54; const stroke = 22;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const slices = data.map((item) => {
    const pct   = item.value / total;
    const dash  = pct * circ;
    const gap   = circ - dash;
    const slice = { ...item, pct, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circ / 4}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fill="#374151" style={{ fontSize: 11 }}>Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#111827" style={{ fontSize: 18, fontWeight: 700 }}>{total}</text>
      </svg>

      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600 w-16">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
            <span className="text-gray-400 text-xs">
              ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    "pending":          { bg: "bg-gray-100 text-gray-600",    label: "Menunggu" },
    "diproses":         { bg: "bg-yellow-100 text-yellow-700", label: "Diproses" },
    "dalam pengiriman": { bg: "bg-blue-100 text-blue-700",    label: "Dikirim" },
    "selesai":          { bg: "bg-green-100 text-green-700",   label: "Selesai" },
  };
  const style = map[status] ?? { bg: "bg-gray-100 text-gray-500", label: status };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg}`}>
      {style.label}
    </span>
  );
}

function PaymentBadge({ payment }: { payment?: string }) {
  if (!payment) return <span className="text-gray-400 text-xs">-</span>;
  const map: Record<string, { bg: string; label: string }> = {
    "tunai":    { bg: "bg-emerald-100 text-emerald-700", label: "Tunai" },
    "transfer": { bg: "bg-purple-100 text-purple-700",   label: "Transfer" },
  };
  const style = map[payment] ?? { bg: "bg-gray-100 text-gray-500", label: payment };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg}`}>
      {style.label}
    </span>
  );
}
