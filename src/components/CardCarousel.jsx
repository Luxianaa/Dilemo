import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { fetchCategories } from "../services/api";

// Importa imágenes por defecto
import pythonLogo from "../assets/python.svg";
import gitLogo from "../assets/git.svg";
import quizLogo from "../assets/quiz.png";
import phpLogo from "../assets/react.svg"; // TEMPORAL: Reemplazar con logo de PHP

export default function CardCarousel() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logos por defecto para las categorías conocidas
  const defaultLogos = {
    python: pythonLogo,
    git: gitLogo,
    logoquiz: quizLogo,
    php: phpLogo
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        const formattedCards = categories.map(cat => ({
          title: cat.code,
          img: defaultLogos[cat.code] || quizLogo, // Usar logo por defecto o genérico
          color: cat.color || "#4D96FF"
        }));
        setCards(formattedCards);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback a categorías hardcodeadas si falla
        setCards([
          { title: "python", img: pythonLogo, color: "#FFD93D" },
          { title: "git", img: gitLogo, color: "#FF6B6B" },
          { title: "logoquiz", img: quizLogo, color: "#4D96FF" },
          { title: "php", img: phpLogo, color: "#777BB4" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

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

    const offset = direction === "next" ? 200 : -200;

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

  if (loading || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[320px]">
        <div className="text-white text-2xl font-black animate-pulse">
          CARGANDO...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">

      {/* Carrusel */}
      <div
        className="relative flex items-center justify-between w-full h-[320px]"
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
          <div className="bg-white rounded-2xl w-[160px] h-[220px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <img src={cards[(index - 1 + cards.length) % cards.length].img} className="w-16 opacity-60" alt="" />
          </div>
        </div>

        {/* Centro */}
        <div
          ref={centerRef}
          className="z-20 cursor-pointer"
          onClick={() => navigate(`/${cards[index].title}`)}
        >
          <div className="relative bg-white w-[200px] h-[280px] rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-between p-4 hover:translate-y-[-4px] transition-transform">

            {/* Título */}
            <div className={`w-full text-white text-center text-lg font-black py-2 border-4 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`} style={{ backgroundColor: cards[index].color }}>
              {cards[index].title.toUpperCase()}
            </div>

            {/* Logo */}
            <div className="flex-1 flex items-center justify-center">
              <img src={cards[index].img} className="w-20 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" alt="" />
            </div>

            {/* Botón Jugar */}
            <div className="bg-black text-white px-8 py-2 rounded-full font-bold text-sm">
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
          <div className="bg-white rounded-2xl w-[160px] h-[220px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <img src={cards[(index + 1) % cards.length].img} className="w-16 opacity-60" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}