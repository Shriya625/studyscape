import { useState } from "react";
import Timer from "./components/Timer/Timer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? "#1A1612" : "#E8DDD0",
    navBorder: darkMode ? "#2E2620" : "#D4C4B4",
    logo: darkMode ? "#D4B896" : "#3D2B1F",
    activeBtn: darkMode
      ? "border border-[#D4B896] text-[#D4B896]"
      : "bg-[#3D2B1F] text-[#E8DDD0]",
    navText: darkMode ? "#A89880" : "#9C8878",
    xpBg: darkMode ? "#2E2620" : "white",
    xpText: darkMode ? "#D4B896" : "#9C8878",
  };

  return (
    <div
      style={{ background: theme.bg }}
      className="min-h-screen flex flex-col transition-colors duration-300"
    >
      {/* Navbar */}
      <nav
        style={{
          background: theme.bg,
          borderBottom: `1px solid ${theme.navBorder}`,
        }}
        className="flex items-center justify-between px-10 py-5"
      >
        <h1
          style={{ color: theme.logo }}
          className="text-xl font-semibold tracking-wide"
        >
          Studyscape
        </h1>
        <div className="flex items-center gap-2">
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium ${theme.activeBtn}`}
          >
            Timer
          </button>
          <button
            style={{ color: theme.navText }}
            className="px-5 py-2 rounded-full text-sm font-medium"
          >
            Stats
          </button>
          <button
            style={{ color: theme.navText }}
            className="px-5 py-2 rounded-full text-sm font-medium"
          >
            City
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: theme.xpBg,
              color: theme.logo,
              border: `1px solid ${theme.navBorder}`,
            }}
            className="ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          >
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <p
          style={{ color: theme.navText }}
          className="text-xs tracking-widest uppercase mb-3"
        >
          Focus Session
        </p>
        <Timer darkMode={darkMode} />
        {/* XP Counter */}
        <div
          style={{
            background: theme.xpBg,
            color: theme.xpText,
            border: `1px solid ${theme.navBorder}`,
          }}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full"
        >
          <span className="font-semibold text-sm">✦ 0 XP</span>
          <span style={{ color: theme.navBorder }}>|</span>
          <span className="text-sm">Start studying to earn XP</span>
        </div>
      </div>
    </div>
  );
}

export default App;
