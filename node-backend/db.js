const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize history file if missing
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

function getHistory(limit = 50) {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const history = JSON.parse(raw);
    return history.slice(0, limit);
  } catch (err) {
    console.error('Error reading history file:', err);
    return [];
  }
}

function savePrediction(prediction) {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const history = JSON.parse(raw);
    
    // Add unique ID and insert at beginning
    const record = {
      id: 'pred_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ...prediction
    };
    
    history.unshift(record);
    
    // Keep max 100 history items
    const trimmed = history.slice(0, 100);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
    return record;
  } catch (err) {
    console.error('Error saving prediction to history:', err);
    return prediction;
  }
}

function clearHistory() {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    return true;
  } catch (err) {
    console.error('Error clearing history:', err);
    return false;
  }
}

module.exports = {
  getHistory,
  savePrediction,
  clearHistory
};
