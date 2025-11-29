import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserProgress } from "../services/api";

export default function GitMenu() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLevel = async () => {
      if (isAuthenticated && token) {
        try {
          const progress = await fetchUserProgress(token);
          setLevel(progress.git?.level || 1);
        } catch (error) {
          console.error('Error loading progress:', error);
          setLevel(1);
        }
      } else {
        const saved = localStorage.getItem("gitLevel");
        setLevel(saved ? parseInt(saved) : 1);
      }
      setLoading(false);
    };
    loadLevel();
  }, [isAuthenticated, token]);
  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] flex flex-col items-center justify-center px-4 relative overflow-hidden cursor-sparkle">

      {/* Botón regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 bg-white hover:bg-gray-100 text-black p-3 rounded-xl shadow-lg border-2 border-black z-50 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Carta */}
      <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-[0_10px_0_#000] p-10 relative border-[4px] border-black z-10">
        {/* Esquinas decorativas */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-4 border-b-4 border-black rounded-br-lg"></div>

        {/* Título */}
        <div className="bg-[#39d3f7] text-white text-center text-xl font-extrabold py-3 rounded-lg border-4 border-black shadow-md">
          GIT
        </div>

        {/* Selector de niveles */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <h1 className="text-lg font-semibold mb-3">Level:</h1>

          <div className="flex flex-col gap-3 text-black items-center">
            <h1 className="font-bold text-3xl">{level}</h1>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => navigate("/game-git")}
            className="w-full max-w-xs bg-[#4b5bfe] hover:bg-[#3c49d0] text-white py-3 rounded-xl border-4 border-black font-semibold text-lg shadow-lg transition"
          >
            Nuevo Juego
          </button>
        </div>
      </div>
    </div>
  );
}
