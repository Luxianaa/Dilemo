import { useNavigate } from "react-router-dom";

export default function PythonMenu() {
  const navigate = useNavigate();

  return (

    // carta flotando
    
    <div className="h-screen w-full bg-gradient-to-b from-[#6d2aff] via-[#8d4fff] to-[#ff7bca] flex flex-col items-center justify-center px-4">
      {/* Botón regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl shadow-lg"
      ></button>

      {/* Carta */}
      <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-[0_10px_0_#000] p-10 relative border-[4px] border-black">
        {/* Esquinas decorativas */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-4 border-b-4 border-black rounded-br-lg"></div>

        {/* Título */}
        <div className="bg-[#39d3f7] text-white text-center text-xl font-extrabold py-3 rounded-lg border-4 border-black shadow-md">
          PYTHON
        </div>

        {/* Selector de niveles */}
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-semibold mb-3">Level:</p>

          <div className="flex flex-colgap-3 text-black font-bold items-center ">
                    1
             
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="w-full max-w-xs bg-[#4b5bfe] hover:bg-[#3c49d0] text-white py-3 rounded-xl border-4 border-black font-semibold text-lg shadow-lg transition">
            Nuevo Juego
          </button>
        </div>
      </div>
    </div>
  );
}
