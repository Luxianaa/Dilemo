import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion, fetchCategories, fetchLevels } from "../../services/api";

export default function CreateQuestion() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [formData, setFormData] = useState({
        text: '',
        isTrue: true,
        levelId: '',
        imageName: '' // Opcional, por ahora solo texto
    });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0].code);
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;

        const loadLevels = async () => {
            try {
                const data = await fetchLevels(selectedCategory);
                setLevels(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, levelId: data[0].id }));
                } else {
                    setFormData(prev => ({ ...prev, levelId: '' }));
                }
            } catch (error) {
                console.error("Error loading levels:", error);
                setLevels([]);
            }
        };
        loadLevels();
    }, [selectedCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.levelId) {
            setMessage({ type: 'error', text: 'Selecciona un nivel válido' });
            return;
        }

        const category = categories.find(c => c.code === selectedCategory);
        if (!category) {
            setMessage({ type: 'error', text: 'Categoría inválida' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await createQuestion({
                ...formData,
                categoryId: category.id
            });
            setMessage({ type: 'success', text: 'Pregunta creada correctamente' });
            setFormData(prev => ({ ...prev, text: '' }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al crear la pregunta' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#4D96FF] px-4 py-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-md mx-auto relative z-10 space-y-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <h1 className="text-2xl font-black text-black mb-6 text-center">NUEVA PREGUNTA</h1>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-xl border-2 border-black font-bold text-center text-white ${message.type === 'success' ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B]'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Categoría (Filtro) */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">CATEGORÍA</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.code}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Nivel */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">NIVEL</label>
                            <select
                                value={formData.levelId}
                                onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium bg-white"
                                disabled={levels.length === 0}
                            >
                                {levels.length === 0 ? (
                                    <option>No hay niveles</option>
                                ) : (
                                    levels.map(lvl => (
                                        <option key={lvl.id} value={lvl.id}>Nivel {lvl.level_number}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Pregunta */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">PREGUNTA</label>
                            <textarea
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                required
                                rows="3"
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium resize-none"
                                placeholder="Escribe la pregunta..."
                            />
                        </div>

                        {/* Respuesta */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">RESPUESTA CORRECTA</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isTrue: true })}
                                    className={`flex-1 py-3 rounded-xl border-4 border-black font-bold transition-all ${formData.isTrue ? 'bg-[#6BCB77] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-1' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    VERDADERO
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isTrue: false })}
                                    className={`flex-1 py-3 rounded-xl border-4 border-black font-bold transition-all ${!formData.isTrue ? 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-1' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    FALSO
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4D96FF] text-white py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'CREANDO...' : 'CREAR PREGUNTA'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
