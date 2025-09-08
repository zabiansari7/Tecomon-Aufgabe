const Widget = require("../models/widgets");
const { getWeather } = require("../services/weatherService");

function normalizeLocation(s) {
  if (!s) return "";
  const t = s.toString().trim();
  return t.toLowerCase().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function isStale(doc) {
  if (!doc.weather || !doc.weatherUpdatedAt) return true;
  const age = Date.now() - new Date(doc.weatherUpdatedAt).getTime();
  return age > 30 * 60 * 1000;
}

const getWidgets = async (_req, res) => {
  try {
    const docs = await Widget.find({}).sort({ createdAt: -1 }).lean();

    const out = await Promise.all(docs.map(async (d) => {
      const location = d.location || d.name || d.city || d.cityName || d.place || "";
      if (!location) return { ...d, location: "" };

      if (isStale(d)) {
        try {
          const weather = await getWeather({ name: location, latitude: d.latitude, longitude: d.longitude });
          await Widget.updateOne({ _id: d._id }, { $set: { weather, weatherUpdatedAt: new Date(), location } });
          return { ...d, weather, weatherUpdatedAt: new Date(), location };
        } catch (e) {

          return { ...d, location };
        }
      }
      return { ...d, location };
    }));

    res.json(out);
  } catch (err) {
    console.error("getWidgets error:", err);
    res.status(500).json({ error: "Failed to load widgets" });
  }
};

const createWidget = async (req, res) => {
  try {
    const raw = req.body?.location;
    const location = normalizeLocation(raw);
    if (!location) return res.status(400).json({ error: "Location is required" });

    const existing = await Widget.findOne({ location }).collation({ locale: "en", strength: 2 });
    if (existing) {

      return res.status(409).json({ error: "Widget already exists", widget: existing });
    }

    const widget = await Widget.create({ location });

    let weather = null;
    try {
      weather = await getWeather({ name: location });
      await Widget.updateOne({ _id: widget._id }, { $set: { weather, weatherUpdatedAt: new Date() } });
    } catch (e) {

    }

    res.status(201).json({ widget, weather });
  } catch (err) {
    console.error("createWidget error:", err);
    res.status(500).json({ error: err.message || "Failed to create" });
  }
};

const deleteWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const out = await Widget.findByIdAndDelete(id);
    if (!out) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete" });
  }
};

module.exports = { getWidgets, createWidget, deleteWidget };