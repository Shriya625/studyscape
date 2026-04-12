import Timer from "../components/Timer/Timer";

function TimerPage({ darkMode }) {
  const theme = {
    text: darkMode ? "#A89880" : "#9C8878",
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <p
        style={{ color: theme.text }}
        className="text-xs tracking-widest uppercase mb-3"
      >
        Focus Session
      </p>
      <Timer darkMode={darkMode} />
    </div>
  );
}

export default TimerPage;
