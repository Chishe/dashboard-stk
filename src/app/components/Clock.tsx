import { useEffect } from "react";

const Clock: React.FC = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      const day = now.toLocaleString("default", { weekday: "long" });

      const dateElement = document.getElementById("date") as HTMLElement;
      const timeElement = document.getElementById("time") as HTMLElement;
      const dayElement = document.getElementById("day") as HTMLElement;

      if (dateElement) dateElement.textContent = date;
      if (timeElement) timeElement.textContent = time;
      if (dayElement) dayElement.textContent = day;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div id="clock" className="text-center bg-indigo-950 p-6 rounded-lg shadow-md mb-6 mt-4">
      <p id="date" className="font-semibold text-xl"></p>
      <p id="time" className="font-bold text-3xl"></p>
      <p id="day" className="uppercase font-semibold text-lg"></p>
    </div>
  );
};

export default Clock;
