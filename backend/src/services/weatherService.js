
const axios = require("axios");
const cache = require("../cache/redisClient");

const WEATHER_TTL = parseInt(process.env.WEATHER_TTL || "600", 10);

function normName(s = "") {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}
function round3(n) {
  return Math.round(Number(n) * 1000) / 1000;
}
async function cacheWrap(key, ttl, fetcher) {
  const hit = await cache.get(key);
  if (hit) return hit;
  const val = await fetcher();
  await cache.set(key, val, ttl);
  return val;
}

function codeToText(code) {
  const m = {
    0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
    61: "Rain", 63: "Moderate rain", 65: "Heavy rain", 71: "Snow",
    80: "Rain showers", 95: "Thunderstorm",
  };
  return m[code] || "—";
}

async function getWeather(input = {}) {
  let lat = input.latitude;
  let lon = input.longitude;
  let label = input.name ? normName(input.name) : "";

  if ((!lat || !lon) && label) {
    try {
      const g = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: label, count: 1, format: "json" },
        timeout: 8000,
      });
      const r = g.data?.results?.[0];
      if (r) { lat = r.latitude; lon = r.longitude; }
    } catch (e) {

    }
  }

  if (!lat || !lon) {
    const err = new Error("Location not found");
    err.code = "NO_LOCATION";
    throw err;
  }

  const key = label
    ? `wx:name:${label}`
    : `wx:geo:${round3(lat)}:${round3(lon)}`;

  return cacheWrap(key, WEATHER_TTL, async () => {

    let data;
    try {
      const r1 = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: lat,
          longitude: lon,
          current: "temperature_2m,apparent_temperature,wind_speed_10m,weather_code",
        },
        timeout: 8000,
      });
      data = r1.data;
    } catch {
      const r2 = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: { latitude: lat, longitude: lon, current_weather: true },
        timeout: 8000,
      });
      data = r2.data;
    }

    let temperature = null, feelsLike = null, windSpeed = null, weatherCode = null;
    if (data?.current) {
      temperature = data.current.temperature_2m ?? null;
      feelsLike   = data.current.apparent_temperature ?? null;
      windSpeed   = data.current.wind_speed_10m ?? null;
      weatherCode = data.current.weather_code ?? null;
    } else if (data?.current_weather) {
      temperature = data.current_weather.temperature ?? null;
      windSpeed   = data.current_weather.windspeed ?? null;
      weatherCode = data.current_weather.weathercode ?? null;
    }

    return { temperature, feelsLike, windSpeed, summary: codeToText(weatherCode) };
  });
}

module.exports = { getWeather };