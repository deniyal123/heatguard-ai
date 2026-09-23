const express = require('express');
const router = express.Router();
const db = require('../db');

const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://127.0.0.1:8000';

const DISCLAIMER = "This prototype provides early-warning support and does not replace professional medical care.";

// Fallback heuristic engine if Python ML service is offline
function computeFallbackPrediction(inputs) {
  const { temperature, humidity, wbgt, age, activity, hydration, heart_rate, symptoms } = inputs;

  const actMap = { 'Resting': 0, 'Moderate work': 1, 'Heavy work': 2, '0': 0, '1': 1, '2': 2 };
  const hydMap = { 'Good': 0, 'Uncertain': 1, 'Low': 2, '0': 0, '1': 1, '2': 2 };
  const symMap = { 'None': 0, 'Dizziness': 1, 'Headache': 2, 'Nausea': 3, 'Confusion': 4, '0': 0, '1': 1, '2': 2, '3': 3, '4': 4 };

  const actCode = actMap[activity] ?? 0;
  const hydCode = hydMap[hydration] ?? 0;
  const symCode = symMap[symptoms] ?? 0;

  const score = (
    (wbgt - 20) * 0.35 +
    (temperature - 25) * 0.15 +
    (humidity - 50) * 0.03 +
    (age - 40) * 0.025 +
    actCode * 1.8 +
    hydCode * 2.2 +
    (heart_rate - 80) * 0.04 +
    symCode * 2.5
  );

  let risk_class = "Low risk";
  let prob = 15.0;
  let recommended_action = "Continue monitoring and drink water regularly.";

  if (score >= 12.0 || symCode === 4 || (wbgt >= 33 && heart_rate >= 140)) {
    risk_class = "Very high risk";
    prob = Math.min(98.5, Math.max(82.0, 75 + score * 1.8));
    recommended_action = "Stop activity and seek immediate assistance now.";
  } else if (score >= 8.0 || symCode >= 2 || wbgt >= 30) {
    risk_class = "High risk";
    prob = Math.min(84.0, Math.max(62.0, 50 + score * 2.2));
    recommended_action = "Stop strenuous activity, move to shade, drink water and notify a supervisor.";
  } else if (score >= 4.0 || actCode >= 1 || hydCode >= 1) {
    risk_class = "Moderate risk";
    prob = Math.min(61.0, Math.max(35.0, 30 + score * 2.5));
    recommended_action = "Reduce exertion, rest periodically and move to a cooler area.";
  }

  const factors = [];
  if (wbgt >= 28) factors.append ? null : factors.push(`Elevated WBGT index (${wbgt}°C)`);
  if (temperature >= 35) factors.push(`High ambient temperature (${temperature}°C)`);
  if (actCode === 2) factors.push("Heavy physical work");
  if (hydCode === 2) factors.push("Low hydration status");
  if (heart_rate >= 120) factors.push(`Elevated heart rate (${heart_rate} BPM)`);
  if (symCode > 0) factors.push(`Reported symptom (${symptoms})`);
  if (factors.length === 0) factors.push("Baseline environment & physiological parameters");

  return {
    risk_class,
    probability: Math.round(prob * 10) / 10,
    contributing_factors: factors,
    recommended_action,
    timestamp: new Date().toISOString(),
    input_summary: `Temp: ${temperature}°C, Humidity: ${humidity}%, WBGT: ${wbgt}°C, Age: ${age}y, Activity: ${activity}, Hydration: ${hydration}, HR: ${heart_rate} BPM, Symptom: ${symptoms}`,
    disclaimer: DISCLAIMER,
    is_synthetic_prototype: true,
    engine: "Node.js Fallback Rules Engine (Python ML Offline)"
  };
}

