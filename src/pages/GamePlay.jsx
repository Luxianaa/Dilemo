import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function GamePlay() {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const modalRef = useRef(null);
  const totalCards = 10;

  // Array de preguntas con sus respuestas correctas
  const questions = [
    { text: "Python fue creado por Guido van Rossum en 1991.", answer: true },
    { text: "En Python, las listas se definen con llaves {}.", answer: false },
    { text: "Python es un lenguaje de tipado dinámico.", answer: true },
    { text: "La función print() en Python requiere paréntesis en Python 3.", answer: true },
    { text: "Python soporta programación orientada a objetos.", answer: true },
    { text: "Los comentarios en Python se escriben con //.", answer: false },
    { text: "Python usa indentación para definir bloques de código.", answer: true },
    { text: "El operador == compara valores y el operador 'is' compara identidad.", answer: true },
    { text: "En Python, las cadenas son mutables.", answer: false },
    { text: "Python permite herencia múltiple en clases.", answer: true }
  ];

  useEffect(() => {
    // Animación de flotación suave
    gsap.to('#game-card', {
      y: -8,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });
  }, []);

  useEffect(() => {
    // Animación del modal cuando aparece
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [showModal]);

  const handleAnswer = (userAnswer) => {
    const correct = questions[currentCardIndex].answer === userAnswer;
    setIsCorrect(correct);
    setShowModal(true);

    if (!correct) {
      setLives(prev => prev - 1);
    }

    // Ocultar modal después de 1.5 segundos y avanzar
    setTimeout(() => {
      setShowModal(false);
      nextCard(userAnswer ? 'true' : 'false');
    }, 1500);
  };

  const nextCard = (direction) => {
    if (currentCardIndex >= totalCards - 1 || lives <= 0) {
      // No hay más cartas o se acabaron las vidas - regresar al inicio
      gsap.to('#game-card', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)",
        onComplete: () => {
          navigate('/python');
        }
      });
      return;
    }

    // Animación de salida
    gsap.to('#game-card', {
      x: direction === 'true' ? 600 : -600,
      rotation: direction === 'true' ? 20 : -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        // Cambiar a la siguiente carta
        setCurrentCardIndex(prev => prev + 1);
        
        // Resetear posición
        gsap.set('#game-card', {
          x: 0,
          rotation: 0,
          opacity: 0,
          scale: 0.8
        });
        
        // Animación de entrada
        gsap.to('#game-card', {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6d2aff] via-[#8d4fff] to-[#ff7bca] flex justify-center items-center overflow-hidden relative px-4">
      
      {/* Botón regresar */}
      <button
        onClick={() => navigate("/python")}
        className="absolute top-5 left-5 bg-white hover:bg-gray-100 text-black p-3 rounded-xl shadow-lg border-2 border-black z-50 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Vidas (rayitos) */}
      <div className="absolute top-5 right-5 flex gap-2 z-50">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`transition-all duration-300 ${i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill={i < lives ? "#FFD700" : "#666"} stroke="#000" strokeWidth="1">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
            </svg>
          </div>
        ))}
      </div>
      
      {/* Contador de cartas */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold bg-black/40 px-6 py-3 rounded-full backdrop-blur-md z-50 border-2 border-white/30">
        Pregunta: <span className="text-2xl">{currentCardIndex + 1}/{totalCards}</span>
      </div>

      {/* Modal de respuesta */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm">
          <div ref={modalRef} className={`${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white px-12 py-8 rounded-3xl border-4 border-white shadow-2xl`}>
            <div className="text-center">
              <div className="text-6xl mb-4">
                {isCorrect ? '✓' : '✗'}
              </div>
              <div className="text-3xl font-bold">
                {isCorrect ? '¡CORRECTO!' : '¡INCORRECTO!'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-10 relative">
        
        {/* Carta con estilo consistente */}
        <div id="game-card" className="w-full max-w-[350px]">
          <div className="relative bg-white rounded-3xl border-[4px] border-black shadow-[0_8px_0_#000] p-8 min-h-[400px] flex flex-col items-center justify-center">
            
            {/* Esquinas decorativas */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-4 border-b-4 border-black rounded-br-lg"></div>

            {/* Barra del título */}
            <div className="w-full bg-[#39d3f7] text-white text-center text-xl font-extrabold py-3 border-b-4 border-black rounded-t-2xl absolute top-0 left-0 right-0">
              Nivel {currentCardIndex + 1}
            </div>

            {/* Pregunta */}
            <p className="text-black text-lg font-semibold text-center px-4 mt-12">
              {questions[currentCardIndex].text}
            </p>
          </div>
        </div>

        {/* Botones Falso / Cierto con mismo estilo */}
        <div className="flex gap-4 w-full max-w-[500px]">
          {/* Botón FALSO */}
          <button 
            onClick={() => handleAnswer(false)}
            disabled={showModal}
            className="flex-1 bg-[#ff4d6d] hover:bg-[#e63956] active:bg-[#cc2542] disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 rounded-2xl border-4 border-black font-bold text-2xl shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] active:shadow-[0_2px_0_#000] active:translate-y-[4px] transition-all"
          >
            FALSO
          </button>
          
          {/* Botón CIERTO */}
          <button 
            onClick={() => handleAnswer(true)}
            disabled={showModal}
            className="flex-1 bg-[#4ecdc4] hover:bg-[#3db9b0] active:bg-[#2ca59c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 rounded-2xl border-4 border-black font-bold text-2xl shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] active:shadow-[0_2px_0_#000] active:translate-y-[4px] transition-all"
          >
            CIERTO
          </button>
        </div>
      </div>
    </div>
  );
}
