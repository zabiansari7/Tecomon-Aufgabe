import { useEffect, useState } from "react";
import api from "../utils/api";
import WidgetCard from "../components/WidgetCard";
import WidgetForm from "../components/WidgetForm";

export default function Home() {
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickErr = (e, fb) => e?.response?.data?.error || e?.message || fb;

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/widgets");
      setWidgets(res.data || []);
    } catch (e) {
      setError(pickErr(e, "Failed to load widgets"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addWidget(location) {
    try { await api.post("/widgets", { location }); await load(); }
    catch (e) { setError(pickErr(e, "Failed to add")); }
  }

  async function deleteWidget(id) {
    try { await api.delete(`/widgets/${id}`); await load(); }
    catch (e) { setError(pickErr(e, "Failed to delete")); }
  }

  return (
    <main className="container py-8 space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Weather Widgets</h1>
        <button onClick={load} className="btn" title="Refresh all">↻ Refresh All</button>
      </header>

      <section className="section">
        <WidgetForm onAdd={addWidget} />
      </section>

      {error && <div className="section border-red-200 bg-red-50 text-red-700">{error}</div>}

      <section className="space-y-3">
        {loading ? (
          <div className="section animate-pulse">Loading...</div>
        ) : widgets.length === 0 ? (
          <div className="section text-gray-600">No widgets yet. Add a city above.</div>
        ) : (
          widgets.map((w) => (
            <WidgetCard
              key={w._id}
              widget={w}
              onDelete={() => deleteWidget(w._id)}
              onRefresh={load}
            />
          ))
        )}
      </section>
    </main>
  );
}
