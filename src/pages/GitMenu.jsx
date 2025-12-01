import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GitMenu() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("gitLevel");
    if (saved) setLevel(parseInt(saved));
  }, []);

  return (
    <div className="h-screen w-full bg-[#FF6B6B] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Botón regresar */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold z-50"
      >
        VOLVER
      </button>

      {/* Carta de Menú */}
      <div className="bg-white w-full max-w-sm rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative z-10 flex flex-col items-center">

        {/* Icono/Título */}
        <div className="bg-[#FFD93D] w-24 h-24 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <svg className="w-14 h-14 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.62 11.11l-8.97-8.97a1.32 1.32 0 00-1.87 0l-1.86 1.86 2.36 2.36c.4-.14.85-.1 1.22.13.38.24.62.65.62 1.09 0 .39-.18.76-.48 1l2.26 2.26c.89-.31 1.92.07 2.42.91.5.84.3 1.93-.46 2.54-.76.61-1.86.52-2.53-.2-.67-.72-.78-1.83-.25-2.67l-2.1-2.1v5.53c.15.07.29.17.42.29.76.76.76 2 0 2.76-.76.76-2 .76-2.76 0-.76-.76-.76-2 0-2.76.13-.13.27-.23.42-.29v-5.59c-.15-.07-.29-.17-.42-.29-.79-.79-.79-2.04 0-2.76.13-.13.27-.23.42-.29L9.14 5.36 2.38 12.11a1.32 1.32 0 000 1.87l8.97 8.97c.52.52 1.35.52 1.87 0l8.98-8.97c.51-.51.51-1.35 0-1.87z" />
          </svg>
        </div>

        <h1 className="text-4xl font-black text-black mb-2 tracking-tight">GIT</h1>
        <p className="text-gray-600 font-bold mb-8 text-center">Control de versiones</p>

        {/* Info Nivel */}
        <div className="w-full bg-gray-100 rounded-2xl border-4 border-black p-4 mb-8 flex justify-between items-center">
          <span className="font-bold text-xl">NIVEL ACTUAL</span>
          <span className="bg-black text-white px-4 py-1 rounded-lg font-black text-xl">{level}</span>
        </div>

        {/* Botón Jugar */}
        <button
          onClick={() => navigate("/game-git")}
          className="w-full bg-[#6BCB77] text-white py-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-2xl tracking-wider"
        >
          JUGAR AHORA
        </button>
      </div>
    </div>
  );
}
