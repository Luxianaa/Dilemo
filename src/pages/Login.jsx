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
        <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] flex justify-center items-center px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[0_8px_0_#000] p-8">

                    {/* Título */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-black mb-2">DILEMO</h1>
                        <p className="text-gray-600">Trivia Game</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 border-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-black font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#39d3f7] text-black"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-black font-bold mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required

                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#39d3f7] text-black"
                                placeholder="••••••"
                            />
                        </div>

                        {/* Botón Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4ecdc4] hover:bg-[#3db9b0] text-white py-4 rounded-2xl border-4 border-black font-bold text-xl shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] active:shadow-[0_2px_0_#000] active:translate-y-[4px] transition-all disabled:opacity-50"
                        >
                            {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
                        </button>
                    </form>

                    {/* Link a Registro */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/register"
                                className="text-[#39d3f7] font-bold hover:underline"
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
