
export function normalizeWeather(w = {}) {
  const temperature = w.temperature ?? w.temp ?? w.temperature_2m ?? null;
  const feelsLike = w.feelsLike ?? w.apparent_temperature ?? temperature ?? null;
  const wind = w.windSpeed ?? w.wind_speed ?? w.windspeed ?? null;
  const summary = w.summary ?? w.condition ?? w.weathercode_text ?? null;
  return { temperature, feelsLike, wind, summary };
}