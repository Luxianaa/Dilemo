import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { fetchQuestions, fetchUserProgress, updateUserProgress } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Mezclar preguntas aleatoriamente
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function GameQuiz() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);

  // Estados para el drag
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  // Cargar progreso del usuario (BD o localStorage)
  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (isAuthenticated && token) {
          // Usuario autenticado: cargar desde BD
          const progress = await fetchUserProgress(token);
          const userLevel = progress.logoquiz?.level || 1;
          setLevel(userLevel);
        } else {
          // Modo invitado: usar localStorage
          const localLevel = parseInt(localStorage.getItem("logoQuizLevel") || "1");
          setLevel(localLevel);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        setLevel(1);
      }
    };

    loadProgress();
  }, [isAuthenticated, token]);

  // Cargar preguntas del nivel desde la API
  useEffect(() => {
    if (level) {
      const loadQuestions = async () => {
        try {
          setLoading(true);
          const data = await fetchQuestions('logoquiz', level);
          setQuestions(shuffleArray(data));
        } catch (error) {
          console.error('Error loading questions:', error);
          navigate('/logoquiz');
        } finally {
          setLoading(false);
        }
      };
      loadQuestions();
    }
  }, [level, navigate]);

  // Animación flotante
  useEffect(() => {
    if (!loading) {
      gsap.to("#game-card", {
        y: -8,
        duration: 2.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] flex justify-center items-center">
        <div className="text-white text-2xl">Cargando preguntas...</div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const totalCards = questions.length;

  // === DRAG HANDLERS ===
  const startDrag = (e) => {
    if (isDragging || showModal) return;

    setIsDragging(true);
    const startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;

    // Pausar animación flotante de GSAP durante el drag
    gsap.killTweensOf("#game-card");

    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }

    const onDrag = (moveEvent) => {
      if (!cardRef.current) return;

      const currentX = moveEvent.type === 'mousemove' ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const diffX = currentX - startX;
      const rotation = diffX * 0.1;

      // Aplicar transformación en tiempo real
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;

      // Feedback visual en el contenedor
      if (containerRef.current) {
        if (diffX > 50) {
          containerRef.current.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
        } else if (diffX < -50) {
          containerRef.current.style.backgroundColor = 'rgba(255, 77, 109, 0.1)';
        } else {
          containerRef.current.style.backgroundColor = 'transparent';
        }
      }
    };

    const endDrag = (endEvent) => {
      setIsDragging(false);

      const currentX = endEvent.type === 'mouseup' ? endEvent.clientX : endEvent.changedTouches[0].clientX;
      const diffX = currentX - startX;

      // Limpiar feedback visual
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = 'transparent';
      }

      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      }

      // Verificar si supera el umbral de swipe
      if (diffX > 100) {
        // Swipe derecha (True) - deslizar fuera
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(150%) rotate(20deg)';
          cardRef.current.style.opacity = '0';
        }
        setTimeout(() => handleAnswer(true), 300);
      } else if (diffX < -100) {
        // Swipe izquierda (False) - deslizar fuera
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(-150%) rotate(-20deg)';
          cardRef.current.style.opacity = '0';
        }
        setTimeout(() => handleAnswer(false), 300);
      } else {
        // Regresar al centro
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(0) rotate(0)';
        }

        // Reactivar animación flotante
        gsap.to("#game-card", {
          y: -8,
          duration: 2.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Remover event listeners
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
    };

    // Agregar event listeners
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  };

  const handleAnswer = (userAnswer) => {
    const correct = questions[currentCardIndex].answer === userAnswer;
    setIsCorrect(correct);
    setShowModal(true);

    if (!correct) {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => navigate("/logoquiz"), 1500);
        return;
      }
    }

    setTimeout(() => {
      setShowModal(false);
      nextCard(userAnswer ? "true" : "false");
    }, 1000);
  };

  const nextCard = async (direction) => {
    if (currentCardIndex >= totalCards - 1) {
      // Subir nivel
      const newLevel = level + 1;

      // Guardar en BD si está autenticado, sino en localStorage
      if (isAuthenticated && token) {
        try {
          await updateUserProgress(token, 'logoquiz', { current_level: newLevel });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      } else {
        localStorage.setItem("logoQuizLevel", newLevel);
      }

      gsap.to("#game-card", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)",
        onComplete: () => navigate("/logoquiz"),
      });

      return;
    }

    // Resetear la carta y pasar a la siguiente
    setCurrentCardIndex((prev) => prev + 1);

    if (cardRef.current) {
      // Resetear estilos
      cardRef.current.style.transition = 'none';
      cardRef.current.style.transform = 'translateX(0) rotate(0) scale(0.8)';
      cardRef.current.style.opacity = '0';

      // Animar entrada de nueva carta
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          cardRef.current.style.transform = 'translateX(0) rotate(0) scale(1)';
          cardRef.current.style.opacity = '1';
        }

        // Reactivar animación flotante
        setTimeout(() => {
          gsap.to("#game-card", {
            y: -8,
            duration: 2.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          });
        }, 400);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] flex justify-center items-center overflow-hidden relative px-4 cursor-sparkle">

      {/* Volver */}
      <button
        onClick={() => navigate("/logoquiz")}
        className="absolute top-5 left-5 bg-white hover:bg-gray-100 text-black p-3 rounded-xl shadow-lg border-2 border-black z-50 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Vidas */}
      <div className="absolute top-5 right-5 flex gap-2 z-50">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`transition-all duration-300 ${i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill={i < lives ? "#FFD700" : "#666"} stroke="#000" strokeWidth="1">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Contador */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 text-black px-5 py-2 rounded-md font-bold text-xl border-2 border-black">
          {currentCardIndex + 1}/{questions.length}
        </div>
      </div>

      <div className="flex flex-col items-center gap-10 relative" ref={containerRef}>

        <div
          id="game-card"
          ref={cardRef}
          className="w-[350px] h-[420px] cursor-grab active:cursor-grabbing"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className={`relative bg-white rounded-3xl border-[4px] ${showModal ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-black'} shadow-[0_8px_0_#000] p-8 min-h-[420px] flex flex-col items-center justify-center transition-all duration-300 select-none`}>

            {/* Esquinas */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-4 border-b-4 border-black rounded-br-lg"></div>

            {/* Título */}
            <div className="w-full bg-[#39d3f7] text-white text-center text-xl font-extrabold py-3 border-b-4 border-black rounded-t-2xl absolute top-0 left-0 right-0">
              Level {level}
            </div>


            <img
              src={questions[currentCardIndex].img}
              className="w-28 h-28 mt-10 mb-6 select-none"
              alt="logo"
            />

            {/* Pregunta */}
            <p className="text-black text-lg font-semibold text-center px-4">
              {questions[currentCardIndex].text}
            </p>

          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 w-full max-w-[500px]">
          <button
            onClick={() => handleAnswer(false)}
            disabled={showModal}
            className="flex-1 bg-[#ff4d6d] text-white py-6 rounded-2xl border-4 border-black font-bold text-2xl shadow-[0_6px_0_#000] hover:translate-y-[2px] transition"
          >
            FALSO
          </button>

          <button
            onClick={() => handleAnswer(true)}
            disabled={showModal}
            className="flex-1 bg-[#4ecdc4] text-white py-6 rounded-2xl border-4 border-black font-bold text-2xl shadow-[0_6px_0_#000] hover:translate-y-[2px] transition"
          >
            CIERTO
          </button>
        </div>
      </div>
    </div>
  );
}
