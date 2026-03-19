import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import IntervalTabs from './components/IntervalTabs';
import VehicleList from './components/VehicleList';
import ChecklistView from './components/ChecklistView';
import { listChecklist, listVehicles, saveInspectionResults } from './lib/api';
import type { InspectionResultDraft, Interval, Vehicle, ChecklistItem } from './lib/types';

export default function App() {
  const [interval, setInterval] = useState<Interval>('DAY');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [results, setResults] = useState<Record<string, InspectionResultDraft>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    listVehicles()
      .then((data) => {
        setVehicles(data);
        if (!selectedVehicleId && data[0]) setSelectedVehicleId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedVehicleId) return;
    listChecklist(selectedVehicleId, interval).then((data) => {
      setItems(data);
      const next: Record<string, InspectionResultDraft> = {};
      data.forEach((item) => {
        next[item.id] = { checklist_item_id: item.id, passed: null, comment_text: '' };
      });
      setResults(next);
    });
  }, [selectedVehicleId, interval]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId]
  );

  function onToggle(itemId: string, passed: boolean) {
    setResults((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        checklist_item_id: itemId,
        passed,
      },
    }));
  }

  function onComment(itemId: string, comment: string) {
    setResults((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        checklist_item_id: itemId,
        comment_text: comment,
      },
    }));
  }

  async function onSave() {
    if (!selectedVehicleId) return;
    const payload = Object.values(results);
    await saveInspectionResults({ vehicleId: selectedVehicleId, interval, results: payload });
    const failed = payload.filter((item) => item.passed === false).length;
    setMessage(failed ? `Kontroll sparad. ${failed} avvikelse(r) registrerade.` : 'Kontroll sparad utan avvikelser.');
  }

  return (
    <main className="app-shell">
      <Header />
      <IntervalTabs value={interval} onChange={setInterval} />

      {loading ? (
        <section className="card">Laddar…</section>
      ) : (
        <div className="layout">
          <VehicleList vehicles={vehicles} selectedId={selectedVehicleId} onSelect={setSelectedVehicleId} />
          <section className="stack">
            <section className="card hero-card">
              <div>
                <div className="eyebrow">Valt fordon</div>
                <h2>{selectedVehicle?.name ?? 'Välj fordon'}</h2>
                <p className="muted">Kontrollintervall: {interval}</p>
              </div>
              <button className="primary" onClick={onSave} disabled={!selectedVehicleId}>Spara kontroll</button>
            </section>
            <ChecklistView items={items} results={results} onToggle={onToggle} onComment={onComment} />
            {message && <section className="card success">{message}</section>}
          </section>
        </div>
      )}
    </main>
  );
}
