import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchGlobalLeaderboard, fetchCategoryLeaderboard } from '../services/api';

export default function Leaderboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global');
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRankings(activeTab);
    }, [activeTab]);

    const loadRankings = async (category) => {
        setLoading(true);
        try {
            const data = category === 'global'
                ? await fetchGlobalLeaderboard()
                : await fetchCategoryLeaderboard(category);

            setRankings(data.rankings || []);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
        setLoading(false);
    };

    const getMedalIcon = (rank) => {
        if (rank === 1) return '👑';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-yellow-400';
        if (rank === 2) return 'bg-gray-300';
        if (rank === 3) return 'bg-amber-600';
        return 'bg-white';
    };

    const tabs = [
        { id: 'global', label: 'GLOBAL', icon: '🌍' },
        { id: 'logoquiz', label: 'LOGOS', icon: '🎨' },
        { id: 'python', label: 'PYTHON', icon: '🐍' },
        { id: 'git', label: 'GIT', icon: '📦' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] px-4 py-8">

            {/* Botón Volver */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl border-4 border-black font-bold shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] transition-all"
            >
                ← VOLVER
            </button>

            {/* Título */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-white mb-2">
                    🏆 LEADERBOARD
                </h1>
                <p className="text-gray-300">Los mejores jugadores</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[120px] py-4 px-4 rounded-xl border-4 border-black font-bold text-base transition-all shadow-[0_4px_0_#000] ${activeTab === tab.id
                                ? 'bg-[#4ecdc4] text-white translate-y-[2px] shadow-[0_2px_0_#000]'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Rankings */}
            <div className="max-w-2xl mx-auto">
                {loading ? (
                    <div className="text-center text-white text-xl py-8">
                        Cargando rankings...
                    </div>
                ) : rankings.length === 0 ? (
                    <div className="text-center text-white text-xl py-8">
                        No hay jugadores aún. ¡Sé el primero!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rankings.map((entry) => (
                            <div
                                key={entry.id}
                                className={`${getRankColor(entry.rank)} ${user && entry.id === user.id ? 'ring-4 ring-[#39d3f7]' : ''
                                    } rounded-2xl border-4 border-black p-4 shadow-[0_6px_0_#000] flex items-center gap-4 transition-all hover:translate-y-[2px] hover:shadow-[0_4px_0_#000]`}
                            >
                                {/* Rank */}
                                <div className="flex-shrink-0 w-12 text-center">
                                    <span className="text-2xl font-black text-black">
                                        #{entry.rank}
                                    </span>
                                </div>

                                {/* Medal */}
                                <div className="text-3xl flex-shrink-0">
                                    {getMedalIcon(entry.rank)}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-black text-lg truncate">
                                        {entry.display_name || entry.username}
                                    </div>
                                    {entry.level && (
                                        <div className="text-sm text-gray-600">
                                            Nivel {entry.level}
                                        </div>
                                    )}
                                </div>

                                {/* Score */}
                                <div className="flex-shrink-0 text-right">
                                    <div className="text-xl font-black text-black">
                                        {entry.score}
                                    </div>
                                    <div className="text-xs text-gray-600">puntos</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer mensaje */}
            {!loading && rankings.length > 0 && (
                <div className="text-center mt-8 text-gray-400 text-sm">
                    ¡Sigue jugando para subir de posición! 🚀
                </div>
            )}
        </div>
    );
}
