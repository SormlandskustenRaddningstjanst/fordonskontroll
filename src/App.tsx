import { useEffect, useState } from "react";

export default function App() {
  const [text, setText] = useState("Startar test...");

  useEffect(() => {
    run();
  }, []);

  async function run() {
    try {
      const res = await fetch("https://rsmuycbunjxixlglrwc.supabase.co/rest/v1/");
      setText(`HTTP ${res.status} ${res.statusText}`);
    } catch (e: any) {
      setText(`FETCH FAIL: ${e?.message || "okänt fel"}`);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>{text}</p>
    </div>
  );
}