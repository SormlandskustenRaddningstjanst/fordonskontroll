export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f8",
        padding: 16
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>Fordonskontroll</h1>
        <p>Appen är nu publicerad korrekt via GitHub Pages.</p>

        <div style={{ marginTop: 16 }}>
          <strong>Status:</strong>
          <div>✅ Frontend fungerar</div>
          <div>✅ Vite build fungerar</div>
          <div>✅ GitHub Pages deploy fungerar</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <strong>Nästa steg:</strong>
          <div>1. Koppla Supabase</div>
          <div>2. Lägg till inloggning</div>
          <div>3. Hämta fordon från databasen</div>
        </div>
      </div>
    </div>
  );
}