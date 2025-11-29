import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserProgress } from "../services/api";

export default function Profile() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        };
        loadProgress();
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const getCategoryName = (code) => {
        const names = {
            logoquiz: 'Logo Quiz',
            python: 'Python',
            git: 'Git'
        };
        return names[code] || code;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] px-4 py-8">

            {/* Botón Volver */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl border-4 border-black font-bold shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] transition-all"
            >
                ← VOLVER
            </button>

            {/* Contenedor Principal */}
            <div className="max-w-2xl mx-auto">

                {/* Card de Perfil */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[0_8px_0_#000] p-8 mb-6">

                    {/* Header con Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-[#4ecdc4] to-[#39d3f7] rounded-2xl border-4 border-black flex items-center justify-center shadow-[0_4px_0_#000]">
                            <span className="text-white text-4xl font-black">
                                {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-black mb-1">
                                {user.display_name || user.username}
                            </h1>
                            <p className="text-gray-600 font-medium">@{user.username}</p>
                        </div>
                    </div>

                    {/* Estadísticas Principales */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#ff4d6d] rounded-2xl border-4 border-black p-4 shadow-[0_4px_0_#000]">
                            <div className="text-white text-center">
                                <div className="text-3xl font-black">{user.total_score || 0}</div>
                                <div className="text-sm font-bold">Puntos Totales</div>
                            </div>
                        </div>

                        <div className="bg-[#4ecdc4] rounded-2xl border-4 border-black p-4 shadow-[0_4px_0_#000]">
                            <div className="text-white text-center">
                                <div className="text-3xl font-black">{user.email}</div>
                                <div className="text-sm font-bold">Email</div>
                            </div>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl border-2 border-black p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Usuario:</span>
                                <span className="text-black font-semibold">{user.username}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-2 border-black p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Nombre:</span>
                                <span className="text-black font-semibold">{user.display_name || 'No configurado'}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-2 border-black p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Email:</span>
                                <span className="text-black font-semibold">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progreso por Categoría */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[0_8px_0_#000] p-8 mb-6">
                    <h2 className="text-2xl font-black text-black mb-6">📊 Progreso</h2>

                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Cargando progreso...</div>
                    ) : progress ? (
                        <div className="space-y-4">
                            {Object.entries(progress).map(([code, data]) => (
                                <div key={code} className="bg-gradient-to-r from-[#39d3f7]/10 to-[#4ecdc4]/10 rounded-2xl border-3 border-black p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xl font-black text-black">{getCategoryName(code)}</span>
                                        <span className="bg-[#ff4d6d] text-white px-4 py-1 rounded-lg border-2 border-black font-bold">
                                            Nivel {data.level}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-semibold">Puntaje: <b className="text-black">{data.score}</b></span>
                                        <span className="text-gray-600 font-semibold">Vidas: <b className="text-black">{data.lives || 3}/3</b></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">No hay progreso disponible</div>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="flex-1 bg-[#4ecdc4] hover:bg-[#3db9b0] text-white py-4 rounded-2xl border-4 border-black font-bold text-lg shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] transition-all"
                    >
                        🏆 Leaderboard
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex-1 bg-[#ff4d6d] hover:bg-[#e63956] text-white py-4 rounded-2xl border-4 border-black font-bold text-lg shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] transition-all"
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
