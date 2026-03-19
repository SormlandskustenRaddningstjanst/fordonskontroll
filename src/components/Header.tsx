export default function Header() {
  return (
    <header className="header">
      <div>
        <div className="eyebrow">Sörmlandskustens Räddningstjänst</div>
        <h1>Fordonskontroll</h1>
      </div>
      <div className="header-card">
        <div className="header-label">Intervall</div>
        <div className="header-value">Dag / Vecka / Månad / Kvartal</div>
      </div>
    </header>
  );
}
