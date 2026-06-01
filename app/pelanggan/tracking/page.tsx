"use client"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────
type StatusPengiriman = "pending" | "diproses" | "dalam pengiriman" | "selesai";

interface PemesananData {
  id: number;
  no_resi: string;
  nama_pengirim: string;
  no_telp_pengirim: string | null;
  alamat_pengirim: string | null;
  nama_penerima: string;
  no_telp_penerima: string | null;
  alamat_penerima: string | null;
  berat: number;
  total_harga: number;
  metode_pembayaran: string | null;
  status_pengiriman: StatusPengiriman;
  status_transaksi: string;
  catatan: string | null;
  tanggal_kirim: string | null;
  created_at: string;
  jenis_pengiriman: string | null;
  estimasi_hari: number | null;
  nama_customer: string | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: PemesananData;
}

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  step: number;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusPengiriman, StatusConfig> = {
  pending:            { label: "Menunggu Konfirmasi", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400", step: 0 },
  diproses:           { label: "Sedang Diproses",     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-400",   step: 1 },
  "dalam pengiriman": { label: "Dalam Pengiriman",    color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", step: 2 },
  selesai:            { label: "Terkirim",            color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  dot: "bg-green-500",  step: 3 },
};

const defaultStatus: StatusConfig = {
  label: "Tidak Diketahui", color: "text-gray-500", bg: "bg-gray-50",
  border: "border-gray-200", dot: "bg-gray-400", step: -1,
};

const STEPS: string[] = ["Menunggu Konfirmasi", "Sedang Diproses", "Dalam Pengiriman", "Terkirim"];

function getStatus(key: string | undefined): StatusConfig {
  if (!key) return defaultStatus;
  return STATUS_CONFIG[key.toLowerCase() as StatusPengiriman] ?? defaultStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(val: string | null | undefined): string {
  if (!val) return "-";
  return new Date(val).toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatRupiah(val: number | null | undefined): string {
  if (val == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(val);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between w-full px-1 py-2">
      {STEPS.map((label, i) => {
        const done   = i <= currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            {i < STEPS.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 w-full h-0.5 ${i < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                style={{ left: "50%", width: "100%" }}
              />
            )}
            <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
              ${done ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}>
              {done && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className={`text-[10px] mt-1 text-center leading-tight
              ${active ? "text-green-700 font-semibold" : done ? "text-green-600" : "text-gray-400"}`}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function TrackingContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const resiParam    = searchParams.get("resi") ?? "";

  const [inputResi, setInputResi] = useState<string>(resiParam);
  const [data, setData]           = useState<PemesananData | null>(null);
  const [loading, setLoading]     = useState<boolean>(false);
  const [error, setError]         = useState<string>("");

  useEffect(() => {
    if (resiParam) fetchTracking(resiParam);
  }, [resiParam]);

  async function fetchTracking(resiNumber: string): Promise<void> {
    const trimmed = resiNumber.trim();
    if (!trimmed) { setError("Masukkan nomor resi terlebih dahulu."); return; }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res        = await fetch(`/api/tracking?resi=${encodeURIComponent(trimmed)}`);
      const json: ApiResponse = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message ?? "Terjadi kesalahan. Coba lagi.");
      } else {
        setData(json.data ?? null);
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  }

  function handleLacak(): void {
    const trimmed = inputResi.trim();
    if (!trimmed) { setError("Masukkan nomor resi terlebih dahulu."); return; }
    router.replace(`/pelanggan/tracking?resi=${encodeURIComponent(trimmed)}`, { scroll: false });
    fetchTracking(trimmed);
  }

  const statusCfg = data ? getStatus(data.status_pengiriman) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100">

      {/* Navbar */}
      <div className="relative flex items-center justify-between px-6 py-4 bg-[#F5F7F6] border border-gray-300 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-200 via-green-500 to-emerald-300 blur-[1px]" />
        <button
          onClick={() => router.back()}
          className="relative z-10 flex items-center gap-2 text-gray-600 hover:text-green-700 transition text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <div className="flex items-center gap-2">
          <img src="/LogoPaketinAja.jpeg" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
          <span className="text-gray-700 font-semibold">PaketinAja</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Search */}
      <div className="px-4 pt-8 pb-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-emerald-950 text-center mb-1">Lacak Paket</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Masukkan nomor resi untuk melihat status pengiriman</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputResi}
            onChange={(e) => setInputResi(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLacak()}
            placeholder="Contoh: RSI-20240601-001"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm shadow-sm"
          />
          <button
            onClick={handleLacak}
            disabled={loading}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition text-sm shadow-sm disabled:opacity-60"
          >
            {loading ? "..." : "Lacak"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-16 max-w-2xl mx-auto space-y-4">

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-700 font-semibold text-sm">Paket Tidak Ditemukan</p>
              <p className="text-red-500 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8" />)}
            </div>
          </div>
        )}

        {/* Result */}
        {data && !loading && statusCfg && (
          <>
            {/* Status + Stepper */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className={`px-6 py-4 ${statusCfg.bg} ${statusCfg.border} border-b flex items-center gap-3`}>
                <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot} flex-shrink-0`} />
                <span className={`font-semibold text-sm ${statusCfg.color}`}>{statusCfg.label}</span>
                <span className="ml-auto text-xs text-gray-400 font-mono">{data.no_resi}</span>
              </div>
              <div className="px-6 py-5">
                <Stepper currentStep={statusCfg.step} />
              </div>
            </div>

            {/* Pengirim → Penerima */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Informasi Pengiriman</h2>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Pengirim</p>
                  <p className="font-semibold text-gray-800 text-sm">{data.nama_pengirim}</p>
                  {data.no_telp_pengirim && <p className="text-gray-500 text-xs">{data.no_telp_pengirim}</p>}
                  {data.alamat_pengirim  && <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{data.alamat_pengirim}</p>}
                </div>
                <div className="flex flex-col items-center pt-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs text-gray-400 mb-0.5">Penerima</p>
                  <p className="font-semibold text-gray-800 text-sm">{data.nama_penerima}</p>
                  {data.no_telp_penerima && <p className="text-gray-500 text-xs">{data.no_telp_penerima}</p>}
                  {data.alamat_penerima  && <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{data.alamat_penerima}</p>}
                </div>
              </div>
            </div>

            {/* Detail paket */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Detail Paket</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Jenis Pengiriman"  value={data.jenis_pengiriman} />
                <InfoRow label="Estimasi Tiba"     value={data.estimasi_hari ? `${data.estimasi_hari} hari kerja` : null} />
                <InfoRow label="Berat"             value={data.berat ? `${data.berat} kg` : null} />
                <InfoRow label="Total Harga"       value={formatRupiah(data.total_harga)} />
                <InfoRow label="Metode Pembayaran" value={data.metode_pembayaran} />
                <InfoRow label="Status Pembayaran" value={data.status_transaksi} />
                <InfoRow label="Tanggal Kirim"     value={formatDate(data.tanggal_kirim)} />
                <InfoRow label="Dibuat"            value={formatDate(data.created_at)} />
                {data.catatan && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Catatan</p>
                    <p className="text-sm font-medium text-gray-700">{data.catatan}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-[#E8FDF5] to-gray-100 flex items-center justify-center text-gray-400 text-sm">Memuat...</div>}>
      <TrackingContent />
    </Suspense>
  );
}