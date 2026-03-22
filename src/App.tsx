import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

type Vehicle = {
  id: string;
  name: string;
  call_sign: string | null;
  registration_number: string | null;
  status: string | null;
};

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("vehicles")
      .select("id, name, call_sign, registration_number, status")
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setVehicles(data ?? []);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 16,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1>Fordonskontroll</h1>
        <p>Fordon från Supabase</p>

        {loading ? <p>Laddar...</p> : null}
        {error ? <p style={{ color: "crimson" }}>Fel: {error}</p> : null}

        <div style={{ display: "grid", gap: 12 }}>
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {vehicle.name}
              </div>
              <div>Anrop: {vehicle.call_sign ?? "-"}</div>
              <div>Regnr: {vehicle.registration_number ?? "-"}</div>
              <div>Status: {vehicle.status ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}