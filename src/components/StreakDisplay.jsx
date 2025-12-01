import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function StreakDisplay({ compact = false }) {
    const { user, token } = useAuth();
    const [streakData, setStreakData] = useState({
        current_streak: 0,
        longest_streak: 0,
        is_active_today: false
    });

    useEffect(() => {
        if (user && token) {
            // La información de racha viene en el user del AuthContext
            setStreakData({
                current_streak: user.current_streak || 0,
                longest_streak: user.longest_streak || 0,
                is_active_today: checkIfPlayedToday(user.last_played_date)
            });
        }
    }, [user, token]);

    const checkIfPlayedToday = (lastPlayedDate) => {
        if (!lastPlayedDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return lastPlayedDate === today;
    };

    if (!user) return null;

    // Versión compacta para el header
    if (compact) {
        return (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl">🔥</div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-600 leading-none">RACHA</span>
                    <span className="text-lg font-black text-black leading-none">{streakData.current_streak}</span>
                </div>
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
                <WeeklyCalendar lastPlayedDate={user.last_played_date} currentStreak={streakData.current_streak} />
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

// Calendario semanal visual
function WeeklyCalendar({ lastPlayedDate, currentStreak }) {
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const today = new Date();
    const last7Days = [];

    // Generar últimos 7 días
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }

    const isDateActive = (date) => {
        if (!lastPlayedDate || currentStreak === 0) return false;

        const dateStr = date.toISOString().split('T')[0];
        const lastPlayed = new Date(lastPlayedDate + 'T00:00:00');

        // Calcular cuántos días atrás desde last_played_date
        const diffTime = lastPlayed.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Si la diferencia es menor que la racha actual, ese día estuvo activo
        return diffDays >= 0 && diffDays < currentStreak;
    };

    return (
        <div className="flex gap-2 justify-between">
            {last7Days.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                const isActive = isDateActive(date);

                return (
                    <div key={index} className="flex-1 text-center">
                        <div className="text-xs font-bold text-gray-600 mb-1">{days[date.getDay() === 0 ? 6 : date.getDay() - 1]}</div>
                        <div className={`w-full aspect-square rounded-lg border-2 border-black flex items-center justify-center text-xl ${isActive
                            ? 'bg-[#FFD93D]'
                            : 'bg-gray-200'
                            } ${isToday ? 'ring-4 ring-[#4D96FF]' : ''}`}>
                            {isActive ? '🔥' : ''}
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
        return "¡Buen comienzo! Vuelve mañana para continuar tu racha 🎯";
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
