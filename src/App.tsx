import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚠️ TEMP: hårdkoda för att säkerställa att det funkar
const SUPABASE_URL = "https://rsmuycbunjxixlglrwc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbXV5Y2J1bmp4aXhsa2dscndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDY0NjksImV4cCI6MjA4OTQyMjQ2OX0.VV56N9CLuL1QELcq6CPYV3eOHiyfP0LEwR4kRJwEsMM"

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
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setDebug("🔄 Hämtar data...");

      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name, call_sign, registration_number, status");

      if (error) {
        setError("Supabase-fel: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        setDebug("⚠️ Inga fordon hittades");
      } else {
        setDebug(`✅ ${data.length} fordon hämtade`);
      }

      setVehicles(data || []);
    } catch (e: any) {
      setError("Nätverksfel: " + e.message);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>Fordon från Supabase</p>

      <p>{debug}</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
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