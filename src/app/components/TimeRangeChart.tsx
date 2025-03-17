"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
  customers: string[]; // Add customer data here
};

export default function TimeRangeChart() {
  const [timeRange, setTimeRange] = useState<string>("daily");
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Palette",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
      },
    ],
    customers: [], // Initialize customers array
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:1880/chart-data?range=${timeRange}`
      );
      if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
      const data: ChartData = await res.json();

      const colorMap: Record<string, { background: string; border: string }> = {
        SRG: {
          background:
            "bg-gradient-to-b from-rgba(170, 0, 0, 1) to-rgba(255, 0, 0, 1)",
          border: "rgba(255, 0, 0, 1)",
        },
        BPH: {
          background:
            "bg-gradient-to-b from-rgba(0, 85, 0, 1) to-rgba(0, 255, 0, 1)",
          border: "rgba(0, 255, 0, 1)",
        },
        GTW: {
          background:
            "bg-gradient-to-b from-rgba(170, 170, 0, 1) to-rgba(255, 255, 0, 1)",
          border: "rgba(255, 255, 0, 1)",
        },
      };

      console.log(data.datasets);

      setChartData({
        labels: data.labels,
        datasets: data.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: data.customers.map(
            (label) => colorMap[label]?.background || "rgba(255, 87, 51, 0.7)"
          ),
          borderColor: data.customers.map(
            (label) => colorMap[label]?.border || "rgba(255, 87, 51, 1)"
          ),
          borderWidth: 2,
        })),
        customers: data.customers,
      });

      setError(null);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const memoizedChartData = useMemo(() => chartData, [chartData]);

  return (
    <div className="w-full h-[92vh] bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        กราฟแสดงยอด -{" "}
        {timeRange === "daily"
          ? "รายวัน"
          : timeRange === "monthly"
          ? "รายเดือน"
          : "รายปี"}
      </h2>

      <div className="flex justify-center mb-6">
        <motion.select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          aria-label="Select time range"
          className="p-3 border-2 border-gray-500 bg-gray-800 text-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <option value="daily">รายวัน</option>
          <option value="monthly">รายเดือน</option>
          <option value="yearly">รายปี</option>
        </motion.select>
      </div>

      <motion.div
        className="flex w-full h-[650px] space-x-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-2/3 p-4 bg-gray-800 rounded-xl shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              กำลังโหลดข้อมูล...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-red-500">
              {error}
            </div>
          ) : (
            <Bar
              data={memoizedChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: "top" } },
                scales: {
                  x: { grid: { display: false } },
                  y: {
                    grid: { color: "#374151" },
                    ticks: { beginAtZero: true },
                  },
                },
              }}
            />
          )}
        </div>

        <div className="w-1/3 p-4 bg-gray-800 rounded-xl shadow-xl overflow-auto">
          <table className="w-full text-center text-yellow-400">
            <thead className="bg-yellow-500 text-gray-900">
              <tr>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">VOLUME</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="py-2 px-4 border-b border-gray-600">
                    {label}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {chartData.customers[index] || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {chartData.datasets[0]?.data[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
