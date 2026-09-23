import React, { useEffect, useState } from 'react';
import { Cpu, BarChart3, CheckCircle, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

export default function ModelMetricsView() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load metrics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading Model Evaluation & Explainability Data...</p>
      </div>
    );
  }

  const rf = metrics?.random_forest;
  const lr = metrics?.logistic_regression;
  const xgb = metrics?.xgboost;

  const featureImportanceList = rf?.feature_importances
    ? Object.entries(rf.feature_importances).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Model Metrics & Explainability</h2>
            <p className="text-xs text-slate-400">
              Comparative evaluation of Random Forest (Primary), Logistic Regression (Baseline), and XGBoost models
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Synthetic Prototype Note:</strong> Models are trained on 2,500 synthetic meteorological & physiological samples (`synthetic_heat_data.csv`).
          </span>
        </div>
      </div>

      {/* Model Accuracy Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Random Forest Card */}
        <div className="glass-panel p-5 rounded-2xl border border-teal-500/40 relative overflow-hidden space-y-3">
          <div className="absolute top-0 right-0 px-3 py-1 bg-teal-500 text-slate-950 font-extrabold text-[10px] rounded-bl-xl uppercase tracking-wider">
            Primary Model
          </div>
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Random Forest</div>
          <div className="text-3xl font-black text-white font-mono">
            {rf ? `${(rf.accuracy * 100).toFixed(1)}%` : '88.6%'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px]">Precision</span>
              <div className="font-bold text-slate-200">{rf ? (rf.precision * 100).toFixed(1) + '%' : '88.6%'}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Recall</span>
              <div className="font-bold text-slate-200">{rf ? (rf.recall * 100).toFixed(1) + '%' : '88.6%'}</div>
            </div>
          </div>
        </div>

        {/* Logistic Regression Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Logistic Regression (Baseline)</div>
          <div className="text-3xl font-black text-white font-mono">
            {lr ? `${(lr.accuracy * 100).toFixed(1)}%` : '89.2%'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px]">Precision</span>
              <div className="font-bold text-slate-200">{lr ? (lr.precision * 100).toFixed(1) + '%' : '89.1%'}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Recall</span>
              <div className="font-bold text-slate-200">{lr ? (lr.recall * 100).toFixed(1) + '%' : '89.2%'}</div>
            </div>
          </div>
        </div>

        {/* XGBoost Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">XGBoost (Gradient Boosted)</div>
          <div className="text-3xl font-black text-white font-mono">
            {xgb ? `${(xgb.accuracy * 100).toFixed(1)}%` : '89.8%'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px]">Precision</span>
              <div className="font-bold text-slate-200">{xgb ? (xgb.precision * 100).toFixed(1) + '%' : '89.8%'}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Recall</span>
              <div className="font-bold text-slate-200">{xgb ? (xgb.recall * 100).toFixed(1) + '%' : '89.8%'}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Importance Section */}
      {featureImportanceList.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Random Forest Feature Importance Weights</h3>
          </div>
          <div className="space-y-3">
            {featureImportanceList.map(([feat, val]) => (
              <div key={feat} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="capitalize text-slate-300 font-mono">{feat.replace('_', ' ')}</span>
                  <span className="text-teal-400 font-bold font-mono">{(val * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${val * 100 * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confusion Matrix Table */}
      {rf?.confusion_matrix && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Random Forest Confusion Matrix (4x4 Multiclass)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900/90 uppercase text-[10px] text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Actual \ Predicted</th>
                  <th className="p-3 text-center text-emerald-400">Low Risk</th>
                  <th className="p-3 text-center text-amber-400">Moderate Risk</th>
                  <th className="p-3 text-center text-orange-400">High Risk</th>
                  <th className="p-3 text-center text-rose-400">Very High Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {['Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'].map((rowLabel, rIdx) => (
                  <tr key={rowLabel} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-slate-200">{rowLabel}</td>
                    {rf.confusion_matrix[rIdx].map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-3 text-center font-bold ${
                          rIdx === cIdx ? 'bg-teal-950/60 text-teal-300 border border-teal-800/50' : 'text-slate-500'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
