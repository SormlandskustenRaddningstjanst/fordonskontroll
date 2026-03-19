import type { Interval } from '../lib/types';

const items: { value: Interval; label: string }[] = [
  { value: 'DAY', label: 'Dag' },
  { value: 'WEEK', label: 'Vecka' },
  { value: 'MONTH', label: 'Månad' },
  { value: 'QUARTER', label: 'Kvartal' },
];

export default function IntervalTabs({ value, onChange }: { value: Interval; onChange: (v: Interval) => void; }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item.value}
          className={item.value === value ? 'tab active' : 'tab'}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
