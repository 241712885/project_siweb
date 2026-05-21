export const customers = [
  {
    id: "C001",
    name: "Miranda",
    email: "miranda@gmail.com",
    phone: "081234567890",
    address: "Jl. Malioboro No.10, Yogyakarta"
  },
  {
    id: "C002",
    name: "Dhinda",
    email: "dhinda@gmail.com",
    phone: "081234567891",
    address: "Jl. Sudirman No.8, Jakarta"
  },
  {
    id: "C003",
    name: "Hendra",
    email: "hendra@gmail.com",
    phone: "081234567892",
    address: "Jl. Diponegoro No.20, Bandung"
  }
];

export const drivers = [
  {
    id:"D001",
    name:"Budi Santoso",
    phone:"081111111111",
    vehicle:"Motor",
    plateNumber:"AB1234XY",
    status:"Aktif"
  },
  {
    id:"D002",
    name:"Dio Saputra",
    phone:"082222222222",
    vehicle:"Mobil Box",
    plateNumber:"AB5678YY",
    status:"Aktif"
  }
];

export const cities = [
  {
    id:"KT001",
    city:"Jakarta",
    province:"DKI Jakarta"
  },
  {
    id:"KT002",
    city:"Bandung",
    province:"Jawa Barat"
  },
  {
    id:"KT003",
    city:"Yogyakarta",
    province:"DI Yogyakarta"
  }
];

export const shipmentTypes = [
  {
    id:"JP001",
    type:"Reguler",
    estimation:"3-5 hari"
  },
  {
    id:"JP002",
    type:"Express",
    estimation:"1-2 hari"
  },
  {
    id:"JP003",
    type:"Same Day",
    estimation:"Hari yang sama"
  }
];

export const tariffs = [
  {
    id:"T001",
    city:"Jakarta",
    type:"Reguler",
    pricePerKg:10000
  },
  {
    id:"T002",
    city:"Bandung",
    type:"Express",
    pricePerKg:15000
  }
];

export const items = [
  {
    id:"B001",
    itemName:"Laptop",
    category:"Elektronik",
    weight:2,
    quantity:1
  },
  {
    id:"B002",
    itemName:"Sepatu",
    category:"Fashion",
    weight:1,
    quantity:2
  }
];