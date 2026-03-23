import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rsmuycbunjxixlglrwc.supabase.co";
const SUPABASE_KEY = "sb_publishable_yAMBMuHdzyyBYlTpa9KbaA_zvie9vJE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [statusText, setStatusText] = useState("Startar...");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setStatusText("Hämtar fordon...");

      const { data, error, status, statusText } = await supabase
        .from("vehicles")
        .select("*")
        .order("name", { ascending: true });

      setStatusText(`HTTP ${status} ${statusText || ""}`.trim());

      if (error) {
        setErrorText(`Supabase-fel: ${error.message}`);
        return;
      }

      setVehicles(data || []);
      setStatusText(`Klart: ${data?.length || 0} fordon`);
    } catch (e) {
      setErrorText(`Nätverksfel: ${e.message}`);
      setStatusText("Kunde inte nå Supabase");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>Fordon från Supabase</p>

      <p>{statusText}</p>
      {errorText && <p style={{ color: "crimson" }}>{errorText}</p>}

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
            <div>Anrop: {v.call_sign || "-"}</div>
            <div>Regnr: {v.registration_number || "-"}</div>
            <div>Status: {v.status || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}