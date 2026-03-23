import { useState } from "react";

type Vehicle = {
  id: string;
  name: string;
};

const vehicles: Vehicle[] = [
  { id: "1", name: "Släckbil 3010" },
  { id: "2", name: "Släckbil 3030" },
  { id: "3", name: "IL-bil 3080" },
];

const checklists: Record<string, string[]> = {
  dag: [
    "Kontrollera bränsle",
    "Kontrollera olja",
    "Kontrollera lampor",
  ],
  vecka: [
    "Testa pumpar",
    "Kontrollera slangar",
    "Kontrollera batteri",
  ],
  månad: [
    "Servicekontroll",
    "Testa utrustning",
    "Rengör fordon",
  ],
  kvartal: [
    "Full genomgång",
    "Säkerhetskontroll",
    "Dokumentation",
  ],
};

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(item: string) {
    setChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  }

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h1>Fordonskontroll</h1>

      {/* Välj fordon */}
      <h3>Välj fordon</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setSelectedVehicle(v.id);
              setChecked({});
            }}
            style={{
              padding: 10,
              borderRadius: 8,
              border: selectedVehicle === v.id ? "2px solid green" : "1px solid #ccc",
              background: "#fff",
            }}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* Välj typ */}
      {selectedVehicle && (
        <>
          <h3 style={{ marginTop: 20 }}>Typ av kontroll</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {["dag", "vecka", "månad", "kvartal"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setChecked({});
                }}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border:
                    selectedType === type
                      ? "2px solid blue"
                      : "1px solid #ccc",
                  background: "#fff",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Checklista */}
      {selectedType && (
        <>
          <h3 style={{ marginTop: 20 }}>Checklista</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {checklists[selectedType].map((item) => (
              <label
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 10,
                  background: "#fff",
                  borderRadius: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked[item] || false}
                  onChange={() => toggle(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </>
      )}

      {/* Klar-status */}
      {selectedType && (
        <p style={{ marginTop: 20 }}>
          Klara:{" "}
          {
            Object.values(checked).filter(Boolean).length
          }{" "}
          / {checklists[selectedType].length}
        </p>
      )}
    </div>
  );
}