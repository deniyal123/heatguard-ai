import os
import json
# pyrefly: ignore [missing-import]
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
from generate_data import generate_synthetic_heatguard_dataset

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

def train_and_evaluate_models():
    data_path = os.path.join('data', 'synthetic_heat_data.csv')
    if not os.path.exists(data_path):
        df = generate_synthetic_heatguard_dataset()
    else:
        df = pd.read_csv(data_path)

    feature_cols = ['temperature', 'humidity', 'wbgt', 'age', 'activity', 'hydration', 'heart_rate', 'symptoms']
    X = df[feature_cols]
    y = df['risk_class']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    metrics_results = {}

    # 1. Primary Model: Random Forest
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_model.fit(X_train, y_train)
    y_pred_rf = rf_model.predict(X_test)
    
    rf_acc = accuracy_score(y_test, y_pred_rf)
    rf_prec = precision_score(y_test, y_pred_rf, average='weighted', zero_division=0)
    rf_rec = recall_score(y_test, y_pred_rf, average='weighted', zero_division=0)
    rf_cm = confusion_matrix(y_test, y_pred_rf).tolist()

    feature_importances = dict(zip(feature_cols, rf_model.feature_importances_.round(4).tolist()))

    metrics_results['random_forest'] = {
        'name': 'Random Forest (Primary)',
        'accuracy': round(float(rf_acc), 4),
        'precision': round(float(rf_prec), 4),
        'recall': round(float(rf_rec), 4),
        'confusion_matrix': rf_cm,
        'feature_importances': feature_importances
    }

    # 2. Baseline Model: Logistic Regression
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train, y_train)
    y_pred_lr = lr_model.predict(X_test)

    lr_acc = accuracy_score(y_test, y_pred_lr)
    lr_prec = precision_score(y_test, y_pred_lr, average='weighted', zero_division=0)
    lr_rec = recall_score(y_test, y_pred_lr, average='weighted', zero_division=0)
    lr_cm = confusion_matrix(y_test, y_pred_lr).tolist()

    metrics_results['logistic_regression'] = {
        'name': 'Logistic Regression (Baseline)',
        'accuracy': round(float(lr_acc), 4),
        'precision': round(float(lr_prec), 4),
        'recall': round(float(lr_rec), 4),
        'confusion_matrix': lr_cm
    }

    # 3. Comparison Model: XGBoost (if available)
    if XGB_AVAILABLE:
        try:
            xgb_model = xgb.XGBClassifier(n_estimators=100, max_depth=6, random_state=42, eval_metric='mlogloss')
            xgb_model.fit(X_train, y_train)
            y_pred_xgb = xgb_model.predict(X_test)

            xgb_acc = accuracy_score(y_test, y_pred_xgb)
            xgb_prec = precision_score(y_test, y_pred_xgb, average='weighted', zero_division=0)
            xgb_rec = recall_score(y_test, y_pred_xgb, average='weighted', zero_division=0)
            xgb_cm = confusion_matrix(y_test, y_pred_xgb).tolist()

            metrics_results['xgboost'] = {
                'name': 'XGBoost (Comparison)',
                'accuracy': round(float(xgb_acc), 4),
                'precision': round(float(xgb_prec), 4),
                'recall': round(float(xgb_rec), 4),
                'confusion_matrix': xgb_cm
            }
        except Exception as e:
            print(f"XGBoost training skipped: {e}")

    # Save trained models
    os.makedirs('models', exist_ok=True)
    model_save_path = os.path.join('models', 'heatguard_model.pkl')
    joblib.dump(rf_model, model_save_path)
    print(f"Saved primary Random Forest model to {model_save_path}")

    metrics_save_path = os.path.join('models', 'model_metrics.json')
    with open(metrics_save_path, 'w') as f:
        json.dump(metrics_results, f, indent=2)
    print(f"Saved model metrics to {metrics_save_path}")

    return metrics_results

if __name__ == '__main__':
    train_and_evaluate_models()
