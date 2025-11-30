import { useEffect, useRef } from "react";
import CardCarousel from "./CardCarousel";
import Header from "./Header";
import gsap from "gsap";

// IMPORTA IMÁGENES
import hand from "../assets/hand.png";

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
    <div className="h-screen w-full bg-[#6C5CE7] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      <Header />

      <div className="flex flex-col items-center gap-8 relative z-10 mt-16">

        {/* Título Principal (Opcional, si no está en el carrusel) */}
        <div className="bg-white px-8 py-3 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] mb-4 gap-2">
          <h1 className="text-4xl font-black text-black tracking-tighter">DILEMO</h1>
        </div>

        <CardCarousel />

        <img
          ref={handRef}
          src={hand}
          className="w-[280px] select-none z-10 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.5)]"
          alt="Hand"
        />
      </div>

    </div>
  );
}
