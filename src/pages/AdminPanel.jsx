import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
    const navigate = useNavigate();

    const menuItems = [
        { title: "CREAR PREGUNTA", path: "/admin/create-question", color: "#4D96FF" },
        { title: "CREAR CATEGORÍA", path: "/admin/create-category", color: "#6BCB77" },
        { title: "CREAR NIVEL", path: "/admin/create-level", color: "#FFD93D" },
    ];

    return (
        <div className="min-h-screen bg-[#9D4EDD] px-4 py-6 font-sans relative overflow-hidden">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-md mx-auto relative z-10 space-y-6">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/settings')}
                    className="bg-white text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                >
                    VOLVER
                </button>

                {/* Header */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
                    <h1 className="text-3xl font-black text-black">PANEL ADMIN</h1>
                    <p className="text-gray-600 font-bold mt-1">Gestión de contenido</p>
                </div>

                {/* Menu Grid */}
                <div className="grid gap-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="w-full py-6 rounded-2xl border-4 border-black font-black text-xl text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                            style={{ backgroundColor: item.color }}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
