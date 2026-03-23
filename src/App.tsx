import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  owner: string;
};

export default function App(): JSX.Element {
  const [user, setUser] = useState(supabase.auth.getUser ? null : null);
  const [email, setEmail] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Get initial auth state
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(user ?? null);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch vehicles for current user
  useEffect(() => {
    if (!user) {
      setVehicles([]);
      return;
    }

    let mounted = true;
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from<Vehicle>('vehicles')
        .select('*')
        .eq('owner', user.id)
        .order('created_at', { ascending: false });
      setLoading(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      if (mounted && data) setVehicles(data);
    };
    fetchVehicles();

    // Realtime subscription
    const channel = supabase.channel(`public:vehicles:owner=${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles', filter: `owner=eq.${user.id}` }, (payload) => {
        // Simple handling: refetch on changes
        fetchVehicles();
      })
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the login link.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVehicles([]);
  };

  const createVehicle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      setMessage('Sign in first');
      return;
    }
    if (!make || !model) {
      setMessage('Make and model are required');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('vehicles').insert([
      { make, model, owner: user.id },
    ]);
    setLoading(false);
    if (error) setMessage(error.message);
    else {
      setMake('');
      setModel('');
      setMessage('Vehicle created');
      // refetch done by realtime subscription / effect
    }
  };

  const deleteVehicle = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage('Vehicle deleted');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Vehicles App</h1>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Signed in as {user.email}</span>
                <button
                  onClick={signOut}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-600">Not signed in</span>
            )}
          </div>
        </header>

        {message && (
          <div className="mb-4 text-sm text-blue-600">
            {message}
          </div>
        )}

        {!user ? (
          <form onSubmit={signIn} className="space-y-4 mb-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Magic Link
            </button>
          </form>
        ) : (
          <div className="mb-6">
            <form onSubmit={createVehicle} className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="block text-sm text-gray-700">Make</label>
                <input
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Model</label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <button
                  onClick={createVehicle}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {loading ? 'Saving...' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        )}

        <section>
          <h2 className="text-xl font-medium mb-3">My Vehicles</h2>
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {!loading && vehicles.length === 0 && (
            <div className="text-sm text-gray-500">No vehicles yet.</div>
          )}
          <ul className="space-y-3">
            {vehicles.map((v) => (
              <li key={v.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-semibold">{v.make} {v.model}</div>
                  <div className="text-xs text-gray-500">id: {v.id}</div>
                </div>
                <div>
                  <button
                    onClick={() => deleteVehicle(v.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}