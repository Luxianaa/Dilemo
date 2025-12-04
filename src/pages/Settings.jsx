import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { useState } from "react";

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isPlaying, volume, toggleMusic, changeVolume } = useMusic();
    const [activeSection, setActiveSection] = useState('audio');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Estados para editar perfil
    const [editData, setEditData] = useState({
        displayName: user?.display_name || '',
        email: user?.email || ''
    });

    // Estados para cambiar contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        // Aquí iría la llamada a la API para actualizar perfil
        setTimeout(() => {
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
            setLoading(false);
        }, 1000);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        setLoading(true);
        // Aquí iría la llamada a la API para cambiar contraseña
        setTimeout(() => {
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setLoading(false);
        }, 1000);
    };

    const handleDeleteAccount = async () => {
        // Aquí iría la llamada a la API para eliminar cuenta
        logout();
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sections = [
        // { id: 'profile', label: 'PERFIL', color: '#4D96FF' },
        { id: 'audio', label: 'AUDIO', color: '#6BCB77' },
        // { id: 'password', label: 'CONTRASEÑA', color: '#FFD93D' },
        { id: 'account', label: 'CUENTA', color: '#FF6B6B' }
    ];

    return (
        <div className="min-h-screen bg-[#6C5CE7] px-4 py-6 font-sans relative overflow-hidden">

            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Contenedor Principal */}
            <div className="max-w-md mx-auto relative z-10 space-y-4">

                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/home')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                {/* Header */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
                    <h1 className="text-4xl font-black text-black">AJUSTES</h1>
                    <p className="text-gray-600 font-bold mt-1">Configura tu cuenta</p>
                </div>

                {/* Tabs de Secciones */}
                <div className="grid grid-cols-2 gap-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`py-3 px-2 rounded-xl border-4 border-black font-black text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${activeSection === section.id
                                ? 'translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white'
                                : 'text-black bg-white hover:translate-y-1'
                                }`}
                            style={activeSection === section.id ? { backgroundColor: section.color } : {}}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Mensaje de feedback */}
                {message.text && (
                    <div className={`rounded-2xl border-4 border-black p-4 font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${message.type === 'success' ? 'bg-[#6BCB77] text-white' : 'bg-[#FF6B6B] text-white'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Contenido según sección activa */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">

                    {/* SECCIÓN: PERFIL */}
                    {activeSection === 'profile' && (
                        <div>
                            <h2 className="text-2xl font-black text-black mb-4">EDITAR PERFIL</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                {/* Username (solo lectura) */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        USUARIO
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        disabled
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 font-bold">No se puede cambiar el nombre de usuario</p>
                                </div>

                                {/* Display Name */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        NOMBRE VISIBLE
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.displayName}
                                        onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        EMAIL
                                    </label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4D96FF] text-black font-medium"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                {/* Botón Guardar */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#4D96FF] text-white py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SECCIÓN: AUDIO */}
                    {activeSection === 'audio' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-black mb-4">MÚSICA DE FONDO</h2>

                            {/* Toggle de música */}
                            <div className="bg-gray-50 rounded-2xl border-3 border-black p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-black font-black">MÚSICA</span>
                                    <button
                                        onClick={toggleMusic}
                                        className={`relative w-16 h-8 rounded-full border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isPlaying ? 'bg-[#6BCB77]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`absolute top-0 left-0 w-8 h-full bg-white border-4 border-black rounded-full transition-transform ${isPlaying ? 'translate-x-8' : 'translate-x-0'
                                            }`}></div>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 font-bold">
                                    {isPlaying ? 'Reproduciendo' : 'Pausado'}
                                </p>
                            </div>

                            {/* Control de volumen */}
                            <div className="bg-gray-50 rounded-2xl border-3 border-black p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-black">VOLUMEN</span>
                                        <span className="text-black font-bold">{Math.round(volume * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                        className="w-full h-4 bg-gray-300 rounded-full border-4 border-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#6BCB77] [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    {/* SECCIÓN: CONTRASEÑA */}
                    {activeSection === 'password' && (
                        <div>
                            <h2 className="text-2xl font-black text-black mb-4">CAMBIAR CONTRASEÑA</h2>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {/* Contraseña actual */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        CONTRASEÑA ACTUAL
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFD93D] text-black font-medium"
                                        placeholder="••••••"
                                    />
                                </div>

                                {/* Nueva contraseña */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        NUEVA CONTRASEÑA
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFD93D] text-black font-medium"
                                        placeholder="••••••"
                                    />
                                </div>

                                {/* Confirmar contraseña */}
                                <div>
                                    <label className="block text-black font-bold mb-2 text-sm">
                                        CONFIRMAR CONTRASEÑA
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFD93D] text-black font-medium"
                                        placeholder="••••••"
                                    />
                                </div>

                                {/* Botón Cambiar */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#FFD93D] text-black py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'CAMBIANDO...' : 'CAMBIAR CONTRASEÑA'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SECCIÓN: CUENTA */}
                    {activeSection === 'account' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-black mb-4">GESTIÓN DE CUENTA</h2>



                            <div className="bg-gray-50 rounded-2xl border-3 border-black p-4">
                                <p className="text-sm text-gray-600 font-bold mb-2">PUNTOS TOTALES</p>
                                <p className="text-black font-black text-2xl">{user?.total_score || 0}</p>
                            </div>

                            {/* Botón Panel Administrador */}
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-[#9D4EDD] text-white py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                PANEL ADMINISTRADOR
                            </button>

                            {/* Botón Cerrar Sesión */}
                            <button
                                onClick={handleLogout}
                                className="w-full bg-[#4D96FF] text-white py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                CERRAR SESIÓN
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
