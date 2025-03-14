export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:1880/api/modbusdata");
        const data = await response.json();
        if (data) setData(data);
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
      const { ons, names, stations, nameCounts, label, value } = data;

      if (ons && names && stations) {
        for (let i = 0; i < 6; i++) {
          const station = stations[i];
          const name = names[i];
          const on = ons[i];
          if (station && name && typeof on !== "undefined") {
            updateBox(station, name, on);
          }
        }
      }

      if (nameCounts) updateCountsDisplay(nameCounts);
      if (label && value !== undefined) {
        console.log(`Label: ${label}, Value: ${value}`);
      }
    }
  }, [data]);

  function updateCountsDisplay(nameCounts) {
    ["SRG", "BPH", "GTW"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const count = nameCounts[id] || 0;
        element.textContent = `${id}: ${count}`;
        console.log(`${id} count updated to:`, count);
      }
    });
  }
  

  function updateBox(station, name, on) {
    const box = document.querySelector(`.box-${station}`);
    if (!box) return;

    box.innerHTML = "";
    const square = document.createElement("div");
    square.classList.add(styles.box);

    const backgroundImage =
      station === "5" ? "PL2-output.png" : "PL1-output.png";
    console.log(station);
    square.style = `
      background-image: url("${backgroundImage}");
      background-size: cover;
      background-position: center;
      width: 200px;
      height: 200px;
      position: relative;
      transition: transform 0.3s ease-in-out;
    `;

    const label = document.createElement("span");
    label.textContent = name || "Unknown";
    label.classList.add(styles.label);

    label.style.position = "absolute";
    label.style.fontSize = "1.5rem";
    label.style.fontWeight = "bold";
    label.style.color = "white";
    label.style.backgroundColor = "#040720";
    label.style.textAlign = "center";

    if (station === "5") {
      label.style.top = "32%";
      label.style.left = "37%";
      label.style.padding = "40px 35px 40px 35px";
      label.style.clipPath = "polygon(0% 28%, 100% 10%, 100% 70%, 0% 87%)";
    } else {
      label.style.top = "40%";
      label.style.left = "4.7%";
      label.style.padding = "30px 35px 20px 35px";
      label.style.clipPath = "polygon(0% 7%, 100% 25%, 100% 100%, 0% 80%)";
    }

    if (name === "SRG") {
      label.style.color = "red";
    } else if (name === "BPH") {
      label.style.color = "green";
    } else if (name === "GTW") {
      label.style.color = "yellow";
    }

    if (on === 1 || on === "1") {
      const colors = { SRG: styles.srg, BPH: styles.bph, GTW: styles.gtw };
      label.classList.add(colors[name] || "");
      square.classList.add(styles.active);
    } else {
      let blink = true;
      setInterval(() => {
        square.classList.toggle(styles.active, blink);
        square.classList.toggle(styles.inactive, !blink);
        blink = !blink;
      }, 500);
    }

    square.appendChild(label);
    box.appendChild(square);
  }
