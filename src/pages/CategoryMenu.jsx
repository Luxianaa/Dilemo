import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import quizLogo from "../assets/quiz.png";
import pythonLogo from "../assets/python.svg";
import gitLogo from "../assets/git.svg";
import phpLogo from "../assets/react.svg";
import { fetchCategoryByCode, fetchUserProgress, fetchLevels } from "../services/api";
import { getUploadUrl } from "../services/urlHelper";
import { useAuth } from "../context/AuthContext";

export default function CategoryMenu() {
    const navigate = useNavigate();
    const { categoryCode } = useParams();
    const { user, token } = useAuth();
    const [level, setLevel] = useState(1);
    const [totalLevels, setTotalLevels] = useState(0);
    const [categoryData, setCategoryData] = useState(null);

    // Logos por defecto
    const categoryLogos = {
        python: pythonLogo,
        git: gitLogo,
        logoquiz: quizLogo,
        php: phpLogo
    };

    // Colores por categoría
    const categoryColors = {
        python: "#FFD93D",
        git: "#FF6B6B",
        logoquiz: "#4D96FF",
        php: "#777BB4"
    };

    useEffect(() => {
        const loadData = async () => {
            // Cargar datos de la categoría desde la BD
            try {
                const data = await fetchCategoryByCode(categoryCode);
                setCategoryData(data);
            } catch (error) {
                console.error('Error loading category:', error);
            }

            // Cargar total de niveles disponibles
            try {
                const levelsData = await fetchLevels(categoryCode);
                setTotalLevels(levelsData.length);
            } catch (error) {
                console.error('Error loading levels:', error);
            }

            // Obtener el nivel actual del usuario
            if (user && token) {
                // Usuario autenticado: obtener nivel desde la API
                try {
                    const progressData = await fetchUserProgress(token);
                    const categoryProgress = progressData[categoryCode];
                    let userLevel = categoryProgress?.level || 1;

                    // Limitar el nivel al máximo disponible
                    const levelsData = await fetchLevels(categoryCode);
                    const maxLevel = levelsData.length;
                    if (userLevel > maxLevel) {
                        userLevel = maxLevel; // No mostrar niveles que no existen
                        console.log(`⚠️ Nivel ajustado de ${categoryProgress?.level} a ${maxLevel} (máximo disponible)`);
                    }

                    setLevel(userLevel);
                    console.log(`✅ Nivel cargado desde API para ${categoryCode}:`, userLevel);
                } catch (error) {
                    console.error('Error loading progress:', error);
                    setLevel(1); // Default nivel 1 si hay error
                }
            } else {
                // Usuario invitado: usar localStorage temporal (con prefijo guest_)
                const saved = localStorage.getItem(`guest_${categoryCode}Level`);
                if (saved) {
                    setLevel(parseInt(saved));
                    console.log(`✅ Nivel cargado desde localStorage (invitado) para ${categoryCode}:`, saved);
                } else {
                    setLevel(1);
                }
            }
        };

        loadData();
    }, [categoryCode, user, token]);

    // Usar logo_url de BD si existe, sino usar logo por defecto
    const logo = categoryData?.logo_url
        ? getUploadUrl(categoryData.logo_url)
        : (categoryLogos[categoryCode] || quizLogo);
    const bgColor = categoryData?.color || categoryColors[categoryCode] || "#4D96FF";

    return (
        <div
            className="h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans"
            style={{ backgroundColor: bgColor }}
        >

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
                <div className="bg-[#4D96FF] w-24 h-24 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <img src={logo} alt={categoryCode} className="w-14 h-14" />
                </div>

                <h1 className="text-4xl font-black text-black mb-2 tracking-tight uppercase">{categoryCode}</h1>
                <p className="text-gray-600 font-bold mb-8 text-center">Domina el código</p>

                {/* Info Nivel */}
                <div className="w-full bg-gray-100 rounded-2xl border-4 border-black p-4 mb-8 flex justify-between items-center">
                    <span className="font-bold text-xl">NIVEL ACTUAL</span>
                    <span className="bg-black text-white px-4 py-1 rounded-lg font-black text-xl">{level}</span>
                </div>

                {/* Botón Jugar */}
                <button
                    onClick={() => navigate(`/game/${categoryCode}`)}
                    className="w-full bg-[#6BCB77] text-white py-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all font-black text-2xl tracking-wider"
                >
                    JUGAR AHORA
                </button>
            </div>
        </div>
    );
}
