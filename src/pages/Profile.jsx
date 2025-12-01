import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserProgress } from "../services/api";
import StreakDisplay from "../components/StreakDisplay";

export default function Profile() {
    const navigate = useNavigate();
    const { user, token, logout, loading } = useAuth();
    const [progress, setProgress] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(true);

    useEffect(() => {
        const loadProgress = async () => {
            if (token) {
                try {
                    const data = await fetchUserProgress(token);
                    setProgress(data);
                } catch (error) {
                    console.error('Error loading progress:', error);
                }
            }
            setLoadingProgress(false);
        };
        loadProgress();
    }, [token]);

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#6C5CE7] flex items-center justify-center">
                <div className="text-white text-4xl font-black">CARGANDO...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const getCategoryInfo = (code) => {
        const categories = {
            logoquiz: { name: 'LOGO QUIZ', color: '#4D96FF' },
            python: { name: 'PYTHON', color: '#FFD93D' },
            git: { name: 'GIT', color: '#FF6B6B' }
        };
        return categories[code] || { name: code.toUpperCase(), color: '#6C5CE7' };
    };

    return (
        <div className="min-h-screen bg-[#6C5CE7] px-4 py-6 font-sans relative overflow-hidden">

            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Contenedor Principal */}
            <div className="max-w-md mx-auto relative z-10 space-y-4">

                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                {/* Card de Perfil */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">

                    {/* Avatar y Nombre */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-[#4D96FF] rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <img
                                src={new URL('../assets/userlogodil.png', import.meta.url).href}
                                alt="User Avatar"
                                className="w-16 h-16 object-contain animate-float"
                            />
                        </div>

                        {/* Info Usuario */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-black text-black leading-tight">
                                {user.display_name || user.username}
                            </h1>
                            <p className="text-gray-600 font-bold">@{user.username}</p>
                        </div>
                    </div>

                    {/* Estadísticas Destacadas */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#FF6B6B] rounded-2xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                            <div className="text-white text-3xl font-black">{user.total_score || 0}</div>
                            <div className="text-white text-xs font-bold uppercase tracking-wide">PUNTOS</div>
                        </div>

                        <div className="bg-[#6BCB77] rounded-2xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                            <div className="text-white text-3xl font-black">{progress ? Object.keys(progress).length : 0}</div>
                            <div className="text-white text-xs font-bold uppercase tracking-wide">CATEGORÍAS</div>
                        </div>
                    </div>

                    {/* Información del Usuario */}
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl border-3 border-black p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-700">Usuario:</span>
                                <span className="text-black font-bold text-sm">{user.username}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-3 border-black p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-700">Nombre:</span>
                                <span className="text-black font-bold text-sm">{user.display_name || 'No configurado'}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-3 border-black p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-700">Email:</span>
                                <span className="text-black font-bold text-sm truncate ml-2">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Racha Diaria */}
                <StreakDisplay />

                {/* Progreso por Categoría */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <h2 className="text-2xl font-black text-black mb-4">
                        PROGRESO
                    </h2>

                    {loadingProgress ? (
                        <div className="text-center text-gray-500 py-6 font-bold">Cargando...</div>
                    ) : progress && Object.keys(progress).length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(progress).map(([code, data]) => {
                                const categoryInfo = getCategoryInfo(code);
                                return (
                                    <div
                                        key={code}
                                        className="rounded-2xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        style={{ backgroundColor: categoryInfo.color }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-black text-white">
                                                {categoryInfo.name}
                                            </span>
                                            <span className="bg-white text-black px-3 py-1 rounded-lg border-2 border-black font-black text-sm">
                                                NIV. {data.current_level || data.level}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-white font-bold">PUNTAJE: <b className="text-lg">{data.total_score || data.score}</b></span>
                                            <span className="text-white font-bold">VIDAS: <b className="text-lg">{data.lives || 3}/3</b></span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6 font-bold">
                            Comienza a jugar para ver tu progreso
                        </div>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-3 pb-6">
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="bg-[#4D96FF] text-white py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-base"
                    >
                        RANKING
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-[#FF6B6B] text-white py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-base"
                    >
                        SALIR
                    </button>
                </div>

            </div>
        </div>
    );
}
