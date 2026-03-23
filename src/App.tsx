import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rsmuycbunjxixlglrwc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbXV5Y2J1bmp4aXhsa2dscndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDY0NjksImV4cCI6MjA4OTQyMjQ2OX0.VV56N9CLuL1QELcq6CPYV3eOHiyfP0LEwR4kRJwEsMM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type Vehicle = {
  id: string;
  name: string;
  call_sign: string | null;
  registration_number: string | null;
  status: string | null;
};

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [debug, setDebug] = useState("Startar app...");
  const [error, setError] = useState("");

  useEffect(() => {
    runTest();
  }, []);

  async function runTest() {
    try {
      setDebug("Testar anslutning...");

      const restUrl = `${SUPABASE_URL}/rest/v1/vehicles?select=id,name,call_sign,registration_number,status`;

      const res = await fetch(restUrl, {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      setDebug(`HTTP ${res.status} ${res.statusText}`);

      const text = await res.text();

      if (!res.ok) {
        setError(`REST-fel: ${text}`);
        return;
      }

      const parsed = JSON.parse(text) as Vehicle[];
      setVehicles(parsed);
      setDebug(`✅ ${parsed.length} fordon hämtade`);
    } catch (e: any) {
      setError(`Nätverksfel: ${e?.message || "okänt fel"}`);
      setDebug("❌ Kunde inte nå Supabase");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>Fordon från Supabase</p>

      <p>{debug}</p>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <strong>{v.name}</strong>
            <div>Anrop: {v.call_sign ?? "-"}</div>
            <div>Regnr: {v.registration_number ?? "-"}</div>
            <div>Status: {v.status ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}