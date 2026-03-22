import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    const { data, error } = await supabase.from("vehicles").select("*");
    if (error) console.error(error);
    else setVehicles(data || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Fordonskontroll</h1>

      <h2>Fordon</h2>

      {vehicles.map((v) => (
        <div key={v.id} style={{ marginBottom: 10 }}>
          🚒 {v.name}
        </div>
      ))}
    </div>
  );
}