// src/app.tsx
import React, { useEffect, useState } from 'react';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Vehicle = {
  id: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  [key: string]: any;
};

export default function App(): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Init: check active session & subscribe to auth changes
  useEffect(() => {
    const s = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch vehicles only when authenticated
  useEffect(() => {
    if (user) {
      fetchVehicles();
    } else {
      setVehicles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchVehicles() {
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from<Vehicle>('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }
      setVehicles(data ?? []);
    } catch (err: any) {
      console.error('Error fetching vehicles:', err);
      setMessage(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email }); // magic link by default
      if (error) throw error;
      setMessage('Magic link sent to your email. Check your inbox.');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setMessage(err.message ?? 'Failed to send magic link.');
    }
  }

  async function signInWithPassword() {
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session ?? null);
      setUser(data.user ?? null);
      setMessage('Signed in.');
    } catch (err: any) {
      console.error('Password sign in error:', err);
      setMessage(err.message ?? 'Failed to sign in.');
    }
  }

  async function signUpWithPassword() {
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage('Signup initiated. Check your email for confirmation if required.');
      setSession(data.session ?? null);
      setUser(data.user ?? null);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setMessage(err.message ?? 'Failed to sign up.');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setVehicles([]);
    setMessage('Signed out.');
  }

  // Simple UI
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Supabase + React (Vite) — Vehicles</h1>

      <section style={{ marginBottom: 20, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        {user ? (
          <div>
            <p>
              Signed in as <strong>{user.email}</strong>
            </p>
            <button onClick={signOut}>Sign out</button>
            <button onClick={fetchVehicles} style={{ marginLeft: 8 }}>
              Refresh Vehicles
            </button>
          </div>
        ) : (
          <div>
            <h2>Sign in</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: 8, flex: 1 }}
              />
              <input
                type="password"
                placeholder="Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: 8, width: 220 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={signInWithEmail}>Send Magic Link</button>
              <button onClick={signInWithPassword}>Sign In (password)</button>
              <button onClick={signUpWithPassword}>Sign Up</button>
            </div>
            <p style={{ marginTop: 8, color: '#555' }}>
              Note: after we changed policies, anonymous/public access is blocked — you must be signed in to read the
              vehicles table.
            </p>
          </div>
        )}
      </section>

      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2>Vehicles</h2>
        {message && <p style={{ color: 'crimson' }}>{message}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          vehicles.length ? (
            <ul>
              {vehicles.map((v) => (
                <li key={v.id}>
                  <strong>{v.make ?? '—'}</strong> {v.model ?? ''} {v.year ? `(${v.year})` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No vehicles found.</p>
          )
        ) : (
          <p>Please sign in to view vehicles.</p>
        )}
      </section>
    </div>
  );
}