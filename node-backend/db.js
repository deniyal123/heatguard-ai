const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const mongoUri = process.env.MONGODB_URI;
const postgresUrl = process.env.DATABASE_URL;
const useMongo = Boolean(mongoUri);
const usePostgres = !useMongo && Boolean(postgresUrl);

const pool = usePostgres
  ? new Pool({
      connectionString: postgresUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5
    })
  : null;

const mongoClient = useMongo ? new MongoClient(mongoUri) : null;
let mongoCollection;

const databaseReady = (async () => {
  if (useMongo) {
    await mongoClient.connect();
    const mongoDb = mongoClient.db(process.env.MONGODB_DB || 'heatguard');
    mongoCollection = mongoDb.collection('prediction_history');
    await mongoCollection.createIndex({ timestamp: -1 });
    return;
  }

  if (usePostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prediction_history (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        record JSONB NOT NULL
      )
    `);
  }
})();

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

async function getHistory(limit = 50) {
  await databaseReady;

  if (useMongo) {
    return mongoCollection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
  }

  if (usePostgres) {
    const result = await pool.query(
      'SELECT record FROM prediction_history ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows.map((row) => row.record);
  }

  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const history = JSON.parse(raw);
    return history.slice(0, limit);
  } catch (err) {
    console.error('Error reading history file:', err);
    return [];
  }
}

async function savePrediction(prediction) {
  await databaseReady;

  const record = {
    id: 'pred_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    ...prediction
  };

  if (useMongo) {
    await mongoCollection.insertOne(record);
    return record;
  }

  if (usePostgres) {
    await pool.query(
      `INSERT INTO prediction_history (id, created_at, record)
       VALUES ($1, $2, $3)`,
      [record.id, record.timestamp || new Date().toISOString(), record]
    );
    return record;
  }

  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const history = JSON.parse(raw);
    history.unshift(record);
    const trimmed = history.slice(0, 100);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
    return record;
  } catch (err) {
    console.error('Error saving history:', err);
    return prediction;
  }
}

async function clearHistory() {
  await databaseReady;

  if (useMongo) {
    await mongoCollection.deleteMany({});
    return true;
  }

  if (usePostgres) {
    await pool.query('TRUNCATE TABLE prediction_history');
    return true;
  }

  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    return true;
  } catch (err) {
    console.error('Error clearing history file:', err);
    return false;
  }
}

module.exports = {
  getHistory,
  savePrediction,
  clearHistory
};
