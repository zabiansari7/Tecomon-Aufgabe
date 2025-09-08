require('dotenv').config();
require('./src/cache/redisClient');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const widgetRoutes = require('./src/routes/widgetRoutes');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

app.use('/widgets', widgetRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));