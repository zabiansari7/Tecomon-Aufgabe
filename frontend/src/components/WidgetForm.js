import { useState } from "react";
export default function WidgetForm({ onAdd }) {
  const [location, setLocation] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!location.trim()) return;
    onAdd(location.trim());
    setLocation("");
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="input"
        placeholder="City e.g. Frankfurt"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">Add</button>
    </form>
  );
}