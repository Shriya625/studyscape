import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import TimerPage from "./pages/TimerPage";
import StatsPage from "./pages/StatsPage";
import CityPage from "./pages/CityPage";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = {
    bg: darkMode ? "#1A1612" : "#E8DDD0",
    border: darkMode ? "#2E2620" : "#D4C4B4",
    logo: darkMode ? "#D4B896" : "#3D2B1F",
    navText: darkMode ? "#A89880" : "#9C8878",
    toggleBg: darkMode ? "#2E2620" : "white",
    toggleText: darkMode ? "#D4B896" : "#3D2B1F",
  };

  const navBtn = (label, path) => {
    const isActive =
      location.pathname === path ||
      (path === "/timer" && location.pathname === "/");
    return (
      <button
        onClick={() => navigate(path)}
        style={{
          color: isActive ? (darkMode ? "#D4B896" : "#E8DDD0") : theme.navText,
          background: isActive
            ? darkMode
              ? "transparent"
              : "#3D2B1F"
            : "transparent",
          border:
            isActive && darkMode
              ? "1px solid #D4B896"
              : "1px solid transparent",
        }}
        className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      style={{
        background: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
      }}
      className="flex items-center justify-between px-10 py-5"
    >
      <h1
        style={{ color: theme.logo }}
        className="text-xl font-semibold tracking-wide cursor-pointer"
        onClick={() => navigate("/timer")}
      >
        Studyscape
      </h1>
      <div className="flex items-center gap-2">
        {navBtn("Timer", "/timer")}
        {navBtn("Stats", "/stats")}
        {navBtn("City", "/city")}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: theme.toggleBg,
            color: theme.toggleText,
            border: `1px solid ${theme.border}`,
          }}
          className="ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
      </div>
    </nav>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const bg = darkMode ? "#1A1612" : "#E8DDD0";

  return (
    <div
      style={{ background: bg }}
      className="min-h-screen flex flex-col transition-colors duration-300"
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-col flex-1">
        <Routes>
          <Route path="/" element={<TimerPage darkMode={darkMode} />} />
          <Route path="/timer" element={<TimerPage darkMode={darkMode} />} />
          <Route path="/stats" element={<StatsPage darkMode={darkMode} />} />
          <Route path="/city" element={<CityPage darkMode={darkMode} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
