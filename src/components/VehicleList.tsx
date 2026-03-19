import Badge from './Badge';
import type { Vehicle } from '../lib/types';

function tone(status: Vehicle['status']) {
  if (status === 'IN_SERVICE') return 'good';
  if (status === 'IN_SERVICE_WITH_DEVIATION') return 'warn';
  return 'danger';
}

function label(status: Vehicle['status']) {
  if (status === 'IN_SERVICE') return 'I tjänst';
  if (status === 'IN_SERVICE_WITH_DEVIATION') return 'Avvikelse';
  if (status === 'NOT_READY') return 'Ej utryckningsklar';
  if (status === 'UNDER_REPAIR') return 'Under åtgärd';
  return 'Ur tjänst';
}

export default function VehicleList({
  vehicles,
  selectedId,
  onSelect,
}: {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="card">
      <h2>Fordon</h2>
      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            className={selectedId === vehicle.id ? 'vehicle-item active' : 'vehicle-item'}
            onClick={() => onSelect(vehicle.id)}
          >
            <div>
              <strong>{vehicle.name}</strong>
              <div className="muted">{vehicle.registration_number || vehicle.call_sign || 'Ingen märkning'}</div>
            </div>
            <Badge tone={tone(vehicle.status)}>{label(vehicle.status)}</Badge>
          </button>
        ))}
      </div>
    </section>
  );
}
