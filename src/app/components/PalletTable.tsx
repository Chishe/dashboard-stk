"use client";
import React, { useEffect, useState } from "react";

type PalletRecord = {
  id: number;
  truc_no: string;
  customer_no: string;
  ship_to: string;
  pallet_part_no: string;
  pallet_qty: number;
  pallet_stack: number;
  rype: string;
  code: string;
  qtypack: string;
  no: string;
  gateway: string;
  dock_code: string;
  order_no: string;
  supplier: string;
  arrive_date: string;
  arrive_time: string;
  mros_no: string;
  passcode: string;
  conveyance: string;
  store_address: string;
  pds_no: string;
  created_at: string;
};

export default function PalletTable() {
  const [data, setData] = useState<PalletRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/pallets");
        if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl text-yellow-400 font-bold mb-4 text-center">
        ตารางข้อมูล Pallet
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">กำลังโหลดข้อมูล...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="w-full overflow-x-auto text-center">
          <table className="min-w-[1200px] w-full table-auto border-collapse text-sm text-yellow-300">
            <thead className="bg-yellow-500 text-black">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Truck No</th>
                <th className="px-4 py-2">Customer No</th>
                <th className="px-4 py-2">Part No</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Stack</th>
                <th className="px-4 py-2">Ship To</th>
                <th className="px-4 py-2">Arrive Date</th>
                <th className="px-4 py-2">Arrive Time</th>
                <th className="px-4 py-2">Order No</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-700 border-b border-gray-600"
                >
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.truc_no}</td>
                  <td className="px-4 py-2">{item.customer_no}</td>
                  <td className="px-4 py-2">{item.pallet_part_no}</td>
                  <td className="px-4 py-2">{item.pallet_qty}</td>
                  <td className="px-4 py-2">{item.pallet_stack}</td>
                  <td className="px-4 py-2">{item.ship_to}</td>
                  <td className="px-4 py-2">{item.arrive_date.split("T")[0]}</td>
                  <td className="px-4 py-2">{item.arrive_time}</td>
                  <td className="px-4 py-2">{item.order_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
