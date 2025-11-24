import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa tus pantallas
import HeroSection from "./components/HeroSection";
import PythonMenu from "./pages/PythonMenu";
import GamePlay from "./pages/GamePlay";
// import GitMenu from "./pages/GitMenu";
// import LogoQuizMenu from "./pages/LogoQuizMenu";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla principal */}
        <Route path="/" element={<HeroSection />} />

        {/* Pantallas del menú según la carta */}
        <Route path="/python" element={<PythonMenu />} />
        
        {/* Pantalla del juego */}
        <Route path="/game" element={<GamePlay />} />
        
        {/* <Route path="/git" element={<GitMenu />} /> */}
        {/* <Route path="/logoquiz" element={<LogoQuizMenu />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
