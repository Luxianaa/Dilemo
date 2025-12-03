import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import phpLogo from "../assets/react.svg"; // TEMPORAL: Reemplazar con logo de PHP
import { useAuth } from "../context/AuthContext";
import { updateUserProgress, fetchQuestions } from "../services/api";
import energyFull from "../assets/full-energy.svg";
import energyEmpty from "../assets/energy_empty.svg";

const TIME_LIMIT = 15; // Segundos por pregunta

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function GamePhp() {
  const navigate = useNavigate();
  const { user, token, addCoins, updateStreakDaily, refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef(null);

  const level = parseInt(localStorage.getItem("phpLevel") || "1");

  // Actualizar racha diaria al entrar al juego
  useEffect(() => {
    if (user && token && updateStreakDaily) {
      updateStreakDaily();
    }
  }, [user, token]);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuestions('php', level);
        setQuestions(data);
      } catch (error) {
        console.error('Error loading questions from DB:', error);
        setQuestions([]);
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [level]);

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
      setTimeout(() => navigate("/php"), 1000);
    }
  };

  const handleAnswer = (userAnswer) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const isAnswerCorrect = userAnswer === questions[currentCardIndex].answer;
    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect) {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => navigate("/php"), 1000);
        return;
      }
    }

    // Animación de swipe
    handleNextCard(isAnswerCorrect ? "true" : "false");
  };

  const handleNextCard = async (direction) => {
    if (currentCardIndex < questions.length - 1) {
      // Animación de swipe
      gsap.to("#game-card", {
        x: direction === "false" ? -500 : 500,
        rotation: direction === "false" ? -15 : 15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setCurrentCardIndex(currentCardIndex + 1);
          gsap.set("#game-card", { x: 0, rotation: 0, opacity: 1 });
        },
      });
    } else {
      // Nivel completado
      const currentLevel = level;
      const nextLevel = level + 1;
      
      localStorage.setItem("phpLevel", nextLevel);

      // Guardar progreso en BD si está autenticado
      if (user && token) {
        try {
          const basePoints = lives * 50;
          const levelBonus = currentLevel * 20;
          const scoreToAdd = basePoints + levelBonus;

          await addCoins(50);

          await updateUserProgress(token, 'php', {
            current_level: nextLevel,
            lives: lives,
            score_to_add: scoreToAdd
          });

          await refreshUser();
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }

      navigate("/php");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#777BB4]">
        <div className="text-white text-4xl font-black animate-pulse">
          CARGANDO...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#777BB4] p-4">
        <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h2 className="text-3xl font-black mb-4">NO HAY PREGUNTAS</h2>
          <p className="text-gray-600 mb-6">No se encontraron preguntas para este nivel.</p>
          <button
            onClick={() => navigate("/php")}
            className="bg-[#777BB4] text-white px-8 py-3 rounded-xl border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all"
          >
            VOLVER
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentCardIndex];
  const progress = ((currentCardIndex + 1) / questions.length) * 100;

  return (
    <div className="h-screen w-full bg-[#777BB4] flex flex-col items-center justify-between px-4 py-6 font-sans relative overflow-hidden">

      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/php")}
            className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
          >
            SALIR
          </button>

          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <img
                key={i}
                src={i < lives ? energyFull : energyEmpty}
                alt="energy"
                className="w-10 h-10"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-4 border-black p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black text-sm">NIVEL {level}</span>
            <span className="font-black text-sm">{currentCardIndex + 1}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black overflow-hidden">
            <div
              className="bg-[#6BCB77] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-4 border-black p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <span className="font-black">TIEMPO:</span>
          <div className={`text-2xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-black'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      <div
        id="game-card"
        className="bg-white w-full max-w-md rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative z-10 flex flex-col items-center"
      >
        <div className="bg-[#777BB4] w-20 h-20 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <img src={phpLogo} alt="PHP" className="w-12 h-12" />
        </div>

        <p className="text-black text-2xl font-black text-center mb-8 leading-tight">
          {currentQuestion.text}
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-[#6BCB77] text-white py-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-xl"
          >
            VERDADERO
          </button>

          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 bg-[#FF6B6B] text-white py-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-xl"
          >
            FALSO
          </button>
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
}
