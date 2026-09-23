import os
import json
# pyrefly: ignore [missing-import]
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Union, List, Optional

app = FastAPI(
    title="HeatGuard AI ML Service",
    description="FastAPI service for Heat-Stroke Risk Prediction and Early Warning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "heatguard_model.pkl")
CONFIG_PATH = os.path.join(BASE_DIR, "models", "config.json")
METRICS_PATH = os.path.join(BASE_DIR, "models", "model_metrics.json")

# Load Configuration
with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

# Load Model
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"[ML Service] Loaded Random Forest model from {MODEL_PATH}")
else:
    model = None
    print(f"[ML Service] WARNING: Model file not found at {MODEL_PATH}")

# Input Schema
class PredictRequest(BaseModel):
    temperature: float = Field(..., description="Temperature in °C", ge=0, le=60)
    humidity: float = Field(..., description="Humidity in %", ge=0, le=100)
    wbgt: float = Field(..., description="WBGT in °C", ge=0, le=50)
    age: int = Field(..., description="Age in years", ge=1, le=120)
    activity: Union[str, int] = Field(..., description="Activity level: Resting (0), Moderate work (1), Heavy work (2)")
    hydration: Union[str, int] = Field(..., description="Hydration status: Good (0), Uncertain (1), Low (2)")
    heart_rate: int = Field(..., description="Heart rate in BPM", ge=30, le=240)
    symptoms: Union[str, int] = Field(..., description="Symptoms: None (0), Dizziness (1), Headache (2), Nausea (3), Confusion (4)")

def normalize_categorical(val, mapping_dict):
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        # try converting directly to int if numeric string
        if val.isdigit():
            return int(val)
        # lookup in mapping dict
        if val in mapping_dict:
            return mapping_dict[val]
    # default fallback
    return 0

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "HeatGuard AI ML Service (FastAPI)",
        "model_loaded": model is not None,
        "disclaimer": config.get("disclaimer"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/metrics")
def get_metrics():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=444, detail="Model metrics file not found.")

@app.post("/predict")
def predict_risk(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="ML Model not loaded.")

    # 1. Map categoricals
    act_code = normalize_categorical(req.activity, config["mappings"]["activity"])
    hyd_code = normalize_categorical(req.hydration, config["mappings"]["hydration"])
    sym_code = normalize_categorical(req.symptoms, config["mappings"]["symptoms"])

    # 2. Strict feature order:
    # temperature, humidity, wbgt, age, activity, hydration, heart_rate, symptoms
    feature_vector = np.array([[
        req.temperature,
        req.humidity,
        req.wbgt,
        req.age,
        act_code,
        hyd_code,
        req.heart_rate,
        sym_code
    ]])

    # 3. Model Inference
    probabilities = model.predict_proba(feature_vector)[0] # Array of probabilities for classes 0, 1, 2, 3
    pred_class_idx = int(np.argmax(probabilities))
    
    # Calculate overall risk percentage weighted toward severe risk classes
    # Probability of High + Very High risk, or weighted probability
    risk_prob_pct = round(float((probabilities[1] * 0.3 + probabilities[2] * 0.7 + probabilities[3] * 1.0) * 100), 1)
    if risk_prob_pct > 99.9:
        risk_prob_pct = 99.9
    if risk_prob_pct < 5.0 and pred_class_idx == 0:
        risk_prob_pct = max(round(float(probabilities[0] * 15), 1), 5.2)

    risk_label = config["risk_classes"][pred_class_idx]

    # 4. Identify Main Contributing Factors
    factors = []
    if req.wbgt >= 31.0:
        factors.append(f"Extreme WBGT index ({req.wbgt}°C)")
    elif req.wbgt >= 28.0:
        factors.append(f"High WBGT index ({req.wbgt}°C)")

    if req.temperature >= 35.0:
        factors.append(f"Elevated ambient temperature ({req.temperature}°C)")

    if req.humidity >= 70.0:
        factors.append(f"High relative humidity ({req.humidity}%)")

    if act_code == 2:
        factors.append("Heavy physical exertion / work")
    elif act_code == 1:
        factors.append("Moderate physical activity")

    if hyd_code == 2:
        factors.append("Low hydration status (Dehydration risk)")
    elif hyd_code == 1:
        factors.append("Uncertain hydration level")

    if req.heart_rate >= 130:
        factors.append(f"High tachycardia / Heart rate ({req.heart_rate} BPM)")
    elif req.heart_rate >= 100:
        factors.append(f"Elevated Heart rate ({req.heart_rate} BPM)")

    symptom_labels = {0: "None", 1: "Dizziness", 2: "Headache", 3: "Nausea", 4: "Confusion"}
    if sym_code > 0:
        factors.append(f"Reported symptom: {symptom_labels.get(sym_code, 'Present')}")

    if req.age >= 60:
        factors.append(f"Vulnerable age group ({req.age} years)")

    if not factors:
        factors.append("Normal environmental & physiological parameters")

    # 5. Get Personalized Alert Text
    recommended_action = config["alert_templates"].get(risk_label, "Monitor symptoms and stay hydrated.")

    # 6. Format Input Summary
    act_str = [k for k, v in config["mappings"]["activity"].items() if v == act_code]
    hyd_str = [k for k, v in config["mappings"]["hydration"].items() if v == hyd_code]
    sym_str = [k for k, v in config["mappings"]["symptoms"].items() if v == sym_code]

    input_summary = (
        f"Temp: {req.temperature}°C, Humidity: {req.humidity}%, WBGT: {req.wbgt}°C, "
        f"Age: {req.age}y, Activity: {act_str[0] if act_str else req.activity}, "
        f"Hydration: {hyd_str[0] if hyd_str else req.hydration}, HR: {req.heart_rate} BPM, "
        f"Symptom: {sym_str[0] if sym_str else req.symptoms}"
    )

    return {
        "risk_class": risk_label,
        "probability": risk_prob_pct,
        "contributing_factors": factors,
        "recommended_action": recommended_action,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_summary": input_summary,
        "disclaimer": config.get("disclaimer"),
        "is_synthetic_prototype": True,
        "raw_probabilities": {
            config["risk_classes"][i]: round(float(probabilities[i] * 100), 1)
            for i in range(len(probabilities))
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
