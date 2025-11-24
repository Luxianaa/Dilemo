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
    { title: "python", img: pythonLogo },
    { title: "git", img: gitLogo },
    { title: "logoquiz", img: quizLogo },
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
          <div className="bg-[#f1e6ff] rounded-2xl w-[220px] h-[300px] shadow-xl flex items-center justify-center">
            <img src={cards[(index - 1 + cards.length) % cards.length].img} className="w-20 opacity-60" />
          </div>
        </div>

        {/* Centro */}
        {/* Centro */}
<div
  ref={centerRef}
  className="z-20 cursor-pointer"
  onClick={() => navigate(`/${cards[index].title}`)}
>
  <div className="relative bg-white w-[260px] h-[350px] rounded-3xl border-[4px] border-black shadow-[0_8px_0_#000] flex flex-col items-center justify-start">

    {/* Esquinas decorativas */}
    <div className="absolute top-3 left-3 w-6 h-6 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
    <div className="absolute top-3 right-3 w-6 h-6 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-4 border-b-4 border-black rounded-br-lg"></div>

    {/* Barra azul del título */}
    <div className="w-full bg-[#39d3f7] text-white text-center text-xl font-extrabold py-3 border-b-4 border-black rounded-t-2xl">
      {cards[index].title.toUpperCase()}
    </div>

    {/* Logo */}
    <img src={cards[index].img} className="w-28 mt-8" />

  </div>
</div>


        {/* Derecha */}
        <div
          ref={rightRef}
          className="scale-90 opacity-70 cursor-pointer transition"
          onClick={nextCard}
        >
          <div className="bg-[#f1e6ff] rounded-2xl w-[220px] h-[300px] shadow-xl flex items-center justify-center">
            <img src={cards[(index + 1) % cards.length].img} className="w-20 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
                                       