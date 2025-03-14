import styles from "./BoxContainer.module.css";

const boxPositions = [
  { top: "-1.5rem", left: "-45rem" },
  { top: "0rem", left: "-32rem" },
  { top: "1.5rem", left: "-19rem" },
  { top: "3rem", left: "-7rem" },
  { top: "3.5rem", left: "10rem" },
];

export default function BoxContainer() {
  return (
    <div className="absolute">
      {boxPositions.map((pos, index) => (
        <div
          key={index}
          className={`box box-${index + 1} ${styles.box}`}
          style={{ top: pos.top, left: pos.left }}
        ></div>
      ))}
    </div>
  );
}