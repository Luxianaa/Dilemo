import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
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

        // Validar contraseñas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.displayName || formData.username
        );

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#243447] to-[#2d4457] flex justify-center items-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[0_8px_0_#000] p-8">

                    {/* Título */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-extrabold text-black mb-2">DILEMO</h1>
                        <p className="text-gray-600">Crear Cuenta</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 border-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                maxLength={50}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#39d3f7] text-black"
                                placeholder="usuario123"
                            />
                        </div>

                        {/* Nombre para Mostrar */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">
                                Nombre para Mostrar (opcional)
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#39d3f7] text-black"
                                placeholder="Tu Nombre"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">
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
                            <label className="block text-black font-bold mb-2 text-sm">
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

                        {/* Confirmar Contraseña */}
                        <div>
                            <label className="block text-black font-bold mb-2 text-sm">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required

                                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#39d3f7] text-black"
                                placeholder="••••••"
                            />
                        </div>

                        {/* Botón Registro */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4ecdc4] hover:bg-[#3db9b0] text-white py-4 rounded-2xl border-4 border-black font-bold text-xl shadow-[0_6px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-[2px] active:shadow-[0_2px_0_#000] active:translate-y-[4px] transition-all disabled:opacity-50 mt-6"
                        >
                            {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                        </button>
                    </form>

                    {/* Link a Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/login"
                                className="text-[#39d3f7] font-bold hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
