import { useState } from "react";
import { signUp } from "../firebase/auth";

function SignupPage({ darkMode, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      onNavigate("timer");
    } catch {
      setError("Could not create account. Try a stronger password.");
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
          Create account
        </h2>
        <p
          style={{ color: theme.subtext }}
          className="text-center text-sm mb-8 tracking-wide"
        >
          Start building your city today
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: theme.input,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: theme.input,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: theme.btnBg, color: theme.btnText }}
            className="w-full py-3 rounded-full font-medium tracking-wide mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p
          style={{ color: theme.subtext }}
          className="text-center text-sm mt-6"
        >
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            style={{ color: theme.text }}
            className="font-medium underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
