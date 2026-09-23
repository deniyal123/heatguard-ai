# 🛡️ HeatGuard AI - Early-Warning Heat-Stroke Risk Prediction System

> **Hackathon Prototype Notice & Medical Disclaimer**:  
> *“This prototype provides early-warning support and does not replace professional medical care.”*  
> All machine learning models, training datasets, risk thresholds, and feature weights are synthetic prototype values created for demonstration and hackathon validation.

---

## 🌟 Project Overview

**HeatGuard AI** is an end-to-end AI-powered heat-stroke risk prediction and early-warning solution designed to protect vulnerable individuals—such as outdoor construction workers, elderly residents, athletes, and agricultural laborers—from dangerous heat strain and heat stroke.

The system collects environmental, demographic, activity, hydration, physiological, and symptom indicators, feeds them to a trained **Random Forest ML model**, predicts heat strain risk tiers, and delivers personalized, actionable preventive alerts.

---

## ⚙️ Architecture & Tech Stack

```
                     ┌──────────────────────────────────────────┐
                     │          React + Vite Frontend           │
                     │  - Health Dashboard & Risk Predictor     │
                     │  - Demo Presets (Low, High, Very High)   │
                     │  - Model Explainability & Metrics View   │
                     │  - Live Physiological Telemetry Monitor  │
                     │  - Caregiver & Supervisor Alert Center   │
                     └────────────────────┬─────────────────────┘
                                          │ HTTP / REST
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │           Node.js Express API            │
                     │  - POST /api/predict (Validator/Proxy)  │
                     │  - GET  /api/health                     │
                     │  - GET  /api/history (SQLite/JSON storage)│
                     │  - Graceful Python Offline Fallback      │
                     └────────────────────┬─────────────────────┘
                                          │ HTTP / REST
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │          Python FastAPI ML Service       │
                     │  - Random Forest Classifier (Primary)    │
                     │  - Logistic Regression (Baseline)        │
                     │  - XGBoost (Gradient Boosted)            │
                     │  - POST /predict                         │
                     │  - GET  /metrics                         │
                     └──────────────────────────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Node.js Backend**: Express.js, JSON/SQLite persistence, HTTP Proxy with fallback rule engine.
- **Python ML Microservice**: FastAPI, Scikit-Learn (Random Forest & Logistic Regression), XGBoost, Pandas, Numpy.

---

## 📂 Project Directory Structure

```
c:\HeatGuard AI/
├── data/
│   ├── synthetic_heat_data.csv    # Generated 2,500 sample training dataset
│   └── history.json               # Persisted prediction logs
├── models/
│   ├── heatguard_model.pkl        # Trained Random Forest model binary
│   ├── model_metrics.json         # Comparative evaluation metrics
│   └── config.json                # Feature order, mappings, thresholds & alerts
├── ml-service/
│   ├── main.py                    # FastAPI application entry point
│   ├── generate_data.py           # Synthetic dataset generator
│   ├── train_model.py             # Model training & metrics computation
│   └── requirements.txt           # Python dependencies
├── node-backend/
│   ├── server.js                  # Express server entry point
│   ├── db.js                      # Local prediction history database helper
│   ├── routes/
│   │   └── api.js                 # API endpoints & proxy logic
│   └── package.json               # Node backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Status bar & navigation tabs
│   │   │   ├── RiskForm.jsx       # 8 input fields & Demo Presets
│   │   │   ├── RiskResultCard.jsx # Probability gauge & personalized alert
│   │   │   ├── ModelMetricsView.jsx # Feature importance & confusion matrix
│   │   │   ├── LiveTelemetry.jsx  # Real-time vital streaming simulation
│   │   │   ├── CaregiverHub.jsx   # Emergency supervisor dispatch center
│   │   │   ├── HistoryTable.jsx   # Filterable prediction history log
│   │   │   └── UserProfile.jsx    # Demographics & baseline setup
│   │   ├── App.jsx                # Main application component
│   │   ├── main.jsx               # React DOM render entry
│   │   └── index.css              # Custom styling & risk color tokens
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 📋 Required Inputs & Risk Outputs

### Required Inputs (8 Parameters)
1. **Temperature (°C)**: Ambient temperature (0 – 60 °C)
2. **Humidity (%)**: Relative humidity (0 – 100 %)
3. **WBGT (°C)**: Wet Bulb Globe Temperature index (0 – 50 °C)
4. **Age (years)**: Subject age (1 – 120 years)
5. **Activity level**: `Resting` | `Moderate work` | `Heavy work`
6. **Hydration status**: `Good` | `Uncertain` | `Low`
7. **Heart rate (BPM)**: Physiological pulse rate (30 – 240 BPM)
8. **Symptoms**: `None` | `Dizziness` | `Headache` | `Nausea` | `Confusion`

### Strict Feature Order in ML Pipeline
```json
["temperature", "humidity", "wbgt", "age", "activity", "hydration", "heart_rate", "symptoms"]
```

### Prediction Output Tiers & Personalized Alerts
- 🟢 **Low risk**: *“Continue monitoring and drink water regularly.”*
- 🟡 **Moderate risk**: *“Reduce exertion, rest periodically and move to a cooler area.”*
- 🟠 **High risk**: *“Stop strenuous activity, move to shade, drink water and notify a supervisor.”*
- 🔴 **Very high risk**: *“Stop activity and seek immediate assistance now.”*

---

## ⚡ Quick Start & Run Commands

### 1. Start Python FastAPI ML Service (Port 8000)
```bash
# Navigate to ml-service directory
cd ml-service

# Train models and generate synthetic data (if not already run)
python generate_data.py
python train_model.py

# Launch FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Start Node.js Express Backend (Port 5000)
```bash
# Navigate to node-backend directory
cd node-backend

# Install dependencies
npm install

# Start Express server
node server.js
```

### 3. Start React Frontend (Port 5173)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173` to launch HeatGuard AI.

---

## 🔄 Node.js Backend to Python ML Service Data Flow

1. **User Request**: The React frontend sends a `POST` request to `http://localhost:5000/api/predict` with the 8 input parameters.
2. **Validation & Conversion**: Express API validates all fields, ensures parameters are within expected ranges, and maps string categoricals (`"Moderate work"` -> `1`, `"Low"` -> `2`) to integer feature codes.
3. **Python Microservice Invocation**: Express uses native asynchronous HTTP fetch to POST the payload to `http://127.0.0.1:8000/predict`.
4. **Random Forest Inference**: FastAPI inputs the vector `[temperature, humidity, wbgt, age, activity, hydration, heart_rate, symptoms]` into the saved `heatguard_model.pkl` Random Forest Classifier.
5. **Enrichment**: FastAPI calculates class probability percentages, identifies top contributing physiological/environmental factors, matches personalized alert text from `models/config.json`, and returns structured JSON response.
6. **Graceful Fallback**: If the Python service is unreachable, Node.js transparently executes its internal rule fallback engine so the user experience is uninterrupted.
7. **History Logging**: Node API saves the prediction into `data/history.json` before returning the response to the frontend.

---

## 🎯 Demo Mode Presets

Click any of the preset buttons on the main dashboard for instant auto-fill & execution:
1. **Low Risk**: Moderate temp (24°C), low WBGT (20°C), resting activity, good hydration, normal heart rate (72 BPM), no symptoms.
2. **High Risk**: High WBGT (31°C), high humidity (75%), moderate work, uncertain hydration, elevated heart rate (118 BPM), dizziness.
3. **Very High Risk**: Extreme WBGT (35°C), heavy work, low hydration, tachycardia (145 BPM), confusion.
