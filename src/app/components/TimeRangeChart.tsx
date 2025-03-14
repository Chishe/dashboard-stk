"use client";

import React, { useState, useEffect } from "react";
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
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

export default function TimeRangeChart() {
  const [timeRange, setTimeRange] = useState<string>("daily");
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Sales",
        data: [],
        backgroundColor: "rgb(211, 47, 47)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChartData({
      labels: [],
      datasets: [
        {
          label: "Sales",
          data: [],
          backgroundColor: "rgb(211, 47, 47)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
    });
    setError(null);
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        ` http://192.168.1.44:1880/chart-data?range=${timeRange}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
      const data: ChartData = await res.json();
      if (data.labels.length === 0) {
        setError("ไม่มีข้อมูลสำหรับช่วงเวลานี้");
      } else {
        setChartData(data);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 m-6 w-full h-full mx-auto from-indigo-400 to-indigo-200  border-indigo-200">
      <h2 className="text-red-700 text-2xl font-bold text-center mb-4">
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
          className="p-2 border text-red-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <option value="daily">รายวัน</option>
          <option value="monthly">รายเดือน</option>
          <option value="yearly">รายปี</option>
        </motion.select>
      </div>

      <motion.div
        className="flex w-full h-[400px] overflow-hidden space-x-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-1/2">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center w-full h-full text-gray-500"
            >
              กำลังโหลดข้อมูล...
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center w-full h-full text-red-500"
            >
              {error}
            </motion.div>
          ) : (
            <Bar
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets.map((dataset) => ({
                  ...dataset,
                  backgroundColor: dataset.backgroundColor || "rgb(211, 47, 47)",
                  borderColor: dataset.borderColor || "rgb(75, 192, 192)",
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      color: "#e5e7eb",
                    },
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                },
              }}
            />
          )}
        </div>

        <div className="w-1/2 overflow-auto">
          <table className="min-w-full bg-slate-900 border border-gray-950 h-full text-red-600 text-center">
            <thead className="bg-red-600 text-lime-900">
              <tr>
                <th className="text-2xl py-2 px-4 border-b">DATE</th>
                <th className="text-2xl py-2 px-4 border-b">VOLUME</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, index) => (
                <tr key={index} className="bg-slate-900 hover:bg-indigo-100">
                  <td className="py-2 px-4 border-b">{label}</td>
                  <td className="py-2 px-4 border-b">
                    {chartData.datasets[0].data[index]}
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
