import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLevel, fetchCategories } from "../../services/api";

export default function CreateLevel() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        levelNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await createLevel(formData);
            setMessage({ type: 'success', text: 'Nivel creado correctamente' });
            setFormData(prev => ({ ...prev, levelNumber: '' }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al crear el nivel' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFD93D] px-4 py-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-md mx-auto relative z-10 space-y-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <h1 className="text-2xl font-black text-black mb-6 text-center">NUEVO NIVEL</h1>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-xl border-2 border-black font-bold text-center ${message.type === 'success' ? 'bg-[#6BCB77] text-white' : 'bg-[#FF6B6B] text-white'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">CATEGORÍA</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFD93D] text-black font-medium bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">NÚMERO DE NIVEL</label>
                            <input
                                type="number"
                                value={formData.levelNumber}
                                onChange={(e) => setFormData({ ...formData, levelNumber: e.target.value })}
                                required
                                min="1"
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFD93D] text-black font-medium"
                                placeholder="Ej: 1"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFD93D] text-black py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'CREANDO...' : 'CREAR NIVEL'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
