# Fordonskontroll mobile app

Mobilvänlig webbapp för fordons- och materialkontroller.

## Start
1. Kopiera `.env.example` till `.env`
2. Lägg in `VITE_SUPABASE_URL` och `VITE_SUPABASE_ANON_KEY`
3. Kör:

```bash
npm install
npm run dev
```

## Ingår
- fordonslista
- intervall: dag, vecka, månad, kvartal
- checklista med instruktioner
- kommentar per punkt
- spara kontroll
- mockdata om Supabase inte är kopplat ännu

## Nästa steg
- Supabase Auth
- riktig inspektionslogik mot tabellerna
- avvikelseskapande
- uppladdning av foto/video
- instruktionsfilmer från Storage
