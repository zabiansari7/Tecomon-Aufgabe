export default function WeatherIcon({ summary }) {
  const s = (summary || "").toLowerCase();
  let icon = "🌡️";
  if (s.includes("thunder") || s.includes("storm")) icon = "⛈️";
  else if (s.includes("snow") || s.includes("sleet")) icon = "❄️";
  else if (s.includes("rain") || s.includes("drizzle") || s.includes("shower")) icon = "🌧️";
  else if (s.includes("fog") || s.includes("mist") || s.includes("haze")) icon = "🌫️";
  else if (s.includes("cloud")) icon = "☁️";
  else if (s.includes("sun") || s.includes("clear")) icon = "☀️";
  return <span aria-label={summary || 'weather'} title={summary || ''} className="text-2xl">{icon}</span>;
}