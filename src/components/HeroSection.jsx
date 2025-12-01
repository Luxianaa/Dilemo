import { useEffect, useRef } from "react";
import CardCarousel from "./CardCarousel";
import Header from "./Header";
import gsap from "gsap";

// IMPORTA IMÁGENES
import hand from "../assets/hand.png";
import escherBg from "../assets/dilemo-escher.6d1f4ed2.svg";

export default function HeroSection() {
  const handRef = useRef(null);

  useEffect(() => {
    gsap.to(handRef.current, {
      y: -10,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="h-screen w-full bg-[#12009F] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Fondo con patrón Escher */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url(${escherBg})`,
          backgroundSize: '120% auto',
          backgroundPosition: 'calc(50% - 10px) center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <Header />

      <div className="flex flex-col items-center gap-6 relative z-10 mt-52">

        {/* Título Principal */}
        <div className="bg-white px-8 py-3 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] mb-2 -mt-20">
          <h1 className="text-4xl font-black text-black tracking-tighter">CODUVA</h1>
        </div>

        <CardCarousel />

        <img
          ref={handRef}
          src={hand}
          className="w-[240px] select-none z-10 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.5)]"
          alt="Hand"
        />
      </div>

    </div>
  );
}
