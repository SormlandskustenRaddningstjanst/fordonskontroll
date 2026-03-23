import { useEffect, useState } from "react";

type Vehicle = {
  id: string;
  name: string;
  call_sign: string | null;
  registration_number: string | null;
  status: string | null;
  type: string | null;
};

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Släckbil 3010",
    call_sign: "3010",
    registration_number: "ABC123",
    status: "IN_SERVICE",
    type: "Släckbil",
  },
  {
    id: "2",
    name: "Släckbil 3030",
    call_sign: "3030",
    registration_number: "DEF456",
    status: "IN_SERVICE",
    type: "Släckbil",
  },
  {
    id: "3",
    name: "IL-bil 3080",
    call_sign: "3080",
    registration_number: "GHI789",
    status: "IN_SERVICE",
    type: "IL-bil",
  },
  {
    id: "4",
    name: "Båttrailer 3110",
    call_sign: "3110",
    registration_number: "JKL012",
    status: "IN_SERVICE_WITH_DEVIATION",
    type: "Trailer",
  },
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusText, setStatusText] = useState("Startar...");

  useEffect(() => {
    setStatusText("Laddar mockade fordon...");
    const timer = setTimeout(() => {
      setVehicles(mockVehicles);
      setStatusText(`Klart: ${mockVehicles.length} fordon`);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

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
        <p>Mockad fordonslista</p>
        <p>{statusText}</p>

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
              <div>Typ: {vehicle.type ?? "-"}</div>
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