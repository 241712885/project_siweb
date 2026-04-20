type TabType = "Semua" | "Proses" | "Selesai";

type ShipmentItem = {
  id: string;
  sender: string;
  receiver: string;
  date: string;
  status: string;
  category: TabType;
};

type HistoryCardProps = {
  item: ShipmentItem;
};

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function HistoryCard({ item }: HistoryCardProps) {
  const isDelivered = item.status === "Terkirim";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          📦
        </div>

        <div>
          <p className="text-xs text-slate-400">{item.id}</p>
          <p className="text-sm font-medium text-slate-800">
            {item.sender} - {item.receiver}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
          {formatDate(item.date)}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isDelivered
              ? "bg-blue-100 text-blue-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}