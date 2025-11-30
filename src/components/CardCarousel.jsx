import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

// Importa imágenes
import pythonLogo from "../assets/python.svg";
import gitLogo from "../assets/git.svg";
import quizLogo from "../assets/quiz.png";

export default function CardCarousel() {
  const navigate = useNavigate();

  const cards = [
    { title: "python", img: pythonLogo, color: "#FFD93D" },
    { title: "git", img: gitLogo, color: "#FF6B6B" },
    { title: "logoquiz", img: quizLogo, color: "#4D96FF" },
  ];

  const [index, setIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);

  const isAnimating = useRef(false);

  const animate = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex((prev) =>
          direction === "next"
            ? (prev + 1) % cards.length
            : (prev - 1 + cards.length) % cards.length
        );
        isAnimating.current = false;
      },
    });

    const offset = direction === "next" ? 250 : -250;

    tl.to(centerRef.current, { x: -offset, scale: 0.85, duration: 0.35 }, 0)
      .to(leftRef.current, { x: -offset, duration: 0.35 }, 0)
      .to(rightRef.current, { x: -offset, duration: 0.35 }, 0)
      .set([leftRef.current, centerRef.current, rightRef.current], {
        x: 0,
        scale: 1,
      });
  };

  const nextCard = () => animate("next");
  const prevCard = () => animate("prev");

  // SWIPE HANDLERS
  const onStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const onEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextCard();
    if (diff < -50) prevCard();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">

      {/* Carrusel */}
      <div
        className="relative flex items-center justify-between w-full h-[420px]"
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        {/* Izquierda */}
        <div
          ref={leftRef}
          className="scale-90 opacity-70 cursor-pointer transition"
          onClick={prevCard}
        >
          <div className="bg-white rounded-3xl w-[220px] h-[300px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <img src={cards[(index - 1 + cards.length) % cards.length].img} className="w-20 opacity-60" />
          </div>
        </div>

        {/* Centro */}
        <div
          ref={centerRef}
          className="z-20 cursor-pointer"
          onClick={() => navigate(`/${cards[index].title}`)}
        >
          <div className="relative bg-white w-[280px] h-[380px] rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-between p-6 hover:translate-y-[-5px] transition-transform">

            {/* Título */}
            <div className={`w-full text-white text-center text-2xl font-black py-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`} style={{ backgroundColor: cards[index].color }}>
              {cards[index].title.toUpperCase()}
            </div>

            {/* Logo */}
            <div className="flex-1 flex items-center justify-center">
              <img src={cards[index].img} className="w-32 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]" />
            </div>

            {/* Botón Jugar */}
            <div className="bg-black text-white px-6 py-2 rounded-full font-bold text-lg">
              JUGAR
            </div>

          </div>
        </div>


        {/* Derecha */}
        <div
          ref={rightRef}
          className="scale-90 opacity-70 cursor-pointer transition"
          onClick={nextCard}
        >
          <div className="bg-white rounded-3xl w-[220px] h-[300px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <img src={cards[(index + 1) % cards.length].img} className="w-20 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}