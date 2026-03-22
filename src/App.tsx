import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(url, key);

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
      setError("");
      setDebug(
        `URL=${url || "saknas"} | KEY=${key ? "ok" : "saknas"} | ONLINE=${navigator.onLine}`
      );

      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name, call_sign, registration_number, status")
        .limit(10);

      if (error) {
        setError(`Supabase-fel: ${error.message}`);
        return;
      }

      setVehicles(data ?? []);
    } catch (e: any) {
      setError(`Nätverksfel: ${e?.message || "okänt fel"}`);
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