import { useState, useEffect } from "react";

const LampStatusComponent = () => {
  const [lampStatus, setLampStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Waiting for Scanner...");
  const [statusSuccess, setStatusSuccess] = useState(null);

  useEffect(() => {
    const lampSocket = new WebSocket("ws://127.0.0.1:1880/ws/lamp");
    lampSocket.onmessage = (event) => {
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

    const statusSocket = new WebSocket("ws://127.0.0.1:1880/ws/status");
    statusSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatusMessage(data.querySuccess ? "Operation Successful" : "Operation Failed");
        setStatusSuccess(data.querySuccess);
      } catch (error) {
        console.error("Error parsing status message:", error);
      }
    };

    return () => {
      lampSocket.close();
      statusSocket.close();
    };
  }, []);

  return (
    <div className="absolute w-auto top-40 left-10 flex flex-row items-center justify-center space-x-12 overflow-x-auto mt-20 p-6 z-10 bg-gradient-to-b from-indigo-950 to-indigo-900 text-white rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
      {/* Lamp (ซ้าย) */}
      <div className="flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full shadow-lg border-4 ${
            lampStatus === 1 ? "bg-green-500 border-green-700" : "bg-red-500 border-red-700"
          }`}
        ></div>
        <p className="text-xl font-bold mt-4">
          {lampStatus === 1 ? "🟢 Lamp Auto" : "🔴 Lamp Manual"}
        </p>
      </div>

      <p className={`text-2xl font-bold tracking-wide uppercase text-center ${
        statusSuccess ? "text-green-500" : "text-red-500"
      }`}>
        {statusMessage}
      </p>
    </div>
  );
};

export default LampStatusComponent;
