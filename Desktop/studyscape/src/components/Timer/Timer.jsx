import { useState, useEffect, useRef } from "react";
import { calculateXP } from "../../utils/xpCalculator";
import { addXP } from "../../firebase/firestore";

function Timer({
  darkMode,
  user,
  timerSeconds,
  setTimerSeconds,
  timerRunning,
  setTimerRunning,
  sessionSeconds,
  setSessionSeconds,
}) {
  const [xpEarned, setXpEarned] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const sessionEndedRef = useRef(false);

  const totalSeconds = 25 * 60;
  const circumference = 2 * Math.PI * 120;
  const progress = ((totalSeconds - timerSeconds) / totalSeconds) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const theme = {
    trackColor: darkMode ? "#2E2620" : "#C4A882",
    progressColor: darkMode ? "#D4B896" : "#7A4F2E",
    timeColor: darkMode ? "#D4B896" : "#3D2B1F",
    startBg: darkMode ? "#D4B896" : "#3D2B1F",
    startText: darkMode ? "#1A1612" : "#E8DDD0",
    resetBorder: darkMode ? "#A89880" : "#C4A882",
    resetText: darkMode ? "#A89880" : "#9C8878",
  };

  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) {
      if (!sessionEndedRef.current) {
        sessionEndedRef.current = true;
        handleSessionEnd();
      }
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((s) => s - 1);
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleSessionEnd = async () => {
    setTimerRunning(false);
    if (sessionSeconds > 0 && user) {
      const earned = calculateXP(sessionSeconds);
      setXpEarned(earned);
      setShowXP(true);
      await addXP(user.uid, sessionSeconds, earned);
      setTimeout(() => setShowXP(false), 3000);
    }
    setSessionSeconds(0);
    sessionEndedRef.current = false;
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
    setSessionSeconds(0);
    sessionEndedRef.current = false;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {showXP && (
        <div
          style={{
            background: darkMode ? "#2E2620" : "white",
            color: darkMode ? "#D4B896" : "#3D2B1F",
            border: `1px solid ${darkMode ? "#3D2E26" : "#E0D5C5"}`,
          }}
          className="px-6 py-3 rounded-full text-sm font-medium animate-bounce"
        >
          ✦ +{xpEarned} XP earned!
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="-rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={theme.trackColor}
            strokeWidth="6"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={theme.progressColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            style={{ color: theme.timeColor }}
            className="text-6xl font-light tracking-widest"
          >
            {formatTime(timerSeconds)}
          </span>
          {timerRunning && (
            <span
              style={{ color: theme.resetText }}
              className="text-xs mt-2 tracking-widest"
            >
              +{calculateXP(sessionSeconds)} XP
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setTimerRunning(!timerRunning)}
          style={{ background: theme.startBg, color: theme.startText }}
          className="px-10 py-3 rounded-full font-medium tracking-wide transition-all duration-200"
        >
          {timerRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          style={{
            border: `1px solid ${theme.resetBorder}`,
            color: theme.resetText,
          }}
          className="px-10 py-3 rounded-full font-medium tracking-wide transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
