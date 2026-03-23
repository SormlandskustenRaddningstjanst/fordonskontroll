import { useEffect, useState } from "react";

const SUPABASE_URL = "https://rsmuycbunjxixlglrwc.supabase.co";
const SUPABASE_KEY = "sb_publishable_yAMBMuHdzyyBYlTpa9KbaA_zvie9vJE";

export default function App() {
  const [statusText, setStatusText] = useState("Startar...");
  const [bodyText, setBodyText] = useState("");

  useEffect(() => {
    runTest();
  }, []);

  async function runTest() {
    try {
      setStatusText("Testar direkt fetch mot Supabase REST...");

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/vehicles?select=id,name,call_sign,registration_number,status`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = await res.text();
      setStatusText(`HTTP ${res.status} ${res.statusText}`);
      setBodyText(text);
    } catch (e: any) {
      setStatusText("FETCH FAIL");
      setBodyText(e?.message || "okänt fel");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>{statusText}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{bodyText}</pre>
    </div>
  );
}