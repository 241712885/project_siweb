let data = [
  {
    id: 1,
    resi: "CRG-2026-001",
    pengirim: "Miranda",
    penerima: "Ale",
    status: "Menunggu",
  },
  {
    id: 2,
    resi: "CRG-2026-002",
    pengirim: "Dhinda",
    penerima: "Jio",
    status: "Proses",
  },
  {
    id: 3,
    resi: "CRG-2026-003",
    pengirim: "Vanesa",
    penerima: "Jennie",
    status: "Terkirim",
  },
];

export async function GET() {
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newData = {
    id: Date.now(),
    resi: "CRG-" + Math.floor(Math.random() * 1000),
    pengirim: body.senderName || "Unknown",
    penerima: body.receiverName || "Unknown",
    status: "Menunggu",
  };

  data.push(newData);

  return Response.json(newData);
}