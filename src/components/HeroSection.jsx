import { useEffect, useRef } from "react";
import CardCarousel from "./cardCarousel";
import gsap from "gsap";

// IMPORTA IMÁGENES
import head from "../assets/head.svg";
import pythonLogo from "../assets/python.svg";
import hand from "../assets/hand.png";

export default function HeroSection() {
  const headRef = useRef(null);
  const handRef = useRef(null);

  useEffect(() => {
    gsap.to(headRef.current, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(handRef.current, {
      y: -10,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="bg-[#453f3d] w-full h-screen flex justify-center items-center overflow-hidden">

      <div className="flex flex-col items-center gap-4 relative">

        {/* Cabeza flotando */}
        <img
          ref={headRef}
          src={head}
          className="w-[200px] -mt-5 select-none z-20"
        />

        <CardCarousel />
        {/* <div className="bg-[#fff2e3] rounded-xl p-4 w-[200px] h-[250px] shadow-lg flex flex-col items-center justify-center gap-2">
          <h1 className="text-xl font-bold text-[#ff6d29]">Python</h1>
          <img src={pythonLogo} className="w-[70px]" />
        </div> */}

        <img
          ref={handRef}
          src={hand}
          className="w-[260px] select-none z-10"
        />
      </div>

    </div>
  );
}
