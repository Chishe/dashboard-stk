import { useState, useEffect } from "react";
import BoxContainer from "../components/BoxContainer";
const DataCard = ({ index }) => (<div className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-white rounded-lg shadow-md mb-4 p-4 z-10 w-1/5">
    <div className="border-b-2 pb-2 mb-2">
      <h3 className="text-xl font-semibold">CURRENT{index + 1}</h3>
    </div>

    <div className="mb-2 text-center text-6xl">
      <div>
        <strong>{index + 1}</strong>
      </div>
    </div>

    <div className="border-t-2 pt-2 mt-2">
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">
        TASK{index + 1}
      </button>
    </div>
  </div>);
const DataTable = () => {
    return (<div className="absolute top-0 left-10 flex space-x-4 overflow-x-auto mt-10 z-10">
      {[...Array(5)].map((_, index) => (<DataCard key={index} index={index}/>))}
    </div>);
};
export default function BackgroundComponent() {
    const [backgroundImage, setBackgroundImage] = useState("/000.png");
    const [nextImage, setNextImage] = useState("/000.png");
    const [fade, setFade] = useState(false);
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
            }
            catch (error) {
                console.error("Error fetching background:", error);
            }
        };
        fetchBackground();
        const interval = setInterval(fetchBackground, 5000);
        return () => clearInterval(interval);
    }, [backgroundImage]);
    return (<div className="relative w-full h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-700">

      {/* Previous background image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${fade ? "opacity-0" : "opacity-100"}`} style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "16px",
        }}/>

      {/* New background image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${fade ? "opacity-100" : "opacity-0"}`} style={{
            backgroundImage: `url('${nextImage}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "16px",
        }}/>

      <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl">
        <BoxContainer />
        <DataTable />
      </div>
    </div>);
}
