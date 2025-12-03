import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";

// Importa tus pantallas
import SplashScreen from "./pages/SplashScreen";
import HeroSection from "./components/HeroSection";
import PythonMenu from "./pages/pythonMenu";
import GamePlay from "./pages/GamePlay";
import GitMenu from "./pages/GitMenu";
import GameGit from "./pages/GameGit";
import QuizMenu from "./pages/QuizMenu";
import GameQuiz from "./pages/GameQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import CreateQuestion from "./pages/Admin/CreateQuestion";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateLevel from "./pages/Admin/CreateLevel";

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <BrowserRouter>
          <Routes>
            {/* Splash Screen */}
            <Route path="/" element={<SplashScreen />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Profile & Leaderboard */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/create-question" element={<CreateQuestion />} />
            <Route path="/admin/create-category" element={<CreateCategory />} />
            <Route path="/admin/create-level" element={<CreateLevel />} />

            {/* Pantalla principal */}
            <Route path="/home" element={<HeroSection />} />

            {/* Python */}
            <Route path="/python" element={<PythonMenu />} />
            <Route path="/game" element={<GamePlay />} />

            {/* Git */}
            <Route path="/git" element={<GitMenu />} />
            <Route path="/game-git" element={<GameGit />} />

            {/* Logo Quiz */}
            <Route path="/logoquiz" element={<QuizMenu />} />
            <Route path="/game-quiz" element={<GameQuiz />} />
          </Routes>
        </BrowserRouter>
      </MusicProvider>
    </AuthProvider>
  );
}
