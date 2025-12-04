import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { updateUserProgress, fetchQuestions, fetchCategoryByCode } from "../services/api";
import energyFull from "../assets/full-energy.svg";
import energyEmpty from "../assets/energy_empty.svg";

const TIME_LIMIT = 15; // Segundos por pregunta

export default function CategoryGame() {
    const navigate = useNavigate();
    const { category } = useParams();
    const { user, token, addCoins, updateStreakDaily, refreshUser } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [categoryData, setCategoryData] = useState(null);

    const timerRef = useRef(null);

    const level = parseInt(localStorage.getItem(`${category}Level`) || "1");

    // Cargar datos de la categoría (para el logo, etc.)
    useEffect(() => {
        const loadCategoryData = async () => {
            try {
                const data = await fetchCategoryByCode(category);
                setCategoryData(data);
            } catch (error) {
                console.error("Error loading category data:", error);
            }
        };
        if (category) loadCategoryData();
    }, [category]);

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
                const data = await fetchQuestions(category, level);
                setQuestions(data);
            } catch (error) {
                console.error('Error loading questions from DB:', error);
                setQuestions([]);
            }
            setIsLoading(false);
        };

        if (category) {
            loadQuestions();
        }
    }, [category, level]);

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

        // Reset timer al cambiar de pregunta
        setTimeLeft(TIME_LIMIT);

        // Iniciar countdown
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

        // Limpiar interval al desmontar o cambiar pregunta
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
            setTimeout(() => navigate(`/${category}`), 1000);
            return;
        }

        setTimeout(() => {
            setShowModal(false);
            nextCard("timeout");
        }, 1500);
    };

    if (isLoading || questions.length === 0 || !questions[currentCardIndex]) {
        return (
            <div className="h-screen w-full bg-[#F0B331] flex items-center justify-center border-8 border-black">
                <div className="text-black text-4xl font-black tracking-tighter">
                    {isLoading ? "CARGANDO..." : "NO HAY PREGUNTAS"}
                </div>
                {!isLoading && questions.length === 0 && (
                    <button
                        onClick={() => navigate(`/${category}`)}
                        className="absolute bottom-20 bg-white text-black px-6 py-3 rounded-xl border-4 border-black font-bold"
                    >
                        VOLVER
                    </button>
                )}
            </div>
        );
    }

    const handleAnswer = (userAnswer) => {
        // Detener el timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Convertir respuesta de string a boolean si es necesario, o comparar directamente
        // Asumimos que userAnswer es boolean (true/false) y questions[].answer también o es string "true"/"false"
        // En GamePlay original: const correct = questions[currentCardIndex].answer === userAnswer;
        // Asegurémonos de comparar correctamente.
        // Si la API devuelve "true" (string), y userAnswer es true (boolean).

        const correctAnswer = questions[currentCardIndex].answer;
        // Normalizar comparación
        const isAnswerCorrect = String(correctAnswer).toLowerCase() === String(userAnswer).toLowerCase();

        setIsCorrect(isAnswerCorrect);
        setShowModal(true);

        if (!isAnswerCorrect) {
            const newLives = lives - 1;
            setLives(newLives);

            if (newLives <= 0) {
                setTimeout(() => navigate(`/${category}`), 1000);
                return;
            }
        }

        setTimeout(() => {
            setShowModal(false);
            nextCard(isAnswerCorrect ? "true" : "false");
        }, 1000);
    };

    const nextCard = async (direction) => {
        if (currentCardIndex >= questions.length - 1) {
            const currentLevel = parseInt(localStorage.getItem(`${category}Level`) || "1");
            const nextLevel = currentLevel + 1;

            localStorage.setItem(`${category}Level`, nextLevel);

            // Guardar progreso y dar monedas si está autenticado
            if (user && token) {
                try {
                    // Calcular puntos basados en el desempeño
                    // Fórmula: 50 puntos por cada vida restante + 20 por nivel
                    const basePoints = lives * 50;
                    const levelBonus = currentLevel * 20;
                    const scoreToAdd = basePoints + levelBonus;

                    await addCoins(50);

                    await updateUserProgress(token, category, {
                        current_level: nextLevel,
                        lives: lives,
                        score_to_add: scoreToAdd // Agregar puntos incrementales
                    });

                    await refreshUser();
                } catch (error) {
                    console.error("Error saving progress:", error);
                }
            }

            navigate(`/${category}`);
            return;
        }

        gsap.to("#game-card", {
            x: direction === "true" ? 500 : -500,
            rotation: direction === "true" ? 15 : -15,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                setCurrentCardIndex((prev) => prev + 1);
                gsap.set("#game-card", { x: 0, rotation: 0, opacity: 0 });
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FFD93D] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-8 z-10">
                <button
                    onClick={() => navigate(`/${category}`)}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    SALIR
                </button>

                <div className="flex gap-3 items-center">
                    {/* Vidas */}
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

                    {/* Timer */}
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

                {/* Nivel */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#4D96FF] px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
                    <span className="font-black text-xl tracking-tight text-white">NIVEL {level}</span>
                </div>

                {/* Carta */}
                <div id="game-card" className="bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 min-h-[450px] flex flex-col items-center justify-between relative">

                    {/* Icono Categoria */}
                    <div className="w-full flex-1 flex items-center justify-center p-4 border-b-4 border-black border-dashed mb-4">
                        {categoryData && categoryData.img ? (
                            <img src={categoryData.img} alt={categoryData.name} className="w-32 h-32 object-contain" />
                        ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-black">
                                <span className="text-4xl font-black">{categoryData?.name?.substring(0, 2).toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    {/* Pregunta */}
                    <div className="w-full text-center mb-6">
                        <p className="text-2xl font-black leading-tight">{questions[currentCardIndex]?.text}</p>
                    </div>

                    {/* Feedback */}
                    {showModal && (
                        <div className={`absolute inset-0 rounded-2xl flex items-center justify-center z-30 ${isCorrect ? 'bg-[#6BCB77]/90' : 'bg-[#FF6B6B]/90'}`}>
                            <span className="text-8xl font-black text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                {isCorrect ? 'SI!' : 'NO!'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Botones */}
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
                    <span className="font-bold text-black text-lg drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
                        PREGUNTA {currentCardIndex + 1} / {questions.length}
                    </span>
                </div>

            </div>
        </div>
    );
}
