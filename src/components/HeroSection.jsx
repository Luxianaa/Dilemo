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
    <div className="h-screen w-full bg-[#1a1f2b] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 relative">

        {/* Cabeza flotando */}
        {/*    */}

        <CardCarousel />

        <img
          ref={handRef}
          src={hand}
          className="w-[320px] select-none z-10"
        />
      </div>

    </div>
  );
}
