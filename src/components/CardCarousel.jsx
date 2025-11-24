import { useState, useRef } from "react";

// IMPORTA TUS IMÁGENES
import pythonLogo from "../assets/python.svg";
import jsLogo from "../assets/python.svg";
import gitLogo from "../assets/python.svg";

export default function CardCarousel() {
  const cards = [
    { title: "Python", img: pythonLogo },
    { title: "JavaScript", img: jsLogo },
    { title: "Git", img: gitLogo },
  ];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
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
    <div className="flex flex-col items-center gap-6 w-full">

      {/* Carrusel de 3 cartas */}
      <div 
        className="relative flex items-center justify-center w-full h-[320px] px-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Carta Izquierda */}
        <div 
          onClick={prevCard}
          className="absolute left-2 sm:left-8 top-10 cursor-pointer transform scale-[0.65] opacity-60 
                     hover:scale-[0.7] hover:opacity-80 transition-all duration-300 z-10"
        >
          <div className="bg-[#fff2e3] rounded-xl p-4 w-[180px] h-[230px] shadow-lg 
                          flex flex-col items-center justify-center gap-2">
            <h1 className="text-lg font-bold text-[#ff6d29]">
              {cards[getCardIndex(-1)].title}
            </h1>
            <img src={cards[getCardIndex(-1)].img} className="w-[60px]" alt={cards[getCardIndex(-1)].title} />
          </div>
        </div>

        {/* Carta Central (GRANDE) */}
        <div className="z-20">
          <div className="bg-[#fff2e3] rounded-xl p-6 w-[200px] sm:w-[240px] h-[280px] shadow-2xl 
                          flex flex-col items-center justify-center gap-4 
                          transition-all duration-500">
            <h1 className="text-2xl font-bold text-[#ff6d29]">
              {cards[index].title}
            </h1>
            <img src={cards[index].img} className="w-[90px]" alt={cards[index].title} />
          </div>
        </div>

        {/* Carta Derecha */}
        <div 
          onClick={nextCard}
          className="absolute right-2 sm:right-8 top-10 cursor-pointer transform scale-[0.65] opacity-60 
                     hover:scale-[0.7] hover:opacity-80 transition-all duration-300 z-10"
        >
          <div className="bg-[#fff2e3] rounded-xl p-4 w-[180px] h-[230px] shadow-lg 
                          flex flex-col items-center justify-center gap-2">
            <h1 className="text-lg font-bold text-[#ff6d29]">
              {cards[getCardIndex(1)].title}
            </h1>
            <img src={cards[getCardIndex(1)].img} className="w-[60px]" alt={cards[getCardIndex(1)].title} />
          </div>
        </div>

      </div>

      {/* Indicadores (puntos) */}
      <div className="flex gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-[#ff6d29] w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Controles (opcional para desktop) */}
      <div className="hidden md:flex gap-6">
        <button
          onClick={prevCard}
          className="bg-white shadow px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ⬅️
        </button>

        <button
          onClick={nextCard}
          className="bg-white shadow px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
