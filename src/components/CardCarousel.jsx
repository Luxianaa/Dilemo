import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// IMPORTA TUS IMÁGENES
import pythonLogo from "../assets/python.svg";
import jsLogo from "../assets/python.svg";
import gitLogo from "../assets/python.svg";

export default function CardCarousel() {
  const cards = [
    { 
      title: "Nivel I", 
      question: "La comida favorita de Eleven en 'Stranger Things' son los tacos.",
      img: pythonLogo 
    },
    { 
      title: "Nivel II", 
      question: "React fue creado por Google en 2013.",
      img: jsLogo 
    },
    { 
      title: "Nivel III", 
      question: "El café es la bebida más consumida en el mundo.",
      img: gitLogo 
    },
  ];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const cardLeftRef = useRef(null);
  const cardCenterRef = useRef(null);
  const cardRightRef = useRef(null);
  const isAnimating = useRef(false);

  const nextCard = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex((prev) => (prev + 1) % cards.length);
        isAnimating.current = false;
      }
    });

    // Rotar las cartas hacia la izquierda
    tl.to(cardLeftRef.current, { x: 300, scale: 1, duration: 0.4, ease: "power2.inOut" }, 0)
      .to(cardCenterRef.current, { x: -250, scale: 0.85, duration: 0.4, ease: "power2.inOut" }, 0)
      .to(cardRightRef.current, { x: -250, scale: 1, duration: 0.4, ease: "power2.inOut" }, 0)
      .set([cardLeftRef.current, cardCenterRef.current, cardRightRef.current], { x: 0, scale: 1 });
  };

  const prevCard = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex((prev) => (prev - 1 + cards.length) % cards.length);
        isAnimating.current = false;
      }
    });

    // Rotar las cartas hacia la derecha
    tl.to(cardRightRef.current, { x: -300, scale: 1, duration: 0.4, ease: "power2.inOut" }, 0)
      .to(cardCenterRef.current, { x: 250, scale: 0.85, duration: 0.4, ease: "power2.inOut" }, 0)
      .to(cardLeftRef.current, { x: 250, scale: 1, duration: 0.4, ease: "power2.inOut" }, 0)
      .set([cardLeftRef.current, cardCenterRef.current, cardRightRef.current], { x: 0, scale: 1 });
  };

  // Funciones para swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // mínimo deslizamiento

    if (diff > threshold) {
      nextCard(); // swipe izquierda -> siguiente
    } else if (diff < -threshold) {
      prevCard(); // swipe derecha -> anterior
    }
  };

  // Helper para obtener el índice de la carta
  const getCardIndex = (offset) => {
    return (index + offset + cards.length) % cards.length;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto">

      {/* Carrusel de 3 cartas */}
      <div 
        className="relative flex items-center justify-between w-full h-[420px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Carta Izquierda - Solo diseño decorativo */}
        <div 
          ref={cardLeftRef}
          onClick={prevCard}
          className="cursor-pointer transform scale-[0.85] hover:scale-90 
                     transition-all duration-200 z-10"
        >
          <div className="bg-gradient-to-br from-[#e8d7f1] to-[#d4c5e3] rounded-2xl p-6 w-[240px] h-[320px] shadow-xl 
                          flex flex-col items-center justify-center gap-4 relative border-4 border-[#9b7eb5]">
            {/* Patrón de rombos decorativos */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-30">
              {[...Array(3)].map((_, i) => (
                <div key={`left-${i}`} className="flex gap-8">
                  {[...Array(2)].map((_, j) => (
                    <div key={`left-${i}-${j}`} className="w-8 h-8 bg-white transform rotate-45"></div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Esquinas decorativas */}
            <div className="absolute top-2 left-2 w-7 h-7 border-l-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute top-2 right-2 w-7 h-7 border-r-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-2 left-2 w-7 h-7 border-l-2 border-b-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-2 right-2 w-7 h-7 border-r-2 border-b-2 border-[#8b6ba8]"></div>
          </div>
        </div>

        {/* Carta Central (GRANDE) */}
        <div ref={cardCenterRef} className="z-20">
          <div className="bg-white rounded-2xl p-7 w-[280px] h-[380px] shadow-2xl 
                          flex flex-col items-center justify-start gap-6 relative border-4 border-[#d4c5e3]">
            {/* Esquinas decorativas */}
            <div className="absolute top-3 left-3 w-9 h-9 border-l-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute top-3 right-3 w-9 h-9 border-r-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-3 left-3 w-9 h-9 border-l-2 border-b-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-3 right-3 w-9 h-9 border-r-2 border-b-2 border-[#8b6ba8]"></div>
            
            {/* Íconos en las esquinas */}
            <div className="absolute top-5 left-5">
              <img src={cards[index].img} className="w-7 h-7 opacity-60" alt="icon" />
            </div>
            <div className="absolute top-5 right-5">
              <img src={cards[index].img} className="w-7 h-7 opacity-60" alt="icon" />
            </div>
            <div className="absolute bottom-5 left-5">
              <img src={cards[index].img} className="w-7 h-7 opacity-60" alt="icon" />
            </div>
            <div className="absolute bottom-5 right-5">
              <img src={cards[index].img} className="w-7 h-7 opacity-60" alt="icon" />
            </div>

            <h1 className="text-2xl font-bold text-[#ff8c94] mt-9">
              {cards[index].title}
            </h1>
            <p className="text-lg text-center text-black px-4 leading-relaxed font-semibold">
              {cards[index].question}
            </p>
          </div>
        </div>

        {/* Carta Derecha - Solo diseño decorativo */}
        <div 
          ref={cardRightRef}
          onClick={nextCard}
          className="cursor-pointer transform scale-[0.85] hover:scale-90 
                     transition-all duration-200 z-10"
        >
          <div className="bg-gradient-to-br from-[#e8d7f1] to-[#d4c5e3] rounded-2xl p-6 w-[240px] h-[320px] shadow-xl 
                          flex flex-col items-center justify-center gap-4 relative border-4 border-[#9b7eb5]">
            {/* Patrón de rombos decorativos */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-30">
              {[...Array(3)].map((_, i) => (
                <div key={`right-${i}`} className="flex gap-8">
                  {[...Array(2)].map((_, j) => (
                    <div key={`right-${i}-${j}`} className="w-8 h-8 bg-white transform rotate-45"></div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Esquinas decorativas */}
            <div className="absolute top-2 left-2 w-7 h-7 border-l-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute top-2 right-2 w-7 h-7 border-r-2 border-t-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-2 left-2 w-7 h-7 border-l-2 border-b-2 border-[#8b6ba8]"></div>
            <div className="absolute bottom-2 right-2 w-7 h-7 border-r-2 border-b-2 border-[#8b6ba8]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
