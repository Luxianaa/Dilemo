import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/api";

export default function CreateCategory() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        color: '#4D96FF',
        description: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Solo se permiten imágenes (JPG, PNG, SVG, WEBP)' });
                return;
            }

            // Validar tamaño (2MB máximo)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'La imagen no debe superar 2MB' });
                return;
            }

            setLogoFile(file);
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Crear FormData para enviar archivo
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('code', formData.code);
            submitData.append('color', formData.color);
            submitData.append('description', formData.description);
            if (logoFile) {
                submitData.append('logo', logoFile);
            }

            await createCategory(submitData);
            setMessage({ type: 'success', text: 'Categoría creada correctamente' });
            setFormData({ name: '', code: '', color: '#4D96FF', description: '' });
            setLogoFile(null);
            setLogoPreview(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Error al crear la categoría' });
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
                                placeholder="Ej: SQL"
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
                                placeholder="Ej: sql"
                            />
                        </div>

                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">COLOR</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-16 h-12 border-4 border-black rounded-xl cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="flex-1 px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6BCB77] text-black font-medium"
                                    placeholder="#4D96FF"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">DESCRIPCIÓN (opcional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6BCB77] text-black font-medium resize-none"
                                placeholder="Descripción de la categoría"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">LOGO</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                                    onChange={handleLogoChange}
                                    className="w-full px-4 py-3 border-4 border-black rounded-xl bg-white text-black font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-black file:text-sm file:font-bold file:bg-[#FFD93D] file:text-black hover:file:bg-[#FFE55D] cursor-pointer"
                                />
                                {logoPreview && (
                                    <div className="flex justify-center p-4 border-4 border-black rounded-xl bg-gray-50">
                                        <img
                                            src={logoPreview}
                                            alt="Preview"
                                            className="max-w-[120px] max-h-[120px] object-contain"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-gray-600 font-bold">
                                    Formatos: JPG, PNG, SVG, WEBP (máx. 2MB)
                                </p>
                            </div>
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
