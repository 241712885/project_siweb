"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Kendaraan = {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  plat_nomor: string;
  kapasitas_muatan: string;
  status_kendaraan: "tersedia" | "digunakan" | "maintenance";
};

type Driver = {
  id: number;
  nama_driver: string;
  no_telepon: string;
  no_sim: string;
  status_driver: "tersedia" | "bertugas" | "cuti";
};

const STATUS_KENDARAAN = ["tersedia", "digunakan", "maintenance"];
const STATUS_DRIVER     = ["tersedia", "bertugas", "cuti"];
const JENIS_KENDARAAN   = ["Truk", "Pickup", "Box", "Motor"];

const emptyKendaraan = {
  nama_kendaraan: "", jenis_kendaraan: "Truk",
  plat_nomor: "", kapasitas_muatan: "", status_kendaraan: "tersedia",
};
const emptyDriver = {
  nama_driver: "", no_telepon: "", no_sim: "", status_driver: "tersedia",
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function ArmadaPage() {
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState<"kendaraan" | "driver">("kendaraan");
  const router = useRouter();

  // Data
  const [kendaraan, setKendaraan] = useState<Kendaraan[]>([]);
  const [drivers, setDrivers]     = useState<Driver[]>([]);
  const [loading, setLoading]     = useState(true);

  // Search
  const [searchK, setSearchK] = useState("");
  const [searchD, setSearchD] = useState("");

  // Modal kendaraan
  const [modalK, setModalK]         = useState(false);
  const [editKendaraan, setEditKendaraan] = useState<Kendaraan | null>(null);
  const [formK, setFormK]           = useState<any>(emptyKendaraan);
  const [errK, setErrK]             = useState<any>({});

  // Modal driver
  const [modalD, setModalD]       = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [formD, setFormD]         = useState<any>(emptyDriver);
  const [errD, setErrD]           = useState<any>({});

  // Konfirmasi hapus
  const [confirmDelete, setConfirmDelete] = useState<{ type: "kendaraan" | "driver"; id: number } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resK, resD] = await Promise.all([
        fetch("/api/kendaraan"),
        fetch("/api/driver"),
      ]);
      const dataK = await resK.json();
      const dataD = await resD.json();
      setKendaraan(Array.isArray(dataK.data) ? dataK.data : []);
      setDrivers(Array.isArray(dataD.data) ? dataD.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Filter ─────────────────────────────────────────────────
  const filteredK = kendaraan.filter((k) =>
    k.nama_kendaraan.toLowerCase().includes(searchK.toLowerCase()) ||
    k.plat_nomor.toLowerCase().includes(searchK.toLowerCase())
  );
  const filteredD = drivers.filter((d) =>
    d.nama_driver.toLowerCase().includes(searchD.toLowerCase()) ||
    d.no_telepon.toLowerCase().includes(searchD.toLowerCase())
  );

  // ── Validasi ───────────────────────────────────────────────
  const validateK = () => {
    const e: any = {};
    if (!formK.nama_kendaraan.trim()) e.nama_kendaraan = "Wajib diisi";
    if (!formK.plat_nomor.trim())     e.plat_nomor     = "Wajib diisi";
    if (!formK.kapasitas_muatan || Number(formK.kapasitas_muatan) <= 0)
      e.kapasitas_muatan = "Harus lebih dari 0";
    setErrK(e);
    return Object.keys(e).length === 0;
  };

  const validateD = () => {
    const e: any = {};
    if (!formD.nama_driver.trim()) e.nama_driver = "Wajib diisi";
    if (!formD.no_telepon.trim())  e.no_telepon  = "Wajib diisi";
    if (!/^\d+$/.test(formD.no_telepon)) e.no_telepon = "Hanya angka";
    if (!formD.no_sim.trim())      e.no_sim      = "Wajib diisi";
    setErrD(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit Kendaraan ───────────────────────────────────────
  const submitKendaraan = async () => {
    if (!validateK()) return;
    const method = editKendaraan ? "PATCH" : "POST";
    const body   = editKendaraan ? { ...formK, id: editKendaraan.id } : formK;
    await fetch("/api/kendaraan", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setModalK(false);
    setEditKendaraan(null);
    setFormK(emptyKendaraan);
    fetchAll();
  };

  // ── Submit Driver ──────────────────────────────────────────
  const submitDriver = async () => {
    if (!validateD()) return;
    const method = editDriver ? "PATCH" : "POST";
    const body   = editDriver ? { ...formD, id: editDriver.id } : formD;
    await fetch("/api/driver", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setModalD(false);
    setEditDriver(null);
    setFormD(emptyDriver);
    fetchAll();
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return;
    await fetch(`/api/${confirmDelete.type}?id=${confirmDelete.id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchAll();
  };

  // ── Open Edit Modal ────────────────────────────────────────
  const openEditK = (k: Kendaraan) => {
    setEditKendaraan(k);
    setFormK({
      nama_kendaraan:  k.nama_kendaraan,
      jenis_kendaraan: k.jenis_kendaraan,
      plat_nomor:      k.plat_nomor,
      kapasitas_muatan: k.kapasitas_muatan,
      status_kendaraan: k.status_kendaraan,
    });
    setErrK({});
    setModalK(true);
  };

  const openEditD = (d: Driver) => {
    setEditDriver(d);
    setFormD({
      nama_driver:  d.nama_driver,
      no_telepon:   d.no_telepon,
      no_sim:       d.no_sim,
      status_driver: d.status_driver,
    });
    setErrD({});
    setModalD(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-10">
            <span className="text-green-700 font-semibold text-lg block">PaketinAja</span>
            <span className="text-gray-500 text-sm">Kirim mudah, cepat, dan aman</span>
          </div>
          <div className="space-y-2 flex-1">
            {[
              { label: "Beranda",    path: "/admin/beranda" },
              { label: "Pemesanan", path: "/admin/order" },
              { label: "Pengiriman",path: "/admin/pengiriman" },
              { label: "Armada",    path: "/admin/armada" },
            ].map((item) => (
              <button key={item.path}
                onClick={() => { router.push(item.path); setOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg transition
                  ${item.path === "/admin/armada"
                    ? "bg-green-600 text-white font-medium"
                    : "hover:bg-gray-100 text-gray-700"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={() => router.push("/keluar")}
            className="w-full text-left px-4 py-2 text-red-500 font-semibold mt-auto mb-20">
            Keluar
          </button>
        </div>
      </div>

      {/* Main */}
      <div className={`transition-all duration-300 ${open ? "blur-sm pointer-events-none" : ""}`}>
        {/* Navbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-md">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <img src="/humbergerMenu.png" alt="menu" className="w-8 h-8" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/LogoPaketinAja.jpeg" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
            <span className="text-gray-700 font-semibold">PaketinAja</span>
          </div>
          <div />
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Armada</h1>
          <p className="text-gray-500 mb-6 text-sm">Kelola kendaraan dan driver pengiriman</p>

          {/* Tab */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("kendaraan")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition
                ${tab === "kendaraan" ? "bg-green-600 text-white shadow" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
              🚛 Kendaraan
            </button>
            <button
              onClick={() => setTab("driver")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition
                ${tab === "driver" ? "bg-green-600 text-white shadow" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
              👤 Driver
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="ml-3 text-gray-400 text-sm">Memuat data...</span>
            </div>
          ) : (
            <>
              {/* ── TAB KENDARAAN ── */}
              {tab === "kendaraan" && (
                <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <input
                      value={searchK}
                      onChange={(e) => setSearchK(e.target.value)}
                      placeholder="🔍 Cari nama atau plat nomor..."
                      className="px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-72"
                    />
                    <button
                      onClick={() => { setEditKendaraan(null); setFormK(emptyKendaraan); setErrK({}); setModalK(true); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap">
                      + Tambah Kendaraan
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4">Nama</th>
                          <th className="pb-3 pr-4">Jenis</th>
                          <th className="pb-3 pr-4">Plat Nomor</th>
                          <th className="pb-3 pr-4">Kapasitas</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredK.length === 0 ? (
                          <tr><td colSpan={6} className="text-center text-gray-400 py-8">Tidak ada data kendaraan</td></tr>
                        ) : filteredK.map((k) => (
                          <tr key={k.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 pr-4 font-medium">{k.nama_kendaraan}</td>
                            <td className="py-3 pr-4 text-gray-500">{k.jenis_kendaraan}</td>
                            <td className="py-3 pr-4 font-mono text-xs bg-gray-50 rounded px-2">{k.plat_nomor}</td>
                            <td className="py-3 pr-4">{Number(k.kapasitas_muatan).toLocaleString("id-ID")} kg</td>
                            <td className="py-3 pr-4"><StatusBadgeK status={k.status_kendaraan} /></td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEditK(k)}
                                  className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                  Edit
                                </button>
                                <button onClick={() => setConfirmDelete({ type: "kendaraan", id: k.id })}
                                  className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── TAB DRIVER ── */}
              {tab === "driver" && (
                <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <input
                      value={searchD}
                      onChange={(e) => setSearchD(e.target.value)}
                      placeholder="🔍 Cari nama atau nomor telepon..."
                      className="px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-72"
                    />
                    <button
                      onClick={() => { setEditDriver(null); setFormD(emptyDriver); setErrD({}); setModalD(true); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap">
                      + Tambah Driver
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4">Nama Driver</th>
                          <th className="pb-3 pr-4">No. Telepon</th>
                          <th className="pb-3 pr-4">No. SIM</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredD.length === 0 ? (
                          <tr><td colSpan={5} className="text-center text-gray-400 py-8">Tidak ada data driver</td></tr>
                        ) : filteredD.map((d) => (
                          <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 pr-4 font-medium">{d.nama_driver}</td>
                            <td className="py-3 pr-4">{d.no_telepon}</td>
                            <td className="py-3 pr-4 font-mono text-xs">{d.no_sim}</td>
                            <td className="py-3 pr-4"><StatusBadgeD status={d.status_driver} /></td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEditD(d)}
                                  className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                  Edit
                                </button>
                                <button onClick={() => setConfirmDelete({ type: "driver", id: d.id })}
                                  className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MODAL KENDARAAN ── */}
      {modalK && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-5 text-green-700">
              {editKendaraan ? "Edit Kendaraan" : "Tambah Kendaraan"}
            </h2>
            <div className="space-y-3">
              <Field label="Nama Kendaraan">
                <input name="nama_kendaraan" value={formK.nama_kendaraan}
                  onChange={(e) => setFormK({ ...formK, nama_kendaraan: e.target.value })}
                  className={inputCls} placeholder="contoh: Truk Besar 01" />
                {errK.nama_kendaraan && <Err msg={errK.nama_kendaraan} />}
              </Field>

              <Field label="Jenis Kendaraan">
                <select value={formK.jenis_kendaraan}
                  onChange={(e) => setFormK({ ...formK, jenis_kendaraan: e.target.value })}
                  className={inputCls}>
                  {JENIS_KENDARAAN.map((j) => <option key={j}>{j}</option>)}
                </select>
              </Field>

              <Field label="Plat Nomor">
                <input value={formK.plat_nomor}
                  onChange={(e) => setFormK({ ...formK, plat_nomor: e.target.value })}
                  className={inputCls} placeholder="contoh: B 1234 ABC" />
                {errK.plat_nomor && <Err msg={errK.plat_nomor} />}
              </Field>

              <Field label="Kapasitas Muatan (kg)">
                <input type="number" value={formK.kapasitas_muatan}
                  onChange={(e) => setFormK({ ...formK, kapasitas_muatan: e.target.value })}
                  className={inputCls} placeholder="contoh: 5000" />
                {errK.kapasitas_muatan && <Err msg={errK.kapasitas_muatan} />}
              </Field>

              <Field label="Status">
                <select value={formK.status_kendaraan}
                  onChange={(e) => setFormK({ ...formK, status_kendaraan: e.target.value })}
                  className={inputCls}>
                  {STATUS_KENDARAAN.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setModalK(false); setEditKendaraan(null); }}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition">
                Batal
              </button>
              <button onClick={submitKendaraan}
                className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition">
                {editKendaraan ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DRIVER ── */}
      {modalD && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-5 text-green-700">
              {editDriver ? "Edit Driver" : "Tambah Driver"}
            </h2>
            <div className="space-y-3">
              <Field label="Nama Driver">
                <input value={formD.nama_driver}
                  onChange={(e) => setFormD({ ...formD, nama_driver: e.target.value })}
                  className={inputCls} placeholder="contoh: Ahmad Yusuf" />
                {errD.nama_driver && <Err msg={errD.nama_driver} />}
              </Field>

              <Field label="No. Telepon">
                <input value={formD.no_telepon}
                  onChange={(e) => setFormD({ ...formD, no_telepon: e.target.value })}
                  className={inputCls} placeholder="contoh: 081234567890" />
                {errD.no_telepon && <Err msg={errD.no_telepon} />}
              </Field>

              <Field label="No. SIM">
                <input value={formD.no_sim}
                  onChange={(e) => setFormD({ ...formD, no_sim: e.target.value })}
                  className={inputCls} placeholder="contoh: SIM-001-2024" />
                {errD.no_sim && <Err msg={errD.no_sim} />}
              </Field>

              <Field label="Status">
                <select value={formD.status_driver}
                  onChange={(e) => setFormD({ ...formD, status_driver: e.target.value })}
                  className={inputCls}>
                  {STATUS_DRIVER.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setModalD(false); setEditDriver(null); }}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition">
                Batal
              </button>
              <button onClick={submitDriver}
                className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition">
                {editDriver ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL KONFIRMASI HAPUS ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Data?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Data {confirmDelete.type} ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HELPER COMPONENTS ──────────────────────────────────────
const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

function StatusBadgeK({ status }: { status: string }) {
  const map: Record<string, string> = {
    tersedia:    "bg-green-100 text-green-700",
    digunakan:   "bg-blue-100 text-blue-700",
    maintenance: "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function StatusBadgeD({ status }: { status: string }) {
  const map: Record<string, string> = {
    tersedia: "bg-green-100 text-green-700",
    bertugas: "bg-blue-100 text-blue-700",
    cuti:     "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}
