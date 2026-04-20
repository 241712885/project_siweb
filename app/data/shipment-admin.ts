export type ShipmentStatus =
  | "Menunggu Pick Up"
  | "Di Gudang"
  | "Dalam Pengiriman"
  | "Terkirim"
  | "Dibatalkan";

export type AdminShipmentItem = {
  id: string;
  date: string;
  receipt: string;
  sender: string;
  receiver: string;
  status: ShipmentStatus;
};

export const adminShipments: AdminShipmentItem[] = [
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
    date: "2026-03-12",
    receipt: "CRG-2026-005",
    sender: "Jio",
    receiver: "Ale",
    status: "Terkirim",
  },
  {
    id: "3",
    date: "2026-03-13",
    receipt: "CRG-2026-006",
    sender: "Vanesa",
    receiver: "Jennie",
    status: "Dalam Pengiriman",
  },
  {
    id: "4",
    date: "2026-03-14",
    receipt: "CRG-2026-007",
    sender: "Zayn",
    receiver: "Hendra",
    status: "Menunggu Pick Up",
  },
  {
    id: "5",
    date: "2026-03-15",
    receipt: "CRG-2026-008",
    sender: "Malik",
    receiver: "Harry",
    status: "Dibatalkan",
  },
  {
    id: "6",
    date: "2026-03-16",
    receipt: "CRG-2026-009",
    sender: "Khanza",
    receiver: "Hans",
    status: "Terkirim",
  },
  {
    id: "7",
    date: "2026-03-17",
    receipt: "CRG-2026-010",
    sender: "Pricila",
    receiver: "Husein",
    status: "Terkirim",
  },
];