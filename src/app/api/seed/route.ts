// scripts/seed.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedData() {
  const mockData = [
    {
      truc_no: "TRK001",
      customer_no: "CUST001",
      ship_to: "BANGKOK",
      pallet_part_no: "PN001",
      pallet_qty: 10,
      pallet_stack: 2,
      rype: "A",
      code: "CODE01",
      qtypack: "10",
      no: "001",
      gateway: "GTW",
      dock_code: "D1",
      order_no: "ORD001",
      supplier: "SupplierA",
      arrive_date: "2025-05-05",
      arrive_time: "08:30:00",
      mros_no: "M001",
      passcode: "PASS123",
      conveyance: "Truck",
      store_address: "Warehouse 1",
      pds_no: "PDS001"
    },
    {
      truc_no: "TRK002",
      customer_no: "CUST002",
      ship_to: "CHONBURI",
      pallet_part_no: "PN002",
      pallet_qty: 20,
      pallet_stack: 3,
      rype: "B",
      code: "CODE02",
      qtypack: "5",
      no: "002",
      gateway: "SRG",
      dock_code: "D2",
      order_no: "ORD002",
      supplier: "SupplierB",
      arrive_date: "2025-05-06",
      arrive_time: "09:45:00",
      mros_no: "M002",
      passcode: "PASS456",
      conveyance: "Container",
      store_address: "Warehouse 2",
      pds_no: "PDS002"
    }
  ];

  for (const item of mockData) {
    await pool.query(
      `INSERT INTO pallet_data (
        truc_no, customer_no, ship_to, pallet_part_no, pallet_qty, pallet_stack,
        rype, code, qtypack, no, gateway, dock_code, order_no, supplier,
        arrive_date, arrive_time, mros_no, passcode, conveyance, store_address, pds_no
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21
      )`,
      [
        item.truc_no,
        item.customer_no,
        item.ship_to,
        item.pallet_part_no,
        item.pallet_qty,
        item.pallet_stack,
        item.rype,
        item.code,
        item.qtypack,
        item.no,
        item.gateway,
        item.dock_code,
        item.order_no,
        item.supplier,
        item.arrive_date,
        item.arrive_time,
        item.mros_no,
        item.passcode,
        item.conveyance,
        item.store_address,
        item.pds_no
      ]
    );
  }

  console.log("✅ Mock data inserted successfully.");
  await pool.end();
}

seedData().catch((err) => {
  console.error("❌ Error inserting mock data:", err);
  process.exit(1);
});
