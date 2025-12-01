import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#6C5CE7] flex justify-center items-center px-4 font-sans relative overflow-hidden">

            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Botón Volver */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold z-50"
            >
                VOLVER
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">

                    {/* Título */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-black text-black mb-2">CODUVA</h1>
                        <p className="text-gray-600 font-bold">Inicia Sesión</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error */}
                        {error && (
                            <div className="bg-[#FF6B6B] border-4 border-black text-white px-4 py-3 rounded-xl font-bold text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-lg">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-lg">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium"
                                placeholder="••••••"
                            />
                        </div>

                        {/* Botón Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6BCB77] text-white py-4 rounded-2xl border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50"
                        >
                            {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
                        </button>

                        {/* Botón Jugar como Invitado */}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full bg-[#FFD93D] text-black py-4 rounded-2xl border-4 border-black font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all"
                        >
                            JUGAR COMO INVITADO
                        </button>
                    </form>

                    {/* Link a Registro */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 font-medium">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-[#4D96FF] font-bold hover:underline"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