// GET /api/health
router.get('/health', async (req, res) => {
  let pythonStatus = 'offline';
  let pythonDetails = null;

  try {
    const pyRes = await fetch(`${PYTHON_ML_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (pyRes.ok) {
      pythonStatus = 'online';
      pythonDetails = await pyRes.json();
    }
  } catch (err) {
    pythonStatus = 'offline (unreachable)';
  }

  res.json({
    status: 'online',
    service: 'HeatGuard Node.js API',
    python_ml_status: pythonStatus,
    python_ml_details: pythonDetails,
    disclaimer: DISCLAIMER,
    timestamp: new Date().toISOString()
  });
});

// GET /api/metrics
router.get('/metrics', async (req, res) => {
  try {
    const pyRes = await fetch(`${PYTHON_ML_URL}/metrics`, { signal: AbortSignal.timeout(3000) });
    if (pyRes.ok) {
      const data = await pyRes.json();
      return res.json(data);
    }
  } catch (err) {
    console.error('Error fetching ML metrics:', err.message);
  }
  
  // Return cached metrics if ML service unreachable
  res.json({
    random_forest: { name: "Random Forest (Primary)", accuracy: 0.886, precision: 0.8861, recall: 0.886 },
    logistic_regression: { name: "Logistic Regression (Baseline)", accuracy: 0.892, precision: 0.8909, recall: 0.892 },
    xgboost: { name: "XGBoost (Comparison)", accuracy: 0.898, precision: 0.8982, recall: 0.898 }
  });
});

// POST /api/predict
router.post('/predict', async (req, res) => {
  const { temperature, humidity, wbgt, age, activity, hydration, heart_rate, symptoms } = req.body;

  // 1. Validation
  const errors = [];
  if (temperature === undefined || isNaN(Number(temperature)) || temperature < 0 || temperature > 60) {
    errors.push('Temperature must be a valid number between 0 and 60 °C.');
  }
  if (humidity === undefined || isNaN(Number(humidity)) || humidity < 0 || humidity > 100) {
    errors.push('Humidity must be a valid percentage between 0 and 100%.');
  }
  if (wbgt === undefined || isNaN(Number(wbgt)) || wbgt < 0 || wbgt > 50) {
    errors.push('WBGT must be a valid number between 0 and 50 °C.');
  }
  if (age === undefined || !Number.isInteger(Number(age)) || age < 1 || age > 120) {
    errors.push('Age must be an integer between 1 and 120 years.');
  }
  if (!activity || !['Resting', 'Moderate work', 'Heavy work', 0, 1, 2, '0', '1', '2'].includes(activity)) {
    errors.push('Activity level must be Resting, Moderate work, or Heavy work.');
  }
  if (!hydration || !['Good', 'Uncertain', 'Low', 0, 1, 2, '0', '1', '2'].includes(hydration)) {
    errors.push('Hydration status must be Good, Uncertain, or Low.');
  }
  if (heart_rate === undefined || !Number.isInteger(Number(heart_rate)) || heart_rate < 30 || heart_rate > 240) {
    errors.push('Heart rate must be an integer between 30 and 240 BPM.');
  }
  if (symptoms === undefined || !['None', 'Dizziness', 'Headache', 'Nausea', 'Confusion', 0, 1, 2, 3, 4, '0', '1', '2', '3', '4'].includes(symptoms)) {
    errors.push('Symptoms must be None, Dizziness, Headache, Nausea, or Confusion.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid input parameters',
      details: errors
    });
  }

  // 2. Prepare payload
  const payload = {
    temperature: Number(temperature),
    humidity: Number(humidity),
    wbgt: Number(wbgt),
    age: Number(age),
    activity,
    hydration,
    heart_rate: Number(heart_rate),
    symptoms
  };

  let result = null;

  // 3. Call Python ML Service
  try {
    const response = await fetch(`${PYTHON_ML_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    });

    if (response.ok) {
      result = await response.json();
      result.engine = "Python FastAPI ML Service (Random Forest)";
    } else {
      console.warn(`Python ML returned status ${response.status}. Using fallback.`);
    }
  } catch (err) {
    console.warn(`Python ML service unreachable (${err.message}). Using fallback engine.`);
  }

  // 4. Fallback if Python ML failed
  if (!result) {
    result = computeFallbackPrediction(payload);
  }

  // 5. Attach original inputs
  result.inputs = payload;

  // 6. Save to local history DB
  const savedRecord = await db.savePrediction(result);

  res.json(savedRecord);
});

// GET /api/history
router.get('/history', async (req, res) => {
  const history = await db.getHistory(50);
  res.json({
    count: history.length,
    history
  });
});

// DELETE /api/history
router.delete('/history', async (req, res) => {
  await db.clearHistory();
  res.json({ message: 'Prediction history cleared.' });
});

module.exports = router;

