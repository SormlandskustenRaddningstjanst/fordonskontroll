export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Fordonskontroll</h1>

      <div>
        URL: {import.meta.env.VITE_SUPABASE_URL || "SAKNAS"}
      </div>

      <div>
        KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK" : "SAKNAS"}
      </div>
    </div>
  );
}