import { useState, useEffect } from "react";
import { subscribeToProfile } from "../firebase/firestore";
import {
  getBuildingLevel,
  getXPToNextLevel,
  BUILDING_THRESHOLDS,
} from "../utils/xpCalculator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatsPage({ darkMode, user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: darkMode ? "#1A1612" : "#E8DDD0",
    card: darkMode ? "#2E2620" : "white",
    text: darkMode ? "#D4B896" : "#3D2B1F",
    subtext: darkMode ? "#A89880" : "#9C8878",
    border: darkMode ? "#3D2E26" : "#E0D5C5",
    track: darkMode ? "#3D2E26" : "#EDE8E0",
    progress: darkMode ? "#D4B896" : "#7A4F2E",
    badge: darkMode ? "#3D2E26" : "#F5F0E8",
  };

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProfile(user.uid, (data) => {
      setProfile(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const formatTime = (seconds) => {
    if (!seconds) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const getProgressPercent = (xp) => {
    const level = getBuildingLevel(xp);
    const thresholds = Object.values(BUILDING_THRESHOLDS);
    const current = thresholds[level - 1] || 0;
    const next = thresholds[level] || thresholds[thresholds.length - 1];
    return Math.min(((xp - current) / (next - current)) * 100, 100);
  };

  // Generate dummy weekly data based on real total
  const getWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const total = profile?.totalStudyTime || 0;
    const avg = Math.floor(total / 7 / 60);
    return days.map((day) => ({
      day,
      minutes: Math.max(0, avg + Math.floor(Math.random() * 20 - 10)),
    }));
  };

  // Generate current month heatmap
  const getMonthDays = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();
    const avgPerDay = profile?.totalStudyTime
      ? Math.floor(profile.totalStudyTime / 60 / Math.max(today, 1))
      : 0;

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isPast = day <= today;
      const mins = isPast ? Math.max(0, avgPerDay + Math.floor(Math.random() * 30 - 15)) : 0;
      return { day, mins };
    });
  };

  const getHeatColor = (mins) => {
    if (mins === 0) return darkMode ? "#2E2620" : "#EDE8E0";
    if (mins < 30) return darkMode ? "#6B4C2A" : "#C4A882";
    if (mins < 60) return darkMode ? "#A0693A" : "#A07850";
    if (mins < 120) return darkMode ? "#C4894A" : "#7A4F2E";
    return darkMode ? "#D4B896" : "#3D2B1F";
  };

  const xp = profile?.xp || 0;
  const level = getBuildingLevel(xp);
  const xpToNext = getXPToNextLevel(xp);
  const progressPercent = getProgressPercent(xp);
  const totalHours = Math.floor((profile?.totalStudyTime || 0) / 3600);
  const streak = profile?.streak || 0;
  const sessions = profile?.sessions || 0;
  const avgDaily = sessions > 0
    ? formatTime(Math.floor((profile?.totalStudyTime || 0) / Math.max(streak, 1)))
    : "0m";

  const achievements = [
    { icon: "🔥", label: "7 Day Streak", earned: streak >= 7 },
    { icon: "⏱️", label: "10 Hours", earned: totalHours >= 10 },
    { icon: "💯", label: "100 Hours", earned: totalHours >= 100 },
    { icon: "⚡", label: "Level 2", earned: level >= 2 },
    { icon: "🏙️", label: "Level 3", earned: level >= 3 },
    { icon: "🌆", label: "Level 5", earned: level >= 5 },
  ];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p style={{ color: theme.subtext }} className="text-sm">Loading your stats...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p style={{ color: theme.subtext }} className="text-sm">Sign in to see your stats</p>
      </div>
    );

  const monthDays = getMonthDays();
  const weeklyData = getWeeklyData();

  return (
    <div className="flex flex-col items-center px-6 py-10 gap-6 max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="text-center">
        <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-1">
          Your Progress
        </p>
        <p style={{ color: theme.subtext }} className="text-sm italic">
          Consistency compounds. Keep going.
        </p>
      </div>

      {/* Profile Card */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full p-6 rounded-3xl flex items-center justify-between">
        <div>
          <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-1">Profile</p>
          <p style={{ color: theme.text }} className="text-xl font-medium">@{profile?.username || "—"}</p>
          <p style={{ color: theme.subtext }} className="text-xs mt-1">{profile?.email}</p>
        </div>
        <div style={{ background: theme.track }} className="w-14 h-14 rounded-full flex items-center justify-center">
          <p style={{ color: theme.text }} className="text-lg font-semibold">L{level}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="w-full grid grid-cols-2 gap-4">
        {[
          { label: "Total Study Time", value: formatTime(profile?.totalStudyTime) },
          { label: "Daily Streak", value: `${streak} day${streak !== 1 ? "s" : ""}` },
          { label: "Total XP", value: xp.toLocaleString() },
          { label: "Sessions", value: sessions },
        ].map(({ label, value }) => (
          <div key={label}
            style={{ background: theme.card, border: `1px solid ${theme.border}` }}
            className="p-5 rounded-3xl">
            <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-2">{label}</p>
            <p style={{ color: theme.text }} className="text-2xl font-light">{value}</p>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full p-6 rounded-3xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase">XP Progress</p>
          <p style={{ color: theme.subtext }} className="text-xs">
            {xpToNext ? `${xpToNext} XP to Level ${level + 1}` : "Max Level! 🏆"}
          </p>
        </div>
        <div style={{ background: theme.track }} className="w-full h-2 rounded-full overflow-hidden">
          <div style={{ background: theme.progress, width: `${progressPercent}%` }}
            className="h-full rounded-full transition-all duration-700" />
        </div>
        <div className="flex justify-between">
          <p style={{ color: theme.subtext }} className="text-xs">Level {level}</p>
          <p style={{ color: theme.subtext }} className="text-xs">Level {Math.min(level + 1, 5)}</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full p-6 rounded-3xl">
        <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-4">
          Weekly Study (minutes)
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weeklyData} barSize={24}>
            <XAxis dataKey="day" axisLine={false} tickLine={false}
              tick={{ fill: theme.subtext, fontSize: 11 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, color: theme.text, fontSize: 12 }}
              cursor={{ fill: theme.track }}
            />
            <Bar dataKey="minutes" fill={theme.progress} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Heatmap */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full p-6 rounded-3xl">
        <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-4">
          This Month
        </p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
          {monthDays.map(({ day, mins }) => (
            <div key={day} title={`Day ${day}: ${mins} min`}
              style={{ background: getHeatColor(mins), aspectRatio: "1" }}
              className="rounded-md flex items-center justify-center">
              <span style={{ color: theme.subtext, fontSize: 9 }}>{day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <p style={{ color: theme.subtext }} className="text-xs">
            Less
          </p>
          <div className="flex gap-1 items-center">
            {["#EDE8E0", "#C4A882", "#A07850", "#7A4F2E", "#3D2B1F"].map((c) => (
              <div key={c} style={{ background: c, width: 12, height: 12, borderRadius: 3 }} />
            ))}
          </div>
          <p style={{ color: theme.subtext }} className="text-xs">More</p>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full p-6 rounded-3xl">
        <p style={{ color: theme.subtext }} className="text-xs tracking-widest uppercase mb-4">
          Achievements
        </p>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map(({ icon, label, earned }) => (
            <div key={label}
              style={{
                background: earned ? theme.badge : theme.track,
                border: `1px solid ${theme.border}`,
                opacity: earned ? 1 : 0.4,
              }}
              className="p-3 rounded-2xl flex flex-col items-center gap-1">
              <span className="text-xl">{icon}</span>
              <p style={{ color: theme.text }} className="text-xs text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state if no sessions */}
      {sessions === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}` }}
          className="w-full p-8 rounded-3xl text-center">
          <p className="text-3xl mb-3">🏙️</p>
          <p style={{ color: theme.text }} className="text-lg font-light mb-1">Your city awaits</p>
          <p style={{ color: theme.subtext }} className="text-sm">
            Start your first study session to begin building
          </p>
        </div>
      )}

    </div>
  );
}

export default StatsPage;