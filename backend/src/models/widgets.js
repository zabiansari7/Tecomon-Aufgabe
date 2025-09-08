const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Widget', widgetSchema);