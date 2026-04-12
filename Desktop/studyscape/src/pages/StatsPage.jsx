function StatsPage({ darkMode }) {
  const theme = {
    text: darkMode ? "#D4B896" : "#3D2B1F",
    subtext: darkMode ? "#A89880" : "#9C8878",
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <p
        style={{ color: theme.subtext }}
        className="text-xs tracking-widest uppercase"
      >
        Your Progress
      </p>
      <h2 style={{ color: theme.text }} className="text-4xl font-light">
        Stats coming soon
      </h2>
    </div>
  );
}

export default StatsPage;
