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
{
  id: "8",
  date: "2026-09-18",
  receipt: "CRG-2026-011",
  sender: "Rina",
  receiver: "Doni",
  status: "Di Gudang",
},
{
  id: "9",
  date: "2026-09-19",
  receipt: "CRG-2026-012",
  sender: "Salsa",
  receiver: "Ari",
  status: "Terkirim",
},
{
  id: "10",
  date: "2026-09-20",
  receipt: "CRG-2026-013",
  sender: "Kevin",
  receiver: "Bagas",
  status: "Dalam Pengiriman",
},
{
  id: "11",
  date: "2026-09-21",
  receipt: "CRG-2026-014",
  sender: "Nina",
  receiver: "Yoga",
  status: "Menunggu Pick Up",
},
{
  id: "12",
  date: "2026-09-22",
  receipt: "CRG-2026-015",
  sender: "Aurel",
  receiver: "Rafi",
  status: "Terkirim",
},
{
  id: "13",
  date: "2026-09-23",
  receipt: "CRG-2026-016",
  sender: "Dian",
  receiver: "Putra",
  status: "Di Gudang",
},
{
  id: "14",
  date: "2026-09-24",
  receipt: "CRG-2026-017",
  sender: "Sarah",
  receiver: "Fajar",
  status: "Dibatalkan",
},
{
  id: "15",
  date: "2026-09-25",
  receipt: "CRG-2026-018",
  sender: "Lina",
  receiver: "Bimo",
  status: "Terkirim",
},
{
  id: "16",
  date: "2026-09-26",
  receipt: "CRG-2026-019",
  sender: "Rani",
  receiver: "Dian",
  status: "Di Gudang",
},
{
  id: "17",
  date: "2026-09-27",
  receipt: "CRG-2026-020",
  sender: "Bayu",
  receiver: "Ali",
  status: "Terkirim",
},
{
  id: "18",
  date: "2026-09-28",
  receipt: "CRG-2026-021",
  sender: "Nella",
  receiver: "Deo",
  status: "Dalam Pengiriman",
},
{
  id: "19",
  date: "2026-09-29",
  receipt: "CRG-2026-022",
  sender: "Nita",
  receiver: "Bolan",
  status: "Menunggu Pick Up",
},
{
  id: "20",
  date: "2026-09-30",
  receipt: "CRG-2026-023",
  sender: "Jessica",
  receiver: "Rafli",
  status: "Terkirim",
},
{
  id: "21",
  date: "2026-09-31",
  receipt: "CRG-2026-024",
  sender: "Safti",
  receiver: "Leon",
  status: "Di Gudang",
},
{
  id: "22",
  date: "2026-09-32",
  receipt: "CRG-2026-025",
  sender: "Dara",
  receiver: "Tiyo",
  status: "Dibatalkan",
},
{
  id: "23",
  date: "2026-09-33",
  receipt: "CRG-2026-026",
  sender: "Lana",
  receiver: "Tori",
  status: "Terkirim",
}
];