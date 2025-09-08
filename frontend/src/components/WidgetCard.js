import WeatherIcon from "./WeatherIcon";
import { normalizeWeather } from "../utils/weather";

export default function WidgetCard({ widget, onDelete, onRefresh }) {
  const w = normalizeWeather(widget?.weather || {});

  return (
    <div className="section">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <WeatherIcon summary={w.summary} />
          <div>
            <div className="font-semibold text-lg">{widget.location}</div>
            <div className="text-xs text-gray-500">
              {widget.createdAt ? new Date(widget.createdAt).toLocaleString() : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && <button onClick={onRefresh} className="btn" title="Refresh this widget">↻ Refresh</button>}
          <button onClick={onDelete} className="btn" title="Delete">Delete</button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div className="card p-3">
          <div className="text-xs text-gray-500">Temp</div>
          <div className="text-lg font-semibold">{w.temperature ?? "—"}°C</div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-gray-500">Feels like</div>
          <div className="text-lg font-semibold">{w.feelsLike ?? "—"}°C</div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-gray-500">Wind</div>
          <div className="text-lg font-semibold">{w.wind ?? "—"} km/h</div>
        </div>
      </div>
    </div>
  );
}
