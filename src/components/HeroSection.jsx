import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CardCarousel from "./cardCarousel";
import gsap from "gsap";

// IMPORTA IMÁGENES

import head from "../assets/head.svg";
import pythonLogo from "../assets/python.svg";
import hand from "../assets/hand.png";

export default function HeroSection() {
  const headRef = useRef(null);
  const handRef = useRef(null);
  const navigate = useNavigate();

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
    <div className="h-screen w-full bg-[#1a1f2b] flex flex-col items-center justify-center px-4 relative">

      {/* Botones Superiores */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <button
          onClick={() => navigate('/leaderboard')}
          className="bg-[#ff4d6d] hover:bg-[#e63956] text-white px-4 py-2 rounded-xl border-4 border-black font-bold shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] transition-all"
        >
          🏆 Leaderboard
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="bg-[#4ecdc4] hover:bg-[#3db9b0] text-white px-4 py-2 rounded-xl border-4 border-black font-bold shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] transition-all"
        >
          👤 Perfil
        </button>
      </div>

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
