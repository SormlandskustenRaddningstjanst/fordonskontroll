import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Vehicle = {
  id: string;
  name: string;
  call_sign: string | null;
  registration_number: string | null;
  status: string | null;
};

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusText, setStatusText] = useState("VERSION LIVE 2118");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setStatusText("Hämtar fordon från Supabase...");

      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name, call_sign, registration_number, status")
        .order("name", { ascending: true });

      if (error) {
        setErrorText(`Supabase-fel: ${error.message}`);
        return;
      }

      setVehicles(data ?? []);
      setStatusText(`Klart: ${data?.length ?? 0} fordon`);
    } catch (e: any) {
      setErrorText(`Nätverksfel: ${e?.message || "okänt fel"}`);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fordonskontroll</h1>
      <p>{statusText}</p>
      {errorText ? <p style={{ color: "crimson" }}>{errorText}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <strong>{vehicle.name}</strong>
            <div>Anrop: {vehicle.call_sign ?? "-"}</div>
            <div>Regnr: {vehicle.registration_number ?? "-"}</div>
            <div>Status: {vehicle.status ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}