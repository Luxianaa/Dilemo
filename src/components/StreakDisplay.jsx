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
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${streakData.is_active_today ? 'text-[#FF6B6B]' : 'text-gray-400'}`}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                <span className={`text-sm font-black ${streakData.is_active_today ? 'text-black' : 'text-gray-500'}`}>
                    {streakData.current_streak}
                </span>
            </div>
        );
    }

    // Versión completa para el perfil
    return (
        <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-black p-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-black tracking-tight">ACTIVIDAD</h3>
                </div>
                {streakData.is_active_today && (
                    <div className="bg-[#6BCB77] px-3 py-1 rounded-lg border-2 border-black">
                        <span className="text-xs font-black text-white tracking-wide">COMPLETADO</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Racha Actual */}
                <div className="bg-gray-50 rounded-2xl border-3 border-black p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#FFD93D] transition-colors duration-300">
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                    </div>
                    <span className="text-4xl font-black text-black mb-1 relative z-10">{streakData.current_streak}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider relative z-10 group-hover:text-black">Días Seguidos</span>
                </div>

                {/* Récord */}
                <div className="bg-gray-50 rounded-2xl border-3 border-black p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#4D96FF] transition-colors duration-300">
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                    </div>
                    <span className="text-4xl font-black text-black mb-1 relative z-10">{streakData.longest_streak}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider relative z-10 group-hover:text-black">Mejor Racha</span>
                </div>
            </div>

            {/* Calendario semanal */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <h4 className="text-sm font-black text-black uppercase tracking-wide">Últimos 7 días</h4>
                    <span className="text-xs font-bold text-gray-400">{streakData.current_streak} / 7 días</span>
                </div>
                <WeeklyCalendar playHistory={streakData.play_history} />
            </div>

            {/* Barra de progreso visual */}
            <div className="mt-4 h-3 w-full bg-gray-100 rounded-full border-2 border-black overflow-hidden">
                <div
                    className="h-full bg-[#FF6B6B]"
                    style={{ width: `${Math.min((streakData.current_streak / 7) * 100, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}

// Calendario semanal visual minimalista
function WeeklyCalendar({ playHistory }) {
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const today = new Date();
    const last7Days = [];

    const historySet = new Set(
        Array.isArray(playHistory)
            ? playHistory.map(date => typeof date === 'string' ? date.split('T')[0] : '')
            : []
    );

    if (typeof playHistory === 'string') {
        try {
            const parsed = JSON.parse(playHistory);
            if (Array.isArray(parsed)) {
                parsed.forEach(d => historySet.add(d.split('T')[0]));
            }
        } catch (e) {
            console.error("Error parsing history", e);
        }
    }

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }

    return (
        <div className="flex justify-between gap-1">
            {last7Days.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = dateStr === today.toISOString().split('T')[0];
                const isActive = historySet.has(dateStr);
                const dayLabel = days[date.getDay()];

                return (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1">
                        <span className={`text-[10px] font-bold ${isToday ? 'text-black' : 'text-gray-400'}`}>
                            {dayLabel}
                        </span>
                        <div className={`
                            w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                            ${isActive
                                ? 'bg-black border-black text-white'
                                : 'bg-transparent border-gray-200 text-transparent'
                            }
                            ${isToday && !isActive ? 'border-dashed border-gray-400' : ''}
                        `}>
                            {isActive && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
