import { useState, useEffect } from "react";
import BoxContainer from "../components/BoxContainer";
import StatusComponent from "../components/StatusComponent";


type CardData = {
  value: string | number | null | undefined;
};

export default function BackgroundComponent() {
  const [backgroundImage, setBackgroundImage] = useState("/000.png");
  const [nextImage, setNextImage] = useState("/000.png");
  const [fade, setFade] = useState(false);
  const [data, setData] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:1880/api/card");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch("http://localhost:1880/api/get-image");
        const data = await response.json();

        if (data.imageUrl !== backgroundImage) {
          setNextImage(data.imageUrl);
          setFade(true);
          setTimeout(() => {
            setBackgroundImage(data.imageUrl);
            setFade(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };

    fetchBackground();
    const interval = setInterval(fetchBackground, 1000);
    return () => clearInterval(interval);
  }, [backgroundImage]);

  return (
    <div className="relative w-full h-[vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-700">
      <div
        className={`absolute inset-0 transition-opacity duration-2000 ${fade ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "16px",
        }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-2000 ${fade ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url('${nextImage}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "16px",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl">
        <BoxContainer />

        <div className="absolute top-0 left-10 flex space-x-4 overflow-x-auto mt-10 z-10">
          {[...Array(5)].map((_, index) => {
            const cardData = data[index] || { value: "0" };
            return (
              <div key={index} className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-white rounded-lg shadow-md mb-4 p-4 z-10 w-1/5">
                <div className="border-b-2 pb-2 mb-2">
                  <h3 className="text-xl font-semibold">CURRENT-0{index + 1}</h3>
                </div>
                <div className="mb-2 text-center text-8xl">
                  <div>
                    <strong>{cardData.value ?? "0"}</strong>
                  </div>
                </div>
                <div className="border-t-2 pt-2 mt-2"></div>
              </div>
            );
          })}
        </div>
        <StatusComponent />
      </div>
    </div>
  );
}
