import numpy as np
import pandas as pd
import json
import os

def generate_synthetic_heatguard_dataset(n_samples=2500, random_state=42):
    np.random.seed(random_state)

    # 1. Temperature (°C): 18°C to 45°C
    temperature = np.random.uniform(18.0, 45.0, n_samples)
    
    # 2. Humidity (%): 20% to 95%
    humidity = np.random.uniform(20.0, 95.0, n_samples)

    # 3. WBGT (°C): realistic correlation with Temp and Humidity
    # Approximate WBGT equation simulation
    wbgt = 0.7 * (temperature * (0.5 + 0.005 * humidity)) + 0.3 * temperature + np.random.normal(0, 1.0, n_samples)
    wbgt = np.clip(wbgt, 15.0, 42.0)

    # 4. Age (years): 18 to 82
    age = np.random.randint(18, 83, n_samples)

    # 5. Activity level: 0 (Resting), 1 (Moderate work), 2 (Heavy work)
    activity = np.random.choice([0, 1, 2], p=[0.4, 0.4, 0.2], size=n_samples)

    # 6. Hydration status: 0 (Good), 1 (Uncertain), 2 (Low)
    hydration = np.random.choice([0, 1, 2], p=[0.5, 0.3, 0.2], size=n_samples)

    # 7. Heart rate (BPM): elevated by WBGT, activity, and dehydration
    base_hr = np.random.normal(72, 8, n_samples)
    hr_boost = (wbgt - 20).clip(0) * 1.8 + activity * 15 + hydration * 12
    heart_rate = np.clip(base_hr + hr_boost + np.random.normal(0, 4, n_samples), 55, 185).astype(int)

    # 8. Symptoms: 0 (None), 1 (Dizziness), 2 (Headache), 3 (Nausea), 4 (Confusion)
    # Higher risk conditions elevate symptom probability
    symptoms = []
    for i in range(n_samples):
        strain_score = (wbgt[i] - 25) * 0.15 + activity[i] * 0.5 + hydration[i] * 0.6 + (heart_rate[i] - 90) * 0.03
        if strain_score > 3.0 and np.random.rand() < 0.65:
            sym = np.random.choice([1, 2, 3, 4], p=[0.3, 0.3, 0.25, 0.15])
        elif strain_score > 1.5 and np.random.rand() < 0.35:
            sym = np.random.choice([1, 2], p=[0.6, 0.4])
        else:
            sym = 0
        symptoms.append(sym)
    symptoms = np.array(symptoms)

    # Target variable generation (Risk Tier 0..3)
    # Synthetic risk formula incorporating heat stress guidelines (OSHA / ACGIH WBGT risk bands)
    risk_scores = (
        (wbgt - 20) * 0.35 +
        (temperature - 25) * 0.15 +
        (humidity - 50) * 0.03 +
        (age - 40) * 0.025 +
        activity * 1.8 +
        hydration * 2.2 +
        (heart_rate - 80) * 0.04 +
        symptoms * 2.5
    )

    risk_class = []
    for score in risk_scores:
        if score < 4.0:
            risk_class.append(0) # Low risk
        elif score < 8.0:
            risk_class.append(1) # Moderate risk
        elif score < 12.0:
            risk_class.append(2) # High risk
        else:
            risk_class.append(3) # Very high risk

    df = pd.DataFrame({
        'temperature': np.round(temperature, 1),
        'humidity': np.round(humidity, 1),
        'wbgt': np.round(wbgt, 1),
        'age': age,
        'activity': activity,
        'hydration': hydration,
        'heart_rate': heart_rate,
        'symptoms': symptoms,
        'risk_class': risk_class
    })

    os.makedirs('data', exist_ok=True)
    csv_path = os.path.join('data', 'synthetic_heat_data.csv')
    df.to_csv(csv_path, index=False)
    print(f"Generated synthetic dataset with {len(df)} rows at {csv_path}")
    print("Class distribution:")
    print(df['risk_class'].value_counts().sort_index())
    return df

if __name__ == '__main__':
    generate_synthetic_heatguard_dataset()
