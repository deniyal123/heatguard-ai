import React, { useEffect, useState } from 'react';
import { History, Trash2, RefreshCw, Clock, Filter, Activity } from 'lucide-react';

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch history:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = () => {
    if (!window.confirm('Clear prediction history log?')) return;
    fetch('/api/history', { method: 'DELETE' })
      .then(() => fetchHistory())
      .catch(err => console.error(err));
  };

  const getBadgeStyle = (riskClass) => {
    switch (riskClass) {
      case 'Low risk': return 'risk-low-badge';
      case 'Moderate risk': return 'risk-moderate-badge';
      case 'High risk': return 'risk-high-badge';
      case 'Very high risk': return 'risk-veryhigh-badge';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="card-healthcare p-6 space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <span>Prediction History Log</span>
          </h3>
          <p className="text-xs text-slate-500">Log of recent heat risk assessments</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Refresh log"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs space-y-2">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading history records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center text-slate-400 space-y-1">
          <Clock className="w-6 h-6 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No predictions recorded yet</p>
          <p className="text-[11px] text-slate-400">Run an assessment or select a demo scenario.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Probability</th>
                <th className="p-3">WBGT</th>
                <th className="p-3">Heart Rate</th>
                <th className="p-3">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getBadgeStyle(item.risk_class)}`}>
                      {item.risk_class}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {item.probability}%
                  </td>
                  <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                    {item.inputs?.wbgt || 24}°C
                  </td>
                  <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                    {item.inputs?.heart_rate || 85} BPM
                  </td>
                  <td className="p-3 text-slate-700 max-w-xs truncate" title={item.recommended_action}>
                    “{item.recommended_action}”
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
