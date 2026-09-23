import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall, Send, UserCheck, BellRing, Clock, CheckCircle2 } from 'lucide-react';

export default function CaregiverHub({ onSendAlertSuccess }) {
  const [alertsLog, setAlertsLog] = useState([
    {
      id: 'alt_001',
      user: 'John D. (Outdoor Construction Worker)',
      risk: 'Very high risk',
      time: '10 mins ago',
      details: 'WBGT 35°C, HR 145 BPM, Symptom: Confusion',
      status: 'Dispatched Medical Supervisor',
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'alt_002',
      user: 'Elena M. (Elderly Resident - Age 74)',
      risk: 'High risk',
      time: '28 mins ago',
      details: 'WBGT 31°C, HR 118 BPM, Symptom: Dizziness',
      status: 'SMS Hydration Warning Sent',
      badgeColor: 'bg-orange-500 text-slate-950'
    }
  ]);

  const [simulatedDispatch, setSimulatedDispatch] = useState(false);

  const handleSimulateDispatch = () => {
    setSimulatedDispatch(true);
    const newLog = {
      id: 'alt_' + Date.now(),
      user: 'Current Monitored Subject (Demo)',
      risk: 'Very high risk',
      time: 'Just Now',
      details: 'Triggered Emergency Supervisor Assistance Request',
      status: 'Dispatch Unit #104 En Route',
      badgeColor: 'bg-rose-500 text-white'
    };
    setAlertsLog(prev => [newLog, ...prev]);

    setTimeout(() => {
      setSimulatedDispatch(false);
      if (onSendAlertSuccess) onSendAlertSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Caregiver & Supervisor Emergency Control Center</h2>
              <p className="text-xs text-slate-400">
                Real-time notification logs, supervisor dispatch, and high-risk subject early warning alerts
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSimulateDispatch}
            disabled={simulatedDispatch}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {simulatedDispatch ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Dispatching Medical Team...</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-4 h-4" />
                <span>Dispatch Supervisor Emergency Team</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Emergency Contacts & Supervisor Roster */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Supervisor On-Call</div>
          <div className="text-sm font-bold text-white">Dr. Sarah Jenkins (Occupational Safety)</div>
          <div className="text-xs font-mono text-teal-400">+1 (555) 019-2834</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Emergency Protocol</div>
          <div className="text-sm font-bold text-white">OSHA / WBGT Class 4 Standard</div>
          <div className="text-xs text-slate-400">Immediate shade, active cooling & IV fluids</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Automated SMS Gateway</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Gateway Online
          </div>
          <div className="text-xs text-slate-400">Latency: 120ms</div>
        </div>
      </div>

      {/* Emergency Alerts History Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <BellRing className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Caregiver Alert Log & Dispatch History</h3>
        </div>

        <div className="space-y-3">
          {alertsLog.map((log) => (
            <div key={log.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${log.badgeColor}`}>
                    {log.risk}
                  </span>
                  <span className="text-sm font-bold text-slate-100">{log.user}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {log.time}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">{log.details}</p>
              <div className="text-xs font-semibold text-teal-400 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-800/40 inline-block">
                Status: {log.status}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
