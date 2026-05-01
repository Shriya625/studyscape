import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { auth } from "./firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "./firebase/firestore";
import TimerPage from "./pages/TimerPage";
import StatsPage from "./pages/StatsPage";
import CityPage from "./pages/CityPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UsernamePage from "./pages/UsernamePage";

function Navbar({ darkMode, user, username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const theme = {
    bg: darkMode ? "#1A1612" : "#E8DDD0",
    border: darkMode ? "#2E2620" : "#D4C4B4",
    logo: darkMode ? "#D4B896" : "#3D2B1F",
    navText: darkMode ? "#A89880" : "#9C8878",
    card: darkMode ? "#2E2620" : "white",
    text: darkMode ? "#D4B896" : "#3D2B1F",
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        {user ? (
          <>
            {navBtn("Timer", "/timer")}
            {navBtn("Stats", "/stats")}
            {navBtn("City", "/city")}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  background: theme.card,
                }}
                className="px-4 py-2 rounded-full text-sm font-medium"
              >
                @{username}
              </button>
              {dropdownOpen && (
                <div
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                  }}
                  className="absolute right-0 mt-2 w-40 rounded-2xl overflow-hidden shadow-sm z-50"
                >
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                    style={{ color: theme.text }}
                    className="w-full px-4 py-3 text-left text-sm hover:opacity-70 transition-opacity"
                  >
                    ⚙ Settings
                  </button>
                  <div style={{ background: theme.border }} className="h-px" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    style={{ color: "#DC2626" }}
                    className="w-full px-4 py-3 text-left text-sm hover:opacity-70 transition-opacity"
                  >
                    → Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{ color: theme.navText }}
              className="px-5 py-2 rounded-full text-sm font-medium"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: darkMode ? "#D4B896" : "#3D2B1F",
                color: darkMode ? "#1A1612" : "#E8DDD0",
              }}
              className="px-5 py-2 rounded-full text-sm font-medium"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function DarkModeToggle({ darkMode, setDarkMode }) {
  const theme = {
    bg: darkMode ? "#2E2620" : "white",
    text: darkMode ? "#D4B896" : "#3D2B1F",
    border: darkMode ? "#3D2E26" : "#E0D5C5",
  };
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
      }}
      className="fixed bottom-6 right-6 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 z-50"
    >
      {darkMode ? "☀ Light" : "☾ Dark"}
    </button>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [hasUsername, setHasUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const timerEndRef = useRef(null);
  const sessionStartRef = useRef(null);
  const navigate = useNavigate();

  // This runs in App.jsx so it NEVER stops even when pages change
  useEffect(() => {
    if (!timerRunning) return;

    timerEndRef.current = Date.now() + timerSeconds * 1000;
    sessionStartRef.current = Date.now() - sessionSeconds * 1000;

    const interval = setInterval(() => {
      if (!timerEndRef.current || !sessionStartRef.current) return;
      const remaining = Math.round((timerEndRef.current - Date.now()) / 1000);
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
      if (remaining <= 0) {
        setTimerSeconds(0);
        setSessionSeconds(elapsed);
        setTimerRunning(false);
        clearInterval(interval);
        return;
      }
      setTimerSeconds(remaining);
      setSessionSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setHasUsername(true);
          setUsername(profile.username);
        } else {
          setHasUsername(false);
          setUsername("");
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    const { logOut } = await import("./firebase/auth");
    await logOut();
    setHasUsername(false);
    setUsername("");
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
    setSessionSeconds(0);
    navigate("/login");
  };

  const bg = darkMode ? "#1A1612" : "#E8DDD0";

  if (loading)
    return (
      <div
        style={{ background: bg }}
        className="min-h-screen flex items-center justify-center"
      >
        <p style={{ color: darkMode ? "#D4B896" : "#3D2B1F" }}>Loading...</p>
      </div>
    );

  if (user && !hasUsername)
    return (
      <div style={{ background: bg }} className="min-h-screen">
        <UsernamePage
          darkMode={darkMode}
          user={user}
          onComplete={(chosenUsername) => {
            setHasUsername(true);
            setUsername(chosenUsername);
          }}
        />
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    );

  const timerProps = {
    timerSeconds,
    setTimerSeconds,
    timerRunning,
    setTimerRunning,
    sessionSeconds,
    setSessionSeconds,
  };

  return (
    <div
      style={{ background: bg }}
      className="min-h-screen flex flex-col transition-colors duration-300"
    >
      <Navbar
        darkMode={darkMode}
        user={user}
        username={username}
        onLogout={handleLogout}
      />
      <div className="flex flex-col flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <TimerPage darkMode={darkMode} user={user} {...timerProps} />
            }
          />
          <Route
            path="/timer"
            element={
              <TimerPage darkMode={darkMode} user={user} {...timerProps} />
            }
          />
          <Route
            path="/stats"
            element={<StatsPage darkMode={darkMode} user={user} />}
          />
          <Route path="/city" element={<CityPage darkMode={darkMode} />} />
          <Route
            path="/login"
            element={
              <LoginPage
                darkMode={darkMode}
                onNavigate={(p) => navigate(`/${p}`)}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupPage
                darkMode={darkMode}
                onNavigate={(p) => navigate(`/${p}`)}
              />
            }
          />
        </Routes>
      </div>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
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
