import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function StreakDisplay({ compact = false }) {
    const { user, token } = useAuth();
    const [streakData, setStreakData] = useState({
        current_streak: 0,
        longest_streak: 0,
        is_active_today: false,
        play_history: []
    });

    useEffect(() => {
        if (user && token) {
            // La información de racha viene en el user del AuthContext
            setStreakData({
                current_streak: user.current_streak || 0,
                longest_streak: user.longest_streak || 0,
                is_active_today: checkIfPlayedToday(user.last_played_date),
                play_history: user.play_history || []
            });
        }
    }, [user, token]);

    const checkIfPlayedToday = (lastPlayedDate) => {
        if (!lastPlayedDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return lastPlayedDate === today;
    };

    if (!user) return null;

    // Versión compacta para el header (Minimalista)
    if (compact) {
        return (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-black/10 shadow-sm hover:scale-105 transition-transform cursor-default">
                <span className="text-lg">🔥</span>
                <span className={`text-sm font-black ${streakData.is_active_today ? 'text-[#FF6B6B]' : 'text-gray-400'}`}>
                    {streakData.current_streak}
                </span>
            </div>
        );
    }

    // Versión completa para el perfil
    return (
        <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-black">TU RACHA 🔥</h3>
                {streakData.is_active_today && (
                    <div className="bg-[#6BCB77] px-3 py-1 rounded-full border-2 border-black">
                        <span className="text-xs font-bold text-white">¡HOY JUGASTE!</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Racha Actual */}
                <div className="bg-[#FFD93D] rounded-2xl border-4 border-black p-4 text-center">
                    <div className="text-5xl mb-2">🔥</div>
                    <div className="text-4xl font-black text-black mb-1">{streakData.current_streak}</div>
                    <div className="text-sm font-bold text-black">RACHA ACTUAL</div>
                </div>

                {/* Récord */}
                <div className="bg-[#4D96FF] rounded-2xl border-4 border-black p-4 text-center">
                    <div className="text-5xl mb-2">🏆</div>
                    <div className="text-4xl font-black text-white mb-1">{streakData.longest_streak}</div>
                    <div className="text-sm font-bold text-white">RÉCORD</div>
                </div>
            </div>

            {/* Calendario semanal */}
            <div className="mt-6">
                <h4 className="text-lg font-black text-black mb-3">ÚLTIMOS 7 DÍAS</h4>
                <WeeklyCalendar playHistory={streakData.play_history} />
            </div>

            {/* Mensaje motivacional */}
            <div className="mt-4 bg-[#F5F5F5] rounded-xl border-2 border-black p-4">
                <p className="text-sm font-bold text-center text-black">
                    {getMotivationalMessage(streakData.current_streak)}
                </p>
            </div>
        </div>
    );
}

// Calendario semanal visual basado en historial real
function WeeklyCalendar({ playHistory }) {
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S']; // Domingo primero para getDay()
    const today = new Date();
    const last7Days = [];

    // Normalizar historial a array de strings YYYY-MM-DD
    const historySet = new Set(
        Array.isArray(playHistory)
            ? playHistory.map(date => typeof date === 'string' ? date.split('T')[0] : '')
            : []
    );

    // Si playHistory es string (JSON), intentar parsearlo
    if (typeof playHistory === 'string') {
        try {
            const parsed = JSON.parse(playHistory);
            if (Array.isArray(parsed)) {
                parsed.forEach(d => historySet.add(d.split('T')[0]));
            }
        } catch (e) {
            console.error("Error parsing history in component", e);
        }
    }

    // Generar últimos 7 días (incluyendo hoy)
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }

    return (
        <div className="flex gap-2 justify-between">
            {last7Days.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = dateStr === today.toISOString().split('T')[0];
                const isActive = historySet.has(dateStr);
                const dayLabel = days[date.getDay()];

                return (
                    <div key={index} className="flex-1 text-center group">
                        <div className="text-xs font-bold text-gray-500 mb-1">{dayLabel}</div>
                        <div className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center text-xl transition-all
                            ${isActive
                                ? 'bg-[#FFD93D] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                : 'bg-gray-100 border-gray-300 text-gray-300'
                            } 
                            ${isToday && !isActive ? 'ring-2 ring-[#4D96FF] ring-offset-1' : ''}
                        `}>
                            {isActive ? '🔥' : (
                                <span className="text-gray-300 text-lg filter grayscale opacity-50">🔥</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Mensajes motivacionales según la racha
function getMotivationalMessage(streak) {
    if (streak === 0) {
        return "¡Comienza tu racha hoy! Juega todos los días para mantenerla activa 🚀";
    } else if (streak === 1) {
        return "¡Buen comienzo! Vuelve mañana para continuar tu racha";
    } else if (streak < 7) {
        return `¡Vas genial con ${streak} días! Sigue así para llegar a una semana 💪`;
    } else if (streak === 7) {
        return "¡Increíble! ¡Una semana completa! 🎉 ¿Puedes llegar a dos?";
    } else if (streak < 30) {
        return `¡Impresionante racha de ${streak} días! Eres imparable 🔥`;
    } else {
        return `¡WOW! ${streak} días consecutivos. ¡Eres una leyenda! 👑`;
    }
}
