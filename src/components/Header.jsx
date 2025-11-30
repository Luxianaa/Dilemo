import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Si el usuario tiene monedas, las mostramos, si no, 0.
    // Esto asume que el objeto user trae 'coins'. 
    // Si no, se mostrará 0 pero no romperá la app.
    const coins = user?.coins || 0;

    return (
        <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-6 pb-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">

                {/* Botón de Perfil */}
                <button
                    onClick={() => navigate("/profile")}
                    className="relative group"
                >
                    <div className="w-14 h-14 rounded-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>
                </button>

                {/* Monedas */}
                <div className="relative">
                    <div className="bg-[#FFD93D] px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2">
                            <span className="text-black font-black text-xl">$</span>
                            <span className="text-2xl font-black text-black tracking-tight">
                                {coins}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botón de Configuración */}
                <button
                    onClick={() => navigate("/settings")}
                    className="relative group"
                >
                    <div className="w-14 h-14 rounded-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-black group-hover:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                            </svg>
                        </div>
                    </div>
                </button>

            </div>
        </div>
    );
}
