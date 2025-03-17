"use client";
import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import BackgroundComponent from "../components/BackgroundComponent";
import styles from "./Dashboard.module.css";
export default function Dashboard() {
    const [data, setData] = useState(null);
    const [counts, setCounts] = useState({ SRG: 0, BPH: 0, GTW: 0 });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:1880/api/modbusdata");
                const jsonData = await response.json();
                if (jsonData) {
                    setData(jsonData);
                    setCounts(jsonData.nameCounts);
                }
            }
            catch (err) {
                console.error("Error fetching data from API:", err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (data) {
            let { stations } = data;
            stations = stations.map((val) => (val === "Invalid range" ? 0 : Number(val)));
            const labelMap = {
                0: null,
                1: "SRG",
                2: "BPH",
                3: "GTW",
            };
            for (let i = 0; i < stations.length; i++) {
                updateBox(i, labelMap[stations[i]] || null);
            }
        }
    }, [data]);
    function updateBox(index, label) {
        const box = document.querySelector(`.box-${index}`);
        if (!box)
            return;
        box.innerHTML = "";
        if (!label)
            return;
        const square = document.createElement("div");
        square.classList.add(styles.box);
        const backgroundImage = index === 5 ? "PL2-output.png" : "PL1-output.png";
        square.style = `
      background-image: url("${backgroundImage}");
      background-size: cover;
      background-position: center;
      width: 200px;
      height: 200px;
      position: relative;
      transition: transform 0.3s ease-in-out;
    `;
        const labelElement = document.createElement("span");
        labelElement.textContent = label;
        labelElement.classList.add(styles.label);
        labelElement.style.position = "absolute";
        labelElement.style.fontSize = "1.5rem";
        labelElement.style.fontWeight = "bold";
        labelElement.style.color = label === "SRG" ? "red" : label === "BPH" ? "green" : "yellow";
        labelElement.style.backgroundColor = "#040720";
        labelElement.style.textAlign = "center";
        if (index === 5) {
            labelElement.style.top = "32%";
            labelElement.style.left = "37%";
            labelElement.style.padding = "40px 35px 40px 35px";
            labelElement.style.clipPath = "polygon(0% 28%, 100% 10%, 100% 70%, 0% 87%)";
        }
        else {
            labelElement.style.top = "40%";
            labelElement.style.left = "4.7%";
            labelElement.style.padding = "30px 35px 20px 35px";
            labelElement.style.clipPath = "polygon(0% 7%, 100% 25%, 100% 100%, 0% 80%)";
        }
        square.appendChild(labelElement);
        box.appendChild(square);
    }
    return (<div className="relative flex h-[92vh]">
      <BackgroundComponent />

      <div className="w-full sm:w-1/6 p-4 bg-gradient-to-b from-indigo-400 to-indigo-200 shadow-lg z-50">
        <div className="text-center bg-indigo-200 p-6 rounded-lg shadow-md mb-6">
          <Clock />
        </div>

        <div className="bg-indigo-200 p-6 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-indigo-950">
              ข้อมูลจำนวนวันนี้
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="mt-8 grid grid-cols-1 gap-4">
              {["SRG", "BPH", "GTW"].map((id, index) => (<div key={index} id={id} className={`p-6 text-center border rounded-lg shadow-lg text-white font-bold text-2xl flex items-center justify-center ${id === "SRG"
                ? "bg-gradient-to-b from-red-950 to-red-500"
                : id === "BPH"
                    ? "bg-gradient-to-b from-green-950 to-green-500"
                    : "bg-gradient-to-b from-yellow-950 to-yellow-500"}`}>
                  <div>
                    <div className="text-lg">{id} Count</div>
                    <div id={`${id}-count`} className="text-4xl">
                      {counts[id] || 0}
                    </div>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
