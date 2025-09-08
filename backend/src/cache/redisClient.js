
const redis = require('redis');

const redisUrl =
  process.env.REDIS_URL ||
  (process.env.REDIS_HOST && `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`) ||
  'redis://127.0.0.1:6379';

const client = redis.createClient({ url: redisUrl });
let connected = false;

client.on('connect', () => console.log('Redis: TCP connect'));
client.on('ready',   () => console.log('Redis: ready'));
client.on('end',     () => console.log('Redis: connection closed'));
client.on('reconnecting', (d) => console.log('Redis: reconnecting', d || ''));
client.on('error', (err) => {
  console.error('Redis Client Error', err?.message || err);
});

(async () => {
  try {
    await client.connect();
    connected = true;
    console.log('Redis connected:', redisUrl);
  } catch (err) {
    connected = false;
    console.error('Redis connection failed (continuing without Redis):', err?.message || err);
  }
})();

async function get(key) {
  if (!connected) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis GET error', err?.message || err);
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  if (!connected) return;
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error('Redis SET error', err?.message || err);
  }
}

async function del(key) {
  if (!connected) return;
  try {
    await client.del(key);
  } catch (err) {
    console.error('Redis DEL error', err?.message || err);
  }
}

module.exports = { client, get, set, del };