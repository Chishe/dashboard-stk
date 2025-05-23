import { useState, useEffect } from "react";

const StatusComponent = () => {
  const [lampStatus, setLampStatus] = useState<0 | 1 | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:1880/ws/lamp");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const lampValue = Number(data.querySuccess);
        if (lampValue === 0 || lampValue === 1) {
          setLampStatus(lampValue);
        }
      } catch (error) {
        console.error("Error parsing lamp message:", error);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div className="absolute top-40 left-10 flex items-center justify-center overflow-x-auto mt-20 p-4 z-10 bg-gradient-to-b from-indigo-950 to-indigo-900 text-white rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full shadow-lg border-4 ${
            lampStatus === 1 ? "bg-green-500 border-green-700" : "bg-red-500 border-red-700"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default StatusComponent;
