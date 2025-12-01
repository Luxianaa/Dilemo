import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { logoQuizLevels } from "../data/logoQuizLevels";
import energyFull from "../assets/full-energy.svg";
import energyEmpty from "../assets/energy_empty.svg";
import { useAuth } from "../context/AuthContext";
import { updateUserProgress } from "../services/api";

const TIME_LIMIT = 15; // Segundos por pregunta

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function GameQuiz() {
  const navigate = useNavigate();
  const { user, token, addCoins, updateStreakDaily } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef(null);

  const level = parseInt(localStorage.getItem("logoQuizLevel") || "1");

  // Actualizar racha diaria al entrar al juego
  useEffect(() => {
    if (user && token && updateStreakDaily) {
      updateStreakDaily();
    }
  }, [user, token]);

  useEffect(() => {
    const currentQuestions =
      logoQuizLevels[level] || logoQuizLevels[Object.keys(logoQuizLevels).length];

    setQuestions(shuffleArray(currentQuestions));
    setIsLoading(false);
  }, [level]);

  // Animación de entrada de la carta
  useEffect(() => {
    if (questions.length > 0) {
      gsap.fromTo("#game-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [currentCardIndex, questions]);

  // Timer effect
  useEffect(() => {
    if (questions.length === 0 || showModal) return;

    setTimeLeft(TIME_LIMIT);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentCardIndex, questions, showModal]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setShowModal(true);

    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setTimeout(() => navigate("/logoquiz"), 1000);
      return;
    }

    setTimeout(() => {
      setShowModal(false);
      nextCard("timeout");
    }, 1500);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="h-screen w-full bg-[#4D96FF] flex items-center justify-center border-8 border-black">
        <div className="text-black text-4xl font-black tracking-tighter">CARGANDO...</div>
      </div>
    );
  }

  const totalCards = questions.length;

  const handleAnswer = (userAnswer) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const correct = questions[currentCardIndex].answer === userAnswer;
    setIsCorrect(correct);
    setShowModal(true);

    if (!correct) {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => navigate("/logoquiz"), 1000);
        return;
      }
    }

    setTimeout(() => {
      setShowModal(false);
      nextCard(correct ? "true" : "false");
    }, 1000);
  };

  const nextCard = async (direction) => {
    if (currentCardIndex >= totalCards - 1) {
      const currentLevel = parseInt(localStorage.getItem("logoQuizLevel") || "1");
      const nextLevel = currentLevel + 1;

      localStorage.setItem("logoQuizLevel", nextLevel);

      // Guardar progreso y dar monedas si está autenticado
      if (user && token) {
        try {
          await addCoins(50);
          await updateUserProgress(token, 'logoquiz', {
            current_level: nextLevel,
            lives: lives
          });
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }

      navigate("/logoquiz");
      return;
    }

    // Animación de salida simple y rápida
    gsap.to("#game-card", {
      x: direction === "true" ? 500 : -500,
      rotation: direction === "true" ? 15 : -15,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentCardIndex((prev) => prev + 1);
        gsap.set("#game-card", { x: 0, rotation: 0, opacity: 0 }); // Reset position
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#4D96FF] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Patrón de fondo sutil (opcional, puntos o rayas) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Header del Juego */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 z-10">
        <button
          onClick={() => navigate("/logoquiz")}
          className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
        >
          SALIR
        </button>

        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <img
                key={i}
                src={i < lives ? energyFull : energyEmpty}
                alt={i < lives ? "Vida llena" : "Vida vacía"}
                className="w-10 h-10"
              />
            ))}
          </div>

          <div className={`w-12 h-12 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl ${timeLeft <= 5 ? 'bg-[#FF6B6B] text-white animate-pulse' :
            timeLeft <= 10 ? 'bg-[#FFD93D] text-black' :
              'bg-[#6BCB77] text-white'
            }`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Área de Juego */}
      <div className="w-full max-w-md relative z-10">

        {/* Contador de Nivel */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FFD93D] px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
          <span className="font-black text-xl tracking-tight">NIVEL {level}</span>
        </div>

        {/* Carta Principal */}
        <div id="game-card" className="bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 min-h-[450px] flex flex-col items-center justify-between relative">

          {/* Imagen / Contenido */}
          <div className="w-full flex-1 flex items-center justify-center p-4 border-b-4 border-black border-dashed mb-4">
            <img
              src={questions[currentCardIndex].img}
              className="w-48 h-48 object-contain"
              alt="logo"
            />
          </div>

          {/* Pregunta */}
          <div className="w-full text-center mb-6">
            <p className="text-2xl font-black leading-tight">{questions[currentCardIndex].text}</p>
          </div>

          {/* Feedback Overlay */}
          {showModal && (
            <div className={`absolute inset-0 rounded-2xl flex items-center justify-center z-30 ${isCorrect ? 'bg-[#6BCB77]/90' : 'bg-[#FF6B6B]/90'}`}>
              <span className="text-8xl font-black text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {isCorrect ? 'SI!' : 'NO!'}
              </span>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => handleAnswer(false)}
            disabled={showModal}
            className="flex-1 bg-[#FF6B6B] text-white py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-2xl tracking-wider"
          >
            FALSO
          </button>

          <button
            onClick={() => handleAnswer(true)}
            disabled={showModal}
            className="flex-1 bg-[#6BCB77] text-white py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-2xl tracking-wider"
          >
            CIERTO
          </button>
        </div>

        {/* Progreso */}
        <div className="mt-6 text-center">
          <span className="font-bold text-white text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            PREGUNTA {currentCardIndex + 1} / {questions.length}
          </span>
        </div>

      </div>
    </div>
  );
}
