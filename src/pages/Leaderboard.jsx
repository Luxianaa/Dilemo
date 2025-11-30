import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchGlobalLeaderboard, fetchCategoryLeaderboard } from '../services/api';
import trophyImage from '../assets/dilemo-prizes.svg';

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

    const getRankColor = (rank) => {
        if (rank === 1) return '#FFD93D'; // Oro
        if (rank === 2) return '#C0C0C0'; // Plata
        if (rank === 3) return '#CD7F32'; // Bronce
        return '#FFFFFF'; // Blanco
    };

    const tabs = [
        { id: 'global', label: 'GLOBAL', color: '#6C5CE7' },
        { id: 'logoquiz', label: 'LOGOS', color: '#4D96FF' },
        { id: 'python', label: 'PYTHON', color: '#FFD93D' },
        { id: 'git', label: 'GIT', color: '#FF6B6B' }
    ];

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
                    ← VOLVER
                </button>

                {/* Header con Trofeo */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
                    <img src={trophyImage} alt="Trophy" className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-4xl font-black text-black">RANKING</h1>
                    <p className="text-gray-600 font-bold mt-1">Los mejores jugadores</p>
                </div>

                {/* Tabs de Categorías */}
                <div className="grid grid-cols-2 gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 rounded-xl border-4 border-black font-black text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${activeTab === tab.id
                                    ? 'translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white'
                                    : 'text-black bg-white hover:translate-y-1'
                                }`}
                            style={activeTab === tab.id ? { backgroundColor: tab.color } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Rankings */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <h2 className="text-xl font-black text-black mb-4">
                        {tabs.find(t => t.id === activeTab)?.label || 'RANKING'}
                    </h2>

                    {loading ? (
                        <div className="text-center text-gray-500 py-8 font-bold">
                            CARGANDO...
                        </div>
                    ) : rankings.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 font-bold">
                            No hay jugadores aún
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {rankings.map((entry) => (
                                <div
                                    key={entry.id}
                                    className={`rounded-2xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 ${user && entry.id === user.id ? 'ring-4 ring-[#4D96FF]' : ''
                                        }`}
                                    style={{ backgroundColor: getRankColor(entry.rank) }}
                                >
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0 w-12 h-12 bg-black rounded-xl border-2 border-white flex items-center justify-center">
                                        <span className="text-white text-xl font-black">
                                            {entry.rank}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-black text-black text-base truncate">
                                            {entry.display_name || entry.username}
                                        </div>
                                        {entry.level && (
                                            <div className="text-xs text-gray-700 font-bold">
                                                NIV. {entry.level}
                                            </div>
                                        )}
                                    </div>

                                    {/* Score */}
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-2xl font-black text-black">
                                            {entry.score}
                                        </div>
                                        <div className="text-xs text-gray-700 font-bold uppercase">PTS</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && rankings.length > 0 && (
                    <div className="text-center text-white font-bold text-sm pb-4">
                        Sigue jugando para subir de posición
                    </div>
                )}

            </div>
        </div>
    );
}
