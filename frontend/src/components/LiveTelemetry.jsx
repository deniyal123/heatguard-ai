import React, { useState, useEffect } from 'react';
import { Activity, Radio, Heart, Sun, Thermometer, ShieldAlert, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LiveTelemetry() {
  const [streamData, setStreamData] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [currentVitals, setCurrentVitals] = useState({
    hr: 112,
    temp: 33.5,
    wbgt: 29.2,
    riskPct: 68.5,
    status: 'High risk'
  });

  useEffect(() => {
    // Generate initial 15 points
    const initial = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
      const baseHR = 100 + Math.floor(Math.sin(i * 0.4) * 25) + Math.floor(Math.random() * 8);
      const baseWBGT = 28.5 + (15 - i) * 0.2 + (Math.random() * 0.4 - 0.2);
      initial.push({
        time: timeStr,
        heartRate: baseHR,
        wbgt: parseFloat(baseWBGT.toFixed(1)),
        risk: Math.min(99, Math.max(10, Math.round((baseHR - 70) * 0.8 + (baseWBGT - 20) * 2.5)))
      });
    }
    setStreamData(initial);

    const interval = setInterval(() => {
      if (!isStreaming) return;

      const timeStr = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
      setStreamData(prev => {
        const last = prev[prev.length - 1] || { heartRate: 110, wbgt: 29.0 };
        const nextHR = Math.min(175, Math.max(65, last.heartRate + Math.floor(Math.random() * 9 - 4)));
        const nextWBGT = parseFloat(Math.min(38.0, Math.max(20.0, last.wbgt + (Math.random() * 0.2 - 0.1))).toFixed(1));
        const nextRisk = Math.min(99, Math.max(5, Math.round((nextHR - 70) * 0.75 + (nextWBGT - 20) * 2.8)));

        let statusStr = 'Low risk';
        if (nextRisk > 80) statusStr = 'Very high risk';
        else if (nextRisk > 60) statusStr = 'High risk';
        else if (nextRisk > 35) statusStr = 'Moderate risk';

        setCurrentVitals({
          hr: nextHR,
          temp: 34.0,
          wbgt: nextWBGT,
          riskPct: nextRisk,
          status: statusStr
        });

        const updated = [...prev.slice(1), { time: timeStr, heartRate: nextHR, wbgt: nextWBGT, risk: nextRisk }];
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Live Physiological Telemetry Monitor</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/50 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                Live Stream
              </span>
            </div>
            <p className="text-xs text-slate-400">Continuous telemetry stream simulating wearable thermal sensor inputs</p>
          </div>
        </div>

        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isStreaming
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900'
              : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900'
          }`}
        >
          {isStreaming ? 'Pause Telemetry Stream' : 'Resume Telemetry Stream'}
        </button>
      </div>

      {/* Live Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Heart Rate */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
              Heart Rate
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-500">Continuous</span>
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono">
            {currentVitals.hr} <span className="text-sm font-normal text-slate-400">BPM</span>
          </div>
        </div>

        {/* WBGT */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-orange-400" />
              Ambient WBGT
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-500">Sensor #01</span>
          </div>
          <div className="text-3xl font-black text-orange-400 font-mono">
            {currentVitals.wbgt}°C
          </div>
        </div>

        {/* Estimated Risk Pct */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-teal-400" />
              Heat Strain Risk
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-500">Real-time</span>
          </div>
          <div className="text-3xl font-black text-teal-400 font-mono">
            {currentVitals.riskPct}%
          </div>
        </div>

        {/* Live Risk Status */}
        <div className={`glass-panel p-4 rounded-2xl border space-y-1 ${
          currentVitals.status === 'Very high risk' ? 'border-rose-500/60 bg-rose-950/30' :
          currentVitals.status === 'High risk' ? 'border-orange-500/60 bg-orange-950/30' :
          currentVitals.status === 'Moderate risk' ? 'border-amber-500/60 bg-amber-950/30' :
          'border-emerald-500/60 bg-emerald-950/30'
        }`}>
          <div className="text-xs text-slate-400">Live Warning State</div>
          <div className={`text-xl font-extrabold capitalize ${
            currentVitals.status === 'Very high risk' ? 'text-rose-400' :
            currentVitals.status === 'High risk' ? 'text-orange-400' :
            currentVitals.status === 'Moderate risk' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>
            {currentVitals.status}
          </div>
        </div>

      </div>

      {/* Real-time Telemetry Line Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Live Physiological & Heat Index Telemetry</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Heart Rate (BPM)
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> WBGT (°C)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#f43f5e" domain={[50, 190]} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f97316" domain={[15, 45]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="wbgt" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
