import { useState } from "react";
import { isUsernameTaken, createUserProfile } from "../firebase/firestore";

function UsernamePage({ darkMode, user, onComplete }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: darkMode ? "#1A1612" : "#E8DDD0",
    card: darkMode ? "#2E2620" : "white",
    text: darkMode ? "#D4B896" : "#3D2B1F",
    subtext: darkMode ? "#A89880" : "#9C8878",
    input: darkMode ? "#1A1612" : "#F5F0E8",
    border: darkMode ? "#3D2E26" : "#E0D5C5",
    btnBg: darkMode ? "#D4B896" : "#3D2B1F",
    btnText: darkMode ? "#1A1612" : "#E8DDD0",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate username
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (username.length > 20) {
      setError("Username must be under 20 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Only letters, numbers and underscores allowed.");
      return;
    }

    setLoading(true);
    try {
      const taken = await isUsernameTaken(username);
      if (taken) {
        setError("That username is already taken. Try another!");
        setLoading(false);
        return;
      }
      await createUserProfile(user.uid, username, user.email);
      onComplete(username);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{ background: theme.bg }}
      className="min-h-screen flex items-center justify-center"
    >
      <div
        style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        className="w-full max-w-md p-10 rounded-3xl"
      >
        <h2
          style={{ color: theme.text }}
          className="text-3xl font-light text-center mb-2"
        >
          Choose your username
        </h2>
        <p
          style={{ color: theme.subtext }}
          className="text-center text-sm mb-8 tracking-wide"
        >
          This will be your identity in Studyscape
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div style={{ position: "relative" }}>
            <span
              style={{
                color: theme.subtext,
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              @
            </span>
            <input
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                background: theme.input,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                paddingLeft: "32px",
              }}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            />
          </div>
          <p style={{ color: theme.subtext }} className="text-xs">
            Letters, numbers and underscores only. 3–20 characters.
          </p>
          <button
            type="submit"
            disabled={loading}
            style={{ background: theme.btnBg, color: theme.btnText }}
            className="w-full py-3 rounded-full font-medium tracking-wide mt-2"
          >
            {loading ? "Checking..." : "Claim username"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernamePage;
