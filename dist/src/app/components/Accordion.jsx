"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
const png = [
    { src: "/conveyor.jpg", alt: "Cat 1", title: "HOME", description: "Welcome home! This page will take you to the heart of the site, where everything starts.", link: "/" },
    { src: "/conveyor.jpg", alt: "Cat 2", title: "DASHBOARD", description: "The Dashboard provides an overview of key data and metrics, keeping you informed and in control.", link: "/dashboard" },
    { src: "/conveyor.jpg", alt: "Cat 3", title: "HISTORY", description: "Explore other features and additional resources available on this page.", link: "/history" },
];
const AccordionItem = ({ cat, isActive, onClick }) => {
    return (<div className={`relative w-1/3 transition-all duration-500 cursor-pointer overflow-hidden ${isActive ? "w-2/3" : "hover:w-2/3"}`} onClick={onClick}>
      <Image src={cat.src} alt={cat.alt} layout="fill" objectFit="cover" className="opacity-80 hover:opacity-60"/>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center opacity-100">
  <Link href={cat.link}>
    <h2 className="text-6xl font-bold uppercase tracking-wide text-red-400 hover:text-red-950">{cat.title}</h2>
    <p className="text-lg">{cat.description}</p>
  </Link>
    </div>

    </div>);
};
const Accordion = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    return (<div className="flex h-[92vh]">
      {png.map((cat, index) => (<AccordionItem key={index} cat={cat} isActive={activeIndex === index} onClick={() => setActiveIndex(index)}/>))}
    </div>);
};
export default Accordion;
