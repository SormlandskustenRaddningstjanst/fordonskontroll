import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Vehicle = {
  id: string;
  name: string;
  call_sign: string | null;
  status: string | null;
};

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, name, call_sign, status")
      .order("name");

    if (error) {
      setError(error.message);
      return;
    }

    setVehicles(data ?? []);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>Fordon från Supabase</p>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

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
            <div>{v.call_sign ?? "Saknar anropsnummer"}</div>
            <div>Status: {v.status ?? "Okänd"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}