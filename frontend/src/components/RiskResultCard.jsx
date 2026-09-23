import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Clock, Info, Bell, FileText, Check } from 'lucide-react';

export default function RiskResultCard({ result, onNotifyCaregiver }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!result) return null;

  const {
    risk_class,
    probability,
    contributing_factors,
    recommended_action,
    timestamp,
    input_summary,
    inputs
  } = result;

  const riskConfig = {
    'Low risk': {
      cardBg: 'bg-emerald-50/70 border-emerald-200',
      badge: 'risk-low-badge',
      text: 'text-emerald-800',
      meterColor: 'bg-emerald-500',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-100 text-emerald-700'
    },
    'Moderate risk': {
      cardBg: 'bg-amber-50/70 border-amber-200',
      badge: 'risk-moderate-badge',
      text: 'text-amber-800',
      meterColor: 'bg-amber-500',
      icon: AlertTriangle,
      iconBg: 'bg-amber-100 text-amber-700'
    },
    'High risk': {
      cardBg: 'bg-orange-50/70 border-orange-200',
      badge: 'risk-orange-badge',
      text: 'text-orange-800',
      meterColor: 'bg-orange-500',
      icon: AlertTriangle,
      iconBg: 'bg-orange-100 text-orange-700'
    },
    'Very high risk': {
      cardBg: 'bg-rose-50/80 border-rose-300',
      badge: 'risk-veryhigh-badge',
      text: 'text-rose-900',
      meterColor: 'bg-rose-600',
      icon: AlertOctagon,
      iconBg: 'bg-rose-100 text-rose-700'
    }
  };

  const cfg = riskConfig[risk_class] || riskConfig['Low risk'];
  const Icon = cfg.icon;

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className={`card-healthcare p-6 border ${cfg.cardBg} space-y-6 transition-all`}>
      
      {/* SECTION B: Risk Result Header & Meter */}
      <div className="space-y-4 border-b border-slate-200/80 pb-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${cfg.iconBg} shadow-sm`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Heat Strain Risk Level
              </span>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${cfg.text}`}>
                {risk_class}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Probability</span>
            <span className={`text-2xl font-black ${cfg.text}`}>{probability}%</span>
          </div>

        </div>

        {/* Horizontal Risk Meter */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.meterColor}`}
              style={{ width: `${Math.max(5, Math.min(100, probability))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 font-mono">
            <span>0% (Low)</span>
            <span>50% (Moderate)</span>
            <span>100% (Critical)</span>
          </div>
        </div>

      </div>

      {/* SECTION C: Personalized Alert Banner & Action Buttons */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Personalized Preventive Alert
          </span>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formattedTime}
          </span>
        </div>

        <p className={`text-base font-bold ${cfg.text} leading-snug`}>
          “{recommended_action}”
        </p>

        {/* Alert Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          
          <button
            onClick={() => setAcknowledged(!acknowledged)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              acknowledged
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{acknowledged ? 'Alert Acknowledged' : 'Acknowledge alert'}</span>
          </button>

          <button
            onClick={onNotifyCaregiver}
            className="px-3 py-1.5 rounded-lg border border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-teal-600" />
            <span>Notify caregiver</span>
          </button>

          <button
            onClick={() => setShowDetailsModal(!showDetailsModal)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>View details</span>
          </button>

        </div>
      </div>

      {/* SECTION D: Explainability Section ("Why this risk?") */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-teal-600" />
          Why this risk? (Main Contributing Factors)
        </h4>

        <div className="space-y-2">
          {contributing_factors && contributing_factors.map((factor, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.meterColor}`} />
                <span>{factor}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Impact Indicator
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal Overlay */}
      {showDetailsModal && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-2 font-mono">
          <div className="font-bold text-teal-400 border-b border-slate-800 pb-1">Technical Assessment Summary</div>
          <div><strong>Input summary:</strong> {input_summary}</div>
          <div><strong>Model Engine:</strong> Random Forest Classifier (Synthetic Demo)</div>
          <div><strong>Timestamp ISO:</strong> {timestamp}</div>
        </div>
      )}

    </div>
  );
}
