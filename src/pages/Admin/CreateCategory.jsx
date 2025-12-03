import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/api";

export default function CreateCategory() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await createCategory(formData);
            setMessage({ type: 'success', text: 'Categoría creada correctamente' });
            setFormData({ name: '', code: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al crear la categoría' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#6BCB77] px-4 py-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-md mx-auto relative z-10 space-y-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <h1 className="text-2xl font-black text-black mb-6 text-center">NUEVA CATEGORÍA</h1>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-xl border-2 border-black font-bold text-center text-white ${message.type === 'success' ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B]'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">NOMBRE</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6BCB77] text-black font-medium"
                                placeholder="Ej: Programación"
                            />
                        </div>

                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">CÓDIGO (slug)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                required
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6BCB77] text-black font-medium"
                                placeholder="Ej: programacion"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6BCB77] text-white py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'CREANDO...' : 'CREAR CATEGORÍA'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
