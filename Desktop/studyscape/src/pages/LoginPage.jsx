import { useState } from "react";
import { signIn, signInWithGoogle } from "../firebase/auth";

function LoginPage({ darkMode, onNavigate }) {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      onNavigate("timer");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
      onNavigate("timer");
    } catch {
      setError("Google sign in failed. Please try again.");
    }
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
          Welcome back
        </h2>
        <p
          style={{ color: theme.subtext }}
          className="text-center text-sm mb-8 tracking-wide"
        >
          Sign in to continue building your city
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            placeholder="Password"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div style={{ background: theme.border }} className="flex-1 h-px" />
          <span style={{ color: theme.subtext }} className="text-xs">
            or
          </span>
          <div style={{ background: theme.border }} className="flex-1 h-px" />
        </div>

        <button
          onClick={handleGoogle}
          style={{ border: `1px solid ${theme.border}`, color: theme.text }}
          className="w-full py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2"
        >
          <span>G</span> Continue with Google
        </button>

        <p
          style={{ color: theme.subtext }}
          className="text-center text-sm mt-6"
        >
          Don't have an account?{" "}
          <button
            onClick={() => onNavigate("signup")}
            style={{ color: theme.text }}
            className="font-medium underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
