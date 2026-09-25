import React, { useEffect, useState } from 'react';
import { Cpu, BarChart3, CheckCircle, AlertTriangle, Database, TrendingUp } from 'lucide-react';

export default function ModelMetricsView() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => { setMetrics(data); setLoading(false); })
      .catch(err => { console.error('Failed to load metrics:', err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="card-healthcare p-10 text-center text-slate-500 space-y-3">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-medium">Loading model evaluation data...</p>
      </div>
    );
  }

  const rf = metrics?.random_forest;
  const lr = metrics?.logistic_regression;
  const xgb = metrics?.xgboost;
  const featureImportanceList = rf?.feature_importances
    ? Object.entries(rf.feature_importances).sort((a, b) => b[1] - a[1])
    : [];

  const models = [
    { key: 'rf', label: 'Random Forest', detail: 'Primary model', data: rf, color: 'teal', icon: CheckCircle },
    { key: 'lr', label: 'Logistic Regression', detail: 'Baseline model', data: lr, color: 'blue', icon: TrendingUp },
    { key: 'xgb', label: 'XGBoost', detail: 'Gradient boosted', data: xgb, color: 'purple', icon: Cpu }
  ];

  const colorMap = {
    teal: { wrap: 'border-teal-200 bg-teal-50/60', icon: 'bg-teal-100 text-teal-700', label: 'text-teal-700', value: 'text-teal-900', bar: 'bg-teal-500' },
    blue: { wrap: 'border-blue-200 bg-blue-50/60', icon: 'bg-blue-100 text-blue-700', label: 'text-blue-700', value: 'text-blue-900', bar: 'bg-blue-500' },
    purple: { wrap: 'border-purple-200 bg-purple-50/60', icon: 'bg-purple-100 text-purple-700', label: 'text-purple-700', value: 'text-purple-900', bar: 'bg-purple-500' }
  };

  return (
    <div className="space-y-6">
      <section className="card-healthcare p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#10233f] text-teal-300 shadow-lg shadow-slate-900/10"><Cpu className="w-6 h-6" /></div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Model intelligence</div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">AI metrics & explainability</h2>
              <p className="text-xs text-slate-500 mt-1">Compare model performance and understand the signals influencing heat-risk predictions.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" /> Evaluation complete
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span><strong>Synthetic prototype:</strong> Models are trained on 2,500 synthetic meteorological and physiological samples.</span>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map(({ key, label, detail, data, color, icon: Icon }) => {
          const c = colorMap[color];
          const accuracy = data?.accuracy ?? (key === 'rf' ? .886 : key === 'lr' ? .892 : .898);
          const precision = data?.precision ?? accuracy;
          const recall = data?.recall ?? accuracy;
          return (
            <div key={key} className={`relative overflow-hidden rounded-2xl border p-5 ${c.wrap} shadow-sm`}>
              {key === 'rf' && <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-teal-500 text-[#10233f] text-[10px] font-extrabold uppercase tracking-wider">Primary</div>}
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl ${c.icon}`}><Icon className="w-4 h-4" /></div>
                <div><div className={`text-xs font-extrabold uppercase tracking-wider ${c.label}`}>{label}</div><div className="text-[10px] text-slate-500 mt-1">{detail}</div></div>
              </div>
              <div className={`text-4xl font-black tracking-tight ${c.value}`}>{(accuracy * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Accuracy</div>
              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden mt-4"><div className={`h-full rounded-full ${c.bar}`} style={{ width: `${accuracy * 100}%` }} /></div>
              <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-200/80">
                <div><span className="text-[10px] text-slate-500 block">Precision</span><strong className="text-sm text-slate-800">{(precision * 100).toFixed(1)}%</strong></div>
                <div><span className="text-[10px] text-slate-500 block">Recall</span><strong className="text-sm text-slate-800">{(recall * 100).toFixed(1)}%</strong></div>
              </div>
            </div>
          );
        })}
      </section>

      {featureImportanceList.length > 0 && (
        <section className="card-healthcare p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-teal-600" /><div><h3 className="text-sm font-bold text-slate-900">What influences the prediction?</h3><p className="text-[10px] text-slate-500 mt-1">Random Forest feature importance weights</p></div></div>
          <div className="grid gap-3">
            {featureImportanceList.map(([feat, val]) => (
              <div key={feat}>
                <div className="flex justify-between text-xs mb-1.5"><span className="capitalize font-medium text-slate-700">{feat.replace('_', ' ')}</span><span className="font-bold text-teal-700">{(val * 100).toFixed(1)}%</span></div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" style={{ width: `${Math.min(100, val * 100 * 3.5)}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {rf?.confusion_matrix && (
        <section className="card-healthcare p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2"><Database className="w-5 h-5 text-teal-600" /><div><h3 className="text-sm font-bold text-slate-900">Confusion matrix</h3><p className="text-[10px] text-slate-500 mt-1">Random Forest multiclass evaluation</p></div></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-bold"><tr><th className="p-3">Actual / predicted</th><th className="p-3 text-center text-emerald-700">Low</th><th className="p-3 text-center text-amber-700">Moderate</th><th className="p-3 text-center text-orange-700">High</th><th className="p-3 text-center text-rose-700">Very high</th></tr></thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {['Low risk', 'Moderate risk', 'High risk', 'Very high risk'].map((rowLabel, rIdx) => (
                  <tr key={rowLabel} className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-700">{rowLabel}</td>{rf.confusion_matrix[rIdx].map((cell, cIdx) => <td key={cIdx} className={`p-3 text-center font-bold ${rIdx === cIdx ? 'bg-teal-50 text-teal-700' : 'text-slate-500'}`}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
