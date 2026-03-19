import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorText(error.message);
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ padding: 16 }}>
      <h2>Logga in</h2>

      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 12, width: "100%", padding: 12 }}
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 12, width: "100%", padding: 12 }}
      />

      <button type="submit" disabled={loading} style={{ padding: 12, width: "100%" }}>
        {loading ? "Loggar in..." : "Logga in"}
      </button>

      {errorText ? <p style={{ color: "red" }}>{errorText}</p> : null}
    </form>
  );
}
