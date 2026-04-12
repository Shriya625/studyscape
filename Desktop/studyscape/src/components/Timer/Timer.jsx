import { useState, useEffect } from "react";

function Timer({ darkMode }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const totalSeconds = 25 * 60;
  const circumference = 2 * Math.PI * 120;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
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
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-10">
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
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{ background: theme.startBg, color: theme.startText }}
          className="px-10 py-3 rounded-full font-medium tracking-wide transition-all duration-200"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSeconds(25 * 60);
          }}
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
