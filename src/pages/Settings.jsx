import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#6C5CE7] flex flex-col items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full text-center">
                <h1 className="text-4xl font-black mb-6">CONFIGURACIÓN</h1>
                <p className="text-xl font-bold mb-8">Próximamente...</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-[#FF6B6B] text-white px-6 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-xl"
                >
                    VOLVER
                </button>
            </div>
        </div>
    );
}
