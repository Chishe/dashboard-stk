"use client";
import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import BackgroundComponent from "../components/BackgroundComponent";
import styles from "./Dashboard.module.css";
import "../globals.css";

type Counts = {
  SRG: number;
  BPH: number;
  GTW: number;
};

type Data = {
  stations: (string | number)[];
  nameCounts: Counts;
};

export default function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [counts, setCounts] = useState<Counts>({ SRG: 0, BPH: 0, GTW: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:1880/api/modbusdata");
        const jsonData = await response.json();
        if (jsonData) {
          setData(jsonData);
          setCounts(jsonData.nameCounts);
        }
      } catch (err) {
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

      stations = stations.map((val) =>
        val === "Invalid range" ? 0 : Number(val)
      );
      console.log(stations);

      const labelMap = {
        0: null,
        1: "GTW(G2)",
        2: "SRG",
        3: "GTW(C2)",
        4: "BPH",
      } as const;

      for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        if (station in labelMap) {
          updateBox(i, labelMap[station as keyof typeof labelMap] || null);
        }
      }
    }
  }, [data]);

  function updateBox(index: number, label: string | null) {
    const box = document.querySelector(`.box-${index}`);
    if (!box) return;

    box.innerHTML = "";

    if (!label) return;

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
    labelElement.style.color =
      label === "GTW(G2)"
        ? "red"
        : label === "SRG"
        ? "green"
        : label === "GTW(C2)"
        ? "orange"
        : label === "BPH"
        ? "yellow"
        : "black";
    labelElement.style.backgroundColor = "#040720";
    labelElement.style.textAlign = "center";

    if ((label === "GTW(G2)" || label === "GTW(C2)") && index !== 5) {
      labelElement.style.top = "40%";
      labelElement.style.left = "4%";
      labelElement.style.padding = "25px 10px 25px 10px";
      labelElement.style.clipPath =
        "polygon(0% 7%, 100% 25%, 100% 100%, 0% 80%)";
    } else if ((label === "SRG" || label === "BPH") && index === 5) {
      labelElement.style.top = "32%";
      labelElement.style.left = "37%";
      labelElement.style.padding = "40px 35px 40px 35px";
      labelElement.style.clipPath =
        "polygon(0% 28%, 100% 10%, 100% 70%, 0% 87%)";
    } else if ((label === "GTW(G2)" || label === "GTW(C2)") && index === 5) {
      labelElement.style.top = "32%";
      labelElement.style.left = "37%";
      labelElement.style.padding = "40px 10px 40px 10px";
      labelElement.style.clipPath =
        "polygon(0% 28%, 100% 10%, 100% 70%, 0% 87%)";
    } else {
      labelElement.style.top = "40%";
      labelElement.style.left = "4.7%";
      labelElement.style.padding = "30px 35px 20px 35px";
      labelElement.style.clipPath =
        "polygon(0% 7%, 100% 25%, 100% 100%, 0% 80%)";
    }

    square.appendChild(labelElement);
    box.appendChild(square);
  }

  return (
    <div className="relative flex h-[100vh]">
      <BackgroundComponent />
      <div className="w-full sm:w-1/6 p-4 bg-gradient-to-b from-indigo-400 to-indigo-200 shadow-lg z-50">
        <div className="text-center bg-indigo-200 p-6 rounded-lg shadow-md mb-6">
          <Clock />
        </div>
        <div className="bg-indigo-200 p-4 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-indigo-950">
              ข้อมูลจำนวนวันนี้
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="mt-8 grid grid-cols-1 gap-4">
              {["GTW(G2)", "SRG", "GTW(C2)", "BPH"].map((id, index) => (
                <div
                  key={index}
                  id={id}
                  className={`p-6 text-center border rounded-lg shadow-lg text-white font-bold text-2xl flex items-center justify-center ${id === "SRG"
                      ? "bg-gradient-to-b from-red-950 to-red-500"
                      : id === "BPH"
                      ? "bg-gradient-to-b from-green-950 to-green-500"
                      : id === "GTW(G2)"
                      ? "bg-gradient-to-b from-yellow-950 to-yellow-500"
                      : id === "GTW(C2)"
                      ? "bg-gradient-to-b from-orange-950 to-orange-500"
                      : ""
                    }`}
                >
                  <div>
                    <div className="text-lg">{id} Count</div>
                    <div id={`${id}-count`} className="text-2xl">
                      {counts[id as keyof Counts] || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
