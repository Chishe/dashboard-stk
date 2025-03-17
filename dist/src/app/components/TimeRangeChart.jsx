"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, } from "chart.js";
import { motion } from "framer-motion";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
export default function TimeRangeChart() {
    const [timeRange, setTimeRange] = useState("daily");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Volume",
                data: [],
                backgroundColor: "rgba(255, 87, 51, 0.7)",
                borderColor: "rgba(255, 87, 51, 1)",
                borderWidth: 2,
            },
        ],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchChartData();
    }, [timeRange]);
    const fetchChartData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/chart-data?range=${timeRange}`);
            if (!res.ok)
                throw new Error(`Failed to fetch data: ${res.status}`);
            const data = await res.json();
            setChartData({
                labels: data.labels,
                datasets: data.datasets.map((dataset, index) => (Object.assign(Object.assign({}, dataset), { backgroundColor: data.labels.map((_, i) => `rgba(${(index * 50) % 255}, ${(i * 40) % 255}, 150, 0.7)`), borderColor: data.labels.map((_, i) => `rgba(${(index * 50) % 255}, ${(i * 40) % 255}, 150, 1)`), borderWidth: 2 }))),
            });
            setError(null);
        }
        catch (error) {
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="w-full h-[92vh] bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        กราฟแสดงยอด - {timeRange === "daily" ? "รายวัน" : timeRange === "monthly" ? "รายเดือน" : "รายปี"}
      </h2>

      <div className="flex justify-center mb-6">
        <motion.select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="p-3 border-2 border-gray-500 bg-gray-800 text-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <option value="daily">รายวัน</option>
          <option value="monthly">รายเดือน</option>
          <option value="yearly">รายปี</option>
        </motion.select>
      </div>

      <motion.div className="flex w-full h-[450px] space-x-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="w-2/3 p-4 bg-gray-800 rounded-xl shadow-xl">
          {loading ? (<div className="flex justify-center items-center h-full text-gray-400">กำลังโหลดข้อมูล...</div>) : error ? (<div className="flex justify-center items-center h-full text-red-500">{error}</div>) : (<Bar data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: "top" } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#374151" }, ticks: { beginAtZero: true } },
                },
            }}/>)}
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
              {chartData.labels.map((label, index) => {
            var _a;
            return (<tr key={index} className="hover:bg-gray-700">
                  <td className="py-2 px-4 border-b border-gray-600">{label}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {(_a = chartData.datasets[0]) === null || _a === void 0 ? void 0 : _a.data[index]}
                  </td>
                </tr>);
        })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>);
}
